using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using CarPartShop.Backend.Data;
using CarPartShop.Backend.Hubs;
using CarPartShop.Backend.Models;

namespace CarPartShop.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CatalogController : ControllerBase
{
    private readonly ShopDbContext _dbContext;
    private readonly IHubContext<ShopHub>? _hubContext;

    public CatalogController(ShopDbContext dbContext, IHubContext<ShopHub>? hubContext = null)
    {
        _dbContext = dbContext;
        _hubContext = hubContext;
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

    [HttpPost("parts")]
    public async Task<IActionResult> CreatePart([FromBody] CreatePartDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.PartNumber))
            return BadRequest(new { message = "Nazwa i numer fabryczny (OEM) są wymagane." });

        if (dto.Price <= 0)
            return BadRequest(new { message = "Cena musi być większa od zera." });

        var category = await _dbContext.Categories.FindAsync(dto.CategoryId);
        if (category == null)
            return BadRequest(new { message = $"Kategoria o ID {dto.CategoryId} nie istnieje." });

        var part = new CarPart
        {
            Name = dto.Name.Trim(),
            PartNumber = dto.PartNumber.Trim(),
            CategoryId = dto.CategoryId,
            Manufacturer = dto.Manufacturer.Trim(),
            Price = dto.Price,
            StockQuantity = Math.Max(0, dto.StockQuantity),
            Description = dto.Description.Trim(),
            Compatibility = dto.Compatibility.Trim(),
            ImageUrl = !string.IsNullOrWhiteSpace(dto.ImageUrl) ? dto.ImageUrl.Trim() : "/images/parts/generic-part.jpg",
            Rating = 5.0,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.CarParts.Add(part);
        await _dbContext.SaveChangesAsync();

        if (_hubContext != null)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveStockUpdate", part.Id, part.StockQuantity);
        }

        return CreatedAtAction(nameof(GetPartById), new { id = part.Id }, new
        {
            part.Id,
            part.Name,
            part.PartNumber,
            part.CategoryId,
            CategoryName = category.Name,
            part.Manufacturer,
            Price = (double)part.Price,
            part.StockQuantity,
            part.Description,
            part.Compatibility,
            part.ImageUrl,
            part.Rating
        });
    }

    [HttpPut("parts/{id:int}")]
    public async Task<IActionResult> UpdatePart(int id, [FromBody] UpdatePartDto dto)
    {
        var part = await _dbContext.CarParts.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
        if (part == null)
            return NotFound(new { message = $"Część o ID {id} nie została znaleziona." });

        if (!string.IsNullOrWhiteSpace(dto.Name)) part.Name = dto.Name.Trim();
        if (!string.IsNullOrWhiteSpace(dto.PartNumber)) part.PartNumber = dto.PartNumber.Trim();
        if (dto.CategoryId.HasValue && dto.CategoryId.Value > 0)
        {
            var cat = await _dbContext.Categories.FindAsync(dto.CategoryId.Value);
            if (cat != null) part.CategoryId = dto.CategoryId.Value;
        }
        if (!string.IsNullOrWhiteSpace(dto.Manufacturer)) part.Manufacturer = dto.Manufacturer.Trim();
        if (dto.Price.HasValue && dto.Price.Value > 0) part.Price = dto.Price.Value;
        if (dto.StockQuantity.HasValue) part.StockQuantity = Math.Max(0, dto.StockQuantity.Value);
        if (dto.Description != null) part.Description = dto.Description.Trim();
        if (dto.Compatibility != null) part.Compatibility = dto.Compatibility.Trim();
        if (!string.IsNullOrWhiteSpace(dto.ImageUrl)) part.ImageUrl = dto.ImageUrl.Trim();

        await _dbContext.SaveChangesAsync();

        if (_hubContext != null)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveStockUpdate", part.Id, part.StockQuantity);
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

    [HttpDelete("parts/{id:int}")]
    public async Task<IActionResult> DeletePart(int id)
    {
        var part = await _dbContext.CarParts.FindAsync(id);
        if (part == null)
            return NotFound(new { message = $"Część o ID {id} nie została znaleziona." });

        var hasOrders = await _dbContext.OrderItems.AnyAsync(i => i.CarPartId == id);
        if (hasOrders)
        {
            return BadRequest(new { message = "Nie można usunąć części powiązanej z istniejącymi zamówieniami w historii. Możesz zamiast tego ustawić stan magazynowy na 0." });
        }

        _dbContext.CarParts.Remove(part);
        await _dbContext.SaveChangesAsync();

        return Ok(new { success = true, message = $"Część {part.Name} została pomyślnie usunięta." });
    }
}

public record AddReviewRequest(string AuthorName, int Rating, string Comment);
public record CreatePartDto(
    string Name,
    string PartNumber,
    int CategoryId,
    string Manufacturer,
    decimal Price,
    int StockQuantity,
    string Description,
    string Compatibility,
    string? ImageUrl = null);

public record UpdatePartDto(
    string? Name = null,
    string? PartNumber = null,
    int? CategoryId = null,
    string? Manufacturer = null,
    decimal? Price = null,
    int? StockQuantity = null,
    string? Description = null,
    string? Compatibility = null,
    string? ImageUrl = null);
