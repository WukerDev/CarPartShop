<template>
  <v-app>
    <Navbar />
    <v-main class="bg-background">
      <router-view />
    </v-main>
    <Footer />
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
  signalrStore.init();
});
</script>

<style>
body {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  background-color: #071314;
  color: #F0FDFA;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #071314;
}
::-webkit-scrollbar-thumb {
  background: #14272A;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #14B8A6;
}
</style>
