using CarPartShop.Backend.Controllers;
using CarPartShop.Backend.Data;
using CarPartShop.Backend.Hubs;
using CarPartShop.Backend.Models;
using CarPartShop.Backend.Services;
using CarPartShop.Backend.Protos;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace CarPartShop.Backend.Tests;

public class NotificationTests
{
    private static ShopDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ShopDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ShopDbContext(options);
    }

    [Fact]
    public async Task GetNotifications_ReturnsAllAndCalculatesUnreadCount()
    {
        using var db = CreateInMemoryDbContext();
        db.Notifications.AddRange(
            new Notification { Title = "Promocja 1", Message = "Rabat 10%", Type = "promo", IsRead = false },
            new Notification { Title = "Promocja 2", Message = "Rabat 20%", Type = "promo", IsRead = true },
            new Notification { Title = "Wysyłka", Message = "Darmowa", Type = "info", IsRead = false }
        );
        await db.SaveChangesAsync();

        var controller = new NotificationsController(db);
        var actionResult = await controller.GetNotifications();
        var result = actionResult as OkObjectResult;

        result.Should().NotBeNull();
        result!.StatusCode.Should().Be(200);

        var json = System.Text.Json.JsonSerializer.Serialize(result.Value);
        using var doc = System.Text.Json.JsonDocument.Parse(json);
        doc.RootElement.GetProperty("unreadCount").GetInt32().Should().Be(2);
        doc.RootElement.GetProperty("totalCount").GetInt32().Should().Be(3);
    }

    [Fact]
    public async Task GetNotifications_WithUnreadOnlyFilter_ReturnsOnlyUnread()
    {
        using var db = CreateInMemoryDbContext();
        db.Notifications.AddRange(
            new Notification { Title = "Powiadomienie 1", Message = "Treść", IsRead = false },
            new Notification { Title = "Powiadomienie 2", Message = "Treść", IsRead = true }
        );
        await db.SaveChangesAsync();

        var controller = new NotificationsController(db);
        var result = await controller.GetNotifications(unreadOnly: true) as OkObjectResult;

        result.Should().NotBeNull();
        var json = System.Text.Json.JsonSerializer.Serialize(result!.Value);
        using var doc = System.Text.Json.JsonDocument.Parse(json);
        doc.RootElement.GetProperty("totalCount").GetInt32().Should().Be(1);
    }

    [Fact]
    public async Task MarkAsRead_WhenValidId_MarksNotificationAsReadAndUpdatesUnreadCount()
    {
        using var db = CreateInMemoryDbContext();
        var hubMock = new Mock<IHubContext<ShopHub>>();
        var clientsMock = new Mock<IHubClients>();
        var clientProxyMock = new Mock<IClientProxy>();
        clientsMock.Setup(c => c.All).Returns(clientProxyMock.Object);
        hubMock.Setup(h => h.Clients).Returns(clientsMock.Object);

        var notification = new Notification { Title = "Nowa Promocja", Message = "Kod TUNING20", IsRead = false };
        db.Notifications.Add(notification);
        await db.SaveChangesAsync();

        var controller = new NotificationsController(db, hubMock.Object);
        var result = await controller.MarkAsRead(notification.Id) as OkObjectResult;

        result.Should().NotBeNull();
        result!.StatusCode.Should().Be(200);

        var updated = await db.Notifications.FindAsync(notification.Id);
        updated!.IsRead.Should().BeTrue();

        var json = System.Text.Json.JsonSerializer.Serialize(result.Value);
        using var doc = System.Text.Json.JsonDocument.Parse(json);
        doc.RootElement.GetProperty("unreadCount").GetInt32().Should().Be(0);
    }

    [Fact]
    public async Task MarkAsRead_WhenInvalidId_ReturnsNotFound()
    {
        using var db = CreateInMemoryDbContext();
        var controller = new NotificationsController(db);
        var result = await controller.MarkAsRead(999) as NotFoundObjectResult;

        result.Should().NotBeNull();
        result!.StatusCode.Should().Be(404);
    }

    [Fact]
    public async Task MarkAllAsRead_MarksAllUnreadNotificationsAsRead()
    {
        using var db = CreateInMemoryDbContext();
        var hubMock = new Mock<IHubContext<ShopHub>>();
        var clientsMock = new Mock<IHubClients>();
        var clientProxyMock = new Mock<IClientProxy>();
        clientsMock.Setup(c => c.All).Returns(clientProxyMock.Object);
        hubMock.Setup(h => h.Clients).Returns(clientsMock.Object);

        db.Notifications.AddRange(
            new Notification { Title = "1", Message = "M1", IsRead = false },
            new Notification { Title = "2", Message = "M2", IsRead = false },
            new Notification { Title = "3", Message = "M3", IsRead = true }
        );
        await db.SaveChangesAsync();

        var controller = new NotificationsController(db, hubMock.Object);
        var result = await controller.MarkAllAsRead() as OkObjectResult;

        result.Should().NotBeNull();
        result!.StatusCode.Should().Be(200);

        var allRead = await db.Notifications.AllAsync(n => n.IsRead);
        allRead.Should().BeTrue();
    }

    [Fact]
    public async Task CreateNotification_WhenValid_AddsNotificationAndReturnsCreated()
    {
        using var db = CreateInMemoryDbContext();
        var hubMock = new Mock<IHubContext<ShopHub>>();
        var clientsMock = new Mock<IHubClients>();
        var clientProxyMock = new Mock<IClientProxy>();
        clientsMock.Setup(c => c.All).Returns(clientProxyMock.Object);
        hubMock.Setup(h => h.Clients).Returns(clientsMock.Object);

        var controller = new NotificationsController(db, hubMock.Object);
        var dto = new CreateNotificationDto("Promocja Weekendowa", "Tylko w ten weekend -15%", "promo", "/portal/catalog");
        var result = await controller.CreateNotification(dto) as CreatedAtActionResult;

        result.Should().NotBeNull();
        result!.StatusCode.Should().Be(201);

        var saved = await db.Notifications.FirstOrDefaultAsync(n => n.Title == "Promocja Weekendowa");
        saved.Should().NotBeNull();
        saved!.Message.Should().Be("Tylko w ten weekend -15%");
        saved.Type.Should().Be("promo");
        saved.Link.Should().Be("/portal/catalog");
        saved.IsRead.Should().BeFalse();
    }

    [Fact]
    public async Task CreateNotification_WhenTitleEmpty_ReturnsBadRequest()
    {
        using var db = CreateInMemoryDbContext();
        var controller = new NotificationsController(db);
        var dto = new CreateNotificationDto("", "Treść", "promo");
        var result = await controller.CreateNotification(dto) as BadRequestObjectResult;

        result.Should().NotBeNull();
        result!.StatusCode.Should().Be(400);
    }

    [Fact]
    public async Task NotificationGrpcService_GetNotifications_ReturnsProtoModels()
    {
        using var db = CreateInMemoryDbContext();
        db.Notifications.Add(new Notification
        {
            Title = "Promocja gRPC",
            Message = "Test gRPC",
            Type = "promo",
            IsRead = false,
            Link = "/portal/"
        });
        await db.SaveChangesAsync();

        var service = new NotificationGrpcService(db);
        var response = await service.GetNotifications(new GetNotificationsRequest(), null!);

        response.Should().NotBeNull();
        response.Notifications.Should().HaveCount(1);
        response.Notifications[0].Title.Should().Be("Promocja gRPC");
        response.UnreadCount.Should().Be(1);
    }
}
