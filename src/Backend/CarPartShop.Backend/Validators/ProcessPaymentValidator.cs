using FluentValidation;
using CarPartShop.Backend.Protos;

namespace CarPartShop.Backend.Validators;

public class ProcessPaymentValidator : AbstractValidator<ProcessPaymentRequest>
{
    public ProcessPaymentValidator()
    {
        RuleFor(x => x.OrderId)
            .GreaterThan(0).WithMessage("Wymagany jest identyfikator zamówienia.");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Kwota płatności musi być większa od 0.");

        RuleFor(x => x.PaymentMethod)
            .NotEmpty().WithMessage("Wybierz metodę płatności.");

        When(x => x.PaymentMethod.Equals("Blik", StringComparison.OrdinalIgnoreCase), () =>
        {
            RuleFor(x => x.BlikCode)
                .NotEmpty().WithMessage("Kod BLIK jest wymagany.")
                .Length(6).WithMessage("Kod BLIK musi składać się z 6 cyfr.")
                .Matches(@"^\d{6}$").WithMessage("Kod BLIK może zawierać wyłącznie cyfry.");
        });

        When(x => x.PaymentMethod.Equals("Card", StringComparison.OrdinalIgnoreCase), () =>
        {
            RuleFor(x => x.CardNumber)
                .NotEmpty().WithMessage("Numer karty jest wymagany.")
                .MinimumLength(13).WithMessage("Nieprawidłowy numer karty.");
        });
    }
}
