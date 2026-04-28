<script setup>
import { ChevronRight } from 'lucide-vue-next';

defineProps({
  items: {
    type: Array,
    required: true,
    // Format: [{ label: 'Home', to: '/', hasIcon: true }, { label: 'Users', to: '/users' }]
  }
});
</script>

<template>
  <nav class="flex items-center space-x-2 text-[10px] font-heading font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-6">
    <div v-for="(item, index) in items" :key="index" class="flex items-center">
      <router-link 
        v-if="item.to && index < items.length - 1" 
        :to="item.to"
        class="flex items-center hover:text-primary transition-colors duration-300"
      >
        <slot v-if="item.hasIcon" name="icon" :item="item"></slot>
        {{ item.label }}
      </router-link>
      
      <span v-else class="flex items-center text-primary/80">
        <slot v-if="item.hasIcon" name="icon" :item="item"></slot>
        {{ item.label }}
      </span>

      <ChevronRight v-if="index < items.length - 1" class="w-3 h-3 mx-2 opacity-30" />
    </div>
  </nav>
</template>
