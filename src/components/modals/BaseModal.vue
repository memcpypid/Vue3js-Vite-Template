<script setup>
import { onMounted, onUnmounted } from 'vue';
import { X } from 'lucide-vue-next';
import BaseButton from '../ui/BaseButton.vue';

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ''
    },
    size: {
        type: String,
        default: 'md',
        validator: (value) => ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl', '10xl'].includes(value)
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close', 'confirm']);

const close = () => {
    if (!props.loading) {
        emit('close');
    }
};

const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    '8xl': 'max-w-8xl',
    '9xl': 'max-w-9xl',
    '10xl': 'max-w-10xl',
};

// Handle Escape key
const handleEscape = (e) => {
    if (e.key === 'Escape' && props.show) {
        close();
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape);
});
</script>

<template>
    <Teleport to="body">
        <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="show"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <Transition enter-active-class="transition duration-300 ease-out"
                    enter-from-class="opacity-0 scale-95 translate-y-4"
                    enter-to-class="opacity-100 scale-100 translate-y-0"
                    leave-active-class="transition duration-200 ease-in"
                    leave-from-class="opacity-100 scale-100 translate-y-0"
                    leave-to-class="opacity-0 scale-95 translate-y-4">
                    <div class="w-full bg-card/95 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl relative"
                        :class="sizes[size]">
                        <!-- Header -->
                        <div class="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                            <h3 v-if="title" class="text-xl font-heading font-black tracking-tight text-primary">
                                {{ title }}
                            </h3>
                            <button @click="close"
                                class="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-primary"
                                :disabled="loading">
                                <X class="w-5 h-5" />
                            </button>
                        </div>

                        <!-- Content -->
                        <div class="px-8 py-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <slot></slot>
                        </div>

                        <!-- Footer -->
                        <div v-if="$slots.footer"
                            class="px-8 py-6 border-t border-white/5 bg-secondary/30 flex justify-end gap-3">
                            <slot name="footer"></slot>
                        </div>
                        <div v-else class="px-8 py-6 border-t border-white/5 bg-secondary/30 flex justify-end gap-3">
                            <BaseButton variant="ghost" @click="close" :disabled="loading">Batal</BaseButton>
                            <BaseButton variant="primary" @click="emit('confirm')" :loading="loading">Simpan
                            </BaseButton>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
@reference "../../style.css";

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-primary/20 rounded-full;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    @apply bg-primary/40;
}
</style>