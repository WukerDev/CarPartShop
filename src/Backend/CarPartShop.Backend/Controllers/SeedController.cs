using Microsoft.AspNetCore.Mvc;
using CarPartShop.Backend.Data;

namespace CarPartShop.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly ShopDbContext _dbContext;
    private readonly ILogger<SeedController> _logger;

    public SeedController(ShopDbContext dbContext, ILogger<SeedController> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Seed([FromQuery] bool reset = false)
    {
        try
        {
            if (reset)
            {
                await DbInitializer.ResetAndSeedAsync(_dbContext);
            }
            else
            {
                await DbInitializer.InitializeAsync(_dbContext);
            }

            var stats = await DbInitializer.GetStatsAsync(_dbContext);

            _logger.LogInformation("Zasilono bazę danych: {Categories} kategorii, {Parts} części, {Orders} zamówień, {Returns} zwrotów.",
                stats.categories, stats.parts, stats.orders, stats.returns);

            return Ok(new
            {
                success = true,
                message = reset
                    ? "Baza danych została zresetowana i pomyślnie zasilona gotowymi danymi."
                    : "Baza danych została pomyślnie zasilona.",
                categoriesCount = stats.categories,
                partsCount = stats.parts,
                ordersCount = stats.orders,
                returnsCount = stats.returns
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Błąd podczas zasilania bazy danych.");
            return StatusCode(500, new
            {
                success = false,
                message = "Wystąpił błąd podczas zasilania bazy danych: " + ex.Message
            });
        }
    }

    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        var stats = await DbInitializer.GetStatsAsync(_dbContext);
        return Ok(new
        {
            isSeeded = stats.categories > 0 && stats.parts > 0,
            categoriesCount = stats.categories,
            partsCount = stats.parts,
            ordersCount = stats.orders,
            returnsCount = stats.returns
        });
    }
}
