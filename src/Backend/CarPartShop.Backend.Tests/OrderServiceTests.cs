using FluentAssertions;
using Grpc.Core;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using CarPartShop.Backend.Data;
using CarPartShop.Backend.Hubs;
using CarPartShop.Backend.Models;
using CarPartShop.Backend.Protos;
using CarPartShop.Backend.Services;
using CarPartShop.Backend.Validators;
using Xunit;

namespace CarPartShop.Backend.Tests;

public class OrderServiceTests
{
    private (ShopDbContext db, Mock<IHubContext<ShopHub>> hubMock, OrderGrpcService service) CreateService()
    {
        var options = new DbContextOptionsBuilder<ShopDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        var db = new ShopDbContext(options);

        var category = new Category { Id = 1, Name = "Filtry", Slug = "filtry" };
        db.Categories.Add(category);
        db.CarParts.Add(new CarPart
        {
            Id = 1,
            Name = "Filtr Oleju Mann",
            PartNumber = "MAN-123",
            CategoryId = 1,
            Price = 50m,
            StockQuantity = 5
        });
        db.SaveChanges();

        var hubMock = new Mock<IHubContext<ShopHub>>();
        var clientsMock = new Mock<IHubClients>();
        var clientProxyMock = new Mock<IClientProxy>();

        clientsMock.Setup(c => c.All).Returns(clientProxyMock.Object);
        hubMock.Setup(h => h.Clients).Returns(clientsMock.Object);

        var loggerMock = new Mock<ILogger<OrderGrpcService>>();
        var orderValidator = new CreateOrderValidator();
        var returnValidator = new ReturnRequestValidator();

        var service = new OrderGrpcService(db, orderValidator, returnValidator, hubMock.Object, loggerMock.Object);

        return (db, hubMock, service);
    }

    [Fact]
    public async Task CreateOrder_WithValidItems_ShouldReduceStockAndCreateOrder()
    {
        var (db, hubMock, service) = CreateService();

        var request = new CreateOrderRequest
        {
            CustomerName = "Jan Kowalski",
            Email = "jan@example.com",
            Phone = "+48 123 456 789",
            ShippingAddress = "ul. Morska 15, Gdynia",
            PaymentMethod = "Card"
        };
        request.Items.Add(new OrderItemInput { PartId = 1, Quantity = 2 });

        var response = await service.CreateOrder(request, null!);

        response.Should().NotBeNull();
        response.TotalPrice.Should().Be(100);
        response.Status.Should().Be("Paid");

        var partInDb = await db.CarParts.FindAsync(1);
        partInDb!.StockQuantity.Should().Be(3);
    }

    [Fact]
    public async Task CreateOrder_WhenQuantityExceedsStock_ShouldThrowRpcException()
    {
        var (db, hubMock, service) = CreateService();

        var request = new CreateOrderRequest
        {
            CustomerName = "Jan Kowalski",
            Email = "jan@example.com",
            Phone = "+48 123 456 789",
            ShippingAddress = "ul. Morska 15, Gdynia"
        };
        request.Items.Add(new OrderItemInput { PartId = 1, Quantity = 10 });

        Func<Task> act = async () => await service.CreateOrder(request, null!);

        await act.Should().ThrowAsync<RpcException>()
            .Where(e => e.StatusCode == StatusCode.FailedPrecondition);
    }
}
