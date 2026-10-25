using Grpc.Core;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using CarPartShop.Backend.Data;
using CarPartShop.Backend.Hubs;
using CarPartShop.Backend.Protos;

namespace CarPartShop.Backend.Services;

public class PaymentGrpcService : PaymentService.PaymentServiceBase
{
    private readonly ShopDbContext _dbContext;
    private readonly IValidator<ProcessPaymentRequest> _validator;
    private readonly IHubContext<ShopHub> _hubContext;
    private readonly ILogger<PaymentGrpcService> _logger;

    public PaymentGrpcService(
        ShopDbContext dbContext,
        IValidator<ProcessPaymentRequest> validator,
        IHubContext<ShopHub> hubContext,
        ILogger<PaymentGrpcService> logger)
    {
        _dbContext = dbContext;
        _validator = validator;
        _hubContext = hubContext;
        _logger = logger;
    }

    public override async Task<ProcessPaymentResponse> ProcessPayment(ProcessPaymentRequest request, ServerCallContext context)
    {
        var validationResult = await _validator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            var errors = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
            throw new RpcException(new Status(StatusCode.InvalidArgument, errors));
        }

        var order = await _dbContext.Orders.FirstOrDefaultAsync(o => o.Id == request.OrderId);
        if (order == null)
        {
            throw new RpcException(new Status(StatusCode.NotFound, $"Zamówienie o ID {request.OrderId} nie istnieje."));
        }

        var transactionId = $"TX-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";
        order.Status = "Paid";
        order.PaymentMethod = request.PaymentMethod;
        order.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Płatność dla zamówienia #{OrderId} powiodła się. Transakcja: {TxId}, Kwota: {Amount} PLN",
            order.Id, transactionId, request.Amount);

        await _hubContext.Clients.All.SendAsync("ReceiveOrderStatusChanged", order.Id, "Paid", $"Płatność {request.Amount:F2} PLN została zaksięgowana pomyślnie.");

        return new ProcessPaymentResponse
        {
            Success = true,
            TransactionId = transactionId,
            Message = "Płatność powiodła się. Zamówienie przekazane do realizacji.",
            PaymentStatus = "PAID_SUCCESS",
            ProcessedAt = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss")
        };
    }
}
