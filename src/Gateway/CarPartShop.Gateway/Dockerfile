FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /app

COPY src/Gateway/CarPartShop.Gateway/CarPartShop.Gateway.csproj src/Gateway/CarPartShop.Gateway/
RUN dotnet restore src/Gateway/CarPartShop.Gateway/CarPartShop.Gateway.csproj

COPY src/Gateway/CarPartShop.Gateway/ src/Gateway/CarPartShop.Gateway/
WORKDIR /app/src/Gateway/CarPartShop.Gateway
RUN dotnet publish -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS runtime
WORKDIR /app
COPY --from=build /out .
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "CarPartShop.Gateway.dll"]
