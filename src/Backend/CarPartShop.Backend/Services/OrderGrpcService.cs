using Grpc.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using CarPartShop.Backend.Data;
using CarPartShop.Backend.Hubs;
using CarPartShop.Backend.Models;
using CarPartShop.Backend.Protos;

namespace CarPartShop.Backend.Services;

public class OrderGrpcService : OrderService.OrderServiceBase
{
    private readonly ShopDbContext _dbContext;
    private readonly IValidator<CreateOrderRequest> _orderValidator;
    private readonly IValidator<RequestReturnRequest> _returnValidator;
    private readonly IHubContext<ShopHub> _hubContext;
    private readonly ILogger<OrderGrpcService> _logger;

    public OrderGrpcService(
        ShopDbContext dbContext,
        IValidator<CreateOrderRequest> orderValidator,
        IValidator<RequestReturnRequest> returnValidator,
        IHubContext<ShopHub> hubContext,
        ILogger<OrderGrpcService> logger)
    {
        _dbContext = dbContext;
        _orderValidator = orderValidator;
        _returnValidator = returnValidator;
        _hubContext = hubContext;
        _logger = logger;
    }

    public override async Task<OrderResponse> CreateOrder(CreateOrderRequest request, ServerCallContext context)
    {
        var validationResult = await _orderValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            var errors = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
            throw new RpcException(new Status(StatusCode.InvalidArgument, errors));
        }

        var httpContext = context != null ? context.GetHttpContext() : null;
        var userId = httpContext?.User?.Identity?.Name ??
                     httpContext?.User?.FindFirst("preferred_username")?.Value ??
                     "admin";

        var requestedPartIds = request.Items.Select(i => i.PartId).ToList();
        var parts = await _dbContext.CarParts
            .Where(p => requestedPartIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id);

        decimal totalPrice = 0;
        var orderItems = new List<OrderItem>();

        foreach (var itemReq in request.Items)
        {
            if (!parts.TryGetValue(itemReq.PartId, out var part))
            {
                throw new RpcException(new Status(StatusCode.NotFound, $"Część o ID {itemReq.PartId} nie istnieje w katalogu."));
            }

            if (part.StockQuantity < itemReq.Quantity)
            {
                throw new RpcException(new Status(StatusCode.FailedPrecondition, $"Niewystarczająca ilość części '{part.Name}' w magazynie (dostępne: {part.StockQuantity})."));
            }

            part.StockQuantity -= itemReq.Quantity;

            var itemTotal = part.Price * itemReq.Quantity;
            totalPrice += itemTotal;

            orderItems.Add(new OrderItem
            {
                CarPartId = part.Id,
                PartName = part.Name,
                PartNumber = part.PartNumber,
                Quantity = itemReq.Quantity,
                UnitPrice = part.Price,
                TotalPrice = itemTotal
            });

            await _hubContext.Clients.All.SendAsync("ReceiveStockUpdate", part.Id, part.StockQuantity);
        }

        var order = new Order
        {
            UserId = userId,
            CustomerName = request.CustomerName,
            Email = request.Email,
            Phone = request.Phone,
            ShippingAddress = request.ShippingAddress,
            PaymentMethod = string.IsNullOrWhiteSpace(request.PaymentMethod) ? "Card" : request.PaymentMethod,
            Status = "Paid",
            TotalPrice = totalPrice,
            ReturnStatus = "None",
            CreatedAt = DateTime.UtcNow,
            Items = orderItems
        };

