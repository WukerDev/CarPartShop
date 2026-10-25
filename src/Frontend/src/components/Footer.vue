<template>
  <v-footer color="#071314" border="t" class="py-6 mt-12">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <div class="d-flex align-center mb-3">
            <v-icon icon="mdi-car-turbocharger" color="primary" class="mr-2"></v-icon>
            <span class="text-h6 font-weight-bold text-white">{{ $t('common.brand') }} {{ $t('common.brandSuffix') }}</span>
          </div>
          <p class="text-body-2 text-grey">
            {{ $t('footer.about') }}
          </p>
          <div class="d-flex mt-3">
            <v-chip size="small" color="primary" variant="outlined" class="mr-2">{{ $t('footer.badges.warranty') }}</v-chip>
            <v-chip size="small" color="secondary" variant="outlined" class="mr-2">{{ $t('footer.badges.shipping') }}</v-chip>
            <v-chip size="small" color="success" variant="outlined">{{ $t('footer.badges.easyReturns') }}</v-chip>
          </div>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <div class="text-subtitle-1 font-weight-bold text-white mb-2">{{ $t('footer.categoriesTitle') }}</div>
          <div class="d-flex flex-column gap-1 text-caption text-grey">
            <span class="cursor-pointer hover-text">{{ $t('footer.categories.brakes') }}</span>
            <span class="cursor-pointer hover-text">{{ $t('footer.categories.suspension') }}</span>
            <span class="cursor-pointer hover-text">{{ $t('footer.categories.filters') }}</span>
            <span class="cursor-pointer hover-text">{{ $t('footer.categories.engine') }}</span>
            <span class="cursor-pointer hover-text">{{ $t('footer.categories.ignition') }}</span>
          </div>
        </v-col>

        <v-col cols="12" sm="6" md="2">
          <div class="text-subtitle-1 font-weight-bold text-white mb-2">{{ $t('footer.accountTitle') }}</div>
          <div class="d-flex flex-column gap-1 text-caption text-grey">
            <router-link to="/profile" class="text-decoration-none text-primary font-weight-bold hover-text d-flex align-center">
              <v-icon icon="mdi-card-account-details-outline" size="14" class="mr-1"></v-icon>
              {{ $t('footer.account.profile') }}
            </router-link>
            <router-link to="/orders" class="text-decoration-none text-grey hover-text">
              {{ $t('footer.account.orders') }}
            </router-link>
            <router-link to="/returns" class="text-decoration-none text-grey hover-text">
              {{ $t('footer.account.returns') }}
            </router-link>
            <router-link to="/wishlist" class="text-decoration-none text-grey hover-text">
              {{ $t('footer.account.wishlist') }}
            </router-link>
          </div>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <div class="text-subtitle-1 font-weight-bold text-white mb-2">{{ $t('footer.contactTitle') }}</div>
          <div class="text-body-2 text-grey mb-1">
            <v-icon icon="mdi-phone" size="18" class="mr-1"></v-icon>
            {{ $t('footer.helpline') }}
          </div>
          <div class="text-body-2 text-grey mb-1">
            <v-icon icon="mdi-email" size="18" class="mr-1"></v-icon>
            {{ $t('footer.email') }}
          </div>
          <div class="text-body-2 text-grey">
            <v-icon icon="mdi-clock-outline" size="18" class="mr-1"></v-icon>
            {{ $t('footer.hours') }}
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-6 border-opacity-25"></v-divider>

      <div class="text-center text-caption text-grey">
        <span>{{ $t('footer.copyright') }}</span>
      </div>
    </v-container>
  </v-footer>
</template>

<style scoped>
.gap-1 {
  gap: 6px;
}
.hover-text:hover {
  color: #fff !important;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
