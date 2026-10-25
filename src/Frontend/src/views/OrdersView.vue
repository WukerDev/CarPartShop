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
        color="surface"
        class="rounded-2xl pa-5 mb-5 border"
      >
        <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center pb-3 border-b mb-3">
          <div>
            <div class="d-flex align-center flex-wrap gap-2 mb-1">
              <span class="text-subtitle-1 font-weight-black text-white mr-1">
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
                class="font-weight-bold"
              >
                {{ $t('orders.returnApproved') }}
              </v-chip>

              <v-chip
                v-if="order.discountCode"
                size="small"
                color="secondary"
                variant="tonal"
                class="font-weight-bold"
              >
                <v-icon icon="mdi-ticket-percent" size="14" class="mr-1"></v-icon>
                {{ order.discountCode }} (-{{ (order.discountAmount ?? 0).toFixed(2) }} {{ $t('common.currency') }})
              </v-chip>
            </div>

            <div class="text-caption text-grey">
              {{ $t('orders.date') }} {{ order.createdAt }} | {{ $t('orders.payment') }} {{ order.paymentMethod }}
            </div>

            <div v-if="order.trackingNumber" class="d-flex align-center mt-2 flex-wrap gap-2">
              <v-chip size="small" color="primary" variant="tonal" class="font-weight-bold">
                <v-icon icon="mdi-truck-fast" size="14" class="mr-1"></v-icon>
                {{ order.courierName || 'InPost Paczkomaty 24/7' }}: {{ order.trackingNumber }}
              </v-chip>
              <v-btn
                :href="getTrackingUrl(order)"
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                color="primary"
                size="x-small"
                prepend-icon="mdi-open-in-new"
                class="text-none font-weight-bold"
                rounded="lg"
              >
                {{ $t('orders.trackPackage') }}
              </v-btn>
            </div>
          </div>

          <div class="text-left text-sm-right mt-3 mt-sm-0">
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
              variant="tonal"
              color="primary"
              size="small"
              prepend-icon="mdi-file-document-outline"
              class="text-none font-weight-bold"
              rounded="lg"
              @click="openInvoiceDialog(order)"
            >
              {{ $t('orders.invoiceBtn') }}
            </v-btn>

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
      color="surface"
      class="pa-12 text-center rounded-2xl border my-8"
    >
      <v-icon icon="mdi-package-variant" size="64" color="grey" class="mb-3"></v-icon>
      <div class="text-h6 font-weight-bold text-white mb-2">{{ $t('orders.emptyTitle') }}</div>
      <p class="text-body-2 text-grey mb-4">{{ $t('orders.emptyDesc') }}</p>
      <v-btn color="primary" variant="flat" to="/" rounded="lg" prepend-icon="mdi-cart">
        {{ $t('orders.firstShopping') }}
      </v-btn>
    </v-sheet>

    <v-dialog v-model="invoiceDialogOpen" max-width="820">
      <v-card color="surface" class="rounded-2xl pa-4 pa-md-6 border invoice-card">
        <div class="d-flex align-center justify-space-between mb-4 pb-3 border-b no-print">
          <div class="d-flex align-center">
            <v-icon icon="mdi-file-certificate-outline" color="primary" class="mr-2" size="28"></v-icon>
            <span class="text-h6 font-weight-bold text-white">
              {{ $t('orders.invoiceDialogTitle', { number: currentInvoice?.invoiceNumber || '' }) }}
            </span>
          </div>
          <div class="d-flex gap-2">
            <v-btn
              color="primary"
              variant="flat"
              prepend-icon="mdi-printer"
              size="small"
              rounded="lg"
              class="text-none font-weight-bold"
              @click="printInvoice"
            >
              {{ $t('orders.invoicePrint') }}
            </v-btn>
            <v-btn icon="mdi-close" variant="text" size="small" @click="invoiceDialogOpen = false"></v-btn>
          </div>
        </div>

        <div v-if="loadingInvoice" class="text-center py-12">
          <v-progress-circular indeterminate color="primary" size="36"></v-progress-circular>
          <div class="text-caption text-grey mt-2">{{ $t('orders.invoiceLoading') }}</div>
        </div>

        <div v-else-if="currentInvoice" id="printableInvoice" class="printable-area bg-white text-black pa-6 rounded-xl">
          <div class="d-flex justify-space-between align-start pb-4 border-b mb-4">
            <div>
              <div class="text-h5 font-weight-black text-teal-darken-3 mb-1">AUTOPARTS PRO</div>
              <div class="text-caption text-grey-darken-2">Oryginalne części & Zamienniki OEM</div>
              <div class="text-caption text-grey-darken-2">NIP: {{ currentInvoice.seller.nip }} | REGON: {{ currentInvoice.seller.regon }}</div>
              <div class="text-caption text-grey-darken-2">{{ currentInvoice.seller.address }}</div>
            </div>
            <div class="text-right">
              <div class="text-h6 font-weight-black text-teal-darken-4">{{ currentInvoice.invoiceNumber }}</div>
              <div class="text-caption text-grey-darken-2">
                {{ $t('orders.invoiceIssueDate') }} <strong>{{ currentInvoice.issueDate }}</strong>
              </div>
              <div class="text-caption text-grey-darken-2">
                {{ $t('orders.invoicePaymentDate') }} <strong>{{ currentInvoice.saleDate }}</strong>
              </div>
              <div class="text-caption text-grey-darken-2">
                {{ $t('orders.payment') }} <strong>{{ currentInvoice.paymentMethod }}</strong>
              </div>
            </div>
          </div>

          <v-row class="mb-4">
            <v-col cols="6">
              <div class="pa-3 rounded border bg-grey-lighten-4">
                <div class="text-caption font-weight-bold text-teal-darken-3 mb-1 uppercase">{{ $t('orders.invoiceSeller') }}</div>
                <div class="text-body-2 font-weight-bold">{{ currentInvoice.seller.name }}</div>
                <div class="text-caption">NIP: {{ currentInvoice.seller.nip }}</div>
                <div class="text-caption">{{ currentInvoice.seller.address }}</div>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="pa-3 rounded border bg-grey-lighten-4">
                <div class="text-caption font-weight-bold text-teal-darken-3 mb-1 uppercase">{{ $t('orders.invoiceBuyer') }}</div>
                <div class="text-body-2 font-weight-bold">{{ currentInvoice.buyer.name }}</div>
                <div class="text-caption">{{ currentInvoice.buyer.email }} | {{ currentInvoice.buyer.phone }}</div>
                <div class="text-caption">{{ currentInvoice.buyer.address }}</div>
              </div>
            </v-col>
          </v-row>

          <table class="invoice-table w-100 mb-4">
            <thead>
              <tr class="bg-teal-darken-3 text-white text-caption font-weight-bold">
                <th class="pa-2 text-center" style="width: 40px;">{{ $t('orders.invoiceItemNo') }}</th>
                <th class="pa-2 text-left">{{ $t('orders.invoiceItemName') }}</th>
                <th class="pa-2 text-center" style="width: 60px;">{{ $t('orders.invoiceItemQty') }}</th>
                <th class="pa-2 text-right" style="width: 90px;">{{ $t('orders.invoiceItemNetPrice') }}</th>
                <th class="pa-2 text-right" style="width: 90px;">{{ $t('orders.invoiceItemNetValue') }}</th>
                <th class="pa-2 text-center" style="width: 60px;">{{ $t('orders.invoiceVatRate') }}</th>
                <th class="pa-2 text-right" style="width: 80px;">{{ $t('orders.invoiceVatAmount') }}</th>
                <th class="pa-2 text-right" style="width: 95px;">{{ $t('orders.invoiceGrossValue') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, idx) in currentInvoice.items"
                :key="item.partNumber"
                class="border-b text-caption"
              >
                <td class="pa-2 text-center">{{ idx + 1 }}</td>
                <td class="pa-2">
                  <div class="font-weight-bold">{{ item.partName }}</div>
                  <div class="text-caption text-grey-darken-1">OEM: {{ item.partNumber }}</div>
                </td>
                <td class="pa-2 text-center font-weight-bold">{{ item.quantity }} szt.</td>
                <td class="pa-2 text-right">{{ item.netUnitPrice.toFixed(2) }} zł</td>
                <td class="pa-2 text-right font-weight-bold">{{ item.netTotalPrice.toFixed(2) }} zł</td>
                <td class="pa-2 text-center">{{ item.vatRate }}</td>
                <td class="pa-2 text-right">{{ item.vatTotalPrice.toFixed(2) }} zł</td>
                <td class="pa-2 text-right font-weight-bold">{{ item.grossTotalPrice.toFixed(2) }} zł</td>
              </tr>

              <tr v-if="(currentInvoice.discountAmount ?? 0) > 0" class="border-b text-caption bg-amber-lighten-5">
                <td class="pa-2 text-center">#</td>
                <td class="pa-2 font-weight-bold" colspan="6">
                  {{ $t('orders.invoiceDiscount') }} ({{ currentInvoice.discountCode }})
                </td>
                <td class="pa-2 text-right font-weight-bold text-success">
                  -{{ (currentInvoice.discountAmount ?? 0).toFixed(2) }} zł
                </td>
              </tr>
            </tbody>
          </table>

          <div class="d-flex justify-end">
            <div style="min-width: 260px;" class="pa-3 bg-grey-lighten-4 rounded border">
              <div class="d-flex justify-space-between text-caption mb-1">
                <span class="text-grey-darken-2">{{ $t('orders.invoiceNetTotal') }}</span>
                <span class="font-weight-bold">{{ currentInvoice.summary.totalNet.toFixed(2) }} PLN</span>
              </div>
              <div class="d-flex justify-space-between text-caption mb-1">
                <span class="text-grey-darken-2">{{ $t('orders.invoiceVatTotal') }}</span>
                <span class="font-weight-bold">{{ currentInvoice.summary.totalVat.toFixed(2) }} PLN</span>
              </div>
              <v-divider class="my-2"></v-divider>
              <div class="d-flex justify-space-between text-subtitle-2 font-weight-black text-teal-darken-4">
                <span>{{ $t('orders.invoiceGrossTotal') }}</span>
                <span>{{ currentInvoice.summary.totalGross.toFixed(2) }} PLN</span>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="returnDialogOpen" max-width="500">
      <v-card color="surface" class="rounded-xl pa-3" border>
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
import { api } from '@/services/api';
import type { Order, InvoiceData } from '@/types';

const { t } = useI18n();
const orderStore = useOrderStore();
const authStore = useAuthStore();
const signalrStore = useSignalRStore();

const returnDialogOpen = ref(false);
const selectedOrder = ref<Order | null>(null);
const returnReason = ref('');
const returnComments = ref('');

const invoiceDialogOpen = ref(false);
const loadingInvoice = ref(false);
const currentInvoice = ref<InvoiceData | null>(null);

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

function getTrackingUrl(order: Order): string {
  const tr = order.trackingNumber || '';
  if (tr.startsWith('DPD') || (order.courierName && order.courierName.includes('DPD'))) {
    return `https://tracktrace.dpd.com.pl/findParcel?p1=${encodeURIComponent(tr)}`;
  }
  return `https://inpost.pl/sledzenie-przesylek?number=${encodeURIComponent(tr)}`;
}

async function openInvoiceDialog(order: Order) {
  loadingInvoice.value = true;
  invoiceDialogOpen.value = true;
  try {
    currentInvoice.value = await api.getOrderInvoice(order.id);
  } catch (err: any) {
    signalrStore.addNotification('error', err.message || t('errors.invoiceFetchError'));
    invoiceDialogOpen.value = false;
  } finally {
    loadingInvoice.value = false;
  }
}

function printInvoice() {
  window.print();
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

.invoice-table {
  border-collapse: collapse;
}

.invoice-table th,
.invoice-table td {
  border: 1px solid #e0e0e0;
}

@media print {
  body * {
    visibility: hidden;
  }
  .printable-area,
  .printable-area * {
    visibility: visible;
  }
  .printable-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 20px;
    background: white !important;
    color: black !important;
  }
  .no-print {
    display: none !important;
  }
}
</style>
