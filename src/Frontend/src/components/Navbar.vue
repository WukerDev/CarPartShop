<template>
  <v-app-bar color="#111827" elevation="3" class="px-3" border="b">
    <v-container class="d-flex align-center py-0" fluid>
      <!-- Logo -->
      <router-link to="/" class="d-flex align-center text-decoration-none mr-6">
        <v-avatar color="primary" size="40" class="mr-2 elevation-2">
          <v-icon icon="mdi-car-turbocharger" color="white" size="24"></v-icon>
        </v-avatar>
        <div class="d-flex flex-column">
          <span class="text-h6 font-weight-bold text-white tracking-wide" style="line-height: 1.1;">
            AUTOPARTS<span class="text-primary font-weight-black">PRO</span>
          </span>
          <span class="text-caption text-grey-lighten-1" style="font-size: 10px !important;">
            Oryginalne części i zamienniki OEM
          </span>
        </div>
      </router-link>

      <!-- Category quick buttons -->
      <div class="d-none d-md-flex align-center mr-4">
        <v-btn
          variant="text"
          prepend-icon="mdi-view-grid-outline"
          to="/"
          class="text-none"
        >
          Katalog
        </v-btn>
        <v-btn
          variant="text"
          prepend-icon="mdi-history"
          to="/orders"
          class="text-none"
        >
          Moje Zamówienia
        </v-btn>
        <v-btn
          variant="text"
          prepend-icon="mdi-keyboard-return"
          to="/returns"
          class="text-none"
        >
          Zwroty
        </v-btn>
      </div>

      <v-spacer></v-spacer>

      <!-- Search bar -->
      <v-text-field
        v-model="catalogStore.searchQuery"
        placeholder="Szukaj po nazwie, nr OEM (np. BRE, BOS), marce..."
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

      <!-- Real-time SignalR indicator -->
      <v-tooltip location="bottom" text="Połączenie SignalR w czasie rzeczywistym aktywne">
        <template #activator="{ props }">
          <v-chip
            v-bind="props"
            size="small"
            color="success"
            variant="tonal"
            class="mr-3 d-none d-lg-flex"
            prepend-icon="mdi-circle-medium"
          >
            Live Hub
          </v-chip>
        </template>
      </v-tooltip>

      <!-- Cart Icon with badge -->
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

      <!-- User Profile Menu -->
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
            <span class="d-none d-sm-inline">{{ authStore.userName }}</span>
          </v-btn>
        </template>

        <v-list bg-color="#1F2937" elevation="4" rounded="lg" min-width="200">
          <v-list-item v-if="authStore.isAuthenticated">
            <template #prepend>
              <v-icon icon="mdi-shield-account" color="primary"></v-icon>
            </template>
            <v-list-item-title class="font-weight-bold">{{ authStore.user?.username }}</v-list-item-title>
            <v-list-item-subtitle class="text-caption text-grey">
              {{ authStore.isAdmin ? 'Administrator sklepu' : 'Klient' }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-divider v-if="authStore.isAuthenticated"></v-divider>

          <v-list-item to="/orders" prepend-icon="mdi-package-variant-closed">
            Historia zamówień
          </v-list-item>

          <v-list-item to="/returns" prepend-icon="mdi-keyboard-return">
            Zgłoszone zwroty
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item
            v-if="authStore.isAuthenticated"
            prepend-icon="mdi-logout"
            color="error"
            @click="authStore.logout"
          >
            Wyloguj się
          </v-list-item>

          <v-list-item
            v-else
            to="/login"
            prepend-icon="mdi-login"
            color="primary"
          >
            Zaloguj się
          </v-list-item>
        </v-list>
      </v-menu>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useCatalogStore } from '@/stores/catalogStore';

const cartStore = useCartStore();
const authStore = useAuthStore();
const catalogStore = useCatalogStore();

function onSearch() {
  catalogStore.fetchParts();
}
</script>

<style scoped>
.tracking-wide {
  letter-spacing: 0.05em;
}
</style>
