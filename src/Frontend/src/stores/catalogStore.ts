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
    selectedMake: (localStorage.getItem('carpart_make') || null) as string | null,
    selectedModel: (localStorage.getItem('carpart_model') || null) as string | null,
    selectedYear: (localStorage.getItem('carpart_year') ? Number(localStorage.getItem('carpart_year')) : null) as number | null,
    vehicleMakes: [] as string[],
    vehicleModels: [] as string[],
    vehicleYears: [] as number[],
    loadingVehicles: false,
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

    hasVehicleSelected: (state) => !!state.selectedMake,

    selectedVehicleDescription: (state) => {
      if (!state.selectedMake) return '';
      const parts = [state.selectedMake];
      if (state.selectedModel) parts.push(state.selectedModel);
      if (state.selectedYear) parts.push(`(${state.selectedYear})`);
      return parts.join(' ');
    },

    filteredParts: (state) => {
      let result = state.parts;
      if (state.selectedCategoryId) {
        result = result.filter(p => p.categoryId === state.selectedCategoryId);
      }
      if (state.selectedMake) {
        const make = state.selectedMake.toLowerCase();
        const model = state.selectedModel ? state.selectedModel.toLowerCase() : null;
        const isVw = make === 'volkswagen' || make === 'vw';

        result = result.filter(p => {
          const comp = p.compatibility.toLowerCase();
          if (comp.includes('uniwersaln')) return true;

          const matchesMake = comp.includes(make) || (isVw && (comp.includes('vw') || comp.includes('volkswagen')));
          if (!matchesMake) return false;

          if (model && !comp.includes(model)) {
            return false;
          }

          return true;
        });
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

    async fetchVehicleMakes() {
      if (this.vehicleMakes.length > 0) return;
      this.loadingVehicles = true;
      try {
        this.vehicleMakes = await api.getVehicleMakes();
      } catch (err: any) {
        console.error(err);
      } finally {
        this.loadingVehicles = false;
      }
    },

    async setVehicleMake(make: string | null) {
      this.selectedMake = make;
      this.selectedModel = null;
      this.selectedYear = null;
      this.vehicleModels = [];
      this.vehicleYears = [];
      if (make) {
        localStorage.setItem('carpart_make', make);
        localStorage.removeItem('carpart_model');
        localStorage.removeItem('carpart_year');
        try {
          this.vehicleModels = await api.getVehicleModels(make);
        } catch (err: any) {
          console.error(err);
        }
      } else {
        localStorage.removeItem('carpart_make');
        localStorage.removeItem('carpart_model');
        localStorage.removeItem('carpart_year');
      }
      await this.fetchParts();
    },

    async setVehicleModel(model: string | null) {
      this.selectedModel = model;
      this.selectedYear = null;
      this.vehicleYears = [];
      if (model && this.selectedMake) {
        localStorage.setItem('carpart_model', model);
        localStorage.removeItem('carpart_year');
        try {
          this.vehicleYears = await api.getVehicleYears(this.selectedMake, model);
        } catch (err: any) {
          console.error(err);
        }
      } else {
        localStorage.removeItem('carpart_model');
        localStorage.removeItem('carpart_year');
      }
      await this.fetchParts();
    },

    async setVehicleYear(year: number | null) {
      this.selectedYear = year;
      if (year) {
        localStorage.setItem('carpart_year', year.toString());
      } else {
        localStorage.removeItem('carpart_year');
      }
      await this.fetchParts();
    },

    async clearVehicleFilter() {
      this.selectedMake = null;
      this.selectedModel = null;
      this.selectedYear = null;
      this.vehicleModels = [];
      this.vehicleYears = [];
      localStorage.removeItem('carpart_make');
      localStorage.removeItem('carpart_model');
      localStorage.removeItem('carpart_year');
      await this.fetchParts();
    },

    async fetchParts() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.getParts({
          categoryId: this.selectedCategoryId || undefined,
          search: this.searchQuery || undefined,
          inStockOnly: this.inStockOnly || undefined,
          carMake: this.selectedMake || undefined,
          carModel: this.selectedModel || undefined,
          carYear: this.selectedYear || undefined
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
