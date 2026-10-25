<template>
  <v-card
    class="product-card h-100 d-flex flex-column rounded-xl"
    color="#151D2C"
    elevation="4"
    border
  >
    <!-- Part Image with Badge -->
    <div class="position-relative overflow-hidden" style="height: 200px; background-color: #0E1524;">
      <v-img
        :src="part.imageUrl"
        height="200"
        cover
        class="align-end"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
        </template>
      </v-img>

      <!-- Manufacturer Chip -->
      <v-chip
        size="x-small"
        color="primary"
        variant="flat"
        class="position-absolute top-0 left-0 ma-3 font-weight-bold"
      >
        {{ part.manufacturer }}
      </v-chip>

      <!-- Stock status chip -->
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
        {{ part.stockQuantity > 0 ? `${part.stockQuantity} szt.` : 'Brak' }}
      </v-chip>
    </div>

    <!-- Content -->
    <v-card-text class="flex-grow-1 pb-2">
      <!-- OEM Number -->
      <div class="text-caption text-secondary font-weight-bold mb-1 d-flex align-center">
        <v-icon icon="mdi-barcode" size="14" class="mr-1"></v-icon>
        OEM: {{ part.partNumber }}
      </div>

      <!-- Title -->
      <h3 class="text-subtitle-1 font-weight-bold text-white mb-2 line-clamp-2">
        {{ part.name }}
      </h3>

      <!-- Compatibility Snippet -->
      <div class="compatibility-box pa-2 rounded-lg mb-3">
        <div class="text-caption text-grey-lighten-1 font-weight-medium d-flex align-center">
          <v-icon icon="mdi-car-info" size="14" class="mr-1 text-primary"></v-icon>
          Pasuje m.in. do:
        </div>
        <div class="text-caption text-white text-truncate font-weight-bold">
          {{ part.compatibility }}
        </div>
      </div>

      <!-- Rating and Reviews -->
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

    <!-- Footer with Price and Add to Cart -->
    <v-card-actions class="px-4 pb-4 pt-0 d-flex justify-space-between align-center">
      <div>
        <div class="text-caption text-grey">Cena brutto</div>
        <div class="text-h6 font-weight-black text-primary">
          {{ part.price.toFixed(2) }} <span class="text-body-2 font-weight-medium">PLN</span>
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
          Do koszyka
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { CarPart } from '@/types';
import { useCartStore } from '@/stores/cartStore';
import { useSignalRStore } from '@/stores/signalrStore';

const props = defineProps<{
  part: CarPart;
}>();

defineEmits<{
  (e: 'view-details', part: CarPart): void;
}>();

const cartStore = useCartStore();
const signalrStore = useSignalRStore();

function addToCart() {
  cartStore.addItem(props.part, 1);
  signalrStore.addNotification('success', `Dodano do koszyka: ${props.part.name}`);
}
</script>

<style scoped>
.product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.product-card:hover {
  transform: translateY(-4px);
  border-color: rgba(225, 29, 72, 0.4) !important;
  box-shadow: 0 12px 24px -10px rgba(225, 29, 72, 0.2) !important;
}

.compatibility-box {
  background-color: rgba(255, 255, 255, 0.04);
  border-left: 3px solid #E11D48;
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
