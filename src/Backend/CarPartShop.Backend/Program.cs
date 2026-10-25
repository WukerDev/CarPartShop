using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using CarPartShop.Backend.Data;
using CarPartShop.Backend.Hubs;
using CarPartShop.Backend.Services;
using CarPartShop.Backend.Validators;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Configuration (PostgreSQL with fallback to InMemory for tests/local)
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

// 2. Authentication & Authorization (Keycloak Authority)
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
        ValidateIssuer = false, // Allows tokens issued from internal or gateway hostnames
        ValidateAudience = false,
        ValidateLifetime = true
    };
    
    // Support SignalR JWT token from query string
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

// 3. FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<CreateOrderValidator>();

// 4. gRPC and SignalR
builder.Services.AddGrpc();
builder.Services.AddSignalR();
builder.Services.AddControllers();

// 5. CORS policy for Frontend and gRPC-Web
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

// 6. Database auto-initialization & seeding
using (var scope = app.Services.CreateScope())
{
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

// 7. Middlewares & Routing
app.UseCors("CorsPolicy");
app.UseRouting();

// Enable GrpcWeb middleware (must be between UseRouting and UseEndpoints)
app.UseGrpcWeb(new GrpcWebOptions { DefaultEnabled = true });

app.UseAuthentication();
app.UseAuthorization();

// Map gRPC services with GrpcWeb enabled
app.MapGrpcService<CatalogGrpcService>().EnableGrpcWeb().RequireCors("CorsPolicy");
app.MapGrpcService<OrderGrpcService>().EnableGrpcWeb().RequireCors("CorsPolicy");
app.MapGrpcService<PaymentGrpcService>().EnableGrpcWeb().RequireCors("CorsPolicy");

// Map SignalR Hub
app.MapHub<ShopHub>("/hubs/shop").RequireCors("CorsPolicy");

// Map REST Controllers
app.MapControllers().RequireCors("CorsPolicy");

app.MapGet("/", () => "CarPartShop Backend API (.NET 10, gRPC, SignalR, PostgreSQL, Authority) działa poprawnie!");

app.Run();
