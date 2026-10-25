<template>
  <v-container class="py-6">
    <v-sheet
      v-if="orderCompleted"
      color="surface"
      class="pa-8 pa-md-12 text-center rounded-2xl border my-8"
      max-width="650"
      style="margin: 0 auto;"
    >
      <v-avatar color="success" size="72" class="mb-4 elevation-3">
        <v-icon icon="mdi-check-bold" color="white" size="40"></v-icon>
      </v-avatar>

      <h1 class="text-h4 font-weight-black text-white mb-2">{{ $t('checkout.orderPlacedTitle') }}</h1>
      <p class="text-subtitle-1 text-grey-lighten-1 mb-4">
        {{ $t('checkout.orderPlacedSubtitle') }}
      </p>

      <v-sheet color="rgba(255,255,255,0.04)" class="pa-4 rounded-xl border mb-6 text-left">
        <div class="d-flex justify-space-between mb-2">
          <span class="text-caption text-grey">{{ $t('checkout.orderNumber') }}</span>
          <span class="text-body-2 font-weight-black text-primary">#{{ completedOrderId }}</span>
        </div>
        <div class="d-flex justify-space-between mb-2">
          <span class="text-caption text-grey">{{ $t('checkout.orderStatus') }}</span>
          <v-chip color="success" size="x-small" variant="flat">{{ $t('checkout.statusPaid') }}</v-chip>
        </div>
        <div class="d-flex justify-space-between mb-2">
          <span class="text-caption text-grey">{{ $t('checkout.recipient') }}</span>
          <span class="text-body-2 font-weight-bold text-white">{{ form.customerName }}</span>
        </div>
        <div class="d-flex justify-space-between mb-2">
          <span class="text-caption text-grey">{{ $t('checkout.courierName') }}</span>
          <span class="text-body-2 text-white font-weight-bold">{{ completedCourierName }}</span>
        </div>
        <div v-if="completedTrackingNumber" class="d-flex justify-space-between mb-2">
          <span class="text-caption text-grey">{{ $t('checkout.trackingNumber') }}</span>
          <v-chip size="x-small" color="primary" variant="tonal" class="font-weight-black">
            {{ completedTrackingNumber }}
          </v-chip>
        </div>
        <div class="d-flex justify-space-between">
          <span class="text-caption text-grey">{{ $t('checkout.shippingAddress') }}</span>
          <span class="text-body-2 text-white">{{ form.shippingAddress }}</span>
        </div>
      </v-sheet>

      <div class="d-flex justify-center gap-3">
        <v-btn
          color="primary"
          variant="flat"
          to="/orders"
          prepend-icon="mdi-history"
          rounded="lg"
          class="text-none font-weight-bold px-5"
        >
          {{ $t('checkout.goToOrders') }}
        </v-btn>
        <v-btn
          variant="outlined"
          to="/"
          prepend-icon="mdi-arrow-left"
          rounded="lg"
          class="text-none font-weight-bold px-5"
        >
          {{ $t('checkout.catalogLink') }}
        </v-btn>
      </div>
    </v-sheet>

    <div v-else>
      <div class="d-flex align-center mb-6">
        <v-btn icon="mdi-arrow-left" variant="text" to="/cart" class="mr-2"></v-btn>
        <h1 class="text-h5 font-weight-bold text-white d-flex align-center">
          <v-icon icon="mdi-credit-card-check" color="primary" class="mr-2"></v-icon>
          {{ $t('checkout.pageTitle') }}
        </h1>
      </div>

      <v-row>
        <v-col cols="12" md="7">
          <v-card color="surface" class="rounded-2xl pa-6 mb-6" border>
            <div class="d-flex align-center justify-space-between mb-4">
              <h2 class="text-subtitle-1 font-weight-bold text-white d-flex align-center mb-0">
                <v-icon icon="mdi-account-outline" color="primary" class="mr-2"></v-icon>
                {{ $t('checkout.deliveryDetails') }}
              </h2>
              <v-chip v-if="hasSavedProfile" size="x-small" color="primary" variant="tonal" class="font-weight-bold">
                <v-icon icon="mdi-check-decagram" size="12" class="mr-1"></v-icon>
                {{ $t('checkout.savedAddressLoaded') }}
              </v-chip>
            </div>

            <v-form ref="formRef" @submit.prevent="proceedToPayment">
              <v-text-field
                v-model="form.customerName"
                :label="$t('checkout.nameLabel')"
                :placeholder="$t('checkout.namePlaceholder')"
                variant="outlined"
                density="compact"
                class="mb-3"
                :rules="[v => !!v || t('checkout.nameRequired')]"
              ></v-text-field>

              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="form.email"
                    :label="$t('checkout.emailLabel')"
                    :placeholder="$t('checkout.emailPlaceholder')"
                    type="email"
                    variant="outlined"
                    density="compact"
                    class="mb-3"
                    :rules="[v => !!v || t('checkout.emailRequired')]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="form.phone"
                    :label="$t('checkout.phoneLabel')"
                    placeholder="+48 600 700 800"
                    variant="outlined"
                    density="compact"
                    class="mb-3"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-text-field
                v-model="form.shippingAddress"
                :label="$t('checkout.addressLabel')"
                :placeholder="$t('checkout.addressPlaceholder')"
                variant="outlined"
                density="compact"
                class="mb-3"
                :rules="[v => !!v || t('checkout.addressRequired')]"
              ></v-text-field>

              <h2 class="text-subtitle-1 font-weight-bold text-white mb-2 d-flex align-center">
                <v-icon icon="mdi-truck-delivery" color="primary" class="mr-2"></v-icon>
                {{ $t('checkout.shippingMethodTitle') }}
              </h2>

              <v-radio-group v-model="form.courierName" class="mb-2">
                <v-radio
                  value="InPost Paczkomaty 24/7"
                  :label="$t('checkout.inpostOption')"
                  color="primary"
                ></v-radio>
                <v-radio
                  value="Kurier DPD 24h"
                  :label="$t('checkout.dpdOption')"
                  color="primary"
                ></v-radio>
              </v-radio-group>

              <v-checkbox
                v-model="saveProfile"
                :label="$t('checkout.saveAddressCheckbox')"
                color="primary"
                density="compact"
                hide-details
                class="mb-4"
              ></v-checkbox>

              <h2 class="text-subtitle-1 font-weight-bold text-white mb-3 d-flex align-center">
                <v-icon icon="mdi-cash" color="secondary" class="mr-2"></v-icon>
                {{ $t('checkout.paymentMethodTitle') }}
              </h2>

              <v-radio-group v-model="form.paymentMethod" class="mb-2">
                <v-radio
                  value="Card"
                  :label="$t('checkout.paymentCardLabel')"
                  color="primary"
                ></v-radio>
                <v-radio
                  value="Blik"
                  :label="$t('checkout.paymentBlikLabel')"
                  color="primary"
                ></v-radio>
                <v-radio
                  value="Transfer"
                  :label="$t('checkout.paymentTransferLabel')"
                  color="primary"
                ></v-radio>
              </v-radio-group>
            </v-form>
          </v-card>
        </v-col>

        <v-col cols="12" md="5">
          <v-card color="surface" class="rounded-2xl pa-6" border>
            <h2 class="text-subtitle-1 font-weight-bold text-white mb-4">
              {{ $t('checkout.yourCart', { count: cartStore.itemCount }) }}
            </h2>

            <div class="mb-4 overflow-y-auto" style="max-height: 260px;">
              <div
                v-for="item in cartStore.items"
                :key="item.part.id"
                class="d-flex justify-space-between align-center py-2 border-b"
              >
                <div class="d-flex align-center">
                  <v-avatar size="36" rounded="lg" class="mr-2 border">
                    <v-img :src="item.part.imageUrl" cover></v-img>
                  </v-avatar>
                  <div>
                    <div class="text-caption font-weight-bold text-white text-truncate" style="max-width: 170px;">
                      {{ item.part.name }}
                    </div>
                    <div class="text-caption text-grey">
                      {{ item.quantity }} x {{ item.part.price.toFixed(2) }} {{ $t('common.currency') }}
                    </div>
                  </div>
                </div>
                <div class="text-caption font-weight-bold text-primary">
                  {{ (item.part.price * item.quantity).toFixed(2) }} {{ $t('common.currency') }}
                </div>
              </div>
            </div>

            <div class="d-flex justify-space-between text-body-2 text-grey mb-1">
              <span>{{ $t('checkout.orderValue') }}</span>
              <span class="text-white font-weight-bold">{{ cartStore.totalPrice.toFixed(2) }} {{ $t('common.currency') }}</span>
            </div>

            <div v-if="cartStore.discountAmount > 0" class="d-flex justify-space-between text-body-2 text-success font-weight-bold mb-1">
              <span>{{ $t('checkout.discountAmount') }} ({{ cartStore.couponCode }})</span>
              <span>-{{ cartStore.discountAmount.toFixed(2) }} {{ $t('common.currency') }}</span>
            </div>

            <div class="d-flex justify-space-between text-body-2 text-grey mb-3">
              <span>{{ $t('checkout.shippingCost') }}</span>
              <span :class="cartStore.shippingCost === 0 ? 'text-success font-weight-bold' : 'text-white font-weight-bold'">
                {{ cartStore.shippingCost === 0 ? $t('cart.free') : `${cartStore.shippingCost.toFixed(2)} ${$t('common.currency')}` }}
              </span>
            </div>

            <v-divider class="my-3"></v-divider>

            <div class="d-flex justify-space-between align-center mb-6">
              <span class="text-subtitle-1 font-weight-bold text-white">{{ $t('checkout.amountToPay') }}</span>
              <span class="text-h5 font-weight-black text-primary">{{ cartStore.grandTotal.toFixed(2) }} {{ $t('common.currency') }}</span>
            </div>

            <v-btn
              color="primary"
              variant="flat"
              block
              size="large"
              class="text-none font-weight-bold py-3"
              rounded="lg"
              prepend-icon="mdi-lock-check"
              :loading="orderStore.loading"
              @click="proceedToPayment"
            >
              {{ $t('checkout.submitOrder') }}
            </v-btn>

            <div v-if="orderStore.error" class="text-caption text-error font-weight-bold mt-3 text-center">
              {{ orderStore.error }}
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <PaymentModal
      v-model="paymentModalOpen"
      :order-id="pendingOrderId"
      :amount="cartStore.grandTotal"
      @success="onPaymentApproved"
      @cancel="paymentModalOpen = false"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCartStore } from '@/stores/cartStore';
