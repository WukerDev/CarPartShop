using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    var devCert = GenerateDevCertificate();
    serverOptions.ListenAnyIP(80);
    serverOptions.ListenAnyIP(5000);
    serverOptions.ListenAnyIP(443, listenOptions =>
    {
        listenOptions.UseHttps(devCert);
    });
});

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

app.MapGet("/", () => Results.Redirect("/portal/"));
app.MapGet("/portal", () => Results.Redirect("/portal/"));

app.MapReverseProxy();

app.Run();

static X509Certificate2 GenerateDevCertificate()
{
    var rsa = RSA.Create(2048);
    var request = new CertificateRequest("cn=localhost", rsa, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
    var sanBuilder = new SubjectAlternativeNameBuilder();
    sanBuilder.AddDnsName("localhost");
    sanBuilder.AddIpAddress(System.Net.IPAddress.Loopback);
    request.CertificateExtensions.Add(sanBuilder.Build());
    return request.CreateSelfSigned(DateTimeOffset.UtcNow.AddDays(-1), DateTimeOffset.UtcNow.AddYears(5));
}
