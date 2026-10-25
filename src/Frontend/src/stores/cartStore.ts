import { defineStore } from 'pinia';
import type { CarPart, CartItem } from '@/types';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: (JSON.parse(localStorage.getItem('carpart_cart') || '[]') as CartItem[])
  }),

  getters: {
    itemCount: (state) => state.items.reduce((total, i) => total + i.quantity, 0),
    totalPrice: (state) => state.items.reduce((total, i) => total + (i.part.price * i.quantity), 0),
    shippingCost(): number {
      if (this.totalPrice === 0) return 0;
      return this.totalPrice > 300 ? 0 : 19.99;
    },
    grandTotal(): number {
      return this.totalPrice + this.shippingCost;
    }
  },

  actions: {
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
      this.saveToStorage();
    },

    saveToStorage() {
      localStorage.setItem('carpart_cart', JSON.stringify(this.items));
    }
  }
});