import { useOrderStore } from '@/stores/orderStore';
import { useAuthStore } from '@/stores/authStore';
import { useSignalRStore } from '@/stores/signalrStore';
import PaymentModal from '@/components/PaymentModal.vue';

const { t } = useI18n();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const authStore = useAuthStore();
const signalrStore = useSignalRStore();

const formRef = ref<any>(null);
const paymentModalOpen = ref(false);
const pendingOrderId = ref(0);
const orderCompleted = ref(false);
const completedOrderId = ref(0);
const completedCourierName = ref('');
const completedTrackingNumber = ref('');
const saveProfile = ref(true);

const hasSavedProfile = !!authStore.shippingProfile;

const form = reactive({
  customerName: authStore.shippingProfile?.customerName || (authStore.user?.username === 'admin' ? t('checkout.defaultAdminName') : t('checkout.defaultCustomerName')),
  email: authStore.shippingProfile?.email || authStore.user?.email || 'admin@carpartshop.local',
  phone: authStore.shippingProfile?.phone || '+48 500 600 700',
  shippingAddress: authStore.shippingProfile?.shippingAddress || t('checkout.defaultAddress'),
  courierName: authStore.shippingProfile?.courierName || 'InPost Paczkomaty 24/7',
  paymentMethod: 'Card'
});

async function proceedToPayment() {
  if (cartStore.itemCount === 0) return;

  const valid = formRef.value ? (await formRef.value.validate()).valid : true;
  if (!valid) return;

  paymentModalOpen.value = true;
}

async function onPaymentApproved(txId: string) {
  paymentModalOpen.value = false;

  try {
    const order = await orderStore.checkout({
      customerName: form.customerName,
      email: form.email,
      phone: form.phone,
      shippingAddress: form.shippingAddress,
      paymentMethod: form.paymentMethod,
      courierName: form.courierName,
      discountCode: cartStore.couponCode || undefined
    });

    if (saveProfile.value) {
      authStore.saveShippingProfile({
        customerName: form.customerName,
        email: form.email,
        phone: form.phone,
        shippingAddress: form.shippingAddress,
        courierName: form.courierName
      });
    }

    completedOrderId.value = order.id;
    completedCourierName.value = order.courierName || form.courierName;
    completedTrackingNumber.value = order.trackingNumber || '';
    orderCompleted.value = true;
    signalrStore.addNotification('success', t('notifications.orderSuccess', { id: order.id, txId }));
  } catch (err: any) {
    console.error(err);
  }
}
</script>

<style scoped>
.gap-3 {
  gap: 12px;
}
</style>
