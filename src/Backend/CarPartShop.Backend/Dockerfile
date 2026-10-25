FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /app

# Copy csproj and restore
COPY src/Backend/CarPartShop.Backend/CarPartShop.Backend.csproj src/Backend/CarPartShop.Backend/
RUN dotnet restore src/Backend/CarPartShop.Backend/CarPartShop.Backend.csproj

# Copy remaining backend source
COPY src/Backend/CarPartShop.Backend/ src/Backend/CarPartShop.Backend/
WORKDIR /app/src/Backend/CarPartShop.Backend
RUN dotnet publish -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS runtime
WORKDIR /app
COPY --from=build /out .
EXPOSE 5001
ENV ASPNETCORE_URLS=http://+:5001
ENTRYPOINT ["dotnet", "CarPartShop.Backend.dll"]
