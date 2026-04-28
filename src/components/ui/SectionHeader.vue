<script setup>
defineProps({
    badge: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    accent: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    align: {
        type: String,
        default: 'left',
        validator: (v) => ['left', 'center', 'right'].includes(v)
    }
});

const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto'
};
</script>

<template>
    <div :class="['flex flex-col mb-16 max-w-4xl', alignmentClasses[align]]">
        <h2
            class="text-[10px] md:text-[11px] font-heading font-black text-primary tracking-[0.3em] uppercase mb-4 animate-fade-in">
            {{ badge }}
        </h2>
        <h3 :class="[
            'font-heading font-black text-foreground tracking-tight leading-[1.1] mb-6 animate-fade-in',
            align === 'center' ? 'text-3xl md:text-5xl lg:text-6xl' : 'text-3xl md:text-5xl lg:text-6xl'
        ]">
            {{ title }}
            <br v-if="accent" />
            <span v-if="accent" class="text-gold-gradient italic">{{ accent }}</span>
        </h3>
        <p v-if="description" :class="[
            'text-muted-foreground text-sm md:text-base font-body italic opacity-90 dark:opacity-80 leading-relaxed border-primary/20 animate-fade-in',
            align === 'center' ? 'max-w-2xl mx-auto' : 'border-l-4 pl-8'
        ]">
            {{ description }}
        </p>
    </div>
</template>