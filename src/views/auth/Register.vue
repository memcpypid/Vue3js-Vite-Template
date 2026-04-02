<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useThemeStore } from '../../stores/theme';
import { Sun, Moon } from 'lucide-vue-next';

const router = useRouter();
const themeStore = useThemeStore();

const name = ref('');
const email = ref('');
const password = ref('');

const handleRegister = () => {
  // In a real app, you would register the user here.
  // For the demo, just redirect to login.
  alert('Registration successful! Please login.');
  router.push('/login');
};
</script>

<template>
  <div class="relative">
    <button @click="themeStore.toggleDark()" class="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground">
      <Moon v-if="!themeStore.isDark" class="w-5 h-5" />
      <Sun v-else class="w-5 h-5 text-yellow-500" />
    </button>

    <div class="p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold tracking-tight text-foreground">Create an account</h1>
        <p class="text-sm text-muted-foreground mt-2">Enter your details below to create your account</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none text-foreground" for="name">Full Name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            placeholder="John Doe"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium leading-none text-foreground" for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            placeholder="m@example.com"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium leading-none text-foreground" for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          />
        </div>

        <button
          type="submit"
          class="group relative overflow-hidden inline-flex items-center justify-center w-full rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary-hover h-10 py-2 px-4 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span class="absolute inset-0 w-full h-full bg-white/10 group-hover:bg-transparent transition-colors"></span>
          <span class="relative z-10">Create Account</span>
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? 
        <router-link to="/login" class="font-medium text-primary hover:underline">Sign in</router-link>
      </div>
    </div>
  </div>
</template>
