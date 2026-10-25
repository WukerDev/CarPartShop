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

public class ReturnServiceTests
{
    private (ShopDbContext db, OrderGrpcService service) CreateServiceWithOrder()
    {
        var options = new DbContextOptionsBuilder<ShopDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        var db = new ShopDbContext(options);

        var part = new CarPart
        {
            Id = 1,
            Name = "Świeca NGK",
            PartNumber = "NGK-1",
            Price = 40m,
            StockQuantity = 10
        };
        db.CarParts.Add(part);

        var order = new Order
        {
            Id = 1,
            CustomerName = "Anna Nowak",
            Email = "anna@example.com",
            Status = "Completed",
            TotalPrice = 80m,
            ReturnStatus = "None",
            Items = new List<OrderItem>
            {
                new OrderItem
                {
                    CarPartId = 1,
                    Quantity = 2,
                    UnitPrice = 40m,
                    TotalPrice = 80m
                }
            }
        };
        db.Orders.Add(order);
        db.SaveChanges();

        var hubMock = new Mock<IHubContext<ShopHub>>();
        var clientsMock = new Mock<IHubClients>();
        var clientProxyMock = new Mock<IClientProxy>();
        clientsMock.Setup(c => c.All).Returns(clientProxyMock.Object);
        hubMock.Setup(h => h.Clients).Returns(clientsMock.Object);

        var service = new OrderGrpcService(
            db,
            new CreateOrderValidator(),
            new ReturnRequestValidator(),
            hubMock.Object,
            new Mock<ILogger<OrderGrpcService>>().Object
        );

        return (db, service);
    }

    [Fact]
    public async Task RequestReturn_WithValidReason_ShouldApproveAndRestoreStock()
    {
        var (db, service) = CreateServiceWithOrder();

        var request = new RequestReturnRequest
        {
            OrderId = 1,
            Reason = "Błędnie zamówiona część",
            Comments = "Nie pasuje do mojego silnika."
        };

        var response = await service.RequestReturn(request, null!);

        response.Success.Should().BeTrue();
        response.NewStatus.Should().Be("Returned");

        var orderInDb = await db.Orders.FindAsync(1);
        orderInDb!.ReturnStatus.Should().Be("Approved");
        orderInDb.Status.Should().Be("Returned");

        var partInDb = await db.CarParts.FindAsync(1);
        partInDb!.StockQuantity.Should().Be(12);
    }

    [Fact]
    public async Task RequestReturn_WhenAlreadyReturned_ShouldThrowRpcException()
    {
        var (db, service) = CreateServiceWithOrder();

        var order = await db.Orders.FindAsync(1);
        order!.ReturnStatus = "Approved";
        await db.SaveChangesAsync();

        var request = new RequestReturnRequest
        {
            OrderId = 1,
            Reason = "Kolejny zwrot"
        };

        Func<Task> act = async () => await service.RequestReturn(request, null!);

        await act.Should().ThrowAsync<RpcException>()
            .Where(e => e.StatusCode == StatusCode.FailedPrecondition);
    }
}
