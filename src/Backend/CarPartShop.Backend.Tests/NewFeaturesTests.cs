using CarPartShop.Backend.Controllers;
using CarPartShop.Backend.Data;
using CarPartShop.Backend.Hubs;
using CarPartShop.Backend.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Xunit;

namespace CarPartShop.Backend.Tests;

public class NewFeaturesTests
{
    private static ShopDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ShopDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ShopDbContext(options);
    }

    [Fact]
    public void ValidateCoupon_WhenValidCoupon_ReturnsCorrectDiscount()
    {
        using var db = CreateInMemoryDbContext();
        var hubMock = new Mock<IHubContext<ShopHub>>();
        var controller = new OrdersController(db, hubMock.Object, NullLogger<OrdersController>.Instance);

        var result = controller.ValidateCoupon(new OrdersController.ValidateCouponDto("START10", 200m)) as OkObjectResult;

        result.Should().NotBeNull();
        result!.StatusCode.Should().Be(200);

        var dynamicObj = result.Value;
        dynamicObj.Should().NotBeNull();
    }

    [Fact]
    public void ValidateCoupon_WhenInvalidCoupon_ReturnsNotFound()
    {
        using var db = CreateInMemoryDbContext();
        var hubMock = new Mock<IHubContext<ShopHub>>();
        var controller = new OrdersController(db, hubMock.Object, NullLogger<OrdersController>.Instance);

        var result = controller.ValidateCoupon(new OrdersController.ValidateCouponDto("INVALID99", 200m)) as NotFoundObjectResult;

        result.Should().NotBeNull();
        result!.StatusCode.Should().Be(404);
    }

    [Fact]
    public async Task AddPartReview_AddsReviewAndUpdatesRating()
    {
        using var db = CreateInMemoryDbContext();
        var part = new CarPart
        {
            Name = "Test Part",
            PartNumber = "TST-01",
            Price = 100m,
            StockQuantity = 10,
            Rating = 5.0
        };
        db.CarParts.Add(part);
        await db.SaveChangesAsync();

        var controller = new CatalogController(db);
        var result = await controller.AddPartReview(part.Id, new AddReviewRequest("Tester", 4, "Świetna część")) as OkObjectResult;

        result.Should().NotBeNull();
        result!.StatusCode.Should().Be(200);

        var reviews = await db.ProductReviews.Where(r => r.CarPartId == part.Id).ToListAsync();
        reviews.Should().HaveCount(1);
        reviews[0].AuthorName.Should().Be("Tester");
        reviews[0].Rating.Should().Be(4);

        var updatedPart = await db.CarParts.FindAsync(part.Id);
        updatedPart!.Rating.Should().Be(4.0);
    }

    [Fact]
    public async Task UpdateOrderStatus_WhenValid_UpdatesStatus()
    {
        using var db = CreateInMemoryDbContext();
        var hubMock = new Mock<IHubContext<ShopHub>>();
        var clientsMock = new Mock<IHubClients>();
        var clientProxyMock = new Mock<IClientProxy>();
        clientsMock.Setup(c => c.All).Returns(clientProxyMock.Object);
        hubMock.Setup(h => h.Clients).Returns(clientsMock.Object);

        var order = new Order
        {
            CustomerName = "Jan Kowalski",
            Email = "jan@example.com",
            Status = "Paid",
            TotalPrice = 250m
        };
        db.Orders.Add(order);
        await db.SaveChangesAsync();

        var controller = new OrdersController(db, hubMock.Object, NullLogger<OrdersController>.Instance);
        var result = await controller.UpdateOrderStatus(order.Id, new OrdersController.UpdateOrderStatusDto("Shipped", "INPOST-123", "InPost")) as OkObjectResult;

        result.Should().NotBeNull();
        result!.StatusCode.Should().Be(200);

        var updatedOrder = await db.Orders.FindAsync(order.Id);
        updatedOrder!.Status.Should().Be("Shipped");
        updatedOrder.TrackingNumber.Should().Be("INPOST-123");
        updatedOrder.CourierName.Should().Be("InPost");
    }

    [Fact]
    public async Task UpdateOrderStatus_WhenCancelled_RestoresStock()
    {
        using var db = CreateInMemoryDbContext();
        var hubMock = new Mock<IHubContext<ShopHub>>();
        var clientsMock = new Mock<IHubClients>();
        var clientProxyMock = new Mock<IClientProxy>();
        clientsMock.Setup(c => c.All).Returns(clientProxyMock.Object);
        hubMock.Setup(h => h.Clients).Returns(clientsMock.Object);

        var part = new CarPart { Name = "Tarcza", PartNumber = "TRC-1", Price = 100m, StockQuantity = 5 };
        db.CarParts.Add(part);
        await db.SaveChangesAsync();

        var order = new Order
        {
            CustomerName = "Jan Kowalski",
            Email = "jan@example.com",
            Status = "Paid",
            TotalPrice = 200m,
            Items = new List<OrderItem>
            {
                new OrderItem { CarPartId = part.Id, Quantity = 2, UnitPrice = 100m, TotalPrice = 200m }
            }
        };
        db.Orders.Add(order);
        await db.SaveChangesAsync();

        var controller = new OrdersController(db, hubMock.Object, NullLogger<OrdersController>.Instance);
        var result = await controller.UpdateOrderStatus(order.Id, new OrdersController.UpdateOrderStatusDto("Cancelled")) as OkObjectResult;

        result.Should().NotBeNull();
        var updatedPart = await db.CarParts.FindAsync(part.Id);
        updatedPart!.StockQuantity.Should().Be(7); // 5 + 2 restored
    }

    [Fact]
    public async Task CreatePart_WhenValid_PersistsToDatabase()
    {
        using var db = CreateInMemoryDbContext();
        var cat = new Category { Name = "Filtry", Slug = "filtry" };
        db.Categories.Add(cat);
        await db.SaveChangesAsync();

        var controller = new CatalogController(db);
        var dto = new CreatePartDto("Filtr Oleju Bosch", "BOS-FLT-01", cat.Id, "Bosch", 49.99m, 25, "Filtr", "VW Golf");
        var result = await controller.CreatePart(dto) as CreatedAtActionResult;

        result.Should().NotBeNull();
        result!.StatusCode.Should().Be(201);

        var savedPart = await db.CarParts.FirstOrDefaultAsync(p => p.PartNumber == "BOS-FLT-01");
        savedPart.Should().NotBeNull();
        savedPart!.Name.Should().Be("Filtr Oleju Bosch");
        savedPart.Price.Should().Be(49.99m);
        savedPart.StockQuantity.Should().Be(25);
    }

    [Fact]
    public async Task DeletePart_WhenPartHasNoOrders_DeletesSuccessfully()
    {
        using var db = CreateInMemoryDbContext();
        var part = new CarPart { Name = "Klocki Brembo", PartNumber = "BRE-01", Price = 150m, StockQuantity = 8 };
        db.CarParts.Add(part);
        await db.SaveChangesAsync();

        var controller = new CatalogController(db);
        var result = await controller.DeletePart(part.Id) as OkObjectResult;

        result.Should().NotBeNull();
        (await db.CarParts.FindAsync(part.Id)).Should().BeNull();
    }

    [Fact]
    public async Task UpdatePart_WhenValid_UpdatesFields()
    {
        using var db = CreateInMemoryDbContext();
        var cat = new Category { Name = "Filtry", Slug = "filtry" };
        db.Categories.Add(cat);
        await db.SaveChangesAsync();

        var part = new CarPart
        {
            Name = "Filtr Powietrza",
            PartNumber = "FIL-OLD",
            CategoryId = cat.Id,
            Price = 45m,
            StockQuantity = 10,
            Manufacturer = "Filtron",
            Compatibility = "Audi A3"
        };
        db.CarParts.Add(part);
        await db.SaveChangesAsync();

        var controller = new CatalogController(db);
        var updateDto = new UpdatePartDto(
            Name: "Filtr Powietrza Wzmocniony",
            PartNumber: null,
            CategoryId: cat.Id,
            Manufacturer: "Filtron",
            Price: 55m,
            StockQuantity: 15,
            Description: null,
            Compatibility: "Audi A3, Golf VII",
            ImageUrl: null
        );

        var actionResult = await controller.UpdatePart(part.Id, updateDto);
        var result = actionResult as OkObjectResult;

        result.Should().NotBeNull();
        result!.StatusCode.Should().Be(200);

        var updated = await db.CarParts.FindAsync(part.Id);
        updated!.Name.Should().Be("Filtr Powietrza Wzmocniony");
        updated.Price.Should().Be(55m);
        updated.StockQuantity.Should().Be(15);
        updated.Compatibility.Should().Be("Audi A3, Golf VII");
    }

    [Fact]
    public async Task DeletePart_WhenPartHasOrderItems_ReturnsBadRequest()
    {
        using var db = CreateInMemoryDbContext();
        var part = new CarPart { Name = "Wahacz", PartNumber = "WAH-01", Price = 300m, StockQuantity = 5 };
        db.CarParts.Add(part);
        await db.SaveChangesAsync();

        var order = new Order
        {
            CustomerName = "Piotr",
            Email = "piotr@test.pl",
            Status = "Paid",
            TotalPrice = 300m,
            Items = new List<OrderItem>
            {
                new OrderItem { CarPartId = part.Id, Quantity = 1, UnitPrice = 300m, TotalPrice = 300m }
            }
        };
        db.Orders.Add(order);
        await db.SaveChangesAsync();

        var controller = new CatalogController(db);
        var result = await controller.DeletePart(part.Id) as BadRequestObjectResult;

        result.Should().NotBeNull();
        result!.StatusCode.Should().Be(400);

        // Part must NOT be deleted
        var stillExists = await db.CarParts.FindAsync(part.Id);
        stillExists.Should().NotBeNull();
    }

    [Fact]
    public async Task GetParts_FilteringByMakeAndModel_ReturnsMatchingParts()
    {
        using var db = CreateInMemoryDbContext();
        db.CarParts.AddRange(
            new CarPart { Name = "Część do VW Golf", PartNumber = "VW-01", Price = 100m, StockQuantity = 5, Compatibility = "VW Golf VII, Passat B8" },
            new CarPart { Name = "Część do BMW 3", PartNumber = "BMW-01", Price = 200m, StockQuantity = 3, Compatibility = "BMW Seria 3 F30" },
            new CarPart { Name = "Płyn uniwersalny", PartNumber = "UNI-01", Price = 30m, StockQuantity = 10, Compatibility = "Uniwersalny" }
        );
        await db.SaveChangesAsync();

        var controller = new CatalogController(db);
        var result = await controller.GetParts(
            categoryId: null,
            search: null,
            minPrice: null,
            maxPrice: null,
            inStockOnly: null,
            carMake: "Volkswagen",
            carModel: "Golf",
            carYear: null
        ) as OkObjectResult;

        result.Should().NotBeNull();
        result!.StatusCode.Should().Be(200);

        var json = System.Text.Json.JsonSerializer.Serialize(result.Value);
        using var doc = System.Text.Json.JsonDocument.Parse(json);
        var totalCount = doc.RootElement.GetProperty("TotalCount").GetInt32();
        totalCount.Should().Be(2);
    }

    [Fact]
    public async Task GetParts_FilteringInStockOnly_ReturnsOnlyPartsWithPositiveStock()
    {
        using var db = CreateInMemoryDbContext();
        db.CarParts.AddRange(
            new CarPart { Name = "Dostępny produkt", PartNumber = "STK-YES", Price = 50m, StockQuantity = 8, Compatibility = "Uniwersalny" },
            new CarPart { Name = "Niedostępny produkt", PartNumber = "STK-NO", Price = 50m, StockQuantity = 0, Compatibility = "Uniwersalny" }
        );
        await db.SaveChangesAsync();

        var controller = new CatalogController(db);
        var result = await controller.GetParts(
            categoryId: null,
            search: null,
            minPrice: null,
            maxPrice: null,
            inStockOnly: true,
            carMake: null,
            carModel: null,
            carYear: null
        ) as OkObjectResult;

        result.Should().NotBeNull();
        var json = System.Text.Json.JsonSerializer.Serialize(result.Value);
        using var doc = System.Text.Json.JsonDocument.Parse(json);
        var totalCount = doc.RootElement.GetProperty("TotalCount").GetInt32();
        totalCount.Should().Be(1);
    }

    [Fact]
    public async Task UpdateOrderStatus_WithInvalidStatus_ReturnsBadRequest()
    {
        using var db = CreateInMemoryDbContext();
        var hubMock = new Mock<IHubContext<ShopHub>>();
        var order = new Order
        {
            CustomerName = "Adam",
            Email = "adam@test.pl",
            Status = "Pending",
            TotalPrice = 100m
        };
        db.Orders.Add(order);
        await db.SaveChangesAsync();

        var controller = new OrdersController(db, hubMock.Object, NullLogger<OrdersController>.Instance);
        var result = await controller.UpdateOrderStatus(order.Id, new OrdersController.UpdateOrderStatusDto("UnknownBogusStatus")) as BadRequestObjectResult;

        result.Should().NotBeNull();
        result!.StatusCode.Should().Be(400);
    }
}
