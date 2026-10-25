using Microsoft.EntityFrameworkCore;
using CarPartShop.Backend.Models;

namespace CarPartShop.Backend.Data;

public class ShopDbContext : DbContext
{
    public ShopDbContext(DbContextOptions<ShopDbContext> options) : base(options)
    {
    }

    public DbSet<Category> Categories => Set<Category>();
    public DbSet<CarPart> CarParts => Set<CarPart>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<ReturnRequest> ReturnRequests => Set<ReturnRequest>();
    public DbSet<VehicleModel> Vehicles => Set<VehicleModel>();
    public DbSet<ProductReview> ProductReviews => Set<ProductReview>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
            entity.Property(c => c.Slug).IsRequired().HasMaxLength(100);
            entity.HasIndex(c => c.Slug).IsUnique();
        });

        modelBuilder.Entity<CarPart>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
            entity.Property(p => p.PartNumber).IsRequired().HasMaxLength(100);
            entity.Property(p => p.Price).HasPrecision(18, 2);
            entity.Property(p => p.Manufacturer).HasMaxLength(100);
            entity.HasOne(p => p.Category)
                  .WithMany(c => c.Parts)
                  .HasForeignKey(p => p.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(o => o.Id);
            entity.Property(o => o.TotalPrice).HasPrecision(18, 2);
            entity.Property(o => o.DiscountAmount).HasPrecision(18, 2);
            entity.Property(o => o.Status).HasMaxLength(50);
            entity.Property(o => o.PaymentMethod).HasMaxLength(50);
            entity.Property(o => o.ReturnStatus).HasMaxLength(50);
            entity.Property(o => o.TrackingNumber).HasMaxLength(100);
            entity.Property(o => o.CourierName).HasMaxLength(100);
            entity.Property(o => o.DiscountCode).HasMaxLength(50);
            entity.Property(o => o.InvoiceNumber).HasMaxLength(100);
            entity.HasMany(o => o.Items)
                  .WithOne(i => i.Order)
                  .HasForeignKey(i => i.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(o => o.Returns)
                  .WithOne(r => r.Order)
                  .HasForeignKey(r => r.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(i => i.Id);
            entity.Property(i => i.UnitPrice).HasPrecision(18, 2);
            entity.Property(i => i.TotalPrice).HasPrecision(18, 2);
            entity.HasOne(i => i.CarPart)
                  .WithMany()
                  .HasForeignKey(i => i.CarPartId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ReturnRequest>(entity =>
        {
            entity.HasKey(r => r.Id);
            entity.Property(r => r.Reason).IsRequired().HasMaxLength(250);
            entity.Property(r => r.Status).HasMaxLength(50);
        });

        modelBuilder.Entity<VehicleModel>(entity =>
        {
            entity.HasKey(v => v.Id);
            entity.Property(v => v.Make).IsRequired().HasMaxLength(100);
            entity.Property(v => v.Model).IsRequired().HasMaxLength(100);
            entity.HasIndex(v => new { v.Make, v.Model });
        });

        modelBuilder.Entity<ProductReview>(entity =>
        {
            entity.HasKey(r => r.Id);
            entity.Property(r => r.AuthorName).IsRequired().HasMaxLength(100);
            entity.Property(r => r.Comment).IsRequired().HasMaxLength(1000);
            entity.HasOne(r => r.CarPart)
                  .WithMany(p => p.Reviews)
                  .HasForeignKey(r => r.CarPartId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
