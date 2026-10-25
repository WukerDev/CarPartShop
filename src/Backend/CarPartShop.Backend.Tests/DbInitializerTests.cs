using CarPartShop.Backend.Data;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace CarPartShop.Backend.Tests;

public class DbInitializerTests
{
    private static ShopDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ShopDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ShopDbContext(options);
    }

    [Fact]
    public async Task InitializeAsync_WhenEmptyDatabase_SeedsInitialData()
    {
        using var db = CreateInMemoryDbContext();

        await DbInitializer.InitializeAsync(db);

        var stats = await DbInitializer.GetStatsAsync(db);

        stats.categories.Should().Be(8);
        stats.parts.Should().Be(24);
        stats.orders.Should().Be(4);
        stats.returns.Should().Be(1);
    }

    [Fact]
    public async Task InitializeAsync_WhenAlreadySeeded_DoesNotDuplicateData()
    {
        using var db = CreateInMemoryDbContext();

        await DbInitializer.InitializeAsync(db);
        await DbInitializer.InitializeAsync(db);

        var stats = await DbInitializer.GetStatsAsync(db);

        stats.categories.Should().Be(8);
        stats.parts.Should().Be(24);
        stats.orders.Should().Be(4);
        stats.returns.Should().Be(1);
    }

    [Fact]
    public async Task ResetAndSeedAsync_WipesAndReseedsData()
    {
        using var db = CreateInMemoryDbContext();

        await DbInitializer.InitializeAsync(db);
        await DbInitializer.ResetAndSeedAsync(db);

        var stats = await DbInitializer.GetStatsAsync(db);

        stats.categories.Should().Be(8);
        stats.parts.Should().Be(24);
        stats.orders.Should().Be(4);
        stats.returns.Should().Be(1);
    }
}
