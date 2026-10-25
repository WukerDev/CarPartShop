<template>
  <v-dialog :model-value="modelValue" max-width="500" persistent>
    <v-card color="#151D2C" class="rounded-xl pa-2" border>
      <v-card-title class="d-flex align-center justify-space-between pt-4 px-4">
        <div class="d-flex align-center">
          <v-icon icon="mdi-shield-check" color="success" size="24" class="mr-2"></v-icon>
          <span class="text-h6 font-weight-bold text-white">{{ $t('payment.title') }}</span>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" :disabled="processing" @click="$emit('cancel')"></v-btn>
      </v-card-title>

      <v-card-text class="px-4 py-2">
        <div class="d-flex justify-space-between align-center pa-3 rounded-lg bg-surface-variant mb-4">
          <span class="text-body-2 text-grey">{{ $t('payment.amountDue') }}</span>
          <span class="text-h5 font-weight-black text-primary">{{ amount.toFixed(2) }} {{ $t('common.currency') }}</span>
        </div>

        <v-btn-toggle
          v-model="selectedMethod"
          mandatory
          color="primary"
          variant="outlined"
          class="w-100 mb-4 d-flex"
        >
          <v-btn value="Card" class="flex-grow-1 text-none" prepend-icon="mdi-credit-card">
            {{ $t('payment.methods.card') }}
          </v-btn>
          <v-btn value="Blik" class="flex-grow-1 text-none" prepend-icon="mdi-cellphone-nfc">
            {{ $t('payment.methods.blik') }}
          </v-btn>
          <v-btn value="Transfer" class="flex-grow-1 text-none" prepend-icon="mdi-bank">
            {{ $t('payment.methods.transfer') }}
          </v-btn>
        </v-btn-toggle>

        <div v-if="selectedMethod === 'Card'">
          <v-text-field
            v-model="cardNumber"
            :label="$t('payment.cardNumber')"
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
                :label="$t('payment.expiry')"
                placeholder="12/28"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="cardCvv"
                :label="$t('payment.cvv')"
                placeholder="123"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>

        <div v-else-if="selectedMethod === 'Blik'">
          <v-text-field
            v-model="blikCode"
            :label="$t('payment.blikLabel')"
            :placeholder="$t('payment.blikPlaceholder')"
            prepend-inner-icon="mdi-cellphone-check"
            variant="outlined"
            density="compact"
            maxlength="6"
            counter
            :hint="$t('payment.blikHint')"
            persistent-hint
            class="mb-2"
          ></v-text-field>
        </div>

        <div v-else class="text-caption text-grey pa-3 rounded bg-surface-variant">
          <v-icon icon="mdi-information" size="16" class="mr-1 text-info"></v-icon>
          {{ $t('payment.transferDesc') }}
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
          {{ $t('payment.confirmAndPay', { amount: amount.toFixed(2) }) }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  modelValue: boolean;
  orderId: number;
  amount: number;
}>();

const emit = defineEmits<{
  (e: 'success', txId: string): void;
  (e: 'cancel'): void;
}>();

const { t } = useI18n();

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
      errorMessage.value = t('payment.blikValidation');
      return;
    }
  }

  processing.value = true;
  await new Promise(r => setTimeout(r, 900));

  processing.value = false;
  const mockTxId = `TX-${Date.now().toString(36).toUpperCase()}`;
  emit('success', mockTxId);
}
</script>
