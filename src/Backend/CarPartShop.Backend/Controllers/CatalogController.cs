using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarPartShop.Backend.Data;
using CarPartShop.Backend.Models;

namespace CarPartShop.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CatalogController : ControllerBase
{
    private readonly ShopDbContext _dbContext;

    public CatalogController(ShopDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _dbContext.Categories
            .Include(c => c.Parts)
            .OrderBy(c => c.Name)
            .Select(c => new
            {
                c.Id,
                c.Name,
                c.Slug,
                c.Description,
                c.Icon,
                PartsCount = c.Parts.Count
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("parts")]
    public async Task<IActionResult> GetParts(
        [FromQuery] int? categoryId,
        [FromQuery] string? search,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] bool? inStockOnly,
        [FromQuery] string? carMake,
        [FromQuery] string? carModel,
        [FromQuery] int? carYear)
    {
        var query = _dbContext.CarParts.Include(p => p.Category).AsQueryable();

        if (categoryId.HasValue && categoryId.Value > 0)
        {
            query = query.Where(p => p.CategoryId == categoryId.Value);
        }

        if (!string.IsNullOrWhiteSpace(carMake))
        {
            var makeLower = carMake.Trim().ToLower();
            var isVw = makeLower == "volkswagen" || makeLower == "vw";
            query = query.Where(p =>
                p.Compatibility.ToLower().Contains("uniwersaln") ||
                p.Compatibility.ToLower().Contains(makeLower) ||
                (isVw && (p.Compatibility.ToLower().Contains("vw") || p.Compatibility.ToLower().Contains("volkswagen"))));
        }

        if (!string.IsNullOrWhiteSpace(carModel))
        {
            var modelLower = carModel.Trim().ToLower();
            query = query.Where(p =>
                p.Compatibility.ToLower().Contains("uniwersaln") ||
                p.Compatibility.ToLower().Contains(modelLower));
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(s) ||
                p.PartNumber.ToLower().Contains(s) ||
                p.Manufacturer.ToLower().Contains(s) ||
                p.Compatibility.ToLower().Contains(s));
        }

        if (minPrice.HasValue && minPrice.Value > 0)
        {
            query = query.Where(p => p.Price >= minPrice.Value);
        }

        if (maxPrice.HasValue && maxPrice.Value > 0)
        {
            query = query.Where(p => p.Price <= maxPrice.Value);
        }

        if (inStockOnly.HasValue && inStockOnly.Value)
        {
            query = query.Where(p => p.StockQuantity > 0);
        }

        var totalCount = await query.CountAsync();
        var parts = await query.OrderBy(p => p.Name).ToListAsync();

        return Ok(new
        {
            TotalCount = totalCount,
            Parts = parts.Select(p => new
            {
                p.Id,
                p.Name,
                p.PartNumber,
                p.CategoryId,
                CategoryName = p.Category?.Name ?? "",
                p.Manufacturer,
                Price = (double)p.Price,
                p.StockQuantity,
                p.Description,
                p.Compatibility,
                p.ImageUrl,
                p.Rating
            })
        });
    }

    [HttpGet("parts/{id:int}")]
    public async Task<IActionResult> GetPartById(int id)
    {
        var part = await _dbContext.CarParts.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
        if (part == null)
        {
            return NotFound(new { message = $"Część o ID {id} nie została znaleziona." });
        }

        return Ok(new
        {
            part.Id,
            part.Name,
            part.PartNumber,
            part.CategoryId,
            CategoryName = part.Category?.Name ?? "",
            part.Manufacturer,
            Price = (double)part.Price,
            part.StockQuantity,
            part.Description,
            part.Compatibility,
            part.ImageUrl,
            part.Rating
        });
    }

    [HttpGet("parts/{id:int}/reviews")]
    public async Task<IActionResult> GetPartReviews(int id)
    {
        var reviews = await _dbContext.ProductReviews
            .Where(r => r.CarPartId == id)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new
            {
                r.Id,
                r.CarPartId,
                r.AuthorName,
                r.Rating,
                r.Comment,
                r.CreatedAt
            })
            .ToListAsync();

        return Ok(reviews);
    }

    [HttpPost("parts/{id:int}/reviews")]
    public async Task<IActionResult> AddPartReview(int id, [FromBody] AddReviewRequest request)
    {
        var part = await _dbContext.CarParts.Include(p => p.Reviews).FirstOrDefaultAsync(p => p.Id == id);
        if (part == null)
        {
            return NotFound(new { message = $"Część o ID {id} nie została znaleziona." });
        }

        if (string.IsNullOrWhiteSpace(request.AuthorName) || string.IsNullOrWhiteSpace(request.Comment))
        {
            return BadRequest(new { message = "Imię autora oraz treść opinii są wymagane." });
        }

        var rating = Math.Clamp(request.Rating, 1, 5);

        var review = new ProductReview
        {
            CarPartId = id,
            AuthorName = request.AuthorName.Trim(),
            Rating = rating,
            Comment = request.Comment.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.ProductReviews.Add(review);
        await _dbContext.SaveChangesAsync();

        var allRatings = await _dbContext.ProductReviews.Where(r => r.CarPartId == id).Select(r => r.Rating).ToListAsync();
        part.Rating = Math.Round(allRatings.Average(), 1);
        await _dbContext.SaveChangesAsync();

        return Ok(new
        {
            review.Id,
            review.CarPartId,
            review.AuthorName,
            review.Rating,
            review.Comment,
            review.CreatedAt,
            updatedPartRating = part.Rating
        });
    }
}

public record AddReviewRequest(string AuthorName, int Rating, string Comment);
