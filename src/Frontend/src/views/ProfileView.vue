<template>
  <v-container class="py-6">
    <div class="d-flex align-center justify-space-between mb-6">
      <div class="d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" to="/" class="mr-2"></v-btn>
        <div>
          <h1 class="text-h5 font-weight-bold text-white d-flex align-center">
            <v-icon icon="mdi-account-circle" color="primary" class="mr-2"></v-icon>
            {{ $t('profile.title') }}
          </h1>
          <span class="text-caption text-grey">{{ $t('profile.subtitle') }}</span>
        </div>
      </div>
    </div>

    <v-row>
      <v-col cols="12" md="4">
        <v-card color="surface" class="rounded-2xl pa-6 border mb-6 text-center" elevation="3">
          <v-avatar color="#14272A" size="84" class="mb-3 border" style="border-color: rgba(45, 212, 191, 0.4) !important;">
            <v-icon icon="mdi-account" color="primary" size="48"></v-icon>
          </v-avatar>

          <h2 class="text-h6 font-weight-bold text-white mb-1">{{ authStore.userName }}</h2>
          <div class="text-caption text-grey mb-3">{{ authStore.user?.email || 'admin@carpartshop.local' }}</div>

          <v-chip
            size="small"
            :color="authStore.isAdmin ? 'secondary' : 'primary'"
            variant="flat"
            class="font-weight-bold mb-4"
          >
            {{ authStore.isAdmin ? $t('navbar.adminRole') : $t('navbar.clientRole') }}
          </v-chip>

          <v-divider class="my-4"></v-divider>

          <div class="d-flex flex-column gap-2 text-left">
            <v-btn
              variant="tonal"
              color="surface-variant"
              to="/orders"
              class="d-flex justify-space-between text-none font-weight-bold px-4 py-2 rounded-xl text-white w-100"
              prepend-icon="mdi-history"
            >
              <span>{{ $t('profile.ordersStat') }}</span>
              <v-chip size="x-small" color="primary" variant="flat" class="font-weight-black ml-auto">
                {{ orderStore.orders.length }}
              </v-chip>
            </v-btn>

            <v-btn
              variant="tonal"
              color="surface-variant"
              to="/wishlist"
              class="d-flex justify-space-between text-none font-weight-bold px-4 py-2 rounded-xl text-white w-100"
              prepend-icon="mdi-heart-outline"
            >
              <span>{{ $t('profile.wishlistStat') }}</span>
              <v-chip size="x-small" color="pink-darken-1" variant="flat" class="font-weight-black ml-auto">
                {{ wishlistStore.count }}
              </v-chip>
            </v-btn>

            <v-btn
              variant="tonal"
              color="surface-variant"
              to="/returns"
              class="d-flex justify-space-between text-none font-weight-bold px-4 py-2 rounded-xl text-white w-100"
              prepend-icon="mdi-keyboard-return"
            >
              <span>{{ $t('profile.returnsStat') }}</span>
              <v-icon icon="mdi-chevron-right" size="18" class="ml-auto"></v-icon>
            </v-btn>
          </div>

          <div class="mt-6 pa-3 rounded-lg border bg-surface-variant text-caption text-grey d-flex align-center">
            <v-icon icon="mdi-shield-check" color="success" size="18" class="mr-2"></v-icon>
            <span>{{ $t('profile.authNotice') }}</span>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card color="surface" class="rounded-2xl pa-6 border" elevation="3">
          <div class="d-flex align-center justify-space-between mb-2">
            <h2 class="text-subtitle-1 font-weight-bold text-white d-flex align-center">
              <v-icon icon="mdi-truck-delivery-outline" color="primary" class="mr-2"></v-icon>
              {{ $t('profile.shippingCardTitle') }}
            </h2>

            <v-chip v-if="authStore.shippingProfile" size="x-small" color="success" variant="tonal" class="font-weight-bold">
              <v-icon icon="mdi-check-decagram" size="12" class="mr-1"></v-icon>
              {{ $t('checkout.savedAddressLoaded') }}
            </v-chip>
          </div>

          <p class="text-caption text-grey mb-6">
            {{ $t('profile.shippingCardDesc') }}
          </p>

          <v-form ref="formRef" @submit.prevent="saveProfile">
            <v-text-field
              v-model="form.customerName"
              :label="$t('profile.nameLabel')"
              placeholder="Jan Kowalski"
              variant="outlined"
              density="compact"
              class="mb-3"
              :rules="[v => !!v || t('profile.nameRequired')]"
            ></v-text-field>

            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.email"
                  :label="$t('profile.emailLabel')"
                  placeholder="jan.kowalski@example.com"
                  type="email"
                  variant="outlined"
                  density="compact"
                  class="mb-3"
                  :rules="[v => !!v || t('profile.emailRequired')]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.phone"
                  :label="$t('profile.phoneLabel')"
                  placeholder="+48 600 700 800"
                  variant="outlined"
                  density="compact"
                  class="mb-3"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-text-field
              v-model="form.shippingAddress"
              :label="$t('profile.addressLabel')"
              placeholder="ul. Główna 15/4, 00-001 Warszawa"
              variant="outlined"
              density="compact"
              class="mb-4"
              :rules="[v => !!v || t('profile.addressRequired')]"
            ></v-text-field>

            <div class="text-caption font-weight-bold text-white mb-2 d-flex align-center">
              <v-icon icon="mdi-truck-fast" color="primary" class="mr-2" size="16"></v-icon>
              {{ $t('profile.courierLabel') }}
            </div>

            <v-radio-group v-model="form.courierName" class="mb-6">
              <v-radio
                value="InPost Paczkomaty 24/7"
                :label="$t('profile.courierInPost')"
                color="primary"
              ></v-radio>
              <v-radio
                value="Kurier DPD 24h"
                :label="$t('profile.courierDpd')"
                color="primary"
              ></v-radio>
            </v-radio-group>

            <div class="d-flex flex-wrap gap-3">
              <v-btn
                color="primary"
                variant="flat"
                prepend-icon="mdi-content-save-check"
                rounded="lg"
                class="text-none font-weight-bold px-6 py-2"
                type="submit"
              >
                {{ $t('profile.saveBtn') }}
              </v-btn>

              <v-btn
                v-if="authStore.shippingProfile"
                variant="outlined"
                color="error"
                prepend-icon="mdi-trash-can-outline"
                rounded="lg"
                class="text-none px-4"
                @click="clearProfile"
              >
                {{ $t('profile.clearBtn') }}
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/authStore';
import { useOrderStore } from '@/stores/orderStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useSignalRStore } from '@/stores/signalrStore';

