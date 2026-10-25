using FluentValidation;
using CarPartShop.Backend.Protos;

namespace CarPartShop.Backend.Validators;

public class CreateOrderValidator : AbstractValidator<CreateOrderRequest>
{
    public CreateOrderValidator()
    {
        RuleFor(x => x.CustomerName)
            .NotEmpty().WithMessage("Imię i nazwisko klienta jest wymagane.")
            .MinimumLength(3).WithMessage("Imię i nazwisko musi mieć co najmniej 3 znaki.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Adres e-mail jest wymagany.")
            .EmailAddress().WithMessage("Podaj prawidłowy format adresu e-mail.");

        RuleFor(x => x.ShippingAddress)
            .NotEmpty().WithMessage("Adres dostawy jest wymagany.")
            .MinimumLength(5).WithMessage("Adres dostawy musi zawierać ulicę, numer oraz miasto.");

        RuleFor(x => x.Items)
            .NotEmpty().WithMessage("Koszyk nie może być pusty.");

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.PartId).GreaterThan(0).WithMessage("Nieprawidłowy identyfikator części.");
            item.RuleFor(i => i.Quantity).GreaterThan(0).WithMessage("Ilość musi być większa od zera.");
        });
    }
}
