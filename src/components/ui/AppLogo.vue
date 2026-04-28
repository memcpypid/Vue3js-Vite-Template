<script setup>
defineProps({
  size: {
    type: String,
    default: 'md'
  },
  scale: {
    type: Number,
    default: 100
  },
  routing: {
    type: String,
    default: '/'
  },
  icon: {
    type: String,
    default: ''
  },
  glow: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <router-link :to="routing" class="flex items-center group">
    <div 
      class="relative flex items-center justify-center bg-primary rounded-xl overflow-hidden transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg"
      :style="{ width: size === 'sm' ? '32px' : '40px', height: size === 'sm' ? '32px' : '40px' }"
    >
      <div v-if="glow" class="absolute inset-0 bg-white/20 animate-pulse"></div>
      <img v-if="icon" :src="icon" class="w-full h-full object-cover" />
      <span v-else class="text-white font-black text-xl">P</span>
    </div>
  </router-link>
</template>
