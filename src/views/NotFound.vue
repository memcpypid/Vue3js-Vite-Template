<script setup>
import BaseButton from '@/components/ui/BaseButton.vue';
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background text-foreground flex-col p-6 text-center">
    <h1 class="text-8xl font-black text-primary mb-4 drop-shadow-sm">404</h1>
    <h2 class="text-2xl font-bold mb-4 tracking-tight">Page Not Found</h2>
    <p class="text-muted-foreground mb-10 max-w-md font-medium">
      The page you are looking for doesn't exist or has been moved to another location.
    </p>
    <BaseButton to="/" variant="primary" size="lg" class="px-8 rounded-2xl shadow-lg shadow-primary/20">
      Go back home
    </BaseButton>
  </div>
</template>
