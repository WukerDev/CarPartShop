using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using CarPartShop.Backend.Data;
using CarPartShop.Backend.Protos;

namespace CarPartShop.Backend.Services;

public class NotificationGrpcService : NotificationService.NotificationServiceBase
{
    private readonly ShopDbContext _dbContext;

    public NotificationGrpcService(ShopDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public override async Task<GetNotificationsResponse> GetNotifications(GetNotificationsRequest request, ServerCallContext context)
    {
        var query = _dbContext.Notifications.AsQueryable();
        if (request.HasUnreadOnly && request.UnreadOnly)
        {
            query = query.Where(n => !n.IsRead);
        }

        var list = await query.OrderByDescending(n => n.CreatedAt).ToListAsync();
        var unreadCount = await _dbContext.Notifications.CountAsync(n => !n.IsRead);

        var response = new GetNotificationsResponse
        {
            UnreadCount = unreadCount
        };

        foreach (var n in list)
        {
            response.Notifications.Add(new NotificationModel
            {
                Id = n.Id,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt.ToString("o"),
                Link = n.Link ?? string.Empty
            });
        }

        return response;
    }

    public override async Task<MarkAsReadResponse> MarkAsRead(MarkAsReadRequest request, ServerCallContext context)
    {
        var notification = await _dbContext.Notifications.FindAsync(request.Id);
        if (notification == null)
        {
            return new MarkAsReadResponse
            {
                Success = false,
                Message = $"Powiadomienie o ID {request.Id} nie zostało odnalezione.",
                UnreadCount = await _dbContext.Notifications.CountAsync(n => !n.IsRead)
            };
        }

        notification.IsRead = true;
        await _dbContext.SaveChangesAsync();

        var unreadCount = await _dbContext.Notifications.CountAsync(n => !n.IsRead);
        return new MarkAsReadResponse
        {
            Success = true,
            Message = "Oznaczono jako przeczytane.",
            UnreadCount = unreadCount
        };
    }

    public override async Task<MarkAllAsReadResponse> MarkAllAsRead(MarkAllAsReadRequest request, ServerCallContext context)
    {
        var unread = await _dbContext.Notifications.Where(n => !n.IsRead).ToListAsync();
        foreach (var n in unread)
        {
            n.IsRead = true;
        }

        await _dbContext.SaveChangesAsync();

        return new MarkAllAsReadResponse
        {
            Success = true,
            UpdatedCount = unread.Count
        };
    }
}
