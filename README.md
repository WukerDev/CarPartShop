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
   - **Panel Administratora:** dodawanie nowych części do katalogu oraz dynamiczne zarządzanie statusem zamówienia (Opłacone, W kompletacji, Wysłane z numerem listu przewozowego, Dostarczone, Anulowane).
   - **Elastyczność bazodanowa:** natywne wsparcie dla PostgreSQL, Microsoft SQL Server (Somee.com) oraz SQLite (bezobsługowa baza plikowa).

---

## 🌐 Publikacja i Wdrożenie na Somee.com (IIS Windows Hosting)

Projekt zawiera automatyczny skrypt `publish-somee.ps1`, który kompiluje frontend Vue 3, integruje go bezpośrednio wewnątrz `wwwroot` backendu ASP.NET Core oraz tworzy gotową paczkę ZIP dla IIS / Somee.com:

```powershell
# 1. Zbuduj i spakuj aplikację z bazą SQLite (opcja 0-konfiguracji, działa od razu na Somee):
.\publish-somee.ps1 -Database sqlite

# Lub z bazą Microsoft SQL Server (darmowa baza Somee MS SQL):
.\publish-somee.ps1 -Database sqlserver
```

### Instrukcja wdrożenia na Somee.com krok po kroku:
1. Załóż darmowe konto na **[somee.com](https://somee.com)**.
2. W panelu Somee przejdź do **User Websites** -> **Create website** (np. `mojsklep-auto.somee.com`).
3. W ustawieniach witryny w sekcji **ASP.NET version** wybierz obsługę .NET Core / ASP.NET Core (lub użyj trybu `publish-somee.ps1 -PublishMode self-contained`, który dołącza runtime .NET do samej paczki).
4. Otwórz **File Manager** na Somee (lub połącz się przez FTP) i przejdź do katalogu głównego witryny (`site/wwwroot`).
5. Wypakuj i wgraj zawartość wygenerowanego folderu `dist-somee/` (lub wgraj plik `carpartshop-somee.zip` i użyj opcji unzip).
6. **Baza danych:**
   - **Opcja A (SQLite - Najprostsza, zalecana):** Aplikacja automatycznie utworzy bazę w podkatalogu `App_Data/carpartshop.db` i zainicjalizuje katalog części przy pierwszym wejściu.
   - **Opcja B (Somee MS SQL Server):** W panelu Somee utwórz darmową bazę MS SQL, a następnie w pliku `appsettings.json` na serwerze podmień ciąg połączenia `ConnectionStrings:DefaultConnection` na dane podane przez Somee.
7. Gotowe! Otwórz adres swojej witryny w przeglądarce. Aplikacja natychmiast serwuje sklep internetowy, API oraz logowanie administratorskie (`admin` / `admin`).

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

Projekt posiada rozbudowany pakiet testów jednostkowych i integracyjnych:

### 1. Testy Jednostkowe Backend (.NET 10, xUnit, FluentAssertions, Moq) - 41 testów:
```bash
dotnet test src/Backend/CarPartShop.Backend.Tests/CarPartShop.Backend.Tests.csproj
```
Pokrywają:
- System powiadomień `NotificationsController` i `NotificationGrpcService` (pobieranie listy, licznik nieprzeczytanych `unreadCount`, oznaczanie pojedynczego i wszystkich jako przeczytane, tworzenie i walidacja).
- Pobieranie i zaawansowane filtrowanie katalogu części (po marce `carMake`, modelu `carModel`, roczniku, cenie, dostępności `inStockOnly`).
- Dodawanie części (`CreatePart`) i edycję właściwości (`UpdatePart`).
- Bezpieczne usuwanie części (`DeletePart` blokowane, jeśli część występuje w historii zamówień).
- Zarządzanie statusem zamówienia (`UpdateOrderStatus`: `Shipped`, `Delivered`, `Cancelled` z automatycznym przywracaniem stanów magazynowych na magazyn).
- Walidację kuponów rabatowych (`START10`, `TUNING20`, `HAMULCE15`).
- Oceny i recenzje części samochodowych z dynamicznym przeliczaniem średniej oceny (gwiazdek).
- Obsługę bazy danych (`DbInitializer` z 56 częściami, brak duplikatów przy ponownym uruchomieniu).
- Reguły FluentValidation (walidacja e-mail, koszyka, kodu BLIK 6 cyfr).

### 2. Testy Jednostkowe Frontend (Vitest, Pinia) - 26 testów:
```bash
cd src/Frontend
npm run test:unit
```
Pokrywają:
- Store powiadomień `notificationStore`: pobieranie listy powiadomień, obsługa dzwoneczka, oznaczanie jako przeczytane, `markAllAsRead`, odbiór powiadomień w czasie rzeczywistym z SignalR.
- Store koszyka `cartStore`: dodawanie do koszyka, limitowanie do stanu magazynowego, przeliczanie kwot i darmowej wysyłki od 300 zł, naliczanie rabatów.
- Store zamówień `orderStore`: pobieranie historii, zgłaszanie zwrotów (aktualizacja statusu na `Returned` / `Approved`), zmiana statusu przesyłki z numerem listu przewozowego i kurierem.
- Klient komunikacji gRPC-Web oraz SignalR.
- Moduł wielojęzyczności i18n (przełączanie polski / angielski w locie).

### 3. Testy End-to-End (Playwright):
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

## 🚀 Wdrożenie na Somee.com (IIS / Windows Hosting)

Aplikacja jest w pełni przystosowana do darmowego lub płatnego hostingu **Somee.com**:
- **Zintegrowany Frontend SPA:** Skompilowany frontend Vue 3 jest serwowany bezpośrednio z folderu `wwwroot` przez ASP.NET Core z obsługą SPA Fallback Routing (`MapFallbackToFile("index.html")`).
- **Wielobazowość (Multi-Database Support):** Automatyczna detekcja dostawcy bazy danych:
  - **SQLite** (domyślnie, zero konfiguracji – plik bazy `App_Data/carpartshop.db`).
  - **Microsoft SQL Server** (darmowy MS SQL oferowany przez Somee.com).
  - **PostgreSQL** (Docker Compose / serwer dedykowany).
  - **InMemory** (testy jednostkowe).
- **Konfiguracja IIS:** W zestawie gotowy [web.config](file:///C:/Users/Wikto/RiderProjects/CarPartShop/src/Backend/CarPartShop.Backend/web.config) dla modułu `AspNetCoreModuleV2`.

### Automatyczne przygotowanie paczki Somee:
Wystarczy uruchomić dedykowany skrypt PowerShell w katalogu głównym projektu:
```powershell
.\publish-somee.ps1 -Database sqlite
```
Skrypt automatycznie:
1. Zbuduje frontend Vue 3 (`npm run build`).
2. Skopiuje pliki wynikowe do `src/Backend/CarPartShop.Backend/wwwroot`.
3. Opublikuje aplikację .NET (`dotnet publish -c Release`).
4. Przygotuje `appsettings.json` z obsługą SQLite w `App_Data/`.
5. Spakuje całość do gotowego archiwum **`carpartshop-somee.zip`** (ok. 32 MB).

Archiwum `carpartshop-somee.zip` wystarczy wgrać i rozpakować w panelu Somee.com (File Manager) do katalogu strony głównej.

---

## ⚙️ GitHub Actions CI/CD Pipeline

Plik workflow [.github/workflows/ci.yml](file:///.github/workflows/ci.yml) automatycznie wykonuje przy każdym pushu i pull requeście:
1. **Backend & Tests (Wymagany):** Budowanie `CarPartShop.Backend.sln` i uruchomienie 41 testów jednostkowych xUnit.
2. **Gateway (Wymagany):** Budowanie `CarPartShop.Gateway.sln`.
3. **Frontend & E2E (Wymagany):** Instalacja zależności, weryfikacja typów TypeScript (`vue-tsc`), 26 testów Vitest, build Vite oraz testy Playwright E2E.
4. **Paczka Somee.com (Krok Opcjonalny):** Nie blokuje pipeline'u i uruchamia się wyłącznie na żądanie:
   - Ręcznie przez zakładkę **Actions -> Run workflow** z zaznaczoną opcją `Przygotuj paczkę wdrożeniową dla Somee.com`.
   - Poprzez dodanie w treści commita taga `[somee]` lub `[deploy-somee]`.
   - Poprzez ustawienie zmiennej repozytorium GitHub `ENABLE_SOMEE=true`.
   Wszystkie kroki budowania paczki Somee posiadają flagę `continue-on-error`, dzięki czemu ewentualne problemy z hostingiem Somee nie unieważniają statusu pipeline.
