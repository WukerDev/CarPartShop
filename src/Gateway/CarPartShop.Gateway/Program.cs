var builder = WebApplication.CreateBuilder(args);

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("GatewayCors", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .WithExposedHeaders("Grpc-Status", "Grpc-Message", "Grpc-Encoding", "Grpc-Accept-Encoding", "X-Grpc-Web");
    });
});

var app = builder.Build();

app.UseCors("GatewayCors");

app.MapGet("/", () => Results.Redirect("/portal"));

app.MapReverseProxy();

app.Run();
