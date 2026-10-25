using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using CarPartShop.Backend.Data;
using CarPartShop.Backend.Hubs;
using CarPartShop.Backend.Services;
using CarPartShop.Backend.Validators;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Host=postgres;Port=5432;Database=carpartshop;Username=postgres;Password=postgres";

builder.Services.AddDbContext<ShopDbContext>(options =>
{
    var useInMemory = builder.Configuration.GetValue<bool>("UseInMemoryDatabase");
    if (useInMemory)
    {
        options.UseInMemoryDatabase("CarPartShopDb");
    }
    else
    {
        options.UseNpgsql(connectionString, npgsqlOptions =>
        {
            npgsqlOptions.EnableRetryOnFailure(maxRetryCount: 5, maxRetryDelay: TimeSpan.FromSeconds(5), errorCodesToAdd: null);
        });
    }
});

var authority = builder.Configuration["Authentication:Authority"] ?? "http://keycloak:8080/identity/realms/carpartshop";
var audience = builder.Configuration["Authentication:Audience"] ?? "account";
var requireHttpsMetadata = builder.Configuration.GetValue<bool>("Authentication:RequireHttpsMetadata", false);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Authority = authority;
    options.Audience = audience;
    options.RequireHttpsMetadata = requireHttpsMetadata;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true
    };
    
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

builder.Services.AddValidatorsFromAssemblyContaining<CreateOrderValidator>();

builder.Services.AddGrpc();
builder.Services.AddSignalR();
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .WithExposedHeaders("Grpc-Status", "Grpc-Message", "Grpc-Encoding", "Grpc-Accept-Encoding", "X-Grpc-Web");
    });
});

var app = builder.Build();

if (args.Contains("--seed") || args.Contains("--reseed"))
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<ShopDbContext>();
    try
    {
        await DbInitializer.ResetAndSeedAsync(db);
        Console.WriteLine("Database seeded successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database seed failed (check if database is reachable): {ex.Message}");
    }

    if (args.Contains("--exit"))
    {
        return;
    }
}
else
{
    using var scope = app.Services.CreateScope();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<ShopDbContext>();
        await DbInitializer.InitializeAsync(db);
        logger.LogInformation("Baza danych CarPartShop zainicjalizowana pomyślnie.");
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Nie można połączyć się z PostgreSQL przy starcie. Może być wymagany ponowny rozruch lub baza jest w trakcie uruchamiania.");
    }
}

app.UseCors("CorsPolicy");
app.UseRouting();

app.UseGrpcWeb(new GrpcWebOptions { DefaultEnabled = true });

app.UseAuthentication();
app.UseAuthorization();

app.MapGrpcService<CatalogGrpcService>().EnableGrpcWeb().RequireCors("CorsPolicy");
app.MapGrpcService<OrderGrpcService>().EnableGrpcWeb().RequireCors("CorsPolicy");
app.MapGrpcService<PaymentGrpcService>().EnableGrpcWeb().RequireCors("CorsPolicy");

app.MapHub<ShopHub>("/hubs/shop").RequireCors("CorsPolicy");

app.MapControllers().RequireCors("CorsPolicy");

app.MapGet("/", () => "CarPartShop Backend API (.NET 10, gRPC, SignalR, PostgreSQL, Authority) działa poprawnie!");
app.MapGet("/health", () => Results.Ok(new { status = "Healthy", timestamp = DateTime.UtcNow }));

app.Run();
