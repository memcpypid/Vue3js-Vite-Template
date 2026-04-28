<script setup>
import BaseSkeleton from './BaseSkeleton.vue';

defineProps({
  rows: {
    type: Number,
    default: 5
  },
  columns: {
    type: Number,
    default: 4
  }
});
</script>

<template>
  <div class="w-full overflow-hidden rounded-3xl border border-border/50 bg-card">
    <div class="animate-pulse">
      <!-- Table Header Skeleton -->
      <div class="grid grid-cols-4 gap-4 px-6 py-4 border-b border-border bg-secondary/30">
        <div v-for="c in columns" :key="c" class="h-3 bg-muted rounded-full w-24"></div>
      </div>
      
      <!-- Table Body Skeleton -->
      <div v-for="r in rows" :key="r" class="grid grid-cols-4 gap-4 px-6 py-6 border-b border-border/30 last:border-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-muted rounded-full shrink-0"></div>
          <div class="h-3 bg-muted rounded-full w-32"></div>
        </div>
        <div class="flex items-center">
          <div class="h-3 bg-muted rounded-full w-40"></div>
        </div>
        <div class="flex items-center">
          <div class="h-5 bg-muted rounded-full w-20"></div>
        </div>
        <div class="flex items-center justify-end">
          <div class="h-8 bg-muted rounded-xl w-24"></div>
        </div>
      </div>
    </div>
  </div>
</template>
