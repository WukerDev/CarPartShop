# AutoParts Pro - Sklep Internetowy z Częściami Samochodowymi

Nowoczesny, modularny system e-commerce dedykowany branży motoryzacyjnej, zbudowany z podziałem na **3 niezależne rozwiązania (.sln / .slnx)**, bramkę YARP, autoryzację Keycloak Authority, backend .NET 10 (gRPC, Entity Framework Core, SignalR) oraz frontend Vue 3 (Vuetify, Pinia, Protobuf / gRPC-Web, SignalR).

---

## 🏛️ Architektura i Podział na 3 Rozwiązania

Projekt jest zorganizowany w katalogu `src/` z trzema dedykowanymi plikami rozwiązań (obsługiwanymi przez JetBrains Rider i Visual Studio):

```
CarPartShop2/
├── .github/
│   └── workflows/
│       └── ci.yml                     # GitHub Actions CI/CD (Build, Unit Tests, E2E)
├── docker-compose.yml                 # PostgreSQL, Keycloak, Backend, Frontend, Gateway
├── keycloak/
│   └── carpartshop-realm.json         # Konfiguracja Keycloak realm, klientów i usera admin/admin
├── src/
│   ├── Gateway/
│   │   ├── CarPartShop.Gateway.sln    # [ROZWIĄZANIE 1]: YARP Reverse Proxy
│   │   └── CarPartShop.Gateway/
│   │       ├── Program.cs
│   │       └── appsettings.json
│   ├── Backend/
│   │   ├── CarPartShop.Backend.sln    # [ROZWIĄZANIE 2]: Backend .NET 10 + Testy
│   │   ├── CarPartShop.Backend/
│   │   │   ├── Protos/                # Kontrakty Protobuf (catalog, order, payment)
│   │   │   ├── Data/                  # EF Core ShopDbContext, DbInitializer (seed)
│   │   │   ├── Models/                # Encje: Category, CarPart, Order, OrderItem, ReturnRequest
│   │   │   ├── Validators/            # FluentValidation
│   │   │   ├── Services/              # gRPC & gRPC-Web Services
│   │   │   ├── Hubs/                  # SignalR ShopHub (eventy realtime)
│   │   │   └── Controllers/           # REST API
│   │   └── CarPartShop.Backend.Tests/ # Testy jednostkowe xUnit + FluentAssertions + Moq
│   └── Frontend/
│       ├── CarPartShop.Frontend.sln   # [ROZWIĄZANIE 3]: Frontend Vue 3 + Vuetify + E2E
│       ├── package.json
│       ├── vite.config.ts
│       ├── e2e/                       # Testy End-to-End Playwright
│       └── src/
│           ├── stores/                # Pinia: authStore, cartStore, catalogStore, orderStore, signalrStore
│           ├── services/              # API, gRPC-Web Client, SignalR Client
│           ├── components/            # Komponenty: Navbar, ProductCard, PaymentModal, etc.
│           └── views/                 # Widoki: Katalog, Koszyk, Kasa, Historia, Zwroty, Logowanie
```

---

## 🔑 Kluczowe Cechy i Technologie

1. **Gateway (YARP Reverse Proxy):**
   - Agregacja ścieżki `/identity` -> Przekierowanie do Keycloak (`KC_HTTP_RELATIVE_PATH=/identity`).
   - Agregacja ścieżki `/portal` oraz `/` -> Przekierowanie do aplikacji SPA (Frontend).
   - Agregacja gRPC (`/carpartshop.*`) z obsługą HTTP/2 i protokołu gRPC-Web.
   - Agregacja SignalR (`/hubs/*`) z pełnym wsparciem WebSocket proxying.
   - CORS policy skonfigurowana pod nagłówki `Grpc-Status`, `Grpc-Message`, `X-Grpc-Web`.

2. **Keycloak Authority & Użytkownik:**
   - Pre-konfigurowany realm: `carpartshop`.
   - Klient publiczny: `carpartshop-frontend` (wspiera PKCE oraz Direct Access Grants / password flow).
   - Założony użytkownik z uprawnieniami administratora:
     - **Login:** `admin`
     - **Hasło:** `admin`
     - **Role:** `admin`, `customer`

