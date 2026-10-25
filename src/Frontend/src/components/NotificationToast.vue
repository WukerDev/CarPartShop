<template>
  <v-snackbar
    :model-value="!!signalrStore.activeToast"
    :color="toastColor"
    location="top right"
    timeout="4000"
    rounded="lg"
    elevation="6"
    @update:model-value="onModelChange"
  >
    <div class="d-flex align-center">
      <v-icon :icon="toastIcon" size="20" class="mr-2"></v-icon>
      <span class="text-body-2 font-weight-medium">{{ signalrStore.activeToast?.message }}</span>
    </div>

    <template #actions>
      <v-btn icon="mdi-close" variant="text" size="small" @click="signalrStore.clearToast()"></v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSignalRStore } from '@/stores/signalrStore';

const signalrStore = useSignalRStore();

const toastColor = computed(() => {
  switch (signalrStore.activeToast?.type) {
    case 'success': return 'success';
    case 'warning': return 'warning';
    case 'error': return 'error';
    default: return 'info';
  }
});

const toastIcon = computed(() => {
  switch (signalrStore.activeToast?.type) {
    case 'success': return 'mdi-check-circle-outline';
    case 'warning': return 'mdi-alert-circle-outline';
    case 'error': return 'mdi-close-circle-outline';
    default: return 'mdi-information-outline';
  }
});

function onModelChange(val: boolean) {
  if (!val) {
    signalrStore.clearToast();
  }
}
</script>
