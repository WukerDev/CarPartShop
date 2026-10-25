<template>
  <v-dialog :model-value="modelValue" max-width="700" @update:model-value="$emit('update:modelValue', $event)">
    <v-card v-if="part" color="surface" class="rounded-xl pa-2" border>
      <v-card-title class="d-flex justify-space-between align-center px-4 pt-4">
        <div class="d-flex align-center">
          <v-chip color="primary" size="small" class="mr-2 font-weight-bold">{{ part.manufacturer }}</v-chip>
          <span class="text-caption text-secondary font-weight-bold">{{ $t('common.oem') }}: {{ part.partNumber }}</span>
        </div>
        <div class="d-flex align-center gap-1">
          <v-btn
            icon
            size="small"
            :variant="isWishlisted ? 'flat' : 'text'"
            :color="isWishlisted ? 'error' : 'grey-lighten-1'"
            @click="toggleWishlist"
          >
            <v-icon :icon="isWishlisted ? 'mdi-heart' : 'mdi-heart-outline'"></v-icon>
          </v-btn>
          <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('update:modelValue', false)"></v-btn>
        </div>
      </v-card-title>

      <v-card-text class="px-4">
        <v-row>
          <v-col cols="12" sm="5">
            <v-img
              :src="part.imageUrl"
              aspect-ratio="1"
              contain
              class="rounded-lg border w-100 bg-white pa-4"
              style="aspect-ratio: 1 / 1;"
            ></v-img>
          </v-col>

          <v-col cols="12" sm="7" class="d-flex flex-column justify-space-between">
            <div>
              <h2 class="text-h6 font-weight-bold text-white mb-2">{{ part.name }}</h2>
              <div class="d-flex align-center mb-3">
                <v-rating :model-value="part.rating" color="amber" density="compact" size="small" readonly half-increments></v-rating>
                <span class="text-caption text-grey ml-2 font-weight-bold">{{ part.rating.toFixed(1) }} / 5.0</span>
              </div>

              <div class="text-h5 font-weight-black text-primary mb-3">
                {{ part.price.toFixed(2) }} <span class="text-body-1 font-weight-normal">{{ $t('common.currency') }}</span>
              </div>

              <div class="d-flex align-center mb-2">
                <span class="text-caption text-grey mr-2">{{ $t('product.stockAvailability') }}</span>
                <v-chip :color="part.stockQuantity > 0 ? 'success' : 'error'" size="x-small" variant="flat">
                  {{ part.stockQuantity > 0 ? $t('product.stockAvailable', { count: part.stockQuantity }) : $t('product.outOfStock') }}
                </v-chip>
              </div>
            </div>

            <div class="d-flex align-center gap-3 pt-3">
              <v-text-field
                v-model.number="quantity"
                type="number"
                min="1"
                :max="part.stockQuantity"
                :label="$t('product.quantity')"
                density="compact"
                hide-details
                variant="outlined"
                style="max-width: 100px;"
                :disabled="part.stockQuantity <= 0"
              ></v-text-field>

              <v-btn
                color="primary"
                variant="flat"
                prepend-icon="mdi-cart-plus"
                :disabled="part.stockQuantity <= 0"
                class="flex-grow-1 text-none font-weight-bold"
                rounded="lg"
                @click="addToCart"
              >
                {{ $t('product.addToCart') }}
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <div>
          <h3 class="text-subtitle-2 font-weight-bold text-grey-lighten-1 mb-2">{{ $t('product.description') }}</h3>
          <p class="text-body-2 text-grey mb-4">{{ part.description }}</p>

          <h3 class="text-subtitle-2 font-weight-bold text-grey-lighten-1 mb-2">{{ $t('product.compatibility') }}</h3>
          <v-sheet color="surface-variant" class="pa-3 rounded-lg border mb-4">
            <div class="text-body-2 text-white">{{ part.compatibility }}</div>
          </v-sheet>

          <v-divider class="my-4"></v-divider>

          <div>
            <div class="d-flex align-center justify-space-between mb-3">
              <h3 class="text-subtitle-2 font-weight-bold text-grey-lighten-1">
                {{ $t('reviews.title') }} ({{ reviews.length }})
              </h3>
              <v-btn
                variant="tonal"
                color="primary"
                size="small"
                prepend-icon="mdi-comment-plus-outline"
                class="text-none"
                @click="showAddReview = !showAddReview"
              >
                {{ $t('reviews.addReviewBtn') }}
              </v-btn>
            </div>

            <v-expand-transition>
              <v-sheet v-if="showAddReview" color="surface-variant" class="pa-4 rounded-xl border mb-4">
                <div class="text-subtitle-2 font-weight-bold text-white mb-2">{{ $t('reviews.newReviewTitle') }}</div>
                <div class="d-flex align-center mb-3">
                  <span class="text-caption text-grey mr-2">{{ $t('reviews.ratingLabel') }}:</span>
                  <v-rating v-model="newRating" color="amber" density="compact" size="small" hover></v-rating>
                </div>
                <v-text-field
                  v-model="newAuthor"
                  :label="$t('reviews.authorLabel')"
                  density="compact"
                  variant="outlined"
                  class="mb-2"
                ></v-text-field>
                <v-textarea
                  v-model="newComment"
                  :label="$t('reviews.commentLabel')"
                  density="compact"
                  variant="outlined"
                  rows="2"
                  class="mb-3"
                ></v-textarea>
                <div class="d-flex justify-end gap-2">
                  <v-btn variant="text" size="small" @click="showAddReview = false">{{ $t('common.cancel') }}</v-btn>
                  <v-btn
                    color="primary"
                    variant="flat"
                    size="small"
                    :loading="submittingReview"
                    :disabled="!newComment.trim()"
                    @click="submitReview"
                  >
                    {{ $t('reviews.submitBtn') }}
                  </v-btn>
                </div>
              </v-sheet>
            </v-expand-transition>

            <div v-if="loadingReviews" class="text-center py-4">
              <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
            </div>

            <div v-else-if="reviews.length > 0" class="d-flex flex-column gap-2">
              <v-sheet
                v-for="rev in reviews"
                :key="rev.id"
                color="#071314"
                class="pa-3 rounded-lg border text-left"
              >
                <div class="d-flex justify-space-between align-center mb-1">
                  <div class="d-flex align-center">
                    <span class="text-subtitle-2 font-weight-bold text-white mr-2">{{ rev.authorName }}</span>
                    <v-rating :model-value="rev.rating" color="amber" density="compact" size="x-small" readonly></v-rating>
                  </div>
                  <span class="text-caption text-grey">{{ formatDate(rev.createdAt) }}</span>
                </div>
                <p class="text-caption text-grey-lighten-2 mb-0">{{ rev.comment }}</p>
              </v-sheet>
            </div>

            <div v-else class="text-caption text-grey text-center py-2">
              {{ $t('reviews.noReviewsYet') }}
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { CarPart, ProductReview } from '@/types';
import { useCartStore } from '@/stores/cartStore';
import { useSignalRStore } from '@/stores/signalrStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/services/api';

