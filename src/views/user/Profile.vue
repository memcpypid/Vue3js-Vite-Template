<script setup>
import { useAuthStore } from '../../stores/auth';
const authStore = useAuthStore();
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight text-foreground">My Profile</h1>
      <p class="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
    </div>

    <div class="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
      <div class="p-6 sm:p-8 space-y-6">
        <div class="flex items-center gap-6">
          <div class="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl font-bold border border-primary/20">
            {{ authStore.user?.name?.charAt(0) || 'U' }}
          </div>
          <div>
            <h2 class="text-xl font-semibold text-foreground">{{ authStore.user?.name }}</h2>
            <p class="text-muted-foreground">{{ authStore.user?.email }}</p>
            <span class="inline-block mt-2 px-2.5 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-md border border-border capitalize">
              Role: {{ authStore.user?.role }}
            </span>
          </div>
        </div>

        <div class="border-t border-border pt-6">
          <h3 class="text-lg font-medium text-foreground mb-4">Personal Information</h3>
          <form class="space-y-4" @submit.prevent>
            <div class="grid gap-2">
              <label class="text-sm font-medium text-foreground">Full Name</label>
              <input type="text" :value="authStore.user?.name" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" readonly />
            </div>
            <div class="grid gap-2">
              <label class="text-sm font-medium text-foreground">Email</label>
              <input type="email" :value="authStore.user?.email" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" readonly />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
