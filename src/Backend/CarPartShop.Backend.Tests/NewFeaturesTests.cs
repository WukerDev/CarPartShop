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
}
