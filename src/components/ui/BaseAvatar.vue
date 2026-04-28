<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  src: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'primary', 'secondary', 'bordeaux'].includes(v)
  }
});

const initials = computed(() => {
  if (!props.name) return '?';
  return props.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
});

const sizeClasses = {
  xs: 'w-6 h-6 text-[8px]',
  sm: 'w-8 h-8 text-[10px]',
  md: 'w-10 h-10 text-xs',
  lg: 'w-14 h-14 text-sm',
  xl: 'w-20 h-20 text-base'
};

const variantClasses = {
  default: 'bg-secondary text-muted-foreground border-border',
  primary: 'bg-primary/10 text-primary border-primary/20',
  secondary: 'bg-accent/10 text-accent border-accent/20',
  bordeaux: 'bg-primary text-white border-transparent'
};
</script>

<template>
  <div 
    :class="[
      'inline-flex items-center justify-center rounded-2xl font-black uppercase tracking-wider border shadow-sm overflow-hidden shrink-0 transition-transform hover:scale-105',
      sizeClasses[size],
      variantClasses[variant]
    ]"
    :title="name"
  >
    <img v-if="src" :src="src" :alt="name" class="w-full h-full object-cover" />
    <span v-else>{{ initials }}</span>
  </div>
</template>
