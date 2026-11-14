using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using CarPartShop.Backend.Data;
using CarPartShop.Backend.Hubs;
using CarPartShop.Backend.Models;

namespace CarPartShop.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly ShopDbContext _dbContext;
    private readonly IHubContext<ShopHub>? _hubContext;

    public NotificationsController(ShopDbContext dbContext, IHubContext<ShopHub>? hubContext = null)
    {
        _dbContext = dbContext;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications([FromQuery] bool? unreadOnly = null)
    {
        var query = _dbContext.Notifications.AsQueryable();
        if (unreadOnly.HasValue && unreadOnly.Value)
        {
            query = query.Where(n => !n.IsRead);
        }

        var list = await query.OrderByDescending(n => n.CreatedAt).ToListAsync();
        var unreadCount = await _dbContext.Notifications.CountAsync(n => !n.IsRead);

        return Ok(new
        {
            unreadCount,
            totalCount = list.Count,
            notifications = list
        });
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        var unreadCount = await _dbContext.Notifications.CountAsync(n => !n.IsRead);
        return Ok(new { unreadCount });
    }

    [HttpPut("{id:int}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var notification = await _dbContext.Notifications.FindAsync(id);
        if (notification == null)
        {
            return NotFound(new { message = $"Powiadomienie o ID {id} nie zostało odnalezione." });
        }

        notification.IsRead = true;
        await _dbContext.SaveChangesAsync();

        var unreadCount = await _dbContext.Notifications.CountAsync(n => !n.IsRead);

        if (_hubContext != null)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveNotificationRead", id, unreadCount);
        }

        return Ok(new
        {
            success = true,
            notification,
            unreadCount
        });
    }

    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var unread = await _dbContext.Notifications.Where(n => !n.IsRead).ToListAsync();
        foreach (var n in unread)
        {
            n.IsRead = true;
        }

        await _dbContext.SaveChangesAsync();

        var unreadCount = 0;

        if (_hubContext != null)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveAllNotificationsRead");
        }

        return Ok(new
        {
            success = true,
            updatedCount = unread.Count,
            unreadCount
        });
    }

    [HttpPost]
    public async Task<IActionResult> CreateNotification([FromBody] CreateNotificationDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Message))
        {
            return BadRequest(new { message = "Tytuł i treść powiadomienia są wymagane." });
        }

        var notification = new Notification
        {
            Title = dto.Title.Trim(),
            Message = dto.Message.Trim(),
            Type = string.IsNullOrWhiteSpace(dto.Type) ? "promo" : dto.Type.Trim().ToLower(),
            Link = dto.Link?.Trim(),
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Notifications.Add(notification);
        await _dbContext.SaveChangesAsync();

        var unreadCount = await _dbContext.Notifications.CountAsync(n => !n.IsRead);

        if (_hubContext != null)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", notification, unreadCount);
        }

        return CreatedAtAction(nameof(GetNotifications), new { id = notification.Id }, notification);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteNotification(int id)
    {
        var notification = await _dbContext.Notifications.FindAsync(id);
        if (notification == null)
        {
            return NotFound(new { message = $"Powiadomienie o ID {id} nie zostało odnalezione." });
        }

        _dbContext.Notifications.Remove(notification);
        await _dbContext.SaveChangesAsync();

        var unreadCount = await _dbContext.Notifications.CountAsync(n => !n.IsRead);

        return Ok(new
        {
            success = true,
            message = "Powiadomienie zostało usunięte.",
            unreadCount
        });
    }
}

public record CreateNotificationDto(string Title, string Message, string? Type = "promo", string? Link = null);