const { t } = useI18n();
const authStore = useAuthStore();
const orderStore = useOrderStore();
const wishlistStore = useWishlistStore();
const signalrStore = useSignalRStore();

const formRef = ref<any>(null);

const form = reactive({
  customerName: authStore.shippingProfile?.customerName || (authStore.user?.username === 'admin' ? t('checkout.defaultAdminName') : t('checkout.defaultCustomerName')),
  email: authStore.shippingProfile?.email || authStore.user?.email || 'admin@carpartshop.local',
  phone: authStore.shippingProfile?.phone || '+48 500 600 700',
  shippingAddress: authStore.shippingProfile?.shippingAddress || t('checkout.defaultAddress'),
  courierName: authStore.shippingProfile?.courierName || 'InPost Paczkomaty 24/7'
});

onMounted(async () => {
  if (orderStore.orders.length === 0) {
    await orderStore.fetchOrders(authStore.user?.username);
  }
});

async function saveProfile() {
  const valid = formRef.value ? (await formRef.value.validate()).valid : true;
  if (!valid) return;

  authStore.saveShippingProfile({
    customerName: form.customerName,
    email: form.email,
    phone: form.phone,
    shippingAddress: form.shippingAddress,
    courierName: form.courierName
  });

  signalrStore.addNotification('success', t('profile.savedSuccess'));
}

function clearProfile() {
  authStore.clearShippingProfile();
  form.customerName = authStore.user?.username === 'admin' ? t('checkout.defaultAdminName') : t('checkout.defaultCustomerName');
  form.email = authStore.user?.email || 'admin@carpartshop.local';
  form.phone = '+48 500 600 700';
  form.shippingAddress = t('checkout.defaultAddress');
  form.courierName = 'InPost Paczkomaty 24/7';
  signalrStore.addNotification('info', t('profile.clearedSuccess'));
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
.gap-3 {
  gap: 12px;
}
</style>
