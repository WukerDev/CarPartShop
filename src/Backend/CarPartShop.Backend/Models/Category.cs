namespace CarPartShop.Backend.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = "mdi-car-wrench";
    public ICollection<CarPart> Parts { get; set; } = new List<CarPart>();
}
