<script setup>
import { computed } from 'vue';
import { Loader2 } from 'lucide-vue-next';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost', 'danger', 'bordeaux', 'gold', 'glass', 'royal'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  href: {
    type: String,
    default: null
  },
  to: {
    type: [String, Object],
    default: null
  }
});

const variants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg shadow-primary/20',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border',
  outline: 'bg-transparent border border-input text-foreground hover:bg-secondary',
  ghost: 'bg-transparent hover:bg-secondary text-muted-foreground hover:text-foreground',
  danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20',
  bordeaux: 'bg-bordeaux-gradient text-white shadow-[0_15px_35px_rgba(128,0,32,0.3)] hover:shadow-[0_20px_45px_rgba(128,0,32,0.4)] border border-white/10 hover:-translate-y-1',
  gold: 'bg-gold-gradient text-[var(--gold-foreground)] shadow-[0_15px_35px_rgba(212,175,55,0.3)] hover:shadow-[0_20px_45px_rgba(212,175,55,0.4)] border border-white/20 hover:-translate-y-1',
  glass: 'glass-dark text-white border-white/20 hover:bg-black/50 hover:border-white/40',
  royal: 'bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-primary shadow-[0_0_20px_rgba(197,160,33,0.1)] hover:shadow-[0_0_30px_rgba(197,160,33,0.3)]'
};

const sizes = {
  xs: 'px-3 py-1 text-[10px] rounded-md tracking-wider',
  sm: 'px-4 py-1.5 text-[11px] rounded-lg tracking-wider',
  md: 'px-6 py-2.5 text-xs rounded-xl tracking-widest',
  lg: 'px-10 py-3.5 text-sm rounded-xl tracking-widest',
  xl: 'px-14 py-5 text-base rounded-2xl tracking-widest'
};

const buttonClasses = computed(() => {
  return [
    'cursor-pointer inline-flex items-center justify-center font-heading font-black uppercase transition-all duration-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none gap-3 select-none',
    variants[props.variant],
    sizes[props.size],
    props.fullWidth ? 'w-full' : '',
    props.loading ? 'cursor-wait' : ''
  ].join(' ');
});

const isLink = computed(() => !!props.to || !!props.href);
const componentType = computed(() => {
  if (props.to) return 'router-link';
  if (props.href) return 'a';
  return 'button';
});
</script>

<template>
  <component :is="componentType" :type="!isLink ? type : null" :to="to" :href="href" :class="buttonClasses"
    :disabled="(disabled || loading) && !isLink">
    <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
    <slot v-else name="iconLeft"></slot>
    <slot></slot>
    <slot v-if="!loading" name="iconRight"></slot>
  </component>
</template>