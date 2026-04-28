<script setup>
import { onMounted } from 'vue';
import ToastContainer from './components/ui/ToastContainer.vue';
import { healthCheck } from './services/api';
onMounted(async () => {
  await healthCheck()
});
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-page" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <ToastContainer />
</template>