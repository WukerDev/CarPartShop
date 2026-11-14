<template>
  <v-container fluid class="py-6 px-4 px-md-8 mx-auto" style="max-width: 1760px;">
    <v-sheet
      color="surface"
      class="hero-banner pa-6 pa-md-10 rounded-2xl mb-8 position-relative overflow-hidden border"
    >
      <div class="position-relative z-1">
        <v-chip color="primary" size="small" class="font-weight-bold mb-3" prepend-icon="mdi-racing-helmet">
          {{ $t('hero.badge') }}
        </v-chip>
        <h1 class="text-h4 text-md-h3 font-weight-black text-white mb-3">
          {{ $t('hero.title') }}
        </h1>
        <p class="text-body-1 text-grey-lighten-1 mb-6" style="max-width: 680px;">
          {{ $t('hero.description') }}
        </p>

        <div class="hero-search-box pa-1 rounded-xl border d-flex align-center mb-6" style="max-width: 720px; background-color: #071314;">
          <v-text-field
            v-model="catalogStore.searchQuery"
            :placeholder="$t('catalog.searchHeroPlaceholder')"
            prepend-inner-icon="mdi-magnify"
            variant="plain"
            hide-details
            density="comfortable"
            class="px-3"
            clearable
            @keyup.enter="catalogStore.fetchParts"
          ></v-text-field>
          <v-btn
            color="primary"
            variant="flat"
            size="large"
            rounded="lg"
            class="font-weight-black px-6 text-none elevation-2 text-subtitle-2 search-action-btn"
            @click="catalogStore.fetchParts"
          >
            <v-icon icon="mdi-magnify" start size="22"></v-icon>
            {{ $t('catalog.searchButton') }}
          </v-btn>
        </div>

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

    <v-sheet
      color="surface"
      class="user-panel-banner pa-4 pa-md-5 rounded-2xl mb-8 border"
      elevation="2"
    >
      <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between gap-3">
        <div class="d-flex align-center">
          <v-avatar color="primary" size="46" class="mr-3 elevation-2 flex-shrink-0">
            <v-icon icon="mdi-card-account-details-outline" color="white" size="26"></v-icon>
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold text-white d-flex align-center flex-wrap">
              <span>{{ $t('catalog.userPanelBannerTitle') }}</span>
              <v-chip
                size="x-small"
                :color="authStore.hasSavedProfile ? 'success' : 'primary'"
                variant="flat"
                class="ml-2 font-weight-black my-1"
              >
                <v-icon :icon="authStore.hasSavedProfile ? 'mdi-check-decagram' : 'mdi-flash'" size="12" class="mr-1"></v-icon>
                {{ authStore.hasSavedProfile ? $t('checkout.savedAddressLoaded') : $t('profile.newBadge') }}
              </v-chip>
            </div>
            <div class="text-caption text-grey-lighten-1">
              {{ $t('catalog.userPanelBannerDesc') }}
            </div>
          </div>
        </div>

        <v-btn
          color="primary"
          variant="flat"
          to="/profile"
          prepend-icon="mdi-account-cog"
          rounded="lg"
          class="text-none font-weight-bold px-5 align-self-stretch align-self-sm-auto flex-shrink-0"
        >
          {{ $t('catalog.userPanelBannerBtn') }}
        </v-btn>
      </div>
    </v-sheet>

    <v-card
      color="surface"
      class="vehicle-selector-card pa-4 pa-md-6 rounded-2xl mb-8 border"
      elevation="3"
    >
      <div class="d-flex flex-wrap align-center justify-space-between mb-4">
        <div class="d-flex align-center">
          <v-avatar color="primary" size="40" class="mr-3">
            <v-icon icon="mdi-car-cog" color="black" size="24"></v-icon>
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold text-white d-flex align-center">
              {{ $t('catalog.vehicleSelectorTitle') }}
              <v-chip
                v-if="catalogStore.hasVehicleSelected"
                size="x-small"
                color="secondary"
                class="ml-2 font-weight-bold"
                variant="flat"
              >
                {{ catalogStore.selectedVehicleDescription }}
              </v-chip>
            </div>
            <div class="text-caption text-grey">
              {{ $t('catalog.vehicleSelectorDesc') }}
            </div>
          </div>
        </div>

        <v-btn
          v-if="catalogStore.hasVehicleSelected"
          variant="text"
          color="error"
          size="small"
          prepend-icon="mdi-close"
          class="text-none mt-2 mt-sm-0"
          @click="catalogStore.clearVehicleFilter()"
        >
          {{ $t('catalog.clearVehicle') }}
        </v-btn>
      </div>

      <v-row dense class="align-center">
        <v-col cols="12" sm="4">
          <v-select
            :model-value="catalogStore.selectedMake"
            :items="catalogStore.vehicleMakes"
            :label="$t('catalog.selectMake')"
            prepend-inner-icon="mdi-car"
            variant="outlined"
            density="comfortable"
            hide-details
            rounded="lg"
            clearable
            :loading="catalogStore.loadingVehicles"
            @update:model-value="catalogStore.setVehicleMake($event)"
          ></v-select>
        </v-col>

        <v-col cols="12" sm="4">
          <v-select
            :model-value="catalogStore.selectedModel"
            :items="catalogStore.vehicleModels"
            :label="$t('catalog.selectModel')"
            prepend-inner-icon="mdi-car-side"
            variant="outlined"
            density="comfortable"
            hide-details
            rounded="lg"
            clearable
            :disabled="!catalogStore.selectedMake"
            @update:model-value="catalogStore.setVehicleModel($event)"
          ></v-select>
        </v-col>

        <v-col cols="12" sm="4">
          <v-select
            :model-value="catalogStore.selectedYear"
            :items="catalogStore.vehicleYears"
            :label="$t('catalog.selectYear')"
            prepend-inner-icon="mdi-calendar"
            variant="outlined"
            density="comfortable"
            hide-details
            rounded="lg"
            clearable
            :disabled="!catalogStore.selectedModel"
            @update:model-value="catalogStore.setVehicleYear($event)"
          ></v-select>
        </v-col>
      </v-row>
    </v-card>

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
        <v-btn
          v-if="authStore.isAdmin"
          color="primary"
          variant="flat"
          prepend-icon="mdi-plus"
          size="small"
          rounded="lg"
          class="mr-3 font-weight-bold text-none"
          @click="openAddPartDialog"
        >
          {{ $t('catalog.addPartBtn') }}
        </v-btn>

        <v-switch
          v-model="catalogStore.inStockOnly"
          color="success"
          :label="$t('catalog.inStockOnly')"
          density="compact"
          hide-details
        ></v-switch>
      </v-col>
    </v-row>

    <div v-if="catalogStore.loading" class="catalog-grid">
      <div v-for="n in 10" :key="n" class="catalog-grid-cell">
        <v-skeleton-loader
          type="image, article, actions"
          color="surface"
          class="rounded-xl border w-100"
        ></v-skeleton-loader>
      </div>
    </div>

    <div v-else-if="catalogStore.filteredParts.length > 0" class="catalog-grid">
      <div
        v-for="part in catalogStore.filteredParts"
        :key="part.id"
        class="catalog-grid-cell"
      >
        <ProductCard
          :part="part"
          @view-details="openDetails"
        />
      </div>
    </div>

    <v-sheet
      v-else
      color="surface"
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

    <v-dialog v-model="addPartDialogOpen" max-width="650">
      <v-card color="surface" class="rounded-2xl pa-4" border>
        <v-card-title class="d-flex align-center justify-space-between pb-3 border-b">
          <div class="d-flex align-center">
            <v-icon icon="mdi-plus-box" color="primary" class="mr-2" size="24"></v-icon>
            <span class="text-subtitle-1 font-weight-bold text-white">{{ $t('catalog.addPartTitle') }}</span>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="addPartDialogOpen = false"></v-btn>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-row dense>
            <v-col cols="12" sm="8">
              <v-text-field
                v-model="newPartForm.name"
                :label="$t('catalog.partNameLabel')"
                placeholder="np. Tarcze hamulcowe Brembo Xtra"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="newPartForm.partNumber"
                :label="$t('catalog.partNumberLabel')"
                placeholder="np. BRE-09.9772.11"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="newPartForm.categoryId"
                :items="catalogStore.categories"
                item-title="name"
                item-value="id"
                :label="$t('catalog.categoryLabel')"
                variant="outlined"
                density="compact"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="newPartForm.manufacturer"
                :label="$t('catalog.manufacturerLabel')"
                placeholder="np. Brembo, Bosch, ATE"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="newPartForm.price"
                type="number"
                min="1"
                step="0.01"
                :label="$t('catalog.priceLabel')"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="newPartForm.stockQuantity"
                type="number"
                min="0"
                :label="$t('catalog.stockQuantityLabel')"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="newPartForm.compatibility"
                :label="$t('catalog.compatibilityLabel')"
                placeholder="np. VW Golf VII, Audi A3 8V, Seat Leon III"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="newPartForm.description"
                :label="$t('catalog.descriptionLabel')"
                placeholder="Szczegółowy opis techniczny części..."
                variant="outlined"
                density="compact"
                rows="2"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pt-2 pb-1">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="grey" class="text-none" @click="addPartDialogOpen = false">
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            class="text-none font-weight-bold px-5"
            rounded="lg"
            :loading="savingPart"
            :disabled="!newPartForm.name || !newPartForm.partNumber || newPartForm.price <= 0"
            @click="submitCreatePart"
          >
            {{ $t('catalog.savePartBtn') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/authStore';
import { useCatalogStore } from '@/stores/catalogStore';
import { useSignalRStore } from '@/stores/signalrStore';
import ProductCard from '@/components/ProductCard.vue';
import ProductDetailModal from '@/components/ProductDetailModal.vue';
import type { CarPart } from '@/types';

const { t } = useI18n();
const authStore = useAuthStore();
const catalogStore = useCatalogStore();
const signalrStore = useSignalRStore();
const detailsOpen = ref(false);
const selectedPart = ref<CarPart | null>(null);

const addPartDialogOpen = ref(false);
const savingPart = ref(false);
const newPartForm = ref({
  name: '',
  partNumber: '',
  categoryId: 1,
  manufacturer: '',
  price: 99.0,
  stockQuantity: 10,
  compatibility: '',
  description: ''
});

function openAddPartDialog() {
  if (catalogStore.categories.length > 0) {
    newPartForm.value.categoryId = catalogStore.categories[0].id;
  }
  newPartForm.value.name = '';
  newPartForm.value.partNumber = '';
  newPartForm.value.manufacturer = '';
  newPartForm.value.price = 99.0;
  newPartForm.value.stockQuantity = 10;
  newPartForm.value.compatibility = '';
  newPartForm.value.description = '';
  addPartDialogOpen.value = true;
}

async function submitCreatePart() {
  if (!newPartForm.value.name || !newPartForm.value.partNumber || newPartForm.value.price <= 0) return;
  savingPart.value = true;
  try {
    await catalogStore.createPart({
      name: newPartForm.value.name,
      partNumber: newPartForm.value.partNumber,
      categoryId: newPartForm.value.categoryId,
      manufacturer: newPartForm.value.manufacturer || 'OEM',
      price: newPartForm.value.price,
      stockQuantity: newPartForm.value.stockQuantity,
      compatibility: newPartForm.value.compatibility || 'Uniwersalna',
      description: newPartForm.value.description || newPartForm.value.name
    });
    signalrStore.addNotification('success', t('notifications.partCreatedSuccess'));
    addPartDialogOpen.value = false;
  } catch (err: any) {
    signalrStore.addNotification('error', err.message || t('notifications.partCreatedError'));
  } finally {
    savingPart.value = false;
  }
}

const displayCategoryName = computed(() => {
  if (!catalogStore.selectedCategoryId) {
    return t('catalog.allCategoriesLabel');
  }
  const cat = catalogStore.categories.find(c => c.id === catalogStore.selectedCategoryId);
  return cat ? cat.name : t('catalog.allCategoriesLabel');
});

onMounted(async () => {
  await Promise.all([
    catalogStore.fetchCategories(),
    catalogStore.fetchVehicleMakes(),
    catalogStore.fetchParts()
  ]);
  if (catalogStore.selectedMake && catalogStore.vehicleModels.length === 0) {
    await catalogStore.setVehicleMake(catalogStore.selectedMake);
  }
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
  catalogStore.clearVehicleFilter();
}
</script>

<style scoped>
.hero-banner {
  background: linear-gradient(135deg, #0A1618 0%, #0F2528 50%, #0B191B 100%);
  border-color: rgba(45, 212, 191, 0.15) !important;
}

.user-panel-banner {
  background: linear-gradient(135deg, rgba(20, 184, 166, 0.12) 0%, #0B181A 100%) !important;
  border-color: rgba(45, 212, 191, 0.3) !important;
}

.hero-search-box {
  border-color: rgba(45, 212, 191, 0.25) !important;
}

.vehicle-selector-card {
  border-color: rgba(45, 212, 191, 0.2) !important;
  background-color: #0B181A !important;
}

.search-action-btn {
  height: 48px !important;
  font-size: 15px !important;
}

.z-1 {
  z-index: 1;
}

.gap-4 {
  gap: 16px;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 20px;
}

@media (min-width: 600px) {
  .catalog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 900px) {
  .catalog-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1200px) {
  .catalog-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1440px) {
  .catalog-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

.catalog-grid-cell {
  display: flex;
  min-width: 0;
}
</style>