const props = defineProps<{
  modelValue: boolean;
  part: CarPart | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const { t } = useI18n();
const cartStore = useCartStore();
const signalrStore = useSignalRStore();
const wishlistStore = useWishlistStore();
const authStore = useAuthStore();

const quantity = ref(1);
const reviews = ref<ProductReview[]>([]);
const loadingReviews = ref(false);
const showAddReview = ref(false);
const submittingReview = ref(false);
const newRating = ref(5);
const newAuthor = ref(authStore.userName || 'Klient');
const newComment = ref('');

const isWishlisted = computed(() => props.part ? wishlistStore.hasItem(props.part.id) : false);

watch(() => props.part, async (newPart) => {
  quantity.value = 1;
  showAddReview.value = false;
  newAuthor.value = authStore.userName || 'Klient';
  newComment.value = '';
  newRating.value = 5;
  if (newPart) {
    loadingReviews.value = true;
    try {
      reviews.value = await api.getPartReviews(newPart.id);
    } catch {
      reviews.value = [];
    } finally {
      loadingReviews.value = false;
    }
  } else {
    reviews.value = [];
  }
}, { immediate: true });

function toggleWishlist() {
  if (!props.part) return;
  const added = wishlistStore.toggle(props.part);
  signalrStore.addNotification(
    'info',
    added
      ? t('wishlist.addedToast', { name: props.part.name })
      : t('wishlist.removedToast', { name: props.part.name })
  );
}

async function submitReview() {
  if (!props.part || !newComment.value.trim()) return;
  submittingReview.value = true;
  try {
    const res = await api.addPartReview(props.part.id, newAuthor.value.trim() || 'Klient', newRating.value, newComment.value.trim());
    reviews.value.unshift({
      id: res.id,
      carPartId: props.part.id,
      authorName: res.authorName,
      rating: res.rating,
      comment: res.comment,
      createdAt: res.createdAt
    });
    if (res.updatedPartRating) {
      props.part.rating = res.updatedPartRating;
    }
    showAddReview.value = false;
    newComment.value = '';
    signalrStore.addNotification('success', t('reviews.reviewAddedSuccess'));
  } catch (err: any) {
    signalrStore.addNotification('error', err.message || t('errors.generalError'));
  } finally {
    submittingReview.value = false;
  }
}

function formatDate(iso: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString();
}

function addToCart() {
  if (!props.part) return;
  cartStore.addItem(props.part, quantity.value);
  signalrStore.addNotification('success', t('notifications.addedToCartCount', { count: quantity.value, name: props.part.name }));
  emit('update:modelValue', false);
}
</script>

<style scoped>
.gap-3 {
  gap: 12px;
}
</style>
