<script setup>
import { useAuthStore } from '@/stores/auth';
import BaseCard from '@/components/ui/BaseCard.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

const authStore = useAuthStore();
</script>

<template>
  <div class="space-y-6">
    <BaseCard>
      <h1 class="text-3xl font-bold text-foreground">Welcome back, {{ authStore.user?.name }}!</h1>
      <p class="text-muted-foreground mt-2">Here is a quick overview of your account.</p>
    </BaseCard>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseCard>
        <template #header>
          <h2 class="text-xl font-semibold text-foreground">Recent Notifications</h2>
        </template>
        <ul class="space-y-3">
          <li class="flex items-center gap-3 p-3 bg-secondary rounded-xl text-secondary-foreground">
            <div class="w-2 h-2 bg-primary rounded-full"></div>
            <span class="text-sm">Welcome to our platform! Start exploring.</span>
          </li>
        </ul>
      </BaseCard>

      <BaseCard>
        <template #header>
          <h2 class="text-xl font-semibold text-foreground">Quick Actions</h2>
        </template>
        <div class="flex gap-4">
          <BaseButton to="/user/profile" variant="primary">
            Edit Profile
          </BaseButton>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
