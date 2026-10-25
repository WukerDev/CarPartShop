<template>
  <v-app-bar color="#0D191B" elevation="3" class="px-3" border="b">
    <v-container class="d-flex align-center py-0" fluid>
      <v-btn
        icon="mdi-menu"
        variant="text"
        class="d-flex d-md-none mr-2"
        @click="drawer = !drawer"
      ></v-btn>

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
          prepend-icon="mdi-card-account-details-outline"
          to="/profile"
          class="text-none font-weight-bold text-primary"
        >
          {{ $t('navbar.userPanel') }}
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
        <v-btn
          variant="text"
          prepend-icon="mdi-heart-outline"
          to="/wishlist"
          class="text-none"
        >
          {{ $t('navbar.wishlist') }}
        </v-btn>
      </div>

      <v-spacer></v-spacer>

      <div class="d-none d-sm-flex align-center mr-4" style="flex: 1; max-width: 440px;">
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
        to="/wishlist"
        class="mr-1"
        :title="$t('navbar.wishlist')"
      >
        <v-badge
          :content="wishlistStore.count"
          :model-value="wishlistStore.count > 0"
          color="pink-darken-1"
          overlap
        >
          <v-icon icon="mdi-heart-outline"></v-icon>
        </v-badge>
      </v-btn>

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
        <v-btn
          variant="tonal"
          color="primary"
          to="/profile"
          class="text-none mr-2 font-weight-bold d-none d-lg-flex align-center"
          rounded="lg"
        >
          <v-icon icon="mdi-card-account-details-outline" start></v-icon>
          <span>{{ $t('navbar.userPanel') }}</span>
        </v-btn>

        <v-menu location="bottom end">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              variant="flat"
              color="#14272A"
              rounded="pill"
              class="text-none border px-3"
              style="border-color: rgba(45, 212, 191, 0.3) !important;"
            >
              <v-avatar size="24" color="primary" class="mr-2">
                <v-icon icon="mdi-account" size="16" color="white"></v-icon>
              </v-avatar>
              <div class="d-none d-md-flex flex-column text-left mr-1" style="line-height: 1.1;">
                <span class="text-caption font-weight-bold text-white">{{ authStore.userName }}</span>
                <span class="text-primary font-weight-bold" style="font-size: 9px !important; text-transform: uppercase;">
                  {{ authStore.isAdmin ? $t('navbar.adminRole') : $t('navbar.clientRole') }}
                </span>
              </div>
              <v-icon icon="mdi-chevron-down" size="16" class="text-grey ml-1"></v-icon>
            </v-btn>
          </template>

          <v-list bg-color="#14272A" elevation="6" rounded="xl" min-width="240" class="border py-2" style="border-color: rgba(45, 212, 191, 0.25) !important;">
            <v-list-item class="mb-1">
              <template #prepend>
                <v-avatar color="primary" size="36">
                  <v-icon icon="mdi-account" color="white" size="22"></v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold text-white">{{ authStore.userName }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption text-primary">
                {{ authStore.isAdmin ? $t('navbar.adminRole') : $t('navbar.clientRole') }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-divider class="my-1 border-opacity-25"></v-divider>
            <v-list-item
              to="/profile"
              prepend-icon="mdi-card-account-details-outline"
              class="rounded-lg ma-1 bg-surface-variant font-weight-bold text-primary"
            >
              <v-list-item-title class="font-weight-bold">{{ $t('navbar.userPanel') }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption text-grey">{{ $t('navbar.userPanelSub') }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item to="/orders" prepend-icon="mdi-package-variant" class="rounded-lg ma-1">
              <v-list-item-title>{{ $t('navbar.orderHistory') }}</v-list-item-title>
            </v-list-item>
            <v-list-item to="/returns" prepend-icon="mdi-keyboard-return" class="rounded-lg ma-1">
              <v-list-item-title>{{ $t('navbar.reportedReturns') }}</v-list-item-title>
            </v-list-item>
            <v-list-item to="/wishlist" prepend-icon="mdi-heart-outline" class="rounded-lg ma-1">
              <v-list-item-title>{{ $t('navbar.wishlist') }}</v-list-item-title>
            </v-list-item>
            <v-divider class="my-1 border-opacity-25"></v-divider>
            <v-list-item prepend-icon="mdi-logout" class="rounded-lg ma-1" @click="handleLogout">
              <v-list-item-title class="text-error font-weight-bold">{{ $t('navbar.logout') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-else>
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
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    temporary
    location="left"
    color="#0D191B"
    class="border-r"
  >
    <div class="pa-4 border-b d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-avatar color="primary" size="32" class="mr-2">
          <v-icon icon="mdi-car-turbocharger" color="white" size="20"></v-icon>
        </v-avatar>
        <span class="text-subtitle-1 font-weight-bold text-white">
          {{ $t('common.brand') }}<span class="text-primary">{{ $t('common.brandSuffix') }}</span>
        </span>
      </div>
      <v-btn icon="mdi-close" variant="text" size="small" @click="drawer = false"></v-btn>
    </div>

    <v-list nav class="pa-3">
      <v-list-item
        to="/"
        prepend-icon="mdi-view-grid-outline"
        rounded="lg"
        @click="drawer = false"
      >
        <v-list-item-title class="font-weight-medium">{{ $t('navbar.catalog') }}</v-list-item-title>
      </v-list-item>

      <v-list-item
        to="/profile"
        prepend-icon="mdi-card-account-details-outline"
        rounded="lg"
        class="bg-surface-variant my-1"
        color="primary"
        @click="drawer = false"
      >
        <v-list-item-title class="font-weight-bold text-primary">{{ $t('navbar.userPanel') }}</v-list-item-title>
        <v-list-item-subtitle class="text-caption text-grey">{{ $t('navbar.userPanelSub') }}</v-list-item-subtitle>
      </v-list-item>

      <v-list-item
        to="/orders"
        prepend-icon="mdi-history"
        rounded="lg"
        @click="drawer = false"
      >
        <v-list-item-title class="font-weight-medium">{{ $t('navbar.orders') }}</v-list-item-title>
      </v-list-item>

      <v-list-item
        to="/returns"
        prepend-icon="mdi-keyboard-return"
        rounded="lg"
        @click="drawer = false"
      >
        <v-list-item-title class="font-weight-medium">{{ $t('navbar.returns') }}</v-list-item-title>
      </v-list-item>

      <v-list-item
        to="/wishlist"
        prepend-icon="mdi-heart-outline"
        rounded="lg"
        @click="drawer = false"
      >
        <v-list-item-title class="font-weight-medium">{{ $t('navbar.wishlist') }}</v-list-item-title>
        <template #append>
          <v-chip v-if="wishlistStore.count > 0" size="x-small" color="pink-darken-1" variant="flat">
            {{ wishlistStore.count }}
          </v-chip>
        </template>
      </v-list-item>

      <v-list-item
        to="/cart"
        prepend-icon="mdi-cart-outline"
        rounded="lg"
        @click="drawer = false"
      >
        <v-list-item-title class="font-weight-medium">{{ $t('cart.title') }}</v-list-item-title>
        <template #append>
          <v-chip v-if="cartStore.itemCount > 0" size="x-small" color="primary" variant="flat">
            {{ cartStore.itemCount }}
          </v-chip>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { useCatalogStore } from '@/stores/catalogStore';
import { useWishlistStore } from '@/stores/wishlistStore';

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();
const catalogStore = useCatalogStore();
const wishlistStore = useWishlistStore();
const { locale } = useI18n();

const drawer = ref(false);

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

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
