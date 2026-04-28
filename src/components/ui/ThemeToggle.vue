<script setup>
import { Sun, Moon } from 'lucide-vue-next';
import { useThemeStore } from '../../stores/theme';

const themeStore = useThemeStore();

const props = defineProps({
    variant: {
        type: String,
        default: 'default',
        validator: (v) => ['default', 'transparent', 'ghost'].includes(v)
    }
});

const variants = {
    default: 'bg-secondary text-primary hover:bg-secondary/80',
    transparent: 'bg-transparent text-white hover:bg-white/10',
    ghost: 'bg-transparent text-muted-foreground hover:text-primary hover:bg-primary/5'
};
</script>

<template>
    <button @click="themeStore.toggleDark()" :class="[
        'cursor-pointer p-2.5 rounded-xl transition-all duration-500 group flex items-center justify-center border border-transparent',
        variants[variant]
    ]" :title="themeStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
        <Sun v-if="themeStore.isDark" class="w-5 h-5 transition-transform duration-700 group-hover:rotate-90" />
        <Moon v-else class="w-5 h-5 transition-transform duration-700 group-hover:-rotate-12" />
    </button>
</template>