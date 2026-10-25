using CarPartShop.Backend.Controllers;
using CarPartShop.Backend.Data;
using CarPartShop.Backend.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace CarPartShop.Backend.Tests;

public class VehicleControllerTests
{
    private static ShopDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ShopDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        var db = new ShopDbContext(options);
        db.Vehicles.AddRange(
            new VehicleModel { Make = "Volkswagen", Model = "Golf VII", YearFrom = 2012, YearTo = 2020 },
            new VehicleModel { Make = "Volkswagen", Model = "Passat B8", YearFrom = 2014, YearTo = 2023 },
            new VehicleModel { Make = "Audi", Model = "A4 B9", YearFrom = 2015, YearTo = 2023 },
            new VehicleModel { Make = "BMW", Model = "Seria 3 F30", YearFrom = 2011, YearTo = 2019 }
        );
        db.SaveChanges();
        return db;
    }

    [Fact]
    public async Task GetMakes_ReturnsDistinctMakesSorted()
    {
        using var db = CreateInMemoryDbContext();
        var controller = new VehicleController(db);

        var result = await controller.GetMakes();

        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        var makes = okResult.Value.Should().BeAssignableTo<IEnumerable<string>>().Subject.ToList();

        makes.Should().ContainInOrder("Audi", "BMW", "Volkswagen");
    }

    [Fact]
    public async Task GetModels_ReturnsModelsForMake()
    {
        using var db = CreateInMemoryDbContext();
        var controller = new VehicleController(db);

        var result = await controller.GetModels("Volkswagen");

        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        var models = okResult.Value.Should().BeAssignableTo<IEnumerable<string>>().Subject.ToList();

        models.Should().Contain("Golf VII");
        models.Should().Contain("Passat B8");
        models.Should().NotContain("A4 B9");
    }

    [Fact]
    public async Task GetYears_ReturnsListOfYearsForModel()
    {
        using var db = CreateInMemoryDbContext();
        var controller = new VehicleController(db);

        var result = await controller.GetYears("Volkswagen", "Golf VII");

        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        var years = okResult.Value.Should().BeAssignableTo<IEnumerable<int>>().Subject.ToList();

        years.Should().Contain(2015);
        years.Should().Contain(2020);
        years.Should().NotContain(2022);
    }
}
