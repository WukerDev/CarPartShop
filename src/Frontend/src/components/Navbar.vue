<template>
  <v-app-bar color="#0D191B" elevation="3" class="px-3" border="b">
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

      <div class="d-none d-sm-flex align-center mr-4" style="flex: 1; max-width: 480px;">
        <v-text-field
          v-model="catalogStore.searchQuery"
          :placeholder="$t('navbar.searchPlaceholder')"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          density="comfortable"
          hide-details
          rounded="lg"
          bg-color="#14272A"
          class="w-100"
          clearable
          @update:model-value="onSearch"
          @keyup.enter="onSearch"
        >
          <template #append-inner>
            <v-btn
              color="primary"
              variant="flat"
              size="default"
              class="font-weight-bold text-none px-4"
              rounded="md"
              elevation="1"
              @click="onSearch"
            >
              <v-icon icon="mdi-magnify" start></v-icon>
              {{ $t('navbar.searchButton') }}
            </v-btn>
          </template>
        </v-text-field>
      </div>

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
        <v-list bg-color="#14272A" elevation="4" rounded="lg">
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

      <v-btn
        icon
        variant="text"
        to="/cart"
        class="mr-2"
      >
        <v-badge
          :content="cartStore.itemCount"
          :model-value="cartStore.itemCount > 0"
          color="primary"
          overlap
        >
          <v-icon icon="mdi-cart-outline"></v-icon>
        </v-badge>
      </v-btn>

      <template v-if="authStore.isAuthenticated">
        <v-menu location="bottom end">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              variant="tonal"
              color="primary"
              rounded="pill"
              class="text-none"
            >
              <v-avatar size="24" color="primary" class="mr-2">
                <v-icon icon="mdi-account" size="16"></v-icon>
              </v-avatar>
              <span class="d-none d-md-inline">{{ authStore.userName }}</span>
            </v-btn>
          </template>

          <v-list bg-color="#14272A" elevation="4" rounded="lg" min-width="200">
            <v-list-item>
              <v-list-item-title class="font-weight-bold">{{ authStore.userName }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption text-primary">
                {{ authStore.isAdmin ? $t('navbar.adminRole') : $t('navbar.clientRole') }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-divider class="my-1"></v-divider>
            <v-list-item to="/orders" prepend-icon="mdi-package-variant">
              <v-list-item-title>{{ $t('navbar.orderHistory') }}</v-list-item-title>
            </v-list-item>
            <v-list-item to="/returns" prepend-icon="mdi-keyboard-return">
              <v-list-item-title>{{ $t('navbar.reportedReturns') }}</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-database-refresh" @click="confirmSeedOpen = true">
              <v-list-item-title class="text-teal-accent-3">{{ $t('navbar.seedDatabase') }}</v-list-item-title>
            </v-list-item>
            <v-divider class="my-1"></v-divider>
            <v-list-item prepend-icon="mdi-logout" @click="authStore.logout()">
              <v-list-item-title class="text-error">{{ $t('navbar.logout') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-else>
        <v-btn
          variant="text"
          size="small"
          color="secondary"
          class="mr-2 text-none d-none d-sm-flex"
          prepend-icon="mdi-database-refresh"
          @click="confirmSeedOpen = true"
        >
          {{ $t('navbar.seedDatabase') }}
        </v-btn>

        <v-btn
          color="primary"
          variant="flat"
          to="/login"
          prepend-icon="mdi-login"
          rounded="lg"
          class="text-none font-weight-bold"
        >
          {{ $t('navbar.login') }}
        </v-btn>
      </template>
    </v-container>

    <v-dialog v-model="confirmSeedOpen" max-width="480">
      <v-card color="#14272A" class="rounded-xl border pa-2">
        <v-card-title class="d-flex align-center text-white">
          <v-icon icon="mdi-database-refresh" color="primary" class="mr-2"></v-icon>
          <span>{{ $t('navbar.seedDatabase') }}</span>
        </v-card-title>
        <v-card-text class="text-grey-lighten-2">
          {{ $t('navbar.seedConfirm') }}
        </v-card-text>
        <v-card-actions class="d-flex justify-end gap-2 px-4 pb-3">
          <v-btn variant="text" :disabled="seeding" @click="confirmSeedOpen = false">
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="seeding"
            rounded="lg"
            @click="handleSeedDatabase"
          >
            {{ $t('common.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { useCatalogStore } from '@/stores/catalogStore';
import { useSignalRStore } from '@/stores/signalrStore';
import { api } from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();
const catalogStore = useCatalogStore();
const signalrStore = useSignalRStore();
const { locale, t } = useI18n();

const confirmSeedOpen = ref(false);
const seeding = ref(false);

const currentLocale = computed(() => locale.value);
const currentLocaleLabel = computed(() => locale.value === 'pl' ? 'PL' : 'EN');

function switchLanguage(lang: 'pl' | 'en') {
  locale.value = lang;
  localStorage.setItem('user_language', lang);
}

function onSearch() {
  if (router.currentRoute.value.path !== '/') {
    router.push('/');
  }
}

async function handleSeedDatabase() {
  seeding.value = true;
  try {
    const res = await api.seedDatabase(true);
    confirmSeedOpen.value = false;
    await catalogStore.fetchCategories();
    await catalogStore.fetchParts();
    signalrStore.addNotification('success', res.message || t('navbar.seedSuccess'));
  } catch (err: any) {
    signalrStore.addNotification('error', err.message || t('errors.generalError'));
  } finally {
    seeding.value = false;
  }
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
