<template>
  <v-container class="py-6">
    <div class="d-flex align-center justify-space-between mb-6">
      <div class="d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" to="/" class="mr-2"></v-btn>
        <div>
          <h1 class="text-h5 font-weight-bold text-white d-flex align-center">
            <v-icon icon="mdi-heart" color="pink-darken-1" class="mr-2"></v-icon>
            {{ $t('wishlist.title') }}
            <v-chip size="small" color="primary" class="ml-3 font-weight-bold" variant="flat">
              {{ wishlistStore.count }}
            </v-chip>
          </h1>
          <span class="text-caption text-grey">{{ $t('wishlist.subtitle') }}</span>
        </div>
      </div>

      <v-btn
        v-if="wishlistStore.count > 0"
        variant="tonal"
        color="error"
        prepend-icon="mdi-delete-sweep-outline"
        size="small"
        rounded="lg"
        class="text-none"
        @click="wishlistStore.clear()"
      >
        {{ $t('wishlist.clearBtn') }}
      </v-btn>
    </div>

    <div v-if="wishlistStore.count > 0" class="wishlist-grid">
      <v-card
        v-for="part in wishlistStore.items"
        :key="part.id"
        color="surface"
        class="wishlist-card rounded-2xl pa-4 border d-flex flex-column justify-space-between"
        elevation="3"
      >
        <div>
          <div class="position-relative mb-3 image-box rounded-xl overflow-hidden cursor-pointer" @click="openDetails(part)">
            <v-img :src="part.imageUrl" aspect-ratio="1" cover class="w-100"></v-img>
            <v-chip size="x-small" color="primary" variant="flat" class="position-absolute top-0 left-0 ma-2 font-weight-bold">
              {{ part.manufacturer }}
            </v-chip>
            <v-btn
              icon="mdi-close"
              size="x-small"
              variant="flat"
              color="surface"
              class="position-absolute top-0 right-0 ma-2"
              @click.stop="wishlistStore.remove(part.id)"
            ></v-btn>
          </div>

          <div class="text-caption text-secondary font-weight-bold mb-1">
            {{ $t('common.oem') }}: {{ part.partNumber }}
          </div>
          <h3 class="text-subtitle-2 font-weight-bold text-white mb-2 line-clamp-2 cursor-pointer" @click="openDetails(part)">
            {{ part.name }}
          </h3>
          <div class="text-caption text-grey mb-3 text-truncate">
            {{ part.compatibility }}
          </div>
        </div>

        <div class="pt-3 border-t">
          <div class="d-flex justify-space-between align-center mb-3">
            <span class="text-caption text-grey">{{ $t('common.grossPrice') }}</span>
            <span class="text-h6 font-weight-black text-primary">
              {{ part.price.toFixed(2) }} <span class="text-body-2 font-weight-normal">{{ $t('common.currency') }}</span>
            </span>
          </div>

          <v-btn
            color="primary"
            variant="flat"
            block
            prepend-icon="mdi-cart-plus"
            :disabled="part.stockQuantity <= 0"
            rounded="lg"
            class="text-none font-weight-bold"
            @click="moveToCart(part)"
          >
            {{ $t('wishlist.moveToCart') }}
          </v-btn>
        </div>
      </v-card>
    </div>

    <v-sheet
      v-else
      color="surface"
      class="pa-12 text-center rounded-2xl border my-8"
    >
      <v-avatar color="#14272A" size="80" class="mb-4">
        <v-icon icon="mdi-heart-broken" size="40" color="grey"></v-icon>
      </v-avatar>
      <div class="text-h6 font-weight-bold text-white mb-2">{{ $t('wishlist.emptyTitle') }}</div>
      <p class="text-body-2 text-grey mb-6" style="max-width: 480px; margin: 0 auto;">
        {{ $t('wishlist.emptyDesc') }}
      </p>
      <v-btn color="primary" variant="flat" to="/" rounded="lg" prepend-icon="mdi-magnify">
        {{ $t('wishlist.browseCatalog') }}
      </v-btn>
    </v-sheet>

    <ProductDetailModal
      v-model="detailsOpen"
      :part="selectedPart"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { CarPart } from '@/types';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useCartStore } from '@/stores/cartStore';
import { useSignalRStore } from '@/stores/signalrStore';
import ProductDetailModal from '@/components/ProductDetailModal.vue';

const { t } = useI18n();
const wishlistStore = useWishlistStore();
const cartStore = useCartStore();
const signalrStore = useSignalRStore();

const detailsOpen = ref(false);
const selectedPart = ref<CarPart | null>(null);

function openDetails(part: CarPart) {
  selectedPart.value = part;
  detailsOpen.value = true;
}

function moveToCart(part: CarPart) {
  cartStore.addItem(part, 1);
  wishlistStore.remove(part.id);
  signalrStore.addNotification('success', t('notifications.addedToCart', { name: part.name }));
}
</script>

<style scoped>
.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.wishlist-card {
  border-color: rgba(45, 212, 191, 0.12) !important;
}

.image-box {
  background-color: #061012;
  aspect-ratio: 1 / 1;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 40px;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
