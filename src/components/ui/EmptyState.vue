<script setup>
import BaseButton from './BaseButton.vue';

defineProps({
  title: {
    type: String,
    default: 'No data found'
  },
  description: {
    type: String,
    default: 'Try adjusting your search or filters to find what you are looking for.'
  },
  showAction: {
    type: Boolean,
    default: false
  },
  actionText: {
    type: String,
    default: 'Clear Filters'
  }
});

const emit = defineEmits(['action']);
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
    <div class="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-border/50">
      <slot name="icon">
        <div class="w-10 h-10 text-muted-foreground/30 flex items-center justify-center">
          <!-- Default fallback icon if no slot provided -->
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
      </slot>
    </div>
    <h3 class="text-lg font-black font-heading text-foreground uppercase tracking-wider mb-2">
      {{ title }}
    </h3>
    <p class="text-sm text-muted-foreground max-w-xs leading-relaxed mb-8 font-body">
      {{ description }}
    </p>
    <BaseButton 
      v-if="showAction" 
      variant="secondary" 
      size="sm" 
      @click="emit('action')"
    >
      {{ actionText }}
    </BaseButton>
  </div>
</template>
