import { defineStore } from 'pinia';
import type { CarPart, CartItem } from '@/types';
import { api } from '@/services/api';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: (JSON.parse(localStorage.getItem('carpart_cart') || '[]') as CartItem[]),
    couponCode: (localStorage.getItem('carpart_coupon') || null) as string | null,
    discountAmount: Number(localStorage.getItem('carpart_discount') || '0'),
    couponDescription: (localStorage.getItem('carpart_coupon_desc') || '') as string
  }),

  getters: {
    itemCount: (state) => state.items.reduce((total, i) => total + i.quantity, 0),
    totalPrice: (state) => state.items.reduce((total, i) => total + (i.part.price * i.quantity), 0),
    shippingCost(): number {
      if (this.totalPrice === 0) return 0;
      return this.totalPrice > 300 ? 0 : 19.99;
    },
    effectiveTotal(): number {
      return Math.max(0, this.totalPrice - this.discountAmount);
    },
    grandTotal(): number {
      if (this.totalPrice === 0) return 0;
      return this.effectiveTotal + this.shippingCost;
    }
  },

  actions: {
    async applyCoupon(code: string): Promise<boolean> {
      try {
        const res = await api.validateCoupon(code, this.totalPrice);
        if (res.valid) {
          this.couponCode = res.code;
          this.discountAmount = res.discountAmount;
          this.couponDescription = res.description;
          localStorage.setItem('carpart_coupon', res.code);
          localStorage.setItem('carpart_discount', String(res.discountAmount));
          localStorage.setItem('carpart_coupon_desc', res.description);
          return true;
        }
        return false;
      } catch (err) {
        throw err;
      }
    },

    removeCoupon() {
      this.couponCode = null;
      this.discountAmount = 0;
      this.couponDescription = '';
      localStorage.removeItem('carpart_coupon');
      localStorage.removeItem('carpart_discount');
      localStorage.removeItem('carpart_coupon_desc');
    },

    addItem(part: CarPart, quantity = 1) {
      const existing = this.items.find(i => i.part.id === part.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty <= part.stockQuantity) {
          existing.quantity = newQty;
        } else {
          existing.quantity = part.stockQuantity;
        }
      } else {
        const initialQty = Math.min(quantity, part.stockQuantity);
        if (initialQty > 0) {
          this.items.push({ part, quantity: initialQty });
        }
      }
      this.saveToStorage();
    },

    updateQuantity(partId: number, quantity: number) {
      const item = this.items.find(i => i.part.id === partId);
      if (item) {
        if (quantity <= 0) {
          this.removeItem(partId);
        } else {
          item.quantity = Math.min(quantity, item.part.stockQuantity);
          this.saveToStorage();
        }
      }
    },

    removeItem(partId: number) {
      this.items = this.items.filter(i => i.part.id !== partId);
      this.saveToStorage();
    },

    clearCart() {
      this.items = [];
      this.removeCoupon();
      this.saveToStorage();
    },

    saveToStorage() {
      localStorage.setItem('carpart_cart', JSON.stringify(this.items));
    }
  }
});
