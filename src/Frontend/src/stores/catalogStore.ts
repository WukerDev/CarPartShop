import { defineStore } from 'pinia';
import { api } from '@/services/api';
import type { Category, CarPart } from '@/types';
import i18n from '@/plugins/i18n';

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    categories: [] as Category[],
    parts: [] as CarPart[],
    selectedCategoryId: null as number | null,
    searchQuery: '',
    minPrice: 0,
    maxPrice: 2000,
    inStockOnly: false,
    loading: false,
    error: null as string | null,
    totalCount: 0
  }),

  getters: {
    selectedCategoryName: (state) => {
      if (!state.selectedCategoryId) return i18n.global.t('catalog.allCategoriesLabel');
      const cat = state.categories.find(c => c.id === state.selectedCategoryId);
      return cat ? cat.name : i18n.global.t('catalog.allCategoriesLabel');
    },

    filteredParts: (state) => {
      let result = state.parts;
      if (state.selectedCategoryId) {
        result = result.filter(p => p.categoryId === state.selectedCategoryId);
      }
      if (state.searchQuery.trim()) {
        const q = state.searchQuery.toLowerCase();
        result = result.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.partNumber.toLowerCase().includes(q) ||
          p.manufacturer.toLowerCase().includes(q) ||
          p.compatibility.toLowerCase().includes(q)
        );
      }
      if (state.inStockOnly) {
        result = result.filter(p => p.stockQuantity > 0);
      }
      return result;
    }
  },

  actions: {
    async fetchCategories() {
      try {
        this.categories = await api.getCategories();
      } catch (err: any) {
        console.error(err);
      }
    },

    async fetchParts() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.getParts({
          categoryId: this.selectedCategoryId || undefined,
          search: this.searchQuery || undefined,
          inStockOnly: this.inStockOnly || undefined
        });
        this.parts = res.parts;
        this.totalCount = res.totalCount;
      } catch (err: any) {
        this.error = err.message || i18n.global.t('errors.catalogLoadError');
      } finally {
        this.loading = false;
      }
    },

    setCategory(categoryId: number | null) {
      this.selectedCategoryId = categoryId;
      this.fetchParts();
    },

    setSearch(search: string) {
      this.searchQuery = search;
    },

    updateStock(partId: number, newStock: number) {
      const part = this.parts.find(p => p.id === partId);
      if (part) {
        part.stockQuantity = newStock;
      }
    }
  }
});
