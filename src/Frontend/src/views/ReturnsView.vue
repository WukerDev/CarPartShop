<template>
  <v-container class="py-6">
    <div class="d-flex align-center mb-6">
      <v-btn icon="mdi-arrow-left" variant="text" to="/" class="mr-2"></v-btn>
      <div>
        <h1 class="text-h5 font-weight-bold text-white d-flex align-center">
          <v-icon icon="mdi-keyboard-return" color="warning" class="mr-2"></v-icon>
          {{ $t('returns.title') }}
        </h1>
        <span class="text-caption text-grey">{{ $t('returns.subtitle') }}</span>
      </div>
    </div>

    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-card color="#151D2C" class="pa-4 rounded-xl border h-100">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-calendar-check" color="success" size="24" class="mr-2"></v-icon>
            <span class="text-subtitle-2 font-weight-bold text-white">{{ $t('returns.banner1.title') }}</span>
          </div>
          <p class="text-caption text-grey mb-0">
            {{ $t('returns.banner1.desc') }}
          </p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="#151D2C" class="pa-4 rounded-xl border h-100">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-cash-refund" color="secondary" size="24" class="mr-2"></v-icon>
            <span class="text-subtitle-2 font-weight-bold text-white">{{ $t('returns.banner2.title') }}</span>
          </div>
          <p class="text-caption text-grey mb-0">
            {{ $t('returns.banner2.desc') }}
          </p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="#151D2C" class="pa-4 rounded-xl border h-100">
          <div class="d-flex align-center mb-2">
            <v-icon icon="mdi-package-variant-closed-check" color="warning" size="24" class="mr-2"></v-icon>
            <span class="text-subtitle-2 font-weight-bold text-white">{{ $t('returns.banner3.title') }}</span>
          </div>
          <p class="text-caption text-grey mb-0">
            {{ $t('returns.banner3.desc') }}
          </p>
        </v-card>
      </v-col>
    </v-row>

    <h2 class="text-subtitle-1 font-weight-bold text-white mb-3">
      {{ $t('returns.ordersSectionTitle') }}
    </h2>

    <div v-if="orderStore.orders.length > 0">
      <v-card
        v-for="order in orderStore.orders"
        :key="order.id"
        color="#151D2C"
        class="rounded-xl pa-4 mb-4 border"
      >
        <div class="d-flex justify-space-between align-center">
          <div>
            <div class="d-flex align-center mb-1">
              <span class="text-subtitle-2 font-weight-bold text-white mr-2">
                {{ $t('orders.orderNum', { id: order.id }) }}
              </span>
              <v-chip
                size="small"
                :color="order.status === 'Returned' ? 'warning' : 'success'"
                variant="flat"
              >
                {{ order.status === 'Returned' ? $t('returns.statusReturned') : $t('returns.statusEligible') }}
              </v-chip>
            </div>
            <div class="text-caption text-grey">
              {{ $t('returns.orderValue', { total: order.totalPrice.toFixed(2), date: order.createdAt }) }}
            </div>
            <div v-if="order.returnReason" class="text-caption text-warning mt-1">
              {{ $t('returns.reasonLabel', { reason: order.returnReason }) }}
            </div>
          </div>

          <div>
            <v-btn
              v-if="order.status !== 'Returned'"
              color="warning"
              variant="tonal"
              size="small"
              class="text-none font-weight-bold"
              rounded="lg"
              prepend-icon="mdi-keyboard-return"
              to="/orders"
            >
              {{ $t('returns.returnInHistoryBtn') }}
            </v-btn>
            <v-chip v-else color="success" size="small" variant="outlined" prepend-icon="mdi-check">
              {{ $t('returns.fundsReturned') }}
            </v-chip>
          </div>
        </div>
      </v-card>
    </div>

    <v-sheet
      v-else
      color="#151D2C"
      class="pa-8 text-center rounded-2xl border"
    >
      <v-icon icon="mdi-information-outline" size="48" color="grey" class="mb-2"></v-icon>
      <div class="text-body-1 font-weight-bold text-white">{{ $t('returns.emptyTitle') }}</div>
      <p class="text-caption text-grey">{{ $t('returns.emptyDesc') }}</p>
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useOrderStore } from '@/stores/orderStore';
import { useAuthStore } from '@/stores/authStore';

const orderStore = useOrderStore();
const authStore = useAuthStore();

onMounted(async () => {
  await orderStore.fetchOrders(authStore.user?.username);
});
</script>
