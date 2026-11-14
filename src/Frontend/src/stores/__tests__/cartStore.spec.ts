import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCartStore } from '../cartStore';
import type { CarPart } from '@/types';

// Mock localStorage if needed in test environment
const mockStorage: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, value: string) => { mockStorage[key] = value; },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
});

const samplePart: CarPart = {
  id: 1,
  name: 'Tarcze hamulcowe Brembo',
  partNumber: 'BRE-09.9772.11',
  categoryId: 1,
  manufacturer: 'Brembo',
  price: 259.99,
  stockQuantity: 10,
  description: 'Tarcze wentylowane',
  compatibility: 'VW Golf VII',
  imageUrl: '/images/parts/BRE-09.9772.11.jpg',
  rating: 4.8
};

const secondPart: CarPart = {
  id: 2,
  name: 'Klocki hamulcowe ATE',
  partNumber: 'ATE-13.0470-7242.2',
  categoryId: 1,
  manufacturer: 'ATE',
  price: 189.50,
  stockQuantity: 5,
  description: 'Klocki ceramiczne',
  compatibility: 'VW Golf VII',
  imageUrl: '/images/parts/ATE-13.0470-7242.2.jpg',
  rating: 4.9
};

describe('useCartStore', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it('starts with an empty cart and zero totals', () => {
    const cart = useCartStore();
    expect(cart.items).toHaveLength(0);
    expect(cart.itemCount).toBe(0);
    expect(cart.totalPrice).toBe(0);
    expect(cart.shippingCost).toBe(0);
    expect(cart.grandTotal).toBe(0);
  });

  it('adds an item to cart and calculates shipping cost under 300 PLN', () => {
    const cart = useCartStore();
    cart.addItem(samplePart, 1);

    expect(cart.items).toHaveLength(1);
    expect(cart.itemCount).toBe(1);
    expect(cart.totalPrice).toBeCloseTo(259.99);
    // Shipping under 300 PLN is 19.99
    expect(cart.shippingCost).toBe(19.99);
    expect(cart.grandTotal).toBeCloseTo(259.99 + 19.99);
  });

  it('provides free shipping when total exceeds 300 PLN', () => {
    const cart = useCartStore();
    cart.addItem(samplePart, 2); // 2 * 259.99 = 519.98 > 300

    expect(cart.totalPrice).toBeCloseTo(519.98);
    expect(cart.shippingCost).toBe(0);
    expect(cart.grandTotal).toBeCloseTo(519.98);
  });

  it('clamps quantity to available stock quantity', () => {
    const cart = useCartStore();
    cart.addItem(secondPart, 100); // stock is only 5

    expect(cart.items[0].quantity).toBe(5);
    expect(cart.itemCount).toBe(5);
  });

  it('increments quantity when adding the same part again', () => {
    const cart = useCartStore();
    cart.addItem(samplePart, 2);
    cart.addItem(samplePart, 3);

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(5);
  });

  it('updates item quantity and removes item when quantity reaches zero', () => {
    const cart = useCartStore();
    cart.addItem(samplePart, 2);

    cart.updateQuantity(samplePart.id, 4);
    expect(cart.items[0].quantity).toBe(4);

    cart.updateQuantity(samplePart.id, 0);
    expect(cart.items).toHaveLength(0);
    expect(cart.itemCount).toBe(0);
  });

  it('removes item directly', () => {
    const cart = useCartStore();
    cart.addItem(samplePart, 1);
    cart.addItem(secondPart, 1);
    expect(cart.items).toHaveLength(2);

    cart.removeItem(samplePart.id);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].part.id).toBe(secondPart.id);
  });

  it('applies discount correctly to effectiveTotal and grandTotal', () => {
    const cart = useCartStore();
    cart.addItem(samplePart, 2); // 519.98 PLN (free shipping)

    cart.discountAmount = 50;
    cart.couponCode = 'PROMO50';

    expect(cart.effectiveTotal).toBeCloseTo(519.98 - 50);
    expect(cart.grandTotal).toBeCloseTo(519.98 - 50);

    cart.removeCoupon();
    expect(cart.couponCode).toBeNull();
    expect(cart.discountAmount).toBe(0);
    expect(cart.grandTotal).toBeCloseTo(519.98);
  });

  it('clears cart and removes coupons completely', () => {
    const cart = useCartStore();
    cart.addItem(samplePart, 2);
    cart.discountAmount = 20;
    cart.couponCode = 'DISC20';

    cart.clearCart();
    expect(cart.items).toHaveLength(0);
    expect(cart.couponCode).toBeNull();
    expect(cart.discountAmount).toBe(0);
    expect(cart.grandTotal).toBe(0);
  });
});
