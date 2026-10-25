import { defineStore } from 'pinia';
import type { CarPart } from '@/types';

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('carpart_wishlist') || '[]') as CarPart[]
  }),

  getters: {
    count: (state) => state.items.length,
    hasItem: (state) => (partId: number) => state.items.some(item => item.id === partId)
  },

  actions: {
    toggle(part: CarPart): boolean {
      const index = this.items.findIndex(item => item.id === part.id);
      let added = false;
      if (index >= 0) {
        this.items.splice(index, 1);
        added = false;
      } else {
        this.items.push(part);
        added = true;
      }
      this.save();
      return added;
    },

    remove(partId: number) {
      this.items = this.items.filter(item => item.id !== partId);
      this.save();
    },

    clear() {
      this.items = [];
      this.save();
    },

    save() {
      localStorage.setItem('carpart_wishlist', JSON.stringify(this.items));
    }
  }
});
