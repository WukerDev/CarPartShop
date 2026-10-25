<template>
  <v-dialog :model-value="modelValue" max-width="700" @update:model-value="$emit('update:modelValue', $event)">
    <v-card v-if="part" color="#151D2C" class="rounded-xl pa-2" border>
      <v-card-title class="d-flex justify-space-between align-center px-4 pt-4">
        <div class="d-flex align-center">
          <v-chip color="primary" size="small" class="mr-2 font-weight-bold">{{ part.manufacturer }}</v-chip>
          <span class="text-caption text-secondary font-weight-bold">OEM: {{ part.partNumber }}</span>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('update:modelValue', false)"></v-btn>
      </v-card-title>

      <v-card-text class="px-4">
        <v-row>
          <v-col cols="12" sm="5">
            <v-img
              :src="part.imageUrl"
              height="240"
              cover
              class="rounded-lg border"
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
                {{ part.price.toFixed(2) }} <span class="text-body-1 font-weight-normal">PLN</span>
              </div>

              <div class="d-flex align-center mb-2">
                <span class="text-caption text-grey mr-2">Dostępność magazynowa:</span>
                <v-chip :color="part.stockQuantity > 0 ? 'success' : 'error'" size="x-small" variant="flat">
                  {{ part.stockQuantity > 0 ? `${part.stockQuantity} sztuk w magazynie centralnym` : 'Brak na stanie' }}
                </v-chip>
              </div>
            </div>

            <div class="d-flex align-center gap-3 pt-3">
              <v-text-field
                v-model.number="quantity"
                type="number"
                min="1"
                :max="part.stockQuantity"
                label="Ilość"
                density="compact"
                variant="outlined"
                hide-details
                style="max-width: 90px;"
              ></v-text-field>

              <v-btn
                color="primary"
                variant="flat"
                prepend-icon="mdi-cart-plus"
                :disabled="part.stockQuantity <= 0"
                class="flex-grow-1 text-none font-weight-bold"
                height="40"
                rounded="lg"
                @click="onAddToCart"
              >
                Dodaj do koszyka
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <div>
          <h4 class="text-subtitle-2 font-weight-bold text-white mb-1">Opis części i parametry techniczne</h4>
          <p class="text-body-2 text-grey-lighten-1 mb-4">{{ part.description }}</p>

          <h4 class="text-subtitle-2 font-weight-bold text-white mb-1">Kompatybilność z pojazdami</h4>
          <v-sheet color="rgba(255,255,255,0.03)" class="pa-3 rounded-lg border">
            <div class="text-body-2 text-white font-weight-medium">
              <v-icon icon="mdi-car-side" color="secondary" size="18" class="mr-2"></v-icon>
              {{ part.compatibility }}
            </div>
          </v-sheet>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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

const quantity = ref(1);
const cartStore = useCartStore();
const signalrStore = useSignalRStore();

function onAddToCart() {
  if (props.part) {
    cartStore.addItem(props.part, quantity.value);
    signalrStore.addNotification('success', `Dodano do koszyka: ${props.part.name} (${quantity.value} szt.)`);
    emit('update:modelValue', false);
    quantity.value = 1;
  }
}
</script>

<style scoped>
.gap-3 {
  gap: 12px;
}
</style>
