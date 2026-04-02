<script setup>
import { useAuthStore } from '../../stores/auth';
const authStore = useAuthStore();
</script>

<template>
  <div class="space-y-6">
    <div class="bg-card border border-border rounded-2xl p-8 shadow-sm">
      <h1 class="text-3xl font-bold text-foreground">Welcome back, {{ authStore.user?.name }}!</h1>
      <p class="text-muted-foreground mt-2">Here is a quick overview of your account.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-card border border-border p-6 rounded-2xl shadow-sm">
        <h2 class="text-xl font-semibold text-foreground mb-4">Recent Notifications</h2>
        <ul class="space-y-3">
          <li class="flex items-center gap-3 p-3 bg-secondary rounded-lg text-secondary-foreground">
            <div class="w-2 h-2 bg-primary rounded-full"></div>
            <span class="text-sm">Welcome to our platform! Start exploring.</span>
          </li>
        </ul>
      </div>

      <div class="bg-card border border-border p-6 rounded-2xl shadow-sm">
        <h2 class="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div class="flex gap-4">
          <router-link to="/user/profile" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
            Edit Profile
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
