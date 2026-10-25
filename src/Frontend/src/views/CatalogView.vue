<template>
  <v-container class="py-6">
    <v-sheet
      color="#151D2C"
      class="hero-banner pa-6 pa-md-10 rounded-2xl mb-8 position-relative overflow-hidden border"
    >
      <div class="position-relative z-1">
        <v-chip color="primary" size="small" class="font-weight-bold mb-3" prepend-icon="mdi-racing-helmet">
          {{ $t('hero.badge') }}
        </v-chip>
        <h1 class="text-h4 text-md-h3 font-weight-black text-white mb-3">
          {{ $t('hero.title') }}
        </h1>
        <p class="text-body-1 text-grey-lighten-1 mb-6" style="max-width: 600px;">
          {{ $t('hero.description') }}
        </p>

        <div class="d-flex flex-wrap gap-4">
          <div class="d-flex align-center">
            <v-icon icon="mdi-shield-check" color="success" class="mr-2"></v-icon>
            <span class="text-caption font-weight-bold text-white">{{ $t('hero.genuineParts') }}</span>
          </div>
          <div class="d-flex align-center">
            <v-icon icon="mdi-truck-fast" color="secondary" class="mr-2"></v-icon>
            <span class="text-caption font-weight-bold text-white">{{ $t('hero.freeShippingOver') }}</span>
          </div>
          <div class="d-flex align-center">
            <v-icon icon="mdi-refresh" color="warning" class="mr-2"></v-icon>
            <span class="text-caption font-weight-bold text-white">{{ $t('hero.easyReturnOnline') }}</span>
          </div>
        </div>
      </div>
    </v-sheet>

    <div class="mb-6">
      <div class="d-flex align-center justify-space-between mb-3">
        <h2 class="text-h6 font-weight-bold text-white d-flex align-center">
          <v-icon icon="mdi-shape" color="primary" class="mr-2"></v-icon>
          {{ $t('catalog.categoriesTitle') }}
        </h2>
        <v-btn
          v-if="catalogStore.selectedCategoryId !== null"
          variant="text"
          size="small"
          color="primary"
          @click="selectCategory(null)"
        >
          {{ $t('catalog.clearFilter') }}
        </v-btn>
      </div>

      <v-slide-group show-arrows>
        <v-slide-group-item>
          <v-chip
            :color="catalogStore.selectedCategoryId === null ? 'primary' : undefined"
            :variant="catalogStore.selectedCategoryId === null ? 'flat' : 'outlined'"
            class="ma-1 font-weight-bold"
            filter
            @click="selectCategory(null)"
          >
            <v-icon icon="mdi-car-multiple" start></v-icon>
            {{ $t('catalog.allCategories') }}
          </v-chip>
        </v-slide-group-item>

        <v-slide-group-item
          v-for="cat in catalogStore.categories"
          :key="cat.id"
        >
          <v-chip
            :color="catalogStore.selectedCategoryId === cat.id ? 'primary' : undefined"
            :variant="catalogStore.selectedCategoryId === cat.id ? 'flat' : 'outlined'"
            class="ma-1 font-weight-bold"
            filter
            @click="selectCategory(cat.id)"
          >
            <v-icon :icon="cat.icon || 'mdi-car-wrench'" start></v-icon>
            {{ cat.name }}
          </v-chip>
        </v-slide-group-item>
      </v-slide-group>
    </div>

    <v-row class="mb-4 align-center">
      <v-col cols="12" sm="6" md="8">
        <div class="text-subtitle-1 font-weight-bold text-white">
          {{ displayCategoryName }}
          <span class="text-caption text-grey font-weight-normal ml-2">
            {{ $t('catalog.availableProducts', { count: catalogStore.filteredParts.length }) }}
          </span>
        </div>
      </v-col>

      <v-col cols="12" sm="6" md="4" class="d-flex justify-end align-center">
        <v-switch
          v-model="catalogStore.inStockOnly"
          color="success"
          :label="$t('catalog.inStockOnly')"
          density="compact"
          hide-details
        ></v-switch>
      </v-col>
    </v-row>

    <v-row v-if="catalogStore.loading">
      <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4" lg="4">
        <v-skeleton-loader
          type="image, article, actions"
          color="#151D2C"
          class="rounded-xl border"
        ></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row v-else-if="catalogStore.filteredParts.length > 0">
      <v-col
        v-for="part in catalogStore.filteredParts"
        :key="part.id"
        cols="12"
        sm="6"
        md="4"
        lg="4"
      >
        <ProductCard
          :part="part"
          @view-details="openDetails"
        />
      </v-col>
    </v-row>

    <v-sheet
      v-else
      color="#151D2C"
      class="pa-12 text-center rounded-2xl border my-8"
    >
      <v-icon icon="mdi-car-off" size="64" color="grey" class="mb-3"></v-icon>
      <div class="text-h6 font-weight-bold text-white mb-2">{{ $t('catalog.emptyTitle') }}</div>
      <p class="text-body-2 text-grey mb-4">{{ $t('catalog.emptyDesc') }}</p>
      <v-btn color="primary" variant="flat" rounded="lg" @click="resetFilters">
        {{ $t('catalog.resetFilters') }}
      </v-btn>
    </v-sheet>

    <ProductDetailModal
      v-model="detailsOpen"
      :part="selectedPart"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCatalogStore } from '@/stores/catalogStore';
import ProductCard from '@/components/ProductCard.vue';
import ProductDetailModal from '@/components/ProductDetailModal.vue';
import type { CarPart } from '@/types';

const { t } = useI18n();
const catalogStore = useCatalogStore();
const detailsOpen = ref(false);
const selectedPart = ref<CarPart | null>(null);

const displayCategoryName = computed(() => {
  if (!catalogStore.selectedCategoryId) {
    return t('catalog.allCategoriesLabel');
  }
  const cat = catalogStore.categories.find(c => c.id === catalogStore.selectedCategoryId);
  return cat ? cat.name : t('catalog.allCategoriesLabel');
});

onMounted(async () => {
  await catalogStore.fetchCategories();
  await catalogStore.fetchParts();
});

function selectCategory(id: number | null) {
  catalogStore.setCategory(id);
}

function openDetails(part: CarPart) {
  selectedPart.value = part;
  detailsOpen.value = true;
}

function resetFilters() {
  catalogStore.searchQuery = '';
  catalogStore.inStockOnly = false;
  catalogStore.setCategory(null);
}
</script>

<style scoped>
.hero-banner {
  background: linear-gradient(135deg, #151D2C 0%, #1E293B 100%);
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.z-1 {
  z-index: 1;
}

.gap-4 {
  gap: 16px;
}
</style>
