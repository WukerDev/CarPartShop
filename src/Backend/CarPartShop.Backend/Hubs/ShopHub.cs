using Microsoft.AspNetCore.SignalR;

namespace CarPartShop.Backend.Hubs;

public class ShopHub : Hub
{
    public async Task JoinOrderUpdates(string userId)
    {
        if (!string.IsNullOrWhiteSpace(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
        }
    }

    public async Task LeaveOrderUpdates(string userId)
    {
        if (!string.IsNullOrWhiteSpace(userId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
        }
    }

    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
    }
}
