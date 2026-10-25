using FluentAssertions;
using CarPartShop.Backend.Protos;
using CarPartShop.Backend.Validators;
using Xunit;

namespace CarPartShop.Backend.Tests;

public class ValidatorTests
{
    [Fact]
    public void CreateOrderValidator_WhenEmailIsInvalid_ShouldHaveValidationError()
    {
        var validator = new CreateOrderValidator();
        var request = new CreateOrderRequest
        {
            CustomerName = "Jan Kowalski",
            Email = "invalid-email-format",
            ShippingAddress = "Gdańsk Główny"
        };
        request.Items.Add(new OrderItemInput { PartId = 1, Quantity = 1 });

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Email");
    }

    [Fact]
    public void CreateOrderValidator_WhenItemsEmpty_ShouldHaveValidationError()
    {
        var validator = new CreateOrderValidator();
        var request = new CreateOrderRequest
        {
            CustomerName = "Jan Kowalski",
            Email = "jan@example.com",
            ShippingAddress = "Warszawa 123"
        };

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Items");
    }

    [Fact]
    public void ReturnRequestValidator_WhenReasonIsEmpty_ShouldHaveValidationError()
    {
        var validator = new ReturnRequestValidator();
        var request = new RequestReturnRequest
        {
            OrderId = 1,
            Reason = ""
        };

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Reason");
    }

    [Fact]
    public void ProcessPaymentValidator_WhenBlikCodeIsNot6Digits_ShouldHaveValidationError()
    {
        var validator = new ProcessPaymentValidator();
        var request = new ProcessPaymentRequest
        {
            OrderId = 1,
            Amount = 100,
            PaymentMethod = "Blik",
            BlikCode = "123" // Invalid, must be 6 digits
        };

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "BlikCode");
    }

    [Fact]
    public void ProcessPaymentValidator_WhenBlikCodeIs6Digits_ShouldBeValid()
    {
        var validator = new ProcessPaymentValidator();
        var request = new ProcessPaymentRequest
        {
            OrderId = 1,
            Amount = 100,
            PaymentMethod = "Blik",
            BlikCode = "777888"
        };

        var result = validator.Validate(request);

        result.IsValid.Should().BeTrue();
    }
}
