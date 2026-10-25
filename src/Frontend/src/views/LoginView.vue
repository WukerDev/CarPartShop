<template>
  <v-container class="py-12 d-flex justify-center">
    <v-card color="surface" max-width="480" width="100%" class="rounded-2xl pa-6 border" elevation="8">
      <div class="text-center mb-6">
        <v-avatar color="primary" size="56" class="mb-3 elevation-2">
          <v-icon icon="mdi-shield-lock-outline" color="white" size="32"></v-icon>
        </v-avatar>
        <h1 class="text-h5 font-weight-black text-white">{{ $t('login.title') }}</h1>
        <p class="text-caption text-grey mt-1">
          {{ $t('login.subtitle') }}
        </p>
      </div>

      <v-sheet color="rgba(20, 184, 166, 0.1)" class="pa-4 rounded-xl border mb-6 text-left" style="border-color: rgba(20, 184, 166, 0.3) !important;">
        <div class="d-flex align-center justify-space-between mb-2">
          <div class="d-flex align-center">
            <v-icon icon="mdi-account-star" color="primary" class="mr-2"></v-icon>
            <span class="text-subtitle-2 font-weight-bold text-white">{{ $t('login.adminAccount') }}</span>
          </div>
          <v-chip size="x-small" color="primary" variant="flat">{{ $t('login.defaultBadge') }}</v-chip>
        </div>
        <p class="text-caption text-grey-lighten-1 mb-3">
          {{ $t('login.loginPrefix') }} <strong class="text-white">admin</strong> | {{ $t('login.passwordPrefix') }} <strong class="text-white">admin</strong>
        </p>
        <v-btn
          color="primary"
          variant="flat"
          block
          size="small"
          rounded="lg"
          prepend-icon="mdi-flash"
          class="text-none font-weight-bold"
          :loading="authStore.loading"
          @click="quickLoginAdmin"
        >
          {{ $t('login.quickLoginBtn') }}
        </v-btn>
      </v-sheet>

      <v-form @submit.prevent="onLogin">
        <v-text-field
          v-model="username"
          :label="$t('login.usernameLabel')"
          placeholder="admin"
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
          density="compact"
          class="mb-3"
          :rules="[v => !!v || t('login.usernameRequired')]"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :label="$t('login.passwordLabel')"
          placeholder="••••••••"
          type="password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          density="compact"
          class="mb-4"
          :rules="[v => !!v || t('login.passwordRequired')]"
        ></v-text-field>

        <div v-if="authStore.error" class="text-caption text-error font-weight-bold mb-3 text-center">
          {{ authStore.error }}
        </div>

        <v-btn
          type="submit"
          color="secondary"
          variant="flat"
          block
          size="large"
          class="text-none font-weight-bold mb-4"
          rounded="lg"
          prepend-icon="mdi-login"
          :loading="authStore.loading"
        >
          {{ $t('login.submitBtn') }}
        </v-btn>

        <div class="text-center text-caption text-grey">
          {{ $t('login.jwtNotice', { realm: 'carpartshop' }) }}
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/authStore';
import { useSignalRStore } from '@/stores/signalrStore';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const authStore = useAuthStore();
const signalrStore = useSignalRStore();

const username = ref('admin');
const password = ref('admin');

async function quickLoginAdmin() {
  username.value = 'admin';
  password.value = 'admin';
  await onLogin();
}

async function onLogin() {
  const success = await authStore.login(username.value, password.value);
  if (success) {
    signalrStore.addNotification('success', t('notifications.loginSuccess', { name: authStore.userName }));
    const redirectPath = (route.query.redirect as string) || '/';
    router.push(redirectPath);
  }
}
</script>
