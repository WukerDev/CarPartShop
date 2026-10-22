<template>
  <v-app>
    <!-- Navbar -->
    <Navbar />

    <!-- Main Content -->
    <v-main class="bg-background">
      <router-view />
    </v-main>

    <!-- Global Footer -->
    <Footer />

    <!-- Real-time SignalR notifications toast -->
    <NotificationToast />
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import NotificationToast from '@/components/NotificationToast.vue';
import { useSignalRStore } from '@/stores/signalrStore';

const signalrStore = useSignalRStore();

onMounted(() => {
  // Initialize real-time connection
  signalrStore.init();
});
</script>

<style>
body {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  background-color: #0B0F19;
  color: #F3F4F6;
}

/* Custom scrollbars */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #0B0F19;
}
::-webkit-scrollbar-thumb {
  background: #1F2937;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #374151;
}
</style>
