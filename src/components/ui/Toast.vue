<script setup>
import { computed } from 'vue';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X
} from 'lucide-vue-next';

const props = defineProps({
  toast: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

const icon = computed(() => {
  switch (props.toast.type) {
    case 'success': return CheckCircle2;
    case 'error': return AlertCircle;
    case 'warning': return AlertTriangle;
    default: return Info;
  }
});

const styles = computed(() => {
  switch (props.toast.type) {
    case 'success':
      return {
        container: 'bg-emerald-50/90 border-emerald-200/50 text-emerald-900 shadow-emerald-500/10 dark:bg-emerald-950/40 dark:border-emerald-500/20 dark:text-emerald-50',
        accent: 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]',
        icon: 'text-emerald-500'
      };
    case 'error':
      return {
        container: 'bg-rose-50/90 border-rose-200/50 text-rose-900 shadow-rose-500/10 dark:bg-rose-950/40 dark:border-rose-500/20 dark:text-rose-50',
        accent: 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]',
        icon: 'text-rose-500'
      };
    case 'warning':
      return {
        container: 'bg-amber-50/90 border-amber-200/50 text-amber-900 shadow-amber-500/10 dark:bg-amber-950/40 dark:border-amber-500/20 dark:text-amber-50',
        accent: 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]',
        icon: 'text-amber-500'
      };
    default:
      return {
        container: 'bg-blue-50/90 border-blue-200/50 text-blue-900 shadow-blue-500/10 dark:bg-blue-950/40 dark:border-blue-500/20 dark:text-blue-50',
        accent: 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]',
        icon: 'text-blue-500'
      };
  }
});
</script>

<template>
  <div
    class="relative flex items-center gap-4 p-4 pr-12 rounded-2xl border backdrop-blur-md shadow-2xl max-w-sm w-full pointer-events-auto overflow-hidden transition-all duration-500 group"
    :class="styles.container">
    <!-- Side Accent Bar -->
    <div class="absolute left-0 top-0 bottom-0 w-1.5 transition-transform duration-500 group-hover:scale-y-110"
      :class="styles.accent"></div>

    <!-- Icon Section -->
    <div
      class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/40 dark:bg-black/20 shrink-0 shadow-inner">
      <component :is="icon" class="w-6 h-6" :class="styles.icon" />
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-0.5">
      <p class="text-[10px] font-heading font-black uppercase tracking-[0.2em] opacity-40">Notifikasi</p>
      <span class="text-sm font-heading font-bold leading-tight tracking-tight">{{ toast.message }}</span>
    </div>

    <!-- Close Button -->
    <button @click="emit('close')"
      class="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300">
      <X class="w-4 h-4 opacity-40 group-hover:opacity-100" />
    </button>
  </div>
</template>