using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using CarPartShop.Backend.Data;
using CarPartShop.Backend.Hubs;
using CarPartShop.Backend.Models;

namespace CarPartShop.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly ShopDbContext _dbContext;
    private readonly IHubContext<ShopHub> _hubContext;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(
        ShopDbContext dbContext,
        IHubContext<ShopHub> hubContext,
        ILogger<OrdersController> logger)
    {
        _dbContext = dbContext;
        _hubContext = hubContext;
        _logger = logger;
    }

    public record CreateOrderItemDto(int PartId, int Quantity);
    public record CreateOrderDto(
        string CustomerName,
        string Email,
        string Phone,
        string ShippingAddress,
        string PaymentMethod,
        string? CourierName,
        string? DiscountCode,
        List<CreateOrderItemDto> Items);

    public record ReturnRequestDto(int OrderId, string Reason, string Comments);
    public record ValidateCouponDto(string Code, decimal Amount);

    [HttpGet]
    public async Task<IActionResult> GetOrders([FromQuery] string? userId, [FromQuery] string? email)
    {
        var currentUserName = User.Identity?.Name ??
                              User.FindFirst("preferred_username")?.Value;

        var query = _dbContext.Orders.Include(o => o.Items).AsQueryable();

        if (!string.IsNullOrWhiteSpace(userId))
        {
            query = query.Where(o => o.UserId == userId);
        }
        else if (!string.IsNullOrWhiteSpace(email))
        {
            query = query.Where(o => o.Email == email);
        }
        else if (!string.IsNullOrWhiteSpace(currentUserName) && !currentUserName.Equals("admin", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(o => o.UserId == currentUserName);
        }

        var orders = await query.OrderByDescending(o => o.CreatedAt).ToListAsync();

        return Ok(orders.Select(MapOrder));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetOrderById(int id)
    {
        var order = await _dbContext.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);
        if (order == null)
        {
            return NotFound(new { message = $"Zamówienie #{id} nie istnieje." });
        }

        return Ok(MapOrder(order));
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CustomerName))
            return BadRequest(new { message = "Imię i nazwisko klienta jest wymagane." });

        if (string.IsNullOrWhiteSpace(dto.Email))
            return BadRequest(new { message = "Adres e-mail jest wymagany." });

        if (dto.Items == null || dto.Items.Count == 0)
            return BadRequest(new { message = "Koszyk nie może być pusty." });

        var userId = User.Identity?.Name ??
                     User.FindFirst("preferred_username")?.Value ??
                     "admin";

        var requestedPartIds = dto.Items.Select(i => i.PartId).ToList();
        var parts = await _dbContext.CarParts
            .Where(p => requestedPartIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id);

        decimal totalPrice = 0;
        var orderItems = new List<OrderItem>();

        foreach (var item in dto.Items)
        {
            if (!parts.TryGetValue(item.PartId, out var part))
            {
                return NotFound(new { message = $"Część #{item.PartId} nie została znaleziona w katalogu." });
            }

            if (part.StockQuantity < item.Quantity)
            {
                return BadRequest(new { message = $"Brak wystarczającej ilości dla '{part.Name}' (dostępne: {part.StockQuantity})." });
            }

            part.StockQuantity -= item.Quantity;
            var itemTotal = part.Price * item.Quantity;
            totalPrice += itemTotal;

            orderItems.Add(new OrderItem
            {
                CarPartId = part.Id,
                PartName = part.Name,
                PartNumber = part.PartNumber,
                Quantity = item.Quantity,
                UnitPrice = part.Price,
                TotalPrice = itemTotal
            });

            await _hubContext.Clients.All.SendAsync("ReceiveStockUpdate", part.Id, part.StockQuantity);
        }

        decimal discountAmount = 0;
        var discountCode = dto.DiscountCode?.Trim().ToUpperInvariant();
        if (!string.IsNullOrEmpty(discountCode))
        {
            switch (discountCode)
            {
                case "START10":
                    discountAmount = Math.Round(totalPrice * 0.10m, 2);
                    break;
                case "MOTO20":
                    discountAmount = Math.Min(totalPrice, 20.00m);
                    break;
                case "WIOSNA15":
                    discountAmount = Math.Round(totalPrice * 0.15m, 2);
                    break;
                case "VIP25":
                    discountAmount = Math.Round(totalPrice * 0.25m, 2);
                    break;
            }
        }

        var finalPrice = Math.Max(0, totalPrice - discountAmount);
        var courier = string.IsNullOrWhiteSpace(dto.CourierName)
            ? (dto.ShippingAddress.Contains("Paczkomat", StringComparison.OrdinalIgnoreCase) ? "InPost Paczkomaty" : "Kurier DPD")
            : dto.CourierName;

        var isPaczkomat = courier.Contains("InPost", StringComparison.OrdinalIgnoreCase) || courier.Contains("Paczkomat", StringComparison.OrdinalIgnoreCase);
        var trackingPrefix = isPaczkomat ? "INP" : "DPD";
        var trackingNumber = $"{trackingPrefix}{DateTime.UtcNow:yyMMdd}{Random.Shared.Next(100000, 999999)}";

        var order = new Order
        {
            UserId = userId,
            CustomerName = dto.CustomerName,
            Email = dto.Email,
            Phone = dto.Phone ?? "",
            ShippingAddress = dto.ShippingAddress ?? "",
            PaymentMethod = string.IsNullOrWhiteSpace(dto.PaymentMethod) ? "Card" : dto.PaymentMethod,
            Status = "Paid",
            TotalPrice = finalPrice,
            ReturnStatus = "None",
            CourierName = courier,
            TrackingNumber = trackingNumber,
            DiscountCode = discountCode,
            DiscountAmount = discountAmount,
            InvoiceNumber = $"FV/{DateTime.UtcNow:yyyy/MM}/{Random.Shared.Next(1000, 9999)}",
            CreatedAt = DateTime.UtcNow,
            Items = orderItems
        };

        _dbContext.Orders.Add(order);
        await _dbContext.SaveChangesAsync();

        order.InvoiceNumber = $"FV/{DateTime.UtcNow:yyyy/MM}/{order.Id:D5}";
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Utworzono zamówienie #{OrderId} dla {Customer}", order.Id, order.CustomerName);

        await _hubContext.Clients.All.SendAsync("ReceiveOrderPlaced", order.Id, order.CustomerName, (double)order.TotalPrice);
        await _hubContext.Clients.All.SendAsync("ReceiveOrderStatusChanged", order.Id, order.Status, "Zamówienie zostało pomyślnie złożone i opłacone.");

        return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, MapOrder(order));
    }

    [HttpPost("return")]
    public async Task<IActionResult> RequestReturn([FromBody] ReturnRequestDto dto)
    {
        if (dto.OrderId <= 0)
            return BadRequest(new { message = "Nieprawidłowy identyfikator zamówienia." });

        if (string.IsNullOrWhiteSpace(dto.Reason))
            return BadRequest(new { message = "Powód zwrotu jest wymagany." });

        var order = await _dbContext.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == dto.OrderId);
        if (order == null)
            return NotFound(new { message = $"Zamówienie #{dto.OrderId} nie zostało odnalezione." });

        if (order.ReturnStatus == "Approved" || order.ReturnStatus == "Completed")
            return BadRequest(new { message = "To zamówienie zostało już zwrócone." });

        order.ReturnStatus = "Approved";
        order.Status = "Returned";
        order.ReturnReason = dto.Reason;
        order.ReturnComments = dto.Comments;
        order.UpdatedAt = DateTime.UtcNow;

        foreach (var item in order.Items)
        {
            var part = await _dbContext.CarParts.FindAsync(item.CarPartId);
            if (part != null)
            {
                part.StockQuantity += item.Quantity;
                await _hubContext.Clients.All.SendAsync("ReceiveStockUpdate", part.Id, part.StockQuantity);
            }
        }

        var returnReq = new ReturnRequest
        {
            OrderId = order.Id,
            Reason = dto.Reason,
            Comments = dto.Comments ?? "",
            Status = "Approved",
            RequestedAt = DateTime.UtcNow,
            ResolvedAt = DateTime.UtcNow
        };

        _dbContext.ReturnRequests.Add(returnReq);
        await _dbContext.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync("ReceiveReturnUpdate", order.Id, "Approved", $"Zwrot zamówienia #{order.Id} został zaakceptowany.");
        await _hubContext.Clients.All.SendAsync("ReceiveOrderStatusChanged", order.Id, "Returned", "Status zamówienia zmieniony na: Zwrócone");

        return Ok(new
        {
            Success = true,
            Message = "Zwrot został pomyślnie zarejestrowany i zaakceptowany.",
            OrderId = order.Id,
            NewStatus = "Returned"
        });
    }

    [HttpPost("coupons/validate")]
    public IActionResult ValidateCoupon([FromBody] ValidateCouponDto dto)
    {
        var code = dto.Code?.Trim().ToUpperInvariant() ?? "";
        if (string.IsNullOrEmpty(code))
        {
            return BadRequest(new { valid = false, message = "Kod rabatowy nie może być pusty." });
        }

        decimal discountPercent = 0;
        decimal discountFixed = 0;
        string description = "";

        switch (code)
        {
            case "START10":
                discountPercent = 10;
                description = "Rabat powitalny 10% na całe zamówienie";
                break;
            case "MOTO20":
                discountFixed = 20;
                description = "Zniżka 20 PLN na zakupy motoryzacyjne";
                break;
            case "WIOSNA15":
                discountPercent = 15;
                description = "Rabat sezonowy 15% na części i oleje";
                break;
            case "VIP25":
                discountPercent = 25;
                description = "Ekskluzywny rabat klubowy 25%";
                break;
            default:
                return NotFound(new { valid = false, message = "Podany kod rabatowy jest nieprawidłowy lub wygasł." });
        }

        decimal calculatedDiscount = 0;
        if (discountPercent > 0)
        {
            calculatedDiscount = Math.Round(dto.Amount * (discountPercent / 100m), 2);
        }
        else if (discountFixed > 0)
        {
            calculatedDiscount = Math.Min(dto.Amount, discountFixed);
        }

        return Ok(new
        {
            valid = true,
            code,
            discountPercent,
            discountFixed,
            discountAmount = (double)calculatedDiscount,
            description
        });
    }

    [HttpGet("{id:int}/invoice")]
    public async Task<IActionResult> GetOrderInvoice(int id)
    {
        var order = await _dbContext.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);
        if (order == null)
        {
            return NotFound(new { message = $"Zamówienie #{id} nie istnieje." });
        }

        var invoiceNum = string.IsNullOrWhiteSpace(order.InvoiceNumber)
            ? $"FV/{order.CreatedAt:yyyy/MM}/{order.Id:D5}"
            : order.InvoiceNumber;

        var itemsList = order.Items.Select(i =>
        {
            var grossUnit = i.UnitPrice;
            var netUnit = Math.Round(grossUnit / 1.23m, 2);
            var grossTotal = i.TotalPrice;
            var netTotal = Math.Round(grossTotal / 1.23m, 2);
            var vatTotal = grossTotal - netTotal;

            return new
            {
                i.Id,
                i.PartName,
                i.PartNumber,
                i.Quantity,
                NetUnitPrice = (double)netUnit,
                GrossUnitPrice = (double)grossUnit,
                VatRate = "23%",
                NetTotalPrice = (double)netTotal,
                VatTotalPrice = (double)vatTotal,
                GrossTotalPrice = (double)grossTotal
            };
        }).ToList();

        var totalGross = order.TotalPrice;
        var totalNet = Math.Round(totalGross / 1.23m, 2);
        var totalVat = totalGross - totalNet;

        return Ok(new
        {
            InvoiceNumber = invoiceNum,
            OrderId = order.Id,
            IssueDate = order.CreatedAt.ToString("yyyy-MM-dd"),
            SaleDate = order.CreatedAt.ToString("yyyy-MM-dd"),
            PaymentDueDate = order.CreatedAt.ToString("yyyy-MM-dd"),
            PaymentMethod = order.PaymentMethod,
            PaymentStatus = "OPŁACONO",
            Seller = new
            {
                Name = "CarPartShop Sp. z o.o.",
                Nip = "PL 521-384-91-02",
                Regon = "142984512",
                Address = "ul. Wyścigowa 42, 00-001 Warszawa",
                BankName = "mBank S.A.",
                BankAccount = "PL 48 1140 2004 0000 3102 7700 1001",
                Email = "faktury@carpartshop.pl",
                Phone = "+48 22 100 20 30"
            },
            Buyer = new
            {
                Name = order.CustomerName,
                Email = order.Email,
                Phone = order.Phone,
                Address = order.ShippingAddress
            },
            Items = itemsList,
            DiscountCode = order.DiscountCode ?? "",
            DiscountAmount = (double)order.DiscountAmount,
            TrackingNumber = order.TrackingNumber ?? "",
            CourierName = order.CourierName ?? "",
            Summary = new
            {
                TotalNet = (double)totalNet,
                TotalVat = (double)totalVat,
                TotalGross = (double)totalGross,
                Currency = "PLN"
            }
        });
    }

    private static object MapOrder(Order order) => new
    {
        order.Id,
        order.CustomerName,
        order.Email,
        order.Phone,
        order.ShippingAddress,
        order.Status,
        TotalPrice = (double)order.TotalPrice,
        CreatedAt = order.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss"),
        order.PaymentMethod,
        order.ReturnStatus,
        ReturnReason = order.ReturnReason ?? "",
        TrackingNumber = order.TrackingNumber ?? "",
        CourierName = order.CourierName ?? "",
        DiscountCode = order.DiscountCode ?? "",
        DiscountAmount = (double)order.DiscountAmount,
        InvoiceNumber = order.InvoiceNumber ?? "",
        Items = order.Items.Select(i => new
        {
            i.Id,
            PartId = i.CarPartId,
            i.PartName,
            i.PartNumber,
            i.Quantity,
            UnitPrice = (double)i.UnitPrice,
            TotalPrice = (double)i.TotalPrice
        })
    };
}