3. **Backend (.NET 10):**
   - **Entity Framework Core 10** z PostgreSQL (oraz opcją InMemory dla testów).
   - **gRPC + gRPC-Web:** oficjalny pakiet `Grpc.AspNetCore.Web` umożliwia komunikację po protobuf bezpośrednio z przeglądarki.
   - **FluentValidation:** walidacja tworzenia zamówień (koszyk, poprawność e-mail, adres), zwrotów (powody) oraz płatności BLIK (format 6 cyfr) i kartą.
   - **SignalR:** hub czasu rzeczywistego emitujący aktualizacje stanu zamówień (`ReceiveOrderStatusChanged`), redukcję/przywrócenie stanu magazynowego (`ReceiveStockUpdate`) oraz akceptację zwrotów (`ReceiveReturnUpdate`).
   - **JWT Bearer Authority:** walidacja tokenów Keycloak na endpointach gRPC i SignalR.

4. **Frontend (Vue 3, Vuetify 3, Pinia, TypeScript):**
   - **Nowoczesny design motoryzacyjny:** Dark Auto Theme, kontrastowe akcenty wyścigowe (Racing Red), karty części, statusy dostępności w magazynie centralnym.
   - **Przeglądarka części z kategoriami:** filtrowanie po kategoriach (Układ hamulcowy, Zawieszenie, Filtry i oleje, Rozrząd, Zapłon, Oświetlenie), wyszukiwanie po nazwach oraz numerach fabrycznych OEM (np. Brembo, Bosch, ATE, Mann-Filter).
   - **Koszyk (Pinia Store):** dynamiczne przeliczanie sumy, wskaźnik darmowej dostawy od 300 zł, zachowanie stanu w LocalStorage.
   - **Zamockowana płatność:** modal wyboru płatności (Karta płatnicza, kod BLIK 6-cyfrowy, Szybki przelew), natychmiastowe potwierdzenie transakcji i zmiana statusu na `Paid`.
   - **Historia zakupów:** szczegółowy podgląd zamówień, statusów realizacji i pozycji zamówienia.
   - **Zwroty (Obsługa zwrotów):** moduł zgłoszenia zwrotu z wyborem przyczyny i natychmiastowym przywróceniem stanu magazynowego części.

---

## 🚀 Uruchomienie za pomocą Docker Compose

Całość (PostgreSQL, Keycloak, Backend, Frontend, Gateway YARP) uruchamia się jednym poleceniem:

```bash
docker compose up --build
```

### Dostępne adresy usług:
- **Bramka YARP (Główny punkt wejścia):** [http://localhost:5000](http://localhost:5000)
  - **Sklep (Portal frontu):** [http://localhost:5000/portal](http://localhost:5000/portal)
  - **Keycloak Authority:** [http://localhost:5000/identity](http://localhost:5000/identity)
  - **Backend REST/gRPC API:** [http://localhost:5000/api](http://localhost:5000/api)
  - **SignalR Hub:** `http://localhost:5000/hubs/shop`
- **PostgreSQL:** `localhost:5432` (baza: `carpartshop`, login: `postgres`, hasło: `postgres`)
- **Keycloak Admin Console:** [http://localhost:8080/identity](http://localhost:8080/identity)

---

## 🧪 Uruchamianie Testów

### 1. Testy Jednostkowe Backend (.NET 10, xUnit, FluentAssertions, Moq):
```bash
dotnet test src/Backend/CarPartShop.Backend.Tests/CarPartShop.Backend.Tests.csproj
```
Pokrywają:
- Pobieranie i filtrowanie katalogu części.
- Tworzenie zamówień, przeliczanie kwot i redukcję stanów magazynowych.
- Procedurę zgłaszania zwrotów i zwrot części na stan magazynowy.
- Reguły FluentValidation (walidacja e-mail, koszyka, kodu BLIK 6 cyfr).

### 2. Testy End-to-End (Playwright):
```bash
cd src/Frontend
npx playwright test
```
Pokrywają pełne scenariusze użytkownika:
1. Ładowanie katalogu części samochodowych i kategorii.
2. Dodanie części do koszyka i weryfikacja zawartości koszyka.
3. Przejście procesu kasy i zamockowanej płatności.
4. Sprawdzenie historii zamówień oraz zgłoszenie zwrotu części.

---

## ⚙️ GitHub Actions CI/CD Pipeline

Plik workflow `.github/workflows/ci.yml` automatycznie wykonuje przy każdym pushu i pull requeście:
1. Budowanie rozwiązania `CarPartShop.Backend.sln` i uruchomienie 12 testów jednostkowych.
2. Budowanie rozwiązania `CarPartShop.Gateway.sln`.
3. Instalację zależności, weryfikację typów TypeScript (`vue-tsc`), build Vite oraz wykonanie testów End-to-End w silniku Chromium (Playwright).
