<template>
  <v-dialog :model-value="modelValue" max-width="500" persistent>
    <v-card color="#151D2C" class="rounded-xl pa-2" border>
      <v-card-title class="d-flex align-center justify-space-between pt-4 px-4">
        <div class="d-flex align-center">
          <v-icon icon="mdi-shield-check" color="success" size="24" class="mr-2"></v-icon>
          <span class="text-h6 font-weight-bold text-white">Bezpieczna Płatność (Mock)</span>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" :disabled="processing" @click="$emit('cancel')"></v-btn>
      </v-card-title>

      <v-card-text class="px-4 py-2">
        <div class="d-flex justify-space-between align-center pa-3 rounded-lg bg-surface-variant mb-4">
          <span class="text-body-2 text-grey">Do zapłaty:</span>
          <span class="text-h5 font-weight-black text-primary">{{ amount.toFixed(2) }} PLN</span>
        </div>

        <v-btn-toggle
          v-model="selectedMethod"
          mandatory
          color="primary"
          variant="outlined"
          class="w-100 mb-4 d-flex"
        >
          <v-btn value="Card" class="flex-grow-1 text-none" prepend-icon="mdi-credit-card">
            Karta
          </v-btn>
          <v-btn value="Blik" class="flex-grow-1 text-none" prepend-icon="mdi-cellphone-nfc">
            BLIK
          </v-btn>
          <v-btn value="Transfer" class="flex-grow-1 text-none" prepend-icon="mdi-bank">
            Przelew
          </v-btn>
        </v-btn-toggle>

        <!-- Card fields -->
        <div v-if="selectedMethod === 'Card'">
          <v-text-field
            v-model="cardNumber"
            label="Numer karty"
            placeholder="4242 •••• •••• 4242"
            prepend-inner-icon="mdi-credit-card-outline"
            variant="outlined"
            density="compact"
            class="mb-3"
          ></v-text-field>

          <v-row dense>
            <v-col cols="6">
              <v-text-field
                v-model="cardExpiry"
                label="MM/RR"
                placeholder="12/28"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="cardCvv"
                label="CVV"
                placeholder="123"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>

        <!-- BLIK fields -->
        <div v-else-if="selectedMethod === 'Blik'">
          <v-text-field
            v-model="blikCode"
            label="Kod BLIK (6 cyfr)"
            placeholder="123456"
            prepend-inner-icon="mdi-cellphone-check"
            variant="outlined"
            density="compact"
            maxlength="6"
            counter
            hint="Wpisz 6-cyfrowy kod z aplikacji bankowej"
            persistent-hint
            class="mb-2"
          ></v-text-field>
        </div>

        <!-- Transfer fields -->
        <div v-else class="text-caption text-grey pa-3 rounded bg-surface-variant">
          <v-icon icon="mdi-information" size="16" class="mr-1 text-info"></v-icon>
          Szybki przelew internetowy (PayByLink). Symulacja płatności zostanie zatwierdzona natychmiastowo.
        </div>

        <div v-if="errorMessage" class="text-caption text-error font-weight-bold mt-2">
          {{ errorMessage }}
        </div>
      </v-card-text>

      <v-card-actions class="px-4 pb-4">
        <v-btn
          color="success"
          variant="flat"
          block
          size="large"
          class="text-none font-weight-bold"
          rounded="lg"
          :loading="processing"
          @click="submitPayment"
        >
          <v-icon icon="mdi-lock" size="18" class="mr-1"></v-icon>
          Potwierdź i zapłać {{ amount.toFixed(2) }} PLN
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  orderId: number;
  amount: number;
}>();

const emit = defineEmits<{
  (e: 'success', txId: string): void;
  (e: 'cancel'): void;
}>();

const selectedMethod = ref<'Card' | 'Blik' | 'Transfer'>('Card');
const cardNumber = ref('4242 4242 4242 4242');
const cardExpiry = ref('12/28');
const cardCvv = ref('789');
const blikCode = ref('777888');
const processing = ref(false);
const errorMessage = ref('');

async function submitPayment() {
  errorMessage.value = '';

  if (selectedMethod.value === 'Blik') {
    if (!/^\d{6}$/.test(blikCode.value)) {
      errorMessage.value = 'Kod BLIK musi składać się dokładnie z 6 cyfr!';
      return;
    }
  }

  processing.value = true;
  // Simulate network latency for payment gateway
  await new Promise(r => setTimeout(r, 900));

  processing.value = false;
  const mockTxId = `TX-${Date.now().toString(36).toUpperCase()}`;
  emit('success', mockTxId);
}
</script>
