import { defineStore } from 'pinia';
import { useDark, useToggle } from '@vueuse/core';
import { getCookie, setCookie } from '@/utils/cookie';
import { watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
  });

  const toggleDark = useToggle(isDark);

  // Initialize theme from cookies for SSR sync
  const initFromCookies = (cookies = '') => {
    const theme = getCookie('vueuse-color-scheme', cookies);
    if (theme) {
      isDark.value = theme === 'dark';
    }
  };

  // Watch for changes and sync to cookie (for SSR to read next time)
  watch(isDark, (val) => {
    if (typeof document !== 'undefined') {
      setCookie('vueuse-color-scheme', val ? 'dark' : 'light', 365);
    }
  }, { immediate: true });

  return {
    isDark,
    toggleDark,
    initFromCookies
  };
});
