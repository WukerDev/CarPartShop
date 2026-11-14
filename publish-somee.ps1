[CmdletBinding()]
param(
    [ValidateSet("framework", "self-contained")]
    [string]$PublishMode = "framework",

    [ValidateSet("sqlite", "sqlserver")]
    [string]$Database = "sqlite",

    [string]$OutputFolder = "./dist-somee",
    [switch]$CreateZip = $true
)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  AUTOPARTS PRO - Przygotowanie paczki dla Somee.com" -ForegroundColor Cyan
Write-Host "  Tryb: $PublishMode | Baza danych: $Database" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

# 1. Krok: Kompilacja Frontendu Vue 3 (Vite + TypeScript)
Write-Host "`n[1/5] Budowanie frontendu Vue 3 (npm run build)..." -ForegroundColor Yellow
Set-Location "$root/src/Frontend"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Błąd podczas budowania frontendu Vue 3!"
}

# 2. Krok: Przeniesienie skompilowanego frontendu do wwwroot w Backendzie
Write-Host "`n[2/5] Kopiowanie frontendu do wwwroot backendu..." -ForegroundColor Yellow
$wwwroot = "$root/src/Backend/CarPartShop.Backend/wwwroot"
if (Test-Path $wwwroot) {
    Remove-Item $wwwroot -Recurse -Force
}
New-Item -ItemType Directory -Path $wwwroot -Force | Out-Null
Copy-Item "$root/src/Frontend/dist/*" -Destination $wwwroot -Recurse -Force
Write-Host "Frontend pomyślnie zintegrowany z backendem w: $wwwroot" -ForegroundColor Green

# 3. Krok: Publikacja Backend .NET
Write-Host "`n[3/5] Publikacja aplikacji .NET..." -ForegroundColor Yellow
Set-Location $root
$outputPath = [System.IO.Path]::GetFullPath($OutputFolder)
if (Test-Path $outputPath) {
    Remove-Item $outputPath -Recurse -Force
}

$publishArgs = @(
    "publish", "src/Backend/CarPartShop.Backend/CarPartShop.Backend.csproj",
    "-c", "Release",
    "-o", $outputPath
)

if ($PublishMode -eq "self-contained") {
    Write-Host "Kompilacja w trybie Self-Contained (win-x64) - zawiera własny runtime .NET..." -ForegroundColor Cyan
    $publishArgs += @("-r", "win-x64", "--self-contained", "true", "-p:PublishSingleFile=false")
} else {
    Write-Host "Kompilacja w trybie Framework-Dependent..." -ForegroundColor Cyan
    $publishArgs += @("--self-contained", "false")
}

& dotnet @publishArgs
if ($LASTEXITCODE -ne 0) {
    Write-Error "Błąd podczas dotnet publish!"
}

# 4. Krok: Konfiguracja appsettings i web.config dla Somee
Write-Host "`n[4/5] Dopasowywanie konfiguracji dla Somee.com..." -ForegroundColor Yellow
$appDataDir = Join-Path $outputPath "App_Data"
if (-not (Test-Path $appDataDir)) {
    New-Item -ItemType Directory -Path $appDataDir -Force | Out-Null
}

$webConfigPath = Join-Path $outputPath "web.config"
if ($PublishMode -eq "self-contained") {
    $webConfigContent = @"
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <location path="." inheritInChildApplications="false">
    <system.webServer>
      <handlers>
        <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
      </handlers>
      <aspNetCore processPath=".\CarPartShop.Backend.exe" arguments="" stdoutLogEnabled="true" stdoutLogFile=".\logs\stdout" hostingModel="inprocess">
        <environmentVariables>
          <environmentVariable name="ASPNETCORE_ENVIRONMENT" value="Production" />
        </environmentVariables>
      </aspNetCore>
    </system.webServer>
  </location>
</configuration>
"@
    Set-Content -Path $webConfigPath -Value $webConfigContent -Encoding UTF8
}

if ($Database -eq "sqlite") {
    $configContent = @"
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "DatabaseProvider": "Sqlite",
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=App_Data/carpartshop.db"
  },
  "Authentication": {
    "Authority": "",
    "Audience": "account",
    "RequireHttpsMetadata": false
  }
}
"@
    Set-Content -Path (Join-Path $outputPath "appsettings.json") -Value $configContent -Encoding UTF8
    Write-Host "Skonfigurowano bezobsługową bazę SQLite (plik App_Data/carpartshop.db)." -ForegroundColor Green
} else {
    Write-Host "Wybrano MS SQL Server. Pamiętaj podmienić ConnectionString w appsettings.json na podany przez Somee!" -ForegroundColor Yellow
}

# 5. Krok: Tworzenie archiwum ZIP
if ($CreateZip) {
    Write-Host "`n[5/5] Pakowanie do carpartshop-somee.zip..." -ForegroundColor Yellow
    $zipPath = Join-Path $root "carpartshop-somee.zip"
    if (Test-Path $zipPath) {
        Remove-Item $zipPath -Force
    }
    Compress-Archive -Path "$outputPath/*" -DestinationPath $zipPath -Force
    Write-Host "Utworzono gotowe archiwum ZIP: $zipPath" -ForegroundColor Green
}

Write-Host "`n================================================================" -ForegroundColor Green
Write-Host "  SUKCES! Aplikacja jest gotowa do wrzucenia na Somee.com!" -ForegroundColor Green
Write-Host "  Folder publikacji: $outputPath" -ForegroundColor Cyan
if ($CreateZip) {
    Write-Host "  Archiwum do uploadu: $zipPath" -ForegroundColor Cyan
}
Write-Host "================================================================" -ForegroundColor Green
