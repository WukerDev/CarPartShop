namespace CarPartShop.Backend.Models;

public class CarPart
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string PartNumber { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
    public string Manufacturer { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Compatibility { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public double Rating { get; set; } = 5.0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<ProductReview> Reviews { get; set; } = new List<ProductReview>();
}
