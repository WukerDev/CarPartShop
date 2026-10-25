using CarPartShop.Backend.Controllers;
using CarPartShop.Backend.Data;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace CarPartShop.Backend.Tests;

public class SeedControllerTests
{
    private static ShopDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ShopDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ShopDbContext(options);
    }

    [Fact]
    public async Task Seed_WhenCalled_ReturnsOkResult()
    {
        using var db = CreateInMemoryDbContext();
        var controller = new SeedController(db, NullLogger<SeedController>.Instance);

        var result = await controller.Seed(reset: false);

        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task Seed_WhenResetTrue_ReturnsOkResult()
    {
        using var db = CreateInMemoryDbContext();
        var controller = new SeedController(db, NullLogger<SeedController>.Instance);

        await controller.Seed(reset: false);
        var result = await controller.Seed(reset: true);

        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task GetStatus_ReturnsStatus()
    {
        using var db = CreateInMemoryDbContext();
        var controller = new SeedController(db, NullLogger<SeedController>.Instance);

        var result = await controller.GetStatus();

        result.Should().BeOfType<OkObjectResult>();
    }
}
