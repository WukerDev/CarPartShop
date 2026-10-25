using FluentAssertions;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using CarPartShop.Backend.Data;
using CarPartShop.Backend.Models;
using CarPartShop.Backend.Protos;
using CarPartShop.Backend.Services;
using Xunit;

namespace CarPartShop.Backend.Tests;

public class CatalogServiceTests
{
    private ShopDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ShopDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        var context = new ShopDbContext(options);
        
        var category = new Category { Id = 1, Name = "Hamulce", Slug = "hamulce", Icon = "mdi-disc" };
        context.Categories.Add(category);
        context.CarParts.AddRange(
            new CarPart
            {
                Id = 1,
                Name = "Klocki Brembo",
                PartNumber = "BRE-100",
                CategoryId = 1,
                Manufacturer = "Brembo",
                Price = 150m,
                StockQuantity = 10,
                Compatibility = "BMW E90"
            },
            new CarPart
            {
                Id = 2,
                Name = "Tarcze ATE",
                PartNumber = "ATE-200",
                CategoryId = 1,
                Manufacturer = "ATE",
                Price = 300m,
                StockQuantity = 0, // out of stock
                Compatibility = "Audi A4"
            }
        );
        context.SaveChanges();
        return context;
    }

    [Fact]
    public async Task GetCategories_ShouldReturnAllCategoriesWithPartCounts()
    {
        using var db = CreateDbContext();
        var service = new CatalogGrpcService(db);

        var response = await service.GetCategories(new GetCategoriesRequest(), null!);

        response.Categories.Should().HaveCount(1);
        response.Categories[0].Name.Should().Be("Hamulce");
        response.Categories[0].PartsCount.Should().Be(2);
    }

    [Fact]
    public async Task GetParts_WithSearchAndInStockFilter_ShouldReturnMatchingParts()
    {
        using var db = CreateDbContext();
        var service = new CatalogGrpcService(db);

        var request = new GetPartsRequest
        {
            Search = "Brembo",
            InStockOnly = true
        };

        var response = await service.GetParts(request, null!);

        response.TotalCount.Should().Be(1);
        response.Parts[0].Name.Should().Be("Klocki Brembo");
        response.Parts[0].StockQuantity.Should().Be(10);
    }

    [Fact]
    public async Task GetPartById_WhenNotFound_ShouldThrowRpcException()
    {
        using var db = CreateDbContext();
        var service = new CatalogGrpcService(db);

        Func<Task> act = async () => await service.GetPartById(new GetPartByIdRequest { Id = 999 }, null!);

        await act.Should().ThrowAsync<RpcException>()
            .Where(e => e.StatusCode == StatusCode.NotFound);
    }
}
