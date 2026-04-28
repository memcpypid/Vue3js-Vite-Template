import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSidebarStore = defineStore('sidebar', () => {
  const isOpen = ref(true);

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  const closeOnMobile = () => {
    if (window.innerWidth < 768) {
      isOpen.value = false;
    }
  };

  return {
    isOpen,
    toggle,
    closeOnMobile
  };
});
