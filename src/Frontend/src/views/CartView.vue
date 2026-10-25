<template>
  <v-container class="py-6">
    <div class="d-flex align-center mb-6">
      <v-btn icon="mdi-arrow-left" variant="text" to="/" class="mr-2"></v-btn>
      <h1 class="text-h5 font-weight-bold text-white d-flex align-center">
        <v-icon icon="mdi-cart" color="primary" class="mr-2"></v-icon>
        {{ $t('cart.title') }}
      </h1>
      <v-spacer></v-spacer>
      <v-btn
        v-if="cartStore.itemCount > 0"
        variant="text"
        color="error"
        size="small"
        prepend-icon="mdi-trash-can-outline"
        @click="cartStore.clearCart()"
      >
        {{ $t('cart.clearCart') }}
      </v-btn>
    </div>

    <v-row v-if="cartStore.itemCount > 0">
      <v-col cols="12" md="8">
        <v-card color="surface" class="rounded-2xl pa-4 mb-4" border>
          <div class="mb-4 pa-3 rounded-xl bg-surface-variant">
            <div class="d-flex justify-space-between align-center text-caption mb-1">
              <span class="font-weight-bold text-white">
                <v-icon icon="mdi-truck-delivery-outline" color="secondary" class="mr-1"></v-icon>
                {{ cartStore.totalPrice >= 300 ? $t('cart.freeDeliveryReached') : $t('cart.freeDeliveryRemaining', { amount: (300 - cartStore.totalPrice).toFixed(2) }) }}
              </span>
              <span class="text-grey font-weight-bold">{{ Math.min(100, Math.round((cartStore.totalPrice / 300) * 100)) }}%</span>
            </div>
            <v-progress-linear
              :model-value="Math.min(100, (cartStore.totalPrice / 300) * 100)"
              color="secondary"
              height="8"
              rounded
            ></v-progress-linear>
          </div>

          <div v-for="(item, index) in cartStore.items" :key="item.part.id">
            <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between py-3">
              <div class="d-flex align-center mr-4 mb-2 mb-sm-0">
                <v-img
                  :src="item.part.imageUrl"
                  width="70"
                  height="70"
                  contain
                  class="rounded-lg mr-3 flex-shrink-0 border bg-white pa-1"
                ></v-img>
                <div>
                  <div class="text-caption text-secondary font-weight-bold">
                    {{ $t('common.oem') }}: {{ item.part.partNumber }} | {{ item.part.manufacturer }}
                  </div>
                  <div class="text-subtitle-2 font-weight-bold text-white">
                    {{ item.part.name }}
                  </div>
                  <div class="text-caption text-grey">
                    {{ $t('cart.unitPrice', { price: item.part.price.toFixed(2) }) }}
                  </div>
                </div>
              </div>

              <div class="d-flex align-center justify-space-between w-100 w-sm-auto">
                <div class="d-flex align-center mr-4 border rounded-lg px-1 py-0 bg-surface-variant">
                  <v-btn
                    icon="mdi-minus"
                    variant="text"
                    size="x-small"
                    :disabled="item.quantity <= 1"
                    @click="cartStore.updateQuantity(item.part.id, item.quantity - 1)"
                  ></v-btn>
                  <span class="mx-2 text-body-2 font-weight-bold text-white">{{ item.quantity }}</span>
                  <v-btn
                    icon="mdi-plus"
                    variant="text"
                    size="x-small"
                    :disabled="item.quantity >= item.part.stockQuantity"
                    @click="cartStore.updateQuantity(item.part.id, item.quantity + 1)"
                  ></v-btn>
                </div>

                <div class="text-right mr-3" style="min-width: 100px;">
                  <div class="text-subtitle-1 font-weight-black text-primary">
                    {{ (item.part.price * item.quantity).toFixed(2) }} {{ $t('common.currency') }}
                  </div>
                </div>

                <v-btn
                  icon="mdi-close"
                  variant="text"
                  size="small"
                  color="grey"
                  @click="cartStore.removeItem(item.part.id)"
                ></v-btn>
              </div>
            </div>

            <v-divider v-if="index < cartStore.items.length - 1" class="my-2"></v-divider>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="surface" class="rounded-2xl pa-6" border>
          <h2 class="text-h6 font-weight-bold text-white mb-4">{{ $t('cart.summaryTitle') }}</h2>

          <div class="d-flex justify-space-between text-body-2 text-grey mb-2">
            <span>{{ $t('cart.cartValue') }}</span>
            <span class="text-white font-weight-bold">{{ cartStore.totalPrice.toFixed(2) }} {{ $t('common.currency') }}</span>
          </div>

          <div class="d-flex justify-space-between text-body-2 text-grey mb-2">
            <span>{{ $t('cart.shippingCost') }}</span>
            <span :class="cartStore.shippingCost === 0 ? 'text-success font-weight-bold' : 'text-white font-weight-bold'">
              {{ cartStore.shippingCost === 0 ? $t('cart.free') : `${cartStore.shippingCost.toFixed(2)} ${$t('common.currency')}` }}
            </span>
          </div>

          <div v-if="cartStore.discountAmount > 0" class="d-flex justify-space-between text-body-2 text-success font-weight-bold mb-2">
            <span>{{ $t('cart.discountLabel') }} ({{ cartStore.couponCode }})</span>
            <span>-{{ cartStore.discountAmount.toFixed(2) }} {{ $t('common.currency') }}</span>
          </div>

          <v-divider class="my-4"></v-divider>

          <div class="mb-4">
            <div v-if="cartStore.couponCode" class="d-flex align-center justify-space-between pa-3 rounded-xl border bg-surface-variant mb-2" style="border-color: rgba(20, 184, 166, 0.4) !important;">
              <div>
                <div class="d-flex align-center">
                  <v-icon icon="mdi-ticket-percent" color="primary" class="mr-2"></v-icon>
                  <span class="text-subtitle-2 font-weight-bold text-white">{{ cartStore.couponCode }}</span>
                </div>
                <div class="text-caption text-primary">{{ cartStore.couponDescription }}</div>
              </div>
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-bold text-success mr-2">-{{ cartStore.discountAmount.toFixed(2) }} {{ $t('common.currency') }}</span>
                <v-btn icon="mdi-close" size="x-small" variant="text" color="grey" @click="cartStore.removeCoupon()"></v-btn>
              </div>
            </div>

            <div v-else class="d-flex align-center gap-2 mb-1">
              <v-text-field
                v-model="couponInput"
                :placeholder="$t('cart.couponPlaceholder')"
                density="compact"
                variant="outlined"
                hide-details
                rounded="lg"
                prepend-inner-icon="mdi-ticket-outline"
                @keyup.enter="handleApplyCoupon"
              ></v-text-field>
              <v-btn
                color="secondary"
                variant="flat"
                :loading="applyingCoupon"
                :disabled="!couponInput.trim()"
                rounded="lg"
                class="text-none font-weight-bold"
                @click="handleApplyCoupon"
              >
                {{ $t('cart.applyCoupon') }}
              </v-btn>
            </div>
            <div v-if="couponError" class="text-caption text-error mb-2">{{ couponError }}</div>
          </div>

          <div class="d-flex justify-space-between align-center mb-6">
            <span class="text-subtitle-1 font-weight-bold text-white">{{ $t('cart.totalToPay') }}</span>
            <span class="text-h5 font-weight-black text-primary">{{ cartStore.grandTotal.toFixed(2) }} {{ $t('common.currency') }}</span>
          </div>

          <v-btn
            color="primary"
            variant="flat"
            block
            size="large"
            to="/checkout"
            class="text-none font-weight-bold py-3"
            rounded="lg"
            prepend-icon="mdi-credit-card-outline"
          >
            {{ $t('cart.proceedToCheckout') }}
          </v-btn>

          <v-sheet
            color="rgba(20, 184, 166, 0.08)"
            class="pa-3 rounded-lg border mt-3 text-caption text-grey-lighten-1 d-flex align-center justify-space-between flex-wrap gap-2"
            style="border-color: rgba(45, 212, 191, 0.25) !important;"
          >
            <div class="d-flex align-center">
              <v-icon icon="mdi-card-account-details-outline" color="primary" class="mr-2" size="20"></v-icon>
              <span>{{ $t('cart.userPanelPrompt') }}</span>
            </div>
            <v-btn
              size="x-small"
              variant="tonal"
              color="primary"
              to="/profile"
              class="text-none font-weight-bold ml-auto"
            >
              {{ $t('cart.userPanelLink') }}
            </v-btn>
          </v-sheet>

          <div class="text-caption text-grey text-center mt-3 d-flex align-center justify-center">
            <v-icon icon="mdi-shield-check" color="success" size="14" class="mr-1"></v-icon>
            {{ $t('cart.securityBadge') }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-sheet
      v-else
      color="surface"
      class="pa-12 text-center rounded-2xl border my-8"
    >
      <v-icon icon="mdi-cart-off" size="64" color="grey" class="mb-3"></v-icon>
      <div class="text-h6 font-weight-bold text-white mb-2">{{ $t('cart.emptyTitle') }}</div>
      <p class="text-body-2 text-grey mb-4">{{ $t('cart.emptyDesc') }}</p>
      <v-btn color="primary" variant="flat" to="/" rounded="lg" prepend-icon="mdi-arrow-left">
        {{ $t('cart.backToCatalog') }}
      </v-btn>
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCartStore } from '@/stores/cartStore';
import { useSignalRStore } from '@/stores/signalrStore';

const { t } = useI18n();
const cartStore = useCartStore();
const signalrStore = useSignalRStore();

const couponInput = ref('');
const applyingCoupon = ref(false);
const couponError = ref('');

async function handleApplyCoupon() {
  if (!couponInput.value.trim()) return;
  applyingCoupon.value = true;
  couponError.value = '';
  try {
    const success = await cartStore.applyCoupon(couponInput.value.trim());
    if (success) {
      signalrStore.addNotification('success', t('cart.couponAppliedSuccess', { code: cartStore.couponCode }));
      couponInput.value = '';
    } else {
      couponError.value = t('errors.invalidCoupon');
    }
  } catch (err: any) {
    couponError.value = err.message || t('errors.invalidCoupon');
  } finally {
    applyingCoupon.value = false;
  }
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
