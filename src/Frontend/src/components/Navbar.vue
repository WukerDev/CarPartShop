<template>
  <v-app-bar color="#111827" elevation="3" class="px-3" border="b">
    <v-container class="d-flex align-center py-0" fluid>
      <router-link to="/" class="d-flex align-center text-decoration-none mr-6">
        <v-avatar color="primary" size="40" class="mr-2 elevation-2">
          <v-icon icon="mdi-car-turbocharger" color="white" size="24"></v-icon>
        </v-avatar>
        <div class="d-flex flex-column">
          <span class="text-h6 font-weight-bold text-white tracking-wide" style="line-height: 1.1;">
            {{ $t('common.brand') }}<span class="text-primary font-weight-black">{{ $t('common.brandSuffix') }}</span>
          </span>
          <span class="text-caption text-grey-lighten-1" style="font-size: 10px !important;">
            {{ $t('navbar.subtitle') }}
          </span>
        </div>
      </router-link>

      <div class="d-none d-md-flex align-center mr-4">
        <v-btn
          variant="text"
          prepend-icon="mdi-view-grid-outline"
          to="/"
          class="text-none"
        >
          {{ $t('navbar.catalog') }}
        </v-btn>
        <v-btn
          variant="text"
          prepend-icon="mdi-history"
          to="/orders"
          class="text-none"
        >
          {{ $t('navbar.orders') }}
        </v-btn>
        <v-btn
          variant="text"
          prepend-icon="mdi-keyboard-return"
          to="/returns"
          class="text-none"
        >
          {{ $t('navbar.returns') }}
        </v-btn>
      </div>

      <v-spacer></v-spacer>

      <v-text-field
        v-model="catalogStore.searchQuery"
        :placeholder="$t('navbar.searchPlaceholder')"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        density="compact"
        hide-details
        rounded="lg"
        bg-color="#1F2937"
        class="d-none d-sm-flex mr-4"
        style="max-width: 320px;"
        clearable
        @update:model-value="onSearch"
      ></v-text-field>

      <v-tooltip location="bottom" :text="$t('navbar.liveHubTooltip')">
        <template #activator="{ props }">
          <v-chip
            v-bind="props"
            size="small"
            color="success"
            variant="tonal"
            class="mr-3 d-none d-lg-flex"
            prepend-icon="mdi-circle-medium"
          >
            {{ $t('navbar.liveHub') }}
          </v-chip>
        </template>
      </v-tooltip>

      <v-menu location="bottom end">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            size="small"
            class="text-none mr-2 font-weight-bold"
            rounded="lg"
          >
            <v-icon icon="mdi-translate" class="mr-1"></v-icon>
            <span>{{ currentLocaleLabel }}</span>
          </v-btn>
        </template>
        <v-list bg-color="#1F2937" elevation="4" rounded="lg">
          <v-list-item
            :active="currentLocale === 'pl'"
            @click="switchLanguage('pl')"
          >
            <v-list-item-title>🇵🇱 {{ $t('common.polish') }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            :active="currentLocale === 'en'"
            @click="switchLanguage('en')"
          >
            <v-list-item-title>🇬🇧 {{ $t('common.english') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn icon to="/cart" class="mr-2">
        <v-badge
          :content="cartStore.itemCount"
          :model-value="cartStore.itemCount > 0"
          color="primary"
          overlap
        >
          <v-icon icon="mdi-cart-outline" size="26"></v-icon>
        </v-badge>
      </v-btn>

      <v-menu location="bottom end">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="tonal"
            color="primary"
            class="text-none px-3"
            rounded="lg"
          >
            <v-icon icon="mdi-account-circle" class="mr-1"></v-icon>
            <span class="d-none d-sm-inline">{{ authStore.user?.username || $t('common.guest') }}</span>
          </v-btn>
        </template>

        <v-list bg-color="#1F2937" elevation="4" rounded="lg" min-width="200">
          <v-list-item v-if="authStore.isAuthenticated">
            <template #prepend>
              <v-icon icon="mdi-shield-account" color="primary"></v-icon>
            </template>
            <v-list-item-title class="font-weight-bold">{{ authStore.user?.username }}</v-list-item-title>
            <v-list-item-subtitle class="text-caption text-grey">
              {{ authStore.isAdmin ? $t('navbar.adminRole') : $t('navbar.clientRole') }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-divider v-if="authStore.isAuthenticated"></v-divider>

          <v-list-item to="/orders" prepend-icon="mdi-package-variant-closed">
            {{ $t('navbar.orderHistory') }}
          </v-list-item>

          <v-list-item to="/returns" prepend-icon="mdi-keyboard-return">
            {{ $t('navbar.reportedReturns') }}
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item prepend-icon="mdi-database-refresh" @click="confirmSeedDialog = true">
            {{ $t('navbar.seedDatabase') }}
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item
            v-if="authStore.isAuthenticated"
            prepend-icon="mdi-logout"
            color="error"
            @click="authStore.logout"
          >
            {{ $t('navbar.logout') }}
          </v-list-item>

          <v-list-item
            v-else
            to="/login"
            prepend-icon="mdi-login"
            color="primary"
          >
            {{ $t('navbar.login') }}
          </v-list-item>
        </v-list>
      </v-menu>
    </v-container>

    <v-dialog v-model="confirmSeedDialog" max-width="450">
      <v-card color="#1F2937" class="rounded-xl border border-grey-darken-3 pa-2">
        <v-card-title class="d-flex align-center font-weight-bold text-white">
          <v-icon icon="mdi-database-refresh" color="primary" class="mr-2"></v-icon>
          {{ $t('navbar.seedDatabase') }}
        </v-card-title>
        <v-card-text class="text-grey-lighten-1">
          {{ $t('navbar.seedConfirm') }}
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" :disabled="seedingLoading" @click="confirmSeedDialog = false">
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn color="primary" variant="flat" :loading="seedingLoading" @click="handleSeed">
            {{ $t('common.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useCatalogStore } from '@/stores/catalogStore';
import { useOrderStore } from '@/stores/orderStore';
import { api } from '@/services/api';
import { setLanguage } from '@/plugins/i18n';

const { locale } = useI18n();
const cartStore = useCartStore();
const authStore = useAuthStore();
const catalogStore = useCatalogStore();
const orderStore = useOrderStore();

const confirmSeedDialog = ref(false);
const seedingLoading = ref(false);

const currentLocale = computed(() => locale.value);
const currentLocaleLabel = computed(() => locale.value.toUpperCase());

function switchLanguage(lang: 'pl' | 'en') {
  setLanguage(lang);
}

function onSearch() {
  catalogStore.fetchParts();
}

async function handleSeed() {
  seedingLoading.value = true;
  try {
    await api.seedDatabase(true);
    await catalogStore.fetchCategories();
    await catalogStore.fetchParts();
    await orderStore.fetchOrders();
    confirmSeedDialog.value = false;
  } catch (err: any) {
    console.error(err);
  } finally {
    seedingLoading.value = false;
  }
}
</script>

<style scoped>
.tracking-wide {
  letter-spacing: 0.05em;
}
</style>