        _dbContext.Orders.Add(order);
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Utworzono zamówienie #{OrderId} o wartości {Total} PLN dla klienta {Customer}",
            order.Id, order.TotalPrice, order.CustomerName);

        await _hubContext.Clients.All.SendAsync("ReceiveOrderPlaced", order.Id, order.CustomerName, (double)order.TotalPrice);
        await _hubContext.Clients.All.SendAsync("ReceiveOrderStatusChanged", order.Id, order.Status, "Zamówienie zostało pomyślnie złożone i opłacone.");

        return MapToOrderResponse(order);
    }

    public override async Task<GetOrdersResponse> GetOrders(GetOrdersRequest request, ServerCallContext context)
    {
        var httpContext = context != null ? context.GetHttpContext() : null;
        var currentUserName = httpContext?.User?.Identity?.Name ??
                              httpContext?.User?.FindFirst("preferred_username")?.Value;

        var query = _dbContext.Orders
            .Include(o => o.Items)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.UserId))
        {
            query = query.Where(o => o.UserId == request.UserId);
        }
        else if (!string.IsNullOrWhiteSpace(request.Email))
        {
            query = query.Where(o => o.Email == request.Email);
        }
        else if (!string.IsNullOrWhiteSpace(currentUserName) && !currentUserName.Equals("admin", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(o => o.UserId == currentUserName);
        }

        var orders = await query.OrderByDescending(o => o.CreatedAt).ToListAsync();
        var response = new GetOrdersResponse();

        foreach (var order in orders)
        {
            response.Orders.Add(MapToOrderResponse(order));
        }

        return response;
    }

    public override async Task<OrderResponse> GetOrderById(GetOrderByIdRequest request, ServerCallContext context)
    {
        var order = await _dbContext.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == request.Id);

        if (order == null)
        {
            throw new RpcException(new Status(StatusCode.NotFound, $"Zamówienie o ID {request.Id} nie istnieje."));
        }

        return MapToOrderResponse(order);
    }

    public override async Task<RequestReturnResponse> RequestReturn(RequestReturnRequest request, ServerCallContext context)
    {
        var validationResult = await _returnValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            var errors = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
            throw new RpcException(new Status(StatusCode.InvalidArgument, errors));
        }

        var order = await _dbContext.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId);

        if (order == null)
        {
            throw new RpcException(new Status(StatusCode.NotFound, $"Zamówienie o ID {request.OrderId} nie zostało odnalezione."));
        }

        if (order.ReturnStatus == "Approved" || order.ReturnStatus == "Completed")
        {
            throw new RpcException(new Status(StatusCode.FailedPrecondition, "To zamówienie zostało już zwrócone."));
        }

        order.ReturnStatus = "Approved";
        order.Status = "Returned";
        order.ReturnReason = request.Reason;
        order.ReturnComments = request.Comments;
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
            Reason = request.Reason,
            Comments = request.Comments ?? string.Empty,
            Status = "Approved",
            RequestedAt = DateTime.UtcNow,
            ResolvedAt = DateTime.UtcNow
        };

        _dbContext.ReturnRequests.Add(returnReq);
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Zgłoszono i zaakceptowano zwrot dla zamówienia #{OrderId}. Powód: {Reason}", order.Id, request.Reason);

        await _hubContext.Clients.All.SendAsync("ReceiveReturnUpdate", order.Id, "Approved", $"Zwrot zamówienia #{order.Id} został zaakceptowany.");
        await _hubContext.Clients.All.SendAsync("ReceiveOrderStatusChanged", order.Id, "Returned", "Status zamówienia zmieniony na: Zwrócone");

        return new RequestReturnResponse
        {
            Success = true,
            Message = "Zwrot został pomyślnie zarejestrowany i zaakceptowany. Środki zostaną zwrócone w ciągu 1-2 dni roboczych.",
            OrderId = order.Id,
            NewStatus = "Returned"
        };
    }

    private static OrderResponse MapToOrderResponse(Order order)
    {
        var response = new OrderResponse
        {
            Id = order.Id,
            CustomerName = order.CustomerName,
            Email = order.Email,
            Phone = order.Phone,
            ShippingAddress = order.ShippingAddress,
            Status = order.Status,
            TotalPrice = (double)order.TotalPrice,
            CreatedAt = order.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss"),
            PaymentMethod = order.PaymentMethod,
            ReturnStatus = order.ReturnStatus,
            ReturnReason = order.ReturnReason ?? string.Empty
        };

        foreach (var item in order.Items)
        {
            response.Items.Add(new OrderItemModel
            {
                Id = item.Id,
                PartId = item.CarPartId,
                PartName = item.PartName,
                PartNumber = item.PartNumber,
                Quantity = item.Quantity,
                UnitPrice = (double)item.UnitPrice,
                TotalPrice = (double)item.TotalPrice
            });
        }

        return response;
    }
}
