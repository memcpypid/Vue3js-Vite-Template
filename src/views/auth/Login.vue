<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useThemeStore } from '../../stores/theme';
import { Loader2, Sun, Moon } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const themeStore = useThemeStore();

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const loading = ref(false);

const handleLogin = async () => {
  errorMsg.value = '';
  // `loading` is preserved here for UI spin tracking, but store's loading is also available via `authStore.loading`
  loading.value = true;
  try {
    // Calling login, which propagates API call and sets state
    await authStore.login({ email: email.value, password: password.value });

    // Redirect logic utilizing the newly populated `authStore.user` state
    if (authStore.hasRole('admin')) {
      router.push('/admin/dashboard');
    } else {
      router.push('/user');
    }
  } catch (error) {
    // Display error message which might bubble from Axios/Service layer
    errorMsg.value = authStore.error || error.message || 'Login failed';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="relative">
    <button @click="themeStore.toggleDark()"
      class="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground">
      <Moon v-if="!themeStore.isDark" class="w-5 h-5" />
      <Sun v-else class="w-5 h-5 text-yellow-500" />
    </button>

    <div class="p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
        <p class="text-sm text-muted-foreground mt-2">Enter your credentials to access your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div v-if="errorMsg" class="p-3 text-sm bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg">
          {{ errorMsg }}
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium leading-none text-foreground" for="email">Email</label>
          <input id="email" v-model="email" type="email" required
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="admin@example.com or user@example.com" />
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium leading-none text-foreground" for="password">Password</label>
            <a href="#" class="text-sm text-primary hover:underline">Forgot password?</a>
          </div>
          <input id="password" v-model="password" type="password" required
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="password" />
        </div>

        <button type="submit" :disabled="loading"
          class="group relative overflow-hidden inline-flex items-center justify-center w-full rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary-hover h-10 py-2 px-4 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0">
          <span class="absolute inset-0 w-full h-full bg-white/10 group-hover:bg-transparent transition-colors"></span>
          <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin relative z-10" />
          <span class="relative z-10">{{ loading ? 'Signing in...' : 'Sign in' }}</span>
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?
        <router-link to="/register" class="font-medium text-primary hover:underline">Sign up</router-link>
      </div>

      <div class="mt-8 pt-6 border-t border-border">
        <p class="text-xs text-muted-foreground text-center mb-2">Demo Credentials</p>
        <div
          class="flex justify-center gap-4 text-xs font-mono bg-secondary p-3 rounded-lg overflow-x-auto text-secondary-foreground">
          <div>
            <b>Admin:</b><br />
            admin@example.com
          </div>
          <div>
            <b>User:</b><br />
            user@example.com
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
