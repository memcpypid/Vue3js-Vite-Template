<script setup>
import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';
import { LogOut, Sun, Moon, LayoutDashboard, Settings, Users, Menu } from 'lucide-vue-next';

const authStore = useAuthStore();
const themeStore = useThemeStore();

const logout = () => {
  authStore.logout();
};
</script>

<template>
  <div class="min-h-screen bg-background text-foreground flex transition-colors duration-300">
    <!-- Sidebar -->
    <aside class="w-64 bg-card border-r border-border hidden md:flex flex-col">
      <div class="p-6">
        <h2 class="text-2xl font-bold text-primary">Admin Panel</h2>
      </div>
      <nav class="flex-1 px-4 space-y-2">
        <router-link to="/admin/dashboard"
          class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary hover:text-primary transition-colors"
          active-class="bg-secondary text-primary font-medium">
          <LayoutDashboard class="w-5 h-5" /> Dashboard
        </router-link>
        <router-link to="/admin/users"
          class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary hover:text-primary transition-colors"
          active-class="bg-secondary text-primary font-medium">
          <Users class="w-5 h-5" /> Users
        </router-link>
        <router-link to="/admin/settings"
          class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary hover:text-primary transition-colors"
          active-class="bg-secondary text-primary font-medium">
          <Settings class="w-5 h-5" /> Settings
        </router-link>
      </nav>
      <div class="p-4 border-t border-border">
        <div class="text-sm text-muted-foreground mb-4 px-2">
          Logged in as <br><span class="font-semibold text-foreground">{{ authStore.user?.name }}</span>
        </div>
        <button @click="logout"
          class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
          <LogOut class="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Navbar -->
      <header class="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6">
        <button class="md:hidden p-2 rounded-lg hover:bg-secondary text-foreground">
          <Menu class="w-6 h-6" />
        </button>
        <div class="flex-1"></div>
        <button @click="themeStore.toggleDark()" class="p-2 rounded-full hover:bg-secondary transition-colors">
          <Moon v-if="!themeStore.isDark" class="w-5 h-5 text-foreground" />
          <Sun v-else class="w-5 h-5 text-yellow-400" />
        </button>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
