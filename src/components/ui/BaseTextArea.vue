<script setup>
const props = defineProps({
    label: {
        type: String,
        required: false
    },
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: ''
    },
    rows: {
        type: [String, Number],
        default: 4
    },
    error: {
        type: String,
        default: ''
    },
    required: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <div class="space-y-2 mb-4">
        <label v-if="label"
            class="block text-xs font-heading font-black tracking-widest uppercase text-muted-foreground transition-colors group-focus-within:text-primary">
            {{ label }} <span v-if="required" class="text-rose-500">*</span>
        </label>
        <div class="relative group">
            <textarea :value="modelValue" @input="emit('update:modelValue', $event.target.value)"
                :placeholder="placeholder" :rows="rows"
                class="w-full px-5 py-4 bg-muted border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all duration-300 outline-none text-sm placeholder:text-muted-foreground/50 border-2 border-transparent focus:border-primary/20 min-h-[120px] resize-y"
                :class="{ 'border-rose-500/50 bg-rose-50/50 dark:bg-rose-950/20': error }"></textarea>
            <div
                class="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
            </div>
        </div>
        <p v-if="error"
            class="text-[10px] font-heading font-black tracking-widest uppercase text-rose-500 mt-1 pl-2 animate-fade-in-up">
            {{ error }}
        </p>
    </div>
</template>