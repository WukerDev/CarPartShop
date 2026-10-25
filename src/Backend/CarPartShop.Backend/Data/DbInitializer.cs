using CarPartShop.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace CarPartShop.Backend.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(ShopDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (await context.Categories.AnyAsync())
        {
            return; // DB already seeded
        }

        var catBrakes = new Category
        {
            Name = "Układ Hamulcowy",
            Slug = "hamulce",
            Description = "Tarcze, klocki hamulcowe, zaciski oraz płyny hamulcowe najwyższej jakości.",
            Icon = "mdi-disc-alert"
        };

        var catSuspension = new Category
        {
            Name = "Układ Zawieszenia",
            Slug = "zawieszenie",
            Description = "Amortyzatory, sprężyny, wahacze i drążki stabilizatora dla maksymalnego komfortu.",
            Icon = "mdi-car-esp"
        };

        var catFilters = new Category
        {
            Name = "Filtry i Oleje",
            Slug = "filtry-i-oleje",
            Description = "Filtry oleju, powietrza, kabinowe oraz paliwa od wiodących producentów.",
            Icon = "mdi-oil"
        };

        var catEngine = new Category
        {
            Name = "Silnik i Rozrząd",
            Slug = "silnik-i-rozrzad",
            Description = "Zestawy rozrządu, paski klinowe, pompy wody, uszczelki głowicy.",
            Icon = "mdi-engine"
        };

        var catIgnition = new Category
        {
            Name = "Układ Zapłonowy i Elektryka",
            Slug = "zaplon-elektryka",
            Description = "Świece zapłonowe, cewki, akumulatory, alternatory i czujniki.",
            Icon = "mdi-flash"
        };

        var catLighting = new Category
        {
            Name = "Oświetlenie",
            Slug = "oswietlenie",
            Description = "Reflektory przednie, lampy tylne, żarówki LED i ksenonowe.",
            Icon = "mdi-car-light-high"
        };

        context.Categories.AddRange(catBrakes, catSuspension, catFilters, catEngine, catIgnition, catLighting);
        await context.SaveChangesAsync();

        var parts = new List<CarPart>
        {
            // Brakes
            new CarPart
            {
                Name = "Tarcze hamulcowe przednie wentylowane 312mm",
                PartNumber = "BRE-09.9772.11",
                CategoryId = catBrakes.Id,
                Manufacturer = "Brembo",
                Price = 349.99m,
                StockQuantity = 18,
                Description = "Wysokowydajne tarcze hamulcowe z powłoką antykorozyjną UV. Zapewniają doskonałą drogę hamowania w każdych warunkach pogodowych.",
                Compatibility = "VW Golf VII, Audi A3 8V, Skoda Octavia III, Seat Leon 5F",
                ImageUrl = "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?w=600&auto=format&fit=crop&q=80",
                Rating = 4.9
            },
            new CarPart
            {
                Name = "Klocki hamulcowe ceramiczne przód",
                PartNumber = "ATE-13.0470-7242.2",
                CategoryId = catBrakes.Id,
                Manufacturer = "ATE",
                Price = 219.50m,
                StockQuantity = 25,
                Description = "Klocki Ceramiczne o obniżonym pyleniu, czyste felgi i cicha praca bez pisków.",
                Compatibility = "BMW Seria 3 F30 / F31, BMW Seria 4 F32, BMW Seria 1 F20",
                ImageUrl = "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80",
                Rating = 4.8
            },
            new CarPart
            {
                Name = "Zacisk hamulcowy tył prawy elektryczny",
                PartNumber = "TRW-BHN1161E",
                CategoryId = catBrakes.Id,
                Manufacturer = "TRW",
                Price = 459.00m,
                StockQuantity = 8,
                Description = "Kompletny zacisk hamulcowy ze zintegrowanym silniczkiem elektrycznego hamulca ręcznego EPB.",
                Compatibility = "VW Passat B8, Audi A4 B9, VW Tiguan II",
                ImageUrl = "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=80",
                Rating = 4.7
            },

            // Suspension
            new CarPart
            {
                Name = "Amortyzator przedni gazowy B4 OE Replacement",
                PartNumber = "BIL-22-131607",
                CategoryId = catSuspension.Id,
                Manufacturer = "Bilstein",
                Price = 389.00m,
                StockQuantity = 14,
                Description = "Gazowy amortyzator jednorurowy. Perfekcyjna stabilność, komfort jazdy i długa żywotność zgodna z parametrami fabrycznymi.",
                Compatibility = "Audi A4 B8, Audi A5 8T, Audi Q5 8R",
                ImageUrl = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80",
                Rating = 4.9
            },
            new CarPart
            {
                Name = "Zestaw wahaczy przedniego zawieszenia aluminiowych",
                PartNumber = "LEM-35537-01",
                CategoryId = catSuspension.Id,
                Manufacturer = "Lemförder",
                Price = 1299.00m,
                StockQuantity = 6,
                Description = "Komplet 8 wzmacnianych wahaczy wraz ze sworzniami i tulejami gumowo-metalowymi klasy premium OEM.",
                Compatibility = "Audi A6 C7, Audi A7 4G, Porsche Macan",
                ImageUrl = "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80",
                Rating = 5.0
            },
            new CarPart
            {
                Name = "Sprężyny zawieszenia Pro-Kit -30mm",
                PartNumber = "EIB-E10-20-031-01-22",
                CategoryId = catSuspension.Id,
                Manufacturer = "Eibach",
                Price = 780.00m,
                StockQuantity = 10,
                Description = "Sportowe progresywne sprężyny obniżające środek ciężkości o 30mm. Zwiększona przyczepność i doskonała optyka.",
                Compatibility = "BMW Seria 3 E90 / E91 / E92, 320d / 330d / 325i",
                ImageUrl = "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&auto=format&fit=crop&q=80",
                Rating = 4.8
            },

            // Filters & Oils
            new CarPart
            {
                Name = "Filtr oleju silnikowego wkład",
                PartNumber = "MAN-HU719/7x",
                CategoryId = catFilters.Id,
                Manufacturer = "Mann-Filter",
                Price = 38.50m,
                StockQuantity = 45,
                Description = "Wysokiej dokładności wkład filtrujący z uszczelkami. Odporny na agresywne oleje syntetyczne i wysokie ciśnienia.",
                Compatibility = "VAG 1.9 TDI, 2.0 TDI (CR & PD), Audi, VW, Skoda, Seat",
                ImageUrl = "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80",
                Rating = 4.9
            },
            new CarPart
            {
                Name = "Filtr kabinowy z węglem aktywnym i antyalergenem",
                PartNumber = "KNE-LAK423",
                CategoryId = catFilters.Id,
                Manufacturer = "Mahle / Knecht",
                Price = 74.90m,
                StockQuantity = 32,
                Description = "Wielowarstwowy filtr z cząstkami polifenolu neutralizującymi pyłki, smog, bakterie i nieprzyjemne zapachy.",
                Compatibility = "Toyota Corolla E12/E15, Toyota Yaris II/III, Toyota Auris",
                ImageUrl = "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80",
                Rating = 4.7
            },
            new CarPart
            {
                Name = "Olej syntetyczny Edge Titanium FST 5W-30 LL 5L",
                PartNumber = "CAS-EDGE-5W30-5L",
                CategoryId = catFilters.Id,
                Manufacturer = "Castrol",
                Price = 189.90m,
                StockQuantity = 28,
                Description = "Olej silnikowy z technologią Fluid TITANIUM modyfikujący swoją strukturę pod obciążeniem. Norma VW 504.00/507.00, MB 229.51, BMW LL-04.",
                Compatibility = "Uniwersalny do silników Benzynowych oraz Diesla z DPF",
                ImageUrl = "https://images.unsplash.com/photo-1527383418406-f85a3b146499?w=600&auto=format&fit=crop&q=80",
                Rating = 4.8
            },

            // Engine & Timing
            new CarPart
            {
                Name = "Zestaw rozrządu z pompą wody PowerGrip",
                PartNumber = "GAT-KP15678XS",
                CategoryId = catEngine.Id,
                Manufacturer = "Gates",
                Price = 589.00m,
                StockQuantity = 12,
                Description = "Wzmocniony pasek rozrządu, rolka napinająca, rolki prowadzące oraz pompa cieczy chłodzącej z metalowym wirnikiem.",
                Compatibility = "Ford Focus MK3 1.6 TDCi, Ford Mondeo MK4 2.0 TDCi, Volvo V40 D2",
                ImageUrl = "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&auto=format&fit=crop&q=80",
                Rating = 4.9
            },
            new CarPart
            {
                Name = "Zestaw łańcucha rozrządu wzmocniony",
                PartNumber = "INA-559015410",
                CategoryId = catEngine.Id,
                Manufacturer = "INA",
                Price = 699.00m,
                StockQuantity = 7,
                Description = "Kompletny zestaw bezluzowego łańcucha rozrządu ze ślizgami i hydraulicznym napinaczem nowej generacji.",
                Compatibility = "Mercedes-Benz C-Klasa W204 C200/C220 CDI, E-Klasa W212 OM651",
                ImageUrl = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80",
                Rating = 4.6
            },

            // Ignition & Electrical
            new CarPart
            {
                Name = "Świece zapłonowe Irydowe Laser Iridium (kpl. 4 szt.)",
                PartNumber = "NGK-ILZKR7B-11",
                CategoryId = catIgnition.Id,
                Manufacturer = "NGK",
                Price = 184.00m,
                StockQuantity = 30,
                Description = "Laserowo spawana irydowa elektroda centralna. Ekstremalnie równa iskra, redukcja spalania i długa trwałość do 100 tys. km.",
                Compatibility = "Honda Civic VIII / IX 1.8 i-VTEC, Accord VIII 2.0 / 2.4",
                ImageUrl = "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80",
                Rating = 4.9
            },
            new CarPart
            {
                Name = "Cewka zapłonowa czerwona Sport R8 Style",
                PartNumber = "BOS-0986221057",
                CategoryId = catIgnition.Id,
                Manufacturer = "Bosch",
                Price = 145.00m,
                StockQuantity = 22,
                Description = "Wzmocniona cewka zapłonowa zapewniająca mocniejszy przeskok iskry przy wysokich obrotach i po modyfikacji mocy.",
                Compatibility = "VAG 2.0 TFSI / TSI (Golf GTI, Audi S3, Leon Cupra)",
                ImageUrl = "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&auto=format&fit=crop&q=80",
                Rating = 4.8
            },

            // Lighting
            new CarPart
            {
                Name = "Żarówki H7 Night Breaker 200 +200% światła (kpl)",
                PartNumber = "OSR-64210NB200-HCB",
                CategoryId = catLighting.Id,
                Manufacturer = "Osram",
                Price = 119.00m,
                StockQuantity = 40,
                Description = "Najjaśniejsze żarówki halogenowe Osram z homologacją drogową ECE. Snop światła dłuższy nawet o 150 metrów.",
                Compatibility = "Uniwersalne gniazdo H7 (PX26d) - 12V 55W",
                ImageUrl = "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&auto=format&fit=crop&q=80",
                Rating = 4.7
            },
            new CarPart
            {
                Name = "Palnik ksenonowy D1S Xenarc Original 4500K",
                PartNumber = "PHI-85415C1",
                CategoryId = catLighting.Id,
                Manufacturer = "Philips",
                Price = 249.00m,
                StockQuantity = 16,
                Description = "Oryginalny palnik ksenonowy z naturalną białą barwą światła i certyfikatem autentyczności OEM.",
                Compatibility = "Audi A4 B7/B8, BMW E60/E90, VW Passat B6/B7 z fabrycznym ksenonem D1S",
                ImageUrl = "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&auto=format&fit=crop&q=80",
                Rating = 4.8
            }
        };

        context.CarParts.AddRange(parts);
        await context.SaveChangesAsync();

        // Seed a sample past order for "admin" so Order History and Returns work immediately
        var sampleOrder = new Order
        {
            UserId = "admin",
            CustomerName = "Admin Sklepu",
            Email = "admin@carpartshop.local",
            Phone = "+48 500 100 200",
            ShippingAddress = "ul. Wyścigowa 42, 00-001 Warszawa",
            Status = "Completed",
            TotalPrice = 569.49m,
            PaymentMethod = "Card",
            ReturnStatus = "None",
            CreatedAt = DateTime.UtcNow.AddDays(-5),
            Items = new List<OrderItem>
            {
                new OrderItem
                {
                    CarPartId = parts[0].Id,
                    PartName = parts[0].Name,
                    PartNumber = parts[0].PartNumber,
                    Quantity = 1,
                    UnitPrice = parts[0].Price,
                    TotalPrice = parts[0].Price
                },
                new OrderItem
                {
                    CarPartId = parts[1].Id,
                    PartName = parts[1].Name,
                    PartNumber = parts[1].PartNumber,
                    Quantity = 1,
                    UnitPrice = parts[1].Price,
                    TotalPrice = parts[1].Price
                }
            }
        };

        context.Orders.Add(sampleOrder);
        await context.SaveChangesAsync();
    }
}
