<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppLogo from '@/components/ui/AppLogo.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { useSidebarStore } from '@/stores/sidebar';
import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';
import {
  LogOut, Sun, Moon, LayoutDashboard, Settings, Users,
  Menu, Newspaper, ClipboardList, Ticket,
  History, X, ChevronRight, Contact,
  Trophy,
  User
} from 'lucide-vue-next';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const sidebarStore = useSidebarStore();
const route = useRoute();

const logout = () => {
  authStore.logout();
};

const menuGroups = [
  {
    title: 'Utama',
    items: [
      { name: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Users', to: '/admin/users', icon: Users },

    ]
  },
  {
    title: 'Sistem',
    items: [
      { name: 'Pengaturan', to: '/admin/settings', icon: User },
    ]
  }
];

const currentPageTitle = computed(() => {
  const currentPath = route.path;
  for (const group of menuGroups) {
    const item = group.items.find(i => i.to === currentPath);
    if (item) return item.name;
  }
  return 'Admin Panel';
});
</script>

<template>
  <div class="min-h-screen bg-background text-foreground flex transition-colors duration-500 overflow-hidden font-body">
    <!-- Mobile Backdrop -->
    <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="sidebarStore.isOpen" @click="sidebarStore.toggle"
        class="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"></div>
    </transition>

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 bg-card border-r border-border transition-all duration-700 ease-spring overflow-hidden flex flex-col shadow-2xl"
      :class="[
        sidebarStore.isOpen ? 'w-72 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0 shadow-none'
      ]">

      <!-- Sidebar Header -->
      <div class="h-20 flex items-center px-6 border-b border-border/50 gap-3 bg-secondary/10 overflow-hidden shrink-0">
        <div class="flex items-center gap-3 shrink-0">
          <AppLogo size="sm" :scale="80" routing="/admin/dashboard" :glow="true" />
          <div class="flex flex-col transition-all duration-500"
            :class="[sidebarStore.isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none absolute']">
            <span
              class="text-sm font-black tracking-tighter text-foreground leading-tight uppercase whitespace-nowrap font-heading">Admin
              Panel</span>
            <span class="text-[10px] text-primary font-bold tracking-widest uppercase whitespace-nowrap">E-Votes
              System</span>
          </div>
        </div>
        <button @click="sidebarStore.toggle"
          class="md:hidden ml-auto p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-all">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-8 space-y-8 overflow-y-auto custom-scrollbar overflow-x-hidden">
        <div v-for="group in menuGroups" :key="group.title" class="space-y-2">
          <h3
            class="px-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 pb-2 flex items-center gap-2 transition-all duration-500"
            :class="[sidebarStore.isOpen ? 'opacity-100' : 'opacity-0']">
            <span v-if="sidebarStore.isOpen" class="whitespace-nowrap">{{ group.title }}</span>
            <span class="grow h-px bg-border/40"></span>
          </h3>
          <div class="space-y-1">
            <router-link v-for="item in group.items" :key="item.name" :to="item.to" @click="sidebarStore.closeOnMobile"
              class="group flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-primary/5 hover:text-primary transition-all duration-300 relative overflow-hidden"
              :class="[sidebarStore.isOpen ? 'justify-start' : 'justify-center']"
              active-class="bg-primary/10 text-primary font-black shadow-inner shadow-primary/5"
              :title="!sidebarStore.isOpen ? item.name : ''">

              <div class="relative z-10 flex items-center gap-3 w-full"
                :class="[sidebarStore.isOpen ? '' : 'justify-center']">
                <component :is="item.icon" class="w-5 h-5 shrink-0 transition-all duration-300"
                  :class="[sidebarStore.isOpen ? 'opacity-70 group-hover:opacity-100 group-hover:scale-110' : 'opacity-100 scale-110']" />
                <span
                  class="text-[10px] font-heading font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap"
                  :class="[sidebarStore.isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 absolute pointer-events-none']">
                  {{ item.name }}
                </span>
                <ChevronRight v-if="sidebarStore.isOpen"
                  class="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>

              <!-- Tooltip for Collapsed Mode -->
              <div v-if="!sidebarStore.isOpen"
                class="fixed left-24 px-3 py-2 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[100] whitespace-nowrap shadow-2xl border border-border/20">
                {{ item.name }}
              </div>
            </router-link>
          </div>
        </div>
      </nav>

      <!-- Sidebar Footer (Profile) -->
      <div class="p-4 border-t border-border bg-secondary/5 shrink-0 overflow-hidden">
        <div
          class="p-3 bg-secondary/30 rounded-2xl border border-border/50 mb-4 flex items-center gap-3 transition-all duration-300"
          :class="[sidebarStore.isOpen ? '' : 'justify-center bg-transparent border-transparent px-0']">
          <div
            class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm font-black uppercase shadow-inner shrink-0 border border-primary/20">
            {{ authStore.user?.name?.charAt(0) }}
          </div>
          <div class="flex flex-col min-w-0 transition-all duration-500"
            :class="[sidebarStore.isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50 absolute pointer-events-none']">
            <span class="text-[10px] font-black font-heading text-foreground uppercase tracking-wider truncate">{{
              authStore.user?.name }}</span>
            <span
              class="text-[9px] text-muted-foreground uppercase font-black tracking-[0.2em] whitespace-nowrap">Administrator</span>
          </div>
        </div>
        <BaseButton @click="logout" variant="bordeaux" size="md" fullWidth
          :title="!sidebarStore.isOpen ? 'Keluar' : ''">
          <template #iconLeft>
            <LogOut class="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-1" />
          </template>
          <span
            class="transition-all duration-500 whitespace-nowrap font-heading font-black text-[10px] uppercase tracking-widest"
            :class="[sidebarStore.isOpen ? 'opacity-100' : 'opacity-0 absolute pointer-events-none']">
            Keluar
          </span>
        </BaseButton>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 transition-all duration-700 ease-spring relative"
      :class="[sidebarStore.isOpen ? 'md:ml-72' : 'ml-0 md:ml-20']">

      <!-- Top Navbar (Header) -->
      <header class="h-20 sticky top-0 z-40 transition-all duration-700">
        <div class="absolute inset-0 bg-card/80 backdrop-blur-md border-b border-border/50"></div>
        <div class="relative h-full px-8 flex items-center justify-between gap-4">
          <!-- Left: Toggle & Title -->
          <div class="flex items-center gap-6">
            <button @click="sidebarStore.toggle"
              class="w-11 h-11 flex items-center justify-center rounded-2xl bg-secondary/50 hover:bg-primary/10 hover:text-primary group transition-all duration-300 border border-border/50 active:scale-90 shadow-sm">
              <Menu v-if="!sidebarStore.isOpen"
                class="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <ChevronRight v-else class="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
            </button>

            <div
              class="hidden sm:flex items-center gap-4 text-sm text-muted-foreground font-medium transition-all duration-500"
              :class="[sidebarStore.isOpen ? 'translate-x-0 opacity-100' : 'md:translate-x-2 opacity-80']">
              <LayoutDashboard class="w-4 h-4 opacity-40" />
              <ChevronRight class="w-3.5 h-3.5 opacity-20" />
              <span class="font-heading font-black text-foreground uppercase tracking-[0.2em] text-[10px]">{{
                currentPageTitle }}</span>
            </div>

            <!-- Logo on Mobile Header -->
            <div class="sm:hidden flex items-center gap-3">
              <AppLogo size="sm" routing="/admin/dashboard" :scale="60" />
              <span class="text-[10px] font-black uppercase tracking-widest font-heading">Admin</span>
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex items-center gap-4">
            <div class="hidden lg:flex flex-col items-end mr-4">
              <span class="text-[8px] font-black uppercase tracking-[0.3em] text-primary mb-1 animate-pulse">System
                Online</span>
              <span class="text-[10px] font-black font-heading text-muted-foreground uppercase tracking-widest">
                {{ new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' }) }}
              </span>
            </div>

            <button @click="themeStore.toggleDark()"
              class="w-11 h-11 flex items-center justify-center rounded-2xl hover:bg-secondary transition-all hover:scale-110 active:scale-95 bg-secondary/40 border border-border/50 shadow-sm">
              <Moon v-if="!themeStore.isDark" class="w-5 h-5 text-foreground transition-all duration-500 rotate-12" />
              <Sun v-else class="w-5 h-5 text-yellow-400 transition-all duration-500 animate-spin-slow" />
            </button>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main class="flex-1 overflow-y-auto scroll-smooth custom-scrollbar bg-background/50 relative">
        <!-- Background Decoration -->
        <div
          class="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none">
        </div>

        <div class="p-8 md:p-10 lg:p-12 max-w-7xl mx-auto relative z-10">
          <router-view v-slot="{ Component }">
            <transition name="fade-page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.ease-spring {
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 10px;
}

.animate-spin-slow {
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.glass {
  background: rgba(var(--card), 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
