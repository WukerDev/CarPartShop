using FluentValidation;
using CarPartShop.Backend.Protos;

namespace CarPartShop.Backend.Validators;

public class ReturnRequestValidator : AbstractValidator<RequestReturnRequest>
{
    public ReturnRequestValidator()
    {
        RuleFor(x => x.OrderId)
            .GreaterThan(0).WithMessage("Wymagany jest prawidłowy identyfikator zamówienia.");

        RuleFor(x => x.Reason)
            .NotEmpty().WithMessage("Powód zwrotu jest wymagany.")
            .MinimumLength(3).WithMessage("Powód zwrotu musi zawierać co najmniej 3 znaki.");
    }
}
