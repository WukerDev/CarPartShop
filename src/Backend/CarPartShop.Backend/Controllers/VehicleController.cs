using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarPartShop.Backend.Data;

namespace CarPartShop.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehicleController : ControllerBase
{
    private readonly ShopDbContext _dbContext;

    public VehicleController(ShopDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("makes")]
    public async Task<IActionResult> GetMakes()
    {
        var makes = await _dbContext.Vehicles
            .Select(v => v.Make)
            .Distinct()
            .OrderBy(m => m)
            .ToListAsync();

        return Ok(makes);
    }

    [HttpGet("models")]
    public async Task<IActionResult> GetModels([FromQuery] string make)
    {
        if (string.IsNullOrWhiteSpace(make))
        {
            return BadRequest("Parametr 'make' jest wymagany.");
        }

        var makeLower = make.Trim().ToLower();
        var models = await _dbContext.Vehicles
            .Where(v => v.Make.ToLower() == makeLower)
            .Select(v => v.Model)
            .Distinct()
            .OrderBy(m => m)
            .ToListAsync();

        return Ok(models);
    }

    [HttpGet("years")]
    public async Task<IActionResult> GetYears([FromQuery] string make, [FromQuery] string? model)
    {
        if (string.IsNullOrWhiteSpace(make))
        {
            return BadRequest("Parametr 'make' jest wymagany.");
        }

        var makeLower = make.Trim().ToLower();
        var query = _dbContext.Vehicles.Where(v => v.Make.ToLower() == makeLower);

        if (!string.IsNullOrWhiteSpace(model))
        {
            var modelLower = model.Trim().ToLower();
            query = query.Where(v => v.Model.ToLower() == modelLower);
        }

        var vehicleRanges = await query
            .Select(v => new { v.YearFrom, v.YearTo })
            .ToListAsync();

        var years = new HashSet<int>();
        foreach (var r in vehicleRanges)
        {
            var start = r.YearFrom > 1980 ? r.YearFrom : 2000;
            var end = r.YearTo >= start ? r.YearTo : 2025;
            for (var y = start; y <= end; y++)
            {
                years.Add(y);
            }
        }

        return Ok(years.OrderByDescending(y => y).ToList());
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var vehicles = await _dbContext.Vehicles
            .OrderBy(v => v.Make)
            .ThenBy(v => v.Model)
            .Select(v => new
            {
                v.Id,
                v.Make,
                v.Model,
                v.YearFrom,
                v.YearTo
            })
            .ToListAsync();

        return Ok(vehicles);
    }
}
