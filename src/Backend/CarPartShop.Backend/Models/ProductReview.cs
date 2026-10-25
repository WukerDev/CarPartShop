namespace CarPartShop.Backend.Models;

public class ProductReview
{
    public int Id { get; set; }
    public int CarPartId { get; set; }
    public CarPart? CarPart { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public int Rating { get; set; } = 5;
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
