import { test, expect } from '@playwright/test';

test.describe('AutoParts Pro E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/catalog/categories', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Układ Hamulcowy', slug: 'hamulce', icon: 'mdi-disc-alert', partsCount: 2 },
          { id: 2, name: 'Zawieszenie', slug: 'zawieszenie', icon: 'mdi-car-esp', partsCount: 1 }
        ])
      });
    });

    await page.route('**/api/catalog/parts*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          totalCount: 2,
          parts: [
            {
              id: 1,
              name: 'Tarcze hamulcowe przednie wentylowane 312mm',
              partNumber: 'BRE-09.9772.11',
              categoryId: 1,
              categoryName: 'Układ Hamulcowy',
              manufacturer: 'Brembo',
              price: 349.99,
              stockQuantity: 10,
              description: 'Wysokowydajne tarcze hamulcowe.',
              compatibility: 'VW Golf VII, Audi A3 8V',
              imageUrl: 'https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?w=600',
              rating: 4.9
            },
            {
              id: 2,
              name: 'Amortyzator przedni gazowy B4',
              partNumber: 'BIL-22-131607',
              categoryId: 2,
              categoryName: 'Zawieszenie',
              manufacturer: 'Bilstein',
              price: 389.00,
              stockQuantity: 5,
              description: 'Gazowy amortyzator jednorurowy.',
              compatibility: 'Audi A4 B8',
              imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600',
              rating: 4.8
            }
          ]
        })
      });
    });

    let ordersList = [
      {
        id: 101,
        customerName: 'Jan Kowalski',
        email: 'jan@example.com',
        phone: '+48 500 100 200',
        shippingAddress: 'ul. Rajdowa 12, Warszawa',
        status: 'Paid',
        totalPrice: 349.99,
        createdAt: '2026-10-21 14:00:00',
        paymentMethod: 'Card',
        returnStatus: 'None',
        items: [
          {
            id: 1,
            partId: 1,
            partName: 'Tarcze hamulcowe przednie wentylowane 312mm',
            partNumber: 'BRE-09.9772.11',
            quantity: 1,
            unitPrice: 349.99,
            totalPrice: 349.99
          }
        ]
      }
    ];

    await page.route('**/api/orders/return', async route => {
      const data = JSON.parse(route.request().postData() || '{}');
      const order = ordersList.find(o => o.id === data.orderId);
      if (order) {
        order.status = 'Returned';
        order.returnStatus = 'Approved';
        order.returnReason = data.reason;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Zwrot został pomyślnie zarejestrowany.',
          orderId: data.orderId,
          newStatus: 'Returned'
        })
      });
    });

    await page.route('**/api/orders*', async route => {
      if (route.request().method() === 'POST') {
        const payload = JSON.parse(route.request().postData() || '{}');
        const newOrder = {
          id: 102,
          customerName: payload.customerName,
          email: payload.email,
          phone: payload.phone,
          shippingAddress: payload.shippingAddress,
          status: 'Paid',
          totalPrice: 349.99,
          createdAt: '2026-10-21 20:00:00',
          paymentMethod: payload.paymentMethod || 'Card',
          returnStatus: 'None',
          items: payload.items.map((i: any, idx: number) => ({
            id: idx + 1,
            partId: i.partId,
            partName: 'Tarcze hamulcowe przednie wentylowane 312mm',
            partNumber: 'BRE-09.9772.11',
            quantity: i.quantity,
            unitPrice: 349.99,
            totalPrice: 349.99 * i.quantity
          }))
        };
        ordersList.unshift(newOrder);
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(newOrder)
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(ordersList)
        });
      }
    });

    await page.route('**/api/payment/process', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          transactionId: 'TX-TEST-MOCK-1234',
          message: 'Płatność powiodła się.'
        })
      });
    });
  });

  test('1. Powinien załadować stronę główną sklepu z katalogiem i kategoriami', async ({ page }) => {
    await page.goto('/portal/');
    await expect(page).toHaveTitle(/AutoParts Pro/);
    await expect(page.getByText('AUTOPARTSPRO').first()).toBeVisible();
    await expect(page.getByText('Układ Hamulcowy').first()).toBeVisible();
    await expect(page.getByText('Tarcze hamulcowe przednie wentylowane 312mm').first()).toBeVisible();
  });

  test('2. Powinien dodać część do koszyka i wyświetlić ją w koszyku', async ({ page }) => {
    await page.goto('/portal/');
    const addToCartBtn = page.getByRole('button', { name: 'Do koszyka' }).first();
    await addToCartBtn.click();

    await page.goto('/portal/cart');
    await expect(page.getByRole('heading', { name: 'Twój Koszyk Zakupowy' })).toBeVisible();
    await expect(page.getByText('Tarcze hamulcowe przednie wentylowane 312mm').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Przejdź do kasy' })).toBeVisible();
  });

  test('3. Powinien przejść proces kasy i zamockowanej płatności', async ({ page }) => {
    await page.goto('/portal/');
    await page.getByRole('button', { name: 'Do koszyka' }).first().click();
    await page.goto('/portal/checkout');

    await expect(page.getByRole('heading', { name: 'Kasa i Dostawa' })).toBeVisible();
    const payBtn = page.getByRole('button', { name: 'Kupuję i płacę' });
    await payBtn.click();

    await expect(page.getByText('Bezpieczna Płatność (Mock)')).toBeVisible();
    const confirmPaymentBtn = page.getByRole('button', { name: 'Potwierdź i zapłać' });
    await confirmPaymentBtn.click();

    await expect(page.getByRole('heading', { name: 'Zamówienie Zostało Złożone!' })).toBeVisible({ timeout: 10000 });
  });

  test('4. Powinien wyświetlić historię zamówień i umożliwić zgłoszenie zwrotu', async ({ page }) => {
    await page.goto('/portal/orders');
    await expect(page.getByRole('heading', { name: 'Historia Twoich Zamówień' })).toBeVisible();
    await expect(page.getByText('Zamówienie #101')).toBeVisible();

    const returnBtn = page.getByRole('button', { name: 'Zgłoś zwrot części' }).first();
    await expect(returnBtn).toBeVisible();
    await returnBtn.click();

    await expect(page.getByText('Zgłoś Zwrot dla Zamówienia #101')).toBeVisible();
    const submitReturnBtn = page.getByRole('button', { name: 'Potwierdź zwrot' });
    await submitReturnBtn.click();

    await expect(page.getByText('Zwrot zaakceptowany').first()).toBeVisible({ timeout: 5000 });
  });
});
