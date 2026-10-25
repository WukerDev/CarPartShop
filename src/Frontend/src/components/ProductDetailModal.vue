<template>
  <v-dialog :model-value="modelValue" max-width="700" @update:model-value="$emit('update:modelValue', $event)">
    <v-card v-if="part" color="surface" class="rounded-xl pa-2" border>
      <v-card-title class="d-flex justify-space-between align-center px-4 pt-4">
        <div class="d-flex align-center">
          <v-chip color="primary" size="small" class="mr-2 font-weight-bold">{{ part.manufacturer }}</v-chip>
          <span class="text-caption text-secondary font-weight-bold">{{ $t('common.oem') }}: {{ part.partNumber }}</span>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('update:modelValue', false)"></v-btn>
      </v-card-title>

      <v-card-text class="px-4">
        <v-row>
          <v-col cols="12" sm="5">
            <v-img
              :src="part.imageUrl"
              aspect-ratio="1"
              cover
              class="rounded-lg border w-100"
              style="aspect-ratio: 1 / 1;"
            ></v-img>
          </v-col>

          <v-col cols="12" sm="7" class="d-flex flex-column justify-space-between">
            <div>
              <h2 class="text-h6 font-weight-bold text-white mb-2">{{ part.name }}</h2>
              <div class="d-flex align-center mb-3">
                <v-rating :model-value="part.rating" color="amber" density="compact" size="small" readonly half-increments></v-rating>
                <span class="text-caption text-grey ml-2 font-weight-bold">{{ part.rating.toFixed(1) }} / 5.0</span>
              </div>

              <div class="text-h5 font-weight-black text-primary mb-3">
                {{ part.price.toFixed(2) }} <span class="text-body-1 font-weight-normal">{{ $t('common.currency') }}</span>
              </div>

              <div class="d-flex align-center mb-2">
                <span class="text-caption text-grey mr-2">{{ $t('product.stockAvailability') }}</span>
                <v-chip :color="part.stockQuantity > 0 ? 'success' : 'error'" size="x-small" variant="flat">
                  {{ part.stockQuantity > 0 ? $t('product.stockAvailable', { count: part.stockQuantity }) : $t('product.outOfStock') }}
                </v-chip>
              </div>
            </div>

            <div class="d-flex align-center gap-3 pt-3">
              <v-text-field
                v-model.number="quantity"
                type="number"
                min="1"
                :max="part.stockQuantity"
                :label="$t('product.quantity')"
                density="compact"
                hide-details
                variant="outlined"
                style="max-width: 100px;"
                :disabled="part.stockQuantity <= 0"
              ></v-text-field>

              <v-btn
                color="primary"
                variant="flat"
                prepend-icon="mdi-cart-plus"
                :disabled="part.stockQuantity <= 0"
                class="flex-grow-1 text-none font-weight-bold"
                rounded="lg"
                @click="addToCart"
              >
                {{ $t('product.addToCart') }}
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <div>
          <h3 class="text-subtitle-2 font-weight-bold text-grey-lighten-1 mb-2">{{ $t('product.description') }}</h3>
          <p class="text-body-2 text-grey mb-4">{{ part.description }}</p>

          <h3 class="text-subtitle-2 font-weight-bold text-grey-lighten-1 mb-2">{{ $t('product.compatibility') }}</h3>
          <v-sheet color="surface-variant" class="pa-3 rounded-lg border">
            <div class="text-body-2 text-white">{{ part.compatibility }}</div>
          </v-sheet>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { CarPart } from '@/types';
import { useCartStore } from '@/stores/cartStore';
import { useSignalRStore } from '@/stores/signalrStore';

const props = defineProps<{
  modelValue: boolean;
  part: CarPart | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const { t } = useI18n();
const cartStore = useCartStore();
const signalrStore = useSignalRStore();
const quantity = ref(1);

watch(() => props.part, () => {
  quantity.value = 1;
});

function addToCart() {
  if (!props.part) return;
  cartStore.addItem(props.part, quantity.value);
  signalrStore.addNotification('success', t('notifications.addedToCartCount', { count: quantity.value, name: props.part.name }));
  emit('update:modelValue', false);
}
</script>

<style scoped>
.gap-3 {
  gap: 12px;
}
</style>
