<template>
  <v-container class="py-6">
    <div class="d-flex align-center justify-space-between mb-6">
      <div class="d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" to="/" class="mr-2"></v-btn>
        <div>
          <h1 class="text-h5 font-weight-bold text-white d-flex align-center">
            <v-icon icon="mdi-history" color="primary" class="mr-2"></v-icon>
            {{ $t('orders.title') }}
          </h1>
          <span class="text-caption text-grey">{{ $t('orders.subtitle') }}</span>
        </div>
      </div>

      <v-btn
        variant="tonal"
        color="secondary"
        prepend-icon="mdi-refresh"
        size="small"
        rounded="lg"
        class="text-none"
        @click="loadOrders"
      >
        {{ $t('orders.refresh') }}
      </v-btn>
    </div>

    <div v-if="orderStore.loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
      <div class="text-caption text-grey mt-3">{{ $t('orders.loading') }}</div>
    </div>

    <div v-else-if="orderStore.orders.length > 0">
      <v-card
        v-for="order in orderStore.orders"
        :key="order.id"
        color="#151D2C"
        class="rounded-2xl pa-5 mb-5 border"
      >
        <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center pb-3 border-b mb-3">
          <div>
            <div class="d-flex align-center mb-1">
              <span class="text-subtitle-1 font-weight-black text-white mr-2">
                {{ $t('orders.orderNum', { id: order.id }) }}
              </span>
              <v-chip
                size="small"
                :color="getStatusColor(order.status)"
                variant="flat"
                class="font-weight-bold"
              >
                {{ formatStatus(order.status) }}
              </v-chip>

              <v-chip
                v-if="order.returnStatus === 'Approved' || order.status === 'Returned'"
                size="small"
                color="warning"
                variant="tonal"
                class="ml-2 font-weight-bold"
              >
                {{ $t('orders.returnApproved') }}
              </v-chip>
            </div>
            <div class="text-caption text-grey">
              {{ $t('orders.date') }} {{ order.createdAt }} | {{ $t('orders.payment') }} {{ order.paymentMethod }}
            </div>
          </div>

          <div class="text-left text-sm-right mt-2 mt-sm-0">
            <div class="text-caption text-grey">{{ $t('orders.totalValue') }}</div>
            <div class="text-h6 font-weight-black text-primary">
              {{ order.totalPrice.toFixed(2) }} {{ $t('common.currency') }}
            </div>
          </div>
        </div>

        <div class="mb-4">
          <div
            v-for="item in order.items"
            :key="item.id || item.partId"
            class="d-flex justify-space-between align-center py-2 text-body-2"
          >
            <div>
              <span class="font-weight-bold text-white">{{ item.partName }}</span>
              <span class="text-caption text-secondary ml-2 font-weight-medium">({{ item.partNumber }})</span>
              <span class="text-caption text-grey ml-2">x {{ item.quantity }}</span>
            </div>
            <div class="font-weight-bold text-white">
              {{ item.totalPrice.toFixed(2) }} {{ $t('common.currency') }}
            </div>
          </div>
        </div>

        <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center pt-3 border-t bg-surface-variant pa-3 rounded-lg">
          <div class="text-caption text-grey mb-2 mb-sm-0">
            <v-icon icon="mdi-map-marker-outline" size="14" class="mr-1"></v-icon>
            {{ $t('orders.shippingAddress') }} <span class="text-white font-weight-medium">{{ order.shippingAddress }}</span>
          </div>

          <div class="d-flex align-center gap-2">
            <v-btn
              v-if="order.status !== 'Returned' && order.returnStatus !== 'Approved'"
              variant="tonal"
              color="warning"
              size="small"
              prepend-icon="mdi-keyboard-return"
              class="text-none font-weight-bold"
              rounded="lg"
              @click="openReturnDialog(order)"
            >
              {{ $t('orders.requestReturnBtn') }}
            </v-btn>
            <div v-else class="text-caption text-warning font-weight-bold d-flex align-center">
              <v-icon icon="mdi-check-circle" size="16" class="mr-1"></v-icon>
              {{ $t('orders.returnCompleted') }}
            </div>
          </div>
        </div>
      </v-card>
    </div>

    <v-sheet
      v-else
      color="#151D2C"
      class="pa-12 text-center rounded-2xl border my-8"
    >
      <v-icon icon="mdi-package-variant" size="64" color="grey" class="mb-3"></v-icon>
      <div class="text-h6 font-weight-bold text-white mb-2">{{ $t('orders.emptyTitle') }}</div>
      <p class="text-body-2 text-grey mb-4">{{ $t('orders.emptyDesc') }}</p>
      <v-btn color="primary" variant="flat" to="/" rounded="lg" prepend-icon="mdi-cart">
        {{ $t('orders.firstShopping') }}
      </v-btn>
    </v-sheet>

    <v-dialog v-model="returnDialogOpen" max-width="500">
      <v-card color="#151D2C" class="rounded-xl pa-3" border>
        <v-card-title class="d-flex align-center justify-space-between pt-2 px-3">
          <div class="d-flex align-center">
            <v-icon icon="mdi-keyboard-return" color="warning" class="mr-2"></v-icon>
            <span class="text-subtitle-1 font-weight-bold text-white">
              {{ $t('orders.dialogTitle', { id: selectedOrder?.id }) }}
            </span>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="returnDialogOpen = false"></v-btn>
        </v-card-title>

        <v-card-text class="px-3">
          <p class="text-caption text-grey mb-4">
            {{ $t('orders.dialogPolicy') }}
          </p>

          <v-select
            v-model="returnReason"
            :label="$t('orders.reasonLabel')"
            :items="returnReasonOptions"
            variant="outlined"
            density="compact"
            class="mb-3"
          ></v-select>

          <v-textarea
            v-model="returnComments"
            :label="$t('orders.commentsLabel')"
            :placeholder="$t('orders.commentsPlaceholder')"
            variant="outlined"
            density="compact"
            rows="3"
          ></v-textarea>
        </v-card-text>

        <v-card-actions class="px-3 pb-3">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            color="grey"
            class="text-none"
            @click="returnDialogOpen = false"
          >
            {{ $t('orders.cancel') }}
          </v-btn>
          <v-btn
            color="warning"
            variant="flat"
            class="text-none font-weight-bold"
            rounded="lg"
            :loading="orderStore.loading"
            :disabled="!returnReason"
            @click="submitReturn"
          >
            {{ $t('orders.confirmReturn') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useOrderStore } from '@/stores/orderStore';
import { useAuthStore } from '@/stores/authStore';
import { useSignalRStore } from '@/stores/signalrStore';
import type { Order } from '@/types';

const { t } = useI18n();
const orderStore = useOrderStore();
const authStore = useAuthStore();
const signalrStore = useSignalRStore();

const returnDialogOpen = ref(false);
const selectedOrder = ref<Order | null>(null);
const returnReason = ref('');
const returnComments = ref('');

const returnReasonOptions = computed(() => [
  t('orders.reasons.wrongPart'),
  t('orders.reasons.notFitting'),
  t('orders.reasons.damaged'),
  t('orders.reasons.mismatch'),
  t('orders.reasons.other')
]);

onMounted(async () => {
  await loadOrders();
});

async function loadOrders() {
  await orderStore.fetchOrders(authStore.user?.username);
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'paid': return 'success';
    case 'completed': return 'success';
    case 'processing': return 'info';
    case 'shipped': return 'secondary';
    case 'returned': return 'warning';
    case 'cancelled': return 'error';
    default: return 'primary';
  }
}

function formatStatus(status: string) {
  switch (status.toLowerCase()) {
    case 'paid': return t('orders.status.paid');
    case 'completed': return t('orders.status.completed');
    case 'processing': return t('orders.status.processing');
    case 'shipped': return t('orders.status.shipped');
    case 'returned': return t('orders.status.returned');
    case 'cancelled': return t('orders.status.cancelled');
    default: return status;
  }
}

function openReturnDialog(order: Order) {
  selectedOrder.value = order;
  returnReason.value = t('orders.reasons.wrongPart');
  returnComments.value = '';
  returnDialogOpen.value = true;
}

async function submitReturn() {
  if (!selectedOrder.value) return;

  try {
    const res = await orderStore.requestReturn({
      orderId: selectedOrder.value.id,
      reason: returnReason.value,
      comments: returnComments.value
    });

    signalrStore.addNotification('success', res.message || t('notifications.returnSuccess'));
    returnDialogOpen.value = false;
    await loadOrders();
  } catch (err: any) {
    signalrStore.addNotification('error', err.message || t('notifications.returnError'));
  }
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
