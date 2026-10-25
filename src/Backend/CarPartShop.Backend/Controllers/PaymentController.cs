using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using CarPartShop.Backend.Data;
using CarPartShop.Backend.Hubs;

namespace CarPartShop.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly ShopDbContext _dbContext;
    private readonly IHubContext<ShopHub> _hubContext;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(
        ShopDbContext dbContext,
        IHubContext<ShopHub> hubContext,
        ILogger<PaymentController> logger)
    {
        _dbContext = dbContext;
        _hubContext = hubContext;
        _logger = logger;
    }

    public record ProcessPaymentDto(
        int OrderId,
        decimal Amount,
        string PaymentMethod,
        string? CardNumber,
        string? CardExpiry,
        string? CardCvv,
        string? BlikCode);

    [HttpPost("process")]
    public async Task<IActionResult> ProcessPayment([FromBody] ProcessPaymentDto dto)
    {
        if (dto.OrderId <= 0)
            return BadRequest(new { message = "Identyfikator zamówienia jest wymagany." });

        if (dto.Amount <= 0)
            return BadRequest(new { message = "Kwota płatności musi być większa od zera." });

        var order = await _dbContext.Orders.FirstOrDefaultAsync(o => o.Id == dto.OrderId);
        if (order == null)
            return NotFound(new { message = $"Zamówienie #{dto.OrderId} nie istnieje." });

        var transactionId = $"TX-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";
        order.Status = "Paid";
        order.PaymentMethod = dto.PaymentMethod;
        order.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Zaksięgowano płatność {Amount} PLN dla zamówienia #{OrderId}, transakcja {TxId}",
            dto.Amount, order.Id, transactionId);

        await _hubContext.Clients.All.SendAsync("ReceiveOrderStatusChanged", order.Id, "Paid", $"Płatność {dto.Amount:F2} PLN zaksięgowana pomyślnie.");

        return Ok(new
        {
            Success = true,
            TransactionId = transactionId,
            Message = "Płatność powiodła się. Zamówienie przekazane do realizacji.",
            PaymentStatus = "PAID_SUCCESS",
            ProcessedAt = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss")
        });
    }
}
