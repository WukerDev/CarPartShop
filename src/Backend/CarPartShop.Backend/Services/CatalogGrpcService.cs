using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using CarPartShop.Backend.Data;
using CarPartShop.Backend.Protos;

namespace CarPartShop.Backend.Services;

public class CatalogGrpcService : CatalogService.CatalogServiceBase
{
    private readonly ShopDbContext _dbContext;

    public CatalogGrpcService(ShopDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public override async Task<GetCategoriesResponse> GetCategories(GetCategoriesRequest request, ServerCallContext context)
    {
        var categories = await _dbContext.Categories
            .Include(c => c.Parts)
            .OrderBy(c => c.Name)
            .ToListAsync();

        var response = new GetCategoriesResponse();
        foreach (var cat in categories)
        {
            response.Categories.Add(new CategoryModel
            {
                Id = cat.Id,
                Name = cat.Name,
                Slug = cat.Slug,
                Description = cat.Description,
                Icon = cat.Icon,
                PartsCount = cat.Parts.Count
            });
        }

        return response;
    }

    public override async Task<GetPartsResponse> GetParts(GetPartsRequest request, ServerCallContext context)
    {
        var query = _dbContext.CarParts.Include(p => p.Category).AsQueryable();

        if (request.HasCategoryId && request.CategoryId > 0)
        {
            query = query.Where(p => p.CategoryId == request.CategoryId);
        }

        if (request.HasSearch && !string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(search) ||
                p.PartNumber.ToLower().Contains(search) ||
                p.Manufacturer.ToLower().Contains(search) ||
                p.Compatibility.ToLower().Contains(search));
        }

        if (request.HasMinPrice && request.MinPrice > 0)
        {
            query = query.Where(p => (double)p.Price >= request.MinPrice);
        }

        if (request.HasMaxPrice && request.MaxPrice > 0)
        {
            query = query.Where(p => (double)p.Price <= request.MaxPrice);
        }

        if (request.HasInStockOnly && request.InStockOnly)
        {
            query = query.Where(p => p.StockQuantity > 0);
        }

        var totalCount = await query.CountAsync();
        var parts = await query.OrderBy(p => p.Name).ToListAsync();

        var response = new GetPartsResponse
        {
            TotalCount = totalCount
        };

        foreach (var p in parts)
        {
            response.Parts.Add(new CarPartModel
            {
                Id = p.Id,
                Name = p.Name,
                PartNumber = p.PartNumber,
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.Name ?? string.Empty,
                Manufacturer = p.Manufacturer,
                Price = (double)p.Price,
                StockQuantity = p.StockQuantity,
                Description = p.Description,
                Compatibility = p.Compatibility,
                ImageUrl = p.ImageUrl,
                Rating = p.Rating
            });
        }

        return response;
    }

    public override async Task<GetPartByIdResponse> GetPartById(GetPartByIdRequest request, ServerCallContext context)
    {
        var part = await _dbContext.CarParts
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == request.Id);

        if (part == null)
        {
            throw new RpcException(new Status(StatusCode.NotFound, $"Część o ID {request.Id} nie została znaleziona."));
        }

        return new GetPartByIdResponse
        {
            Part = new CarPartModel
            {
                Id = part.Id,
                Name = part.Name,
                PartNumber = part.PartNumber,
                CategoryId = part.CategoryId,
                CategoryName = part.Category?.Name ?? string.Empty,
                Manufacturer = part.Manufacturer,
                Price = (double)part.Price,
                StockQuantity = part.StockQuantity,
                Description = part.Description,
                Compatibility = part.Compatibility,
                ImageUrl = part.ImageUrl,
                Rating = part.Rating
            }
        };
    }
}
