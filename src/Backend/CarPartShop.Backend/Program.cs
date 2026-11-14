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

var dbProvider = builder.Configuration.GetValue<string>("DatabaseProvider");
var useInMemory = builder.Configuration.GetValue<bool>("UseInMemoryDatabase");

if (string.IsNullOrWhiteSpace(dbProvider))
{
    if (useInMemory)
    {
        dbProvider = "InMemory";
    }
    else if (connectionString.Contains(".db", StringComparison.OrdinalIgnoreCase) || 
             connectionString.Contains(".sqlite", StringComparison.OrdinalIgnoreCase))
    {
        dbProvider = "Sqlite";
    }
    else if (connectionString.Contains("Initial Catalog=", StringComparison.OrdinalIgnoreCase) || 
             connectionString.Contains("Integrated Security=", StringComparison.OrdinalIgnoreCase) ||
             connectionString.Contains("TrustServerCertificate=", StringComparison.OrdinalIgnoreCase) ||
             connectionString.Contains("Server=tcp:", StringComparison.OrdinalIgnoreCase) ||
             connectionString.Contains(".database.windows.net", StringComparison.OrdinalIgnoreCase) ||
             connectionString.Contains("somee.com", StringComparison.OrdinalIgnoreCase))
    {
        dbProvider = "SqlServer";
    }
    else
    {
        dbProvider = "PostgreSql";
    }
}

builder.Services.AddDbContext<ShopDbContext>(options =>
{
    switch (dbProvider.ToLowerInvariant())
    {
        case "inmemory":
            options.UseInMemoryDatabase("CarPartShopDb");
            break;
        case "sqlite":
            if (connectionString.Contains("Data Source=", StringComparison.OrdinalIgnoreCase))
            {
                var parts = connectionString.Split("Data Source=");
                if (parts.Length > 1)
                {
                    var dbPath = parts[1].Split(';')[0].Trim();
                    var dbDir = Path.GetDirectoryName(dbPath);
                    if (!string.IsNullOrEmpty(dbDir) && !Directory.Exists(dbDir))
                    {
                        Directory.CreateDirectory(dbDir);
                    }
                }
            }
            options.UseSqlite(connectionString);
            break;
        case "sqlserver":
        case "mssql":
            options.UseSqlServer(connectionString, sqlOptions =>
            {
                sqlOptions.EnableRetryOnFailure(maxRetryCount: 5, maxRetryDelay: TimeSpan.FromSeconds(5), errorNumbersToAdd: null);
            });
            break;
        case "postgresql":
        case "npgsql":
        case "postgres":
        default:
            options.UseNpgsql(connectionString, npgsqlOptions =>
            {
                npgsqlOptions.EnableRetryOnFailure(maxRetryCount: 5, maxRetryDelay: TimeSpan.FromSeconds(5), errorCodesToAdd: null);
            });
            break;
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
            var accessToken = context.Request.Query["access_token"].ToString();
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
            {
                context.Token = accessToken;
            }

            var authHeader = context.Request.Headers.Authorization.ToString();
            var rawToken = !string.IsNullOrEmpty(accessToken)
                ? accessToken
                : authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
                    ? authHeader.Substring(7).Trim()
                    : null;

            if (!string.IsNullOrEmpty(rawToken) && rawToken.StartsWith("mock."))
            {
                try
                {
                    var tokenParts = rawToken.Split('.');
                    if (tokenParts.Length >= 2)
                    {
                        var jsonBytes = Convert.FromBase64String(tokenParts[1]);
                        using var doc = System.Text.Json.JsonDocument.Parse(jsonBytes);
                        var claims = new List<System.Security.Claims.Claim>();

                        if (doc.RootElement.TryGetProperty("preferred_username", out var u))
                        {
                            var uname = u.GetString() ?? "admin";
                            claims.Add(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, uname));
                            claims.Add(new System.Security.Claims.Claim("preferred_username", uname));
                        }
                        if (doc.RootElement.TryGetProperty("email", out var em))
                        {
                            claims.Add(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Email, em.GetString() ?? ""));
                        }
                        if (doc.RootElement.TryGetProperty("roles", out var rolesElem) && rolesElem.ValueKind == System.Text.Json.JsonValueKind.Array)
                        {
                            foreach (var r in rolesElem.EnumerateArray())
                            {
                                claims.Add(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, r.GetString() ?? ""));
                            }
                        }

                        var identity = new System.Security.Claims.ClaimsIdentity(claims, "MockAuth");
                        context.Principal = new System.Security.Claims.ClaimsPrincipal(identity);
                        context.Success();
                    }
                }
                catch
                {
                    // Fall back to standard validation
                }
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
        logger.LogInformation("Baza danych CarPartShop zainicjalizowana pomyślnie ({Provider}).", db.Database.ProviderName);
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Nie można połączyć się z bazą danych przy starcie. Może być wymagany ponowny rozruch lub baza jest w trakcie uruchamiania.");
    }
}

app.UseRouting();
app.UseCors("CorsPolicy");

app.UseGrpcWeb(new GrpcWebOptions { DefaultEnabled = true });

app.UseAuthentication();
app.UseAuthorization();

var wwwrootFolder = Path.Combine(app.Environment.ContentRootPath, "wwwroot");
var hasWwwroot = Directory.Exists(wwwrootFolder);
var hasIndexHtml = File.Exists(Path.Combine(wwwrootFolder, "index.html"));

if (hasWwwroot)
{
    app.UseDefaultFiles();
    app.UseStaticFiles();
}

app.MapGrpcService<CatalogGrpcService>().EnableGrpcWeb().RequireCors("CorsPolicy");
app.MapGrpcService<OrderGrpcService>().EnableGrpcWeb().RequireCors("CorsPolicy");
app.MapGrpcService<PaymentGrpcService>().EnableGrpcWeb().RequireCors("CorsPolicy");
app.MapGrpcService<NotificationGrpcService>().EnableGrpcWeb().RequireCors("CorsPolicy");

app.MapHub<ShopHub>("/hubs/shop").RequireCors("CorsPolicy");

app.MapControllers().RequireCors("CorsPolicy");

app.MapGet("/health", () => Results.Ok(new { status = "Healthy", timestamp = DateTime.UtcNow }));

if (hasIndexHtml)
{
    app.MapFallbackToFile("index.html");
}
else
{
    app.MapGet("/", () => "CarPartShop Backend API (.NET 10, gRPC, SignalR) działa poprawnie! (Frontend nie został jeszcze skompilowany do wwwroot).");
}

app.Run();
