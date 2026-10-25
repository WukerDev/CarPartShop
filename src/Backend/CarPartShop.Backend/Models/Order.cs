namespace CarPartShop.Backend.Models;

public class Order
{
    public int Id { get; set; }
    public string UserId { get; set; } = "admin";
    public string CustomerName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public string Status { get; set; } = "Created"; // Created, Paid, Processing, Shipped, Completed, ReturnRequested, Returned, Cancelled
    public decimal TotalPrice { get; set; }
    public string PaymentMethod { get; set; } = "Card";
    public string ReturnStatus { get; set; } = "None"; // None, Pending, Approved, Rejected
    public string? ReturnReason { get; set; }
    public string? ReturnComments { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    public ICollection<ReturnRequest> Returns { get; set; } = new List<ReturnRequest>();
}
