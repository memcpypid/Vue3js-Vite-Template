<script setup>
import { useAuthStore } from '../stores/auth';
import { useThemeStore } from '../stores/theme';
import { LogOut, Sun, Moon, Home, User as UserIcon } from 'lucide-vue-next';

const authStore = useAuthStore();
const themeStore = useThemeStore();

const logout = () => {
  authStore.logout();
};
</script>

<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
    <!-- Navbar -->
    <header
      class="h-16 bg-card border-b border-border shadow-sm flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-6">
        <h2 class="text-xl font-bold tracking-tight text-primary">Vue App</h2>
        <nav class="hidden md:flex gap-4">
          <router-link to="/user/dashboard" class="text-sm font-medium hover:text-primary transition-colors"
            active-class="text-primary">Dashboard</router-link>
          <router-link to="/user/profile" class="text-sm font-medium hover:text-primary transition-colors"
            active-class="text-primary">Profile</router-link>
        </nav>
      </div>

      <div class="flex items-center gap-4">
        <button @click="themeStore.toggleDark()" class="p-2 rounded-full hover:bg-secondary transition-colors">
          <Moon v-if="!themeStore.isDark" class="w-5 h-5 text-foreground" />
          <Sun v-else class="w-5 h-5 text-yellow-400" />
        </button>
        <div class="h-8 w-px bg-border"></div>
        <div class="flex items-center gap-3">
          <div class="text-sm text-right hidden sm:block">
            <p class="font-medium truncate max-w-[120px]">{{ authStore.user?.name }}</p>
          </div>
          <button @click="logout"
            class="p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 rounded-full transition-colors"
            title="Logout">
            <LogOut class="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>

    <!-- Page Content -->
    <main class="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <router-view />
    </main>
  </div>
</template>
