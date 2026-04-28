<script setup>
import { computed } from 'vue';
import { formatIDR, parseCurrency } from '../../utils/formatCurrency';

const props = defineProps({
  label: {
    type: String,
    required: false
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substr(2, 9)}`
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

// Handle currency formatting
const displayValue = computed(() => {
  if (props.type === 'currency') {
    return formatIDR(props.modelValue);
  }
  return props.modelValue;
});

const handleInput = (event) => {
  let val = event.target.value;

  if (props.type === 'currency') {
    val = parseCurrency(val);
    // Emit as number
    emit('update:modelValue', val);
  } else if (props.type === 'number') {
    emit('update:modelValue', val === '' ? '' : Number(val));
  } else {
    emit('update:modelValue', val);
  }
};
</script>

<template>
  <div class="space-y-2 mb-4">
    <label v-if="label"
      class="block text-xs font-heading font-black tracking-widest uppercase text-muted-foreground transition-colors group-focus-within:text-primary">
      {{ label }} <span v-if="required" class="text-rose-500">*</span>
    </label>
    <div class="relative group">
      <input :id="id" :type="type === 'currency' ? 'text' : type" :value="displayValue" :disabled="disabled"
        @input="handleInput" :placeholder="placeholder"
        class="w-full px-5 py-4 bg-muted border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all duration-300 outline-none text-sm placeholder:text-muted-foreground/50 border-2 border-transparent focus:border-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[
          { 'border-rose-500/50 bg-rose-50/50 dark:bg-rose-950/20': error },
          $slots.iconRight ? 'pr-14' : ''
        ]" />
      <!-- Icon Right Slot -->
      <div v-if="$slots.iconRight" class="absolute inset-y-0 right-0 flex items-center pr-5 z-10">
        <slot name="iconRight"></slot>
      </div>
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