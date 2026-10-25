<template>
  <v-card
    class="product-card h-100 d-flex flex-column rounded-xl"
    color="surface"
    elevation="4"
    border
  >
    <div class="product-image-container position-relative overflow-hidden w-100">
      <v-img
        :src="part.imageUrl"
        aspect-ratio="1"
        cover
        class="align-end w-100 h-100"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
        </template>
      </v-img>

      <v-chip
        size="x-small"
        color="primary"
        variant="flat"
        class="position-absolute top-0 left-0 ma-3 font-weight-bold"
      >
        {{ part.manufacturer }}
      </v-chip>

      <v-chip
        size="x-small"
        :color="part.stockQuantity > 0 ? 'success' : 'error'"
        variant="flat"
        class="position-absolute top-0 right-0 ma-3 font-weight-bold"
      >
        <v-icon
          :icon="part.stockQuantity > 0 ? 'mdi-check-circle' : 'mdi-alert-circle'"
          size="12"
          class="mr-1"
        ></v-icon>
        {{ part.stockQuantity > 0 ? `${part.stockQuantity} ${$t('common.pieces')}` : $t('common.outOfStock') }}
      </v-chip>
    </div>

    <v-card-text class="flex-grow-1 pb-2">
      <div class="d-flex align-center justify-space-between mb-1">
        <div class="text-caption text-secondary font-weight-bold d-flex align-center">
          <v-icon icon="mdi-barcode" size="14" class="mr-1"></v-icon>
          {{ $t('common.oem') }}: {{ part.partNumber }}
        </div>
        <v-chip
          v-if="catalogStore.hasVehicleSelected && isVehicleMatch"
          size="x-small"
          color="teal-accent-4"
          variant="flat"
          class="font-weight-black text-black"
          prepend-icon="mdi-check-decagram"
        >
          {{ $t('catalog.fitsYourVehicle') }}
        </v-chip>
      </div>

      <h3 class="text-subtitle-1 font-weight-bold text-white mb-2 line-clamp-2">
        {{ part.name }}
      </h3>

      <div class="compatibility-box pa-2 rounded-lg mb-3">
        <div class="text-caption text-grey-lighten-1 font-weight-medium d-flex align-center">
          <v-icon icon="mdi-car-info" size="14" class="mr-1 text-primary"></v-icon>
          {{ $t('catalog.fitsTo') }}
        </div>
        <div class="text-caption text-white text-truncate font-weight-bold">
          {{ part.compatibility }}
        </div>
      </div>

      <div class="d-flex align-center mb-2">
        <v-rating
          :model-value="part.rating"
          color="amber"
          density="compact"
          size="small"
          half-increments
          readonly
        ></v-rating>
        <span class="text-caption text-grey ml-1 font-weight-bold">({{ part.rating.toFixed(1) }})</span>
      </div>
    </v-card-text>

    <v-card-actions class="px-4 pb-4 pt-0 d-flex justify-space-between align-center">
      <div>
        <div class="text-caption text-grey">{{ $t('common.grossPrice') }}</div>
        <div class="text-h6 font-weight-black text-primary">
          {{ part.price.toFixed(2) }} <span class="text-body-2 font-weight-medium">{{ $t('common.currency') }}</span>
        </div>
      </div>

      <div class="d-flex gap-2">
        <v-btn
          icon
          size="small"
          variant="tonal"
          color="grey-lighten-1"
          @click="$emit('view-details', part)"
        >
          <v-icon icon="mdi-eye-outline"></v-icon>
        </v-btn>

        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-cart-plus"
          :disabled="part.stockQuantity <= 0"
          class="text-none font-weight-bold"
          rounded="lg"
          @click="addToCart"
        >
          {{ $t('catalog.addToCart') }}
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { CarPart } from '@/types';
import { useCartStore } from '@/stores/cartStore';
import { useCatalogStore } from '@/stores/catalogStore';
import { useSignalRStore } from '@/stores/signalrStore';

const props = defineProps<{
  part: CarPart;
}>();

defineEmits<{
  (e: 'view-details', part: CarPart): void;
}>();

const { t } = useI18n();
const cartStore = useCartStore();
const catalogStore = useCatalogStore();
const signalrStore = useSignalRStore();

const isVehicleMatch = computed(() => {
  if (!catalogStore.selectedMake) return false;
  const comp = props.part.compatibility.toLowerCase();
  if (comp.includes('uniwersaln')) return true;
  const make = catalogStore.selectedMake.toLowerCase();
  const isVw = make === 'volkswagen' || make === 'vw';
  const matchesMake = comp.includes(make) || (isVw && (comp.includes('vw') || comp.includes('volkswagen')));
  if (!matchesMake) return false;
  if (catalogStore.selectedModel && !comp.includes(catalogStore.selectedModel.toLowerCase())) {
    return false;
  }
  return true;
});

function addToCart() {
  cartStore.addItem(props.part, 1);
  signalrStore.addNotification('success', t('notifications.addedToCart', { name: props.part.name }));
}
</script>

<style scoped>
.product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  border-color: rgba(45, 212, 191, 0.12) !important;
}

.product-card:hover {
  transform: translateY(-4px);
  border-color: rgba(20, 184, 166, 0.6) !important;
  box-shadow: 0 12px 24px -10px rgba(20, 184, 166, 0.25) !important;
}

.product-image-container {
  aspect-ratio: 1 / 1;
  background-color: #061012;
}

.compatibility-box {
  background-color: rgba(20, 184, 166, 0.08);
  border-left: 3px solid #14B8A6;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 44px;
}

.gap-2 {
  gap: 8px;
}
</style>
