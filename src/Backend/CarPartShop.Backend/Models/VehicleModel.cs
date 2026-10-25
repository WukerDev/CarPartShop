namespace CarPartShop.Backend.Models;

public class VehicleModel
{
    public int Id { get; set; }
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int YearFrom { get; set; }
    public int YearTo { get; set; }
}
