<script setup>
import { computed } from 'vue';
import { Loader2, AlertTriangle, Info } from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    default: 'Are you sure you want to perform this action?'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  type: {
    type: String,
    default: 'danger', // 'danger', 'warning', 'info'
    validator: (value) => ['danger', 'warning', 'info'].includes(value)
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'confirm']);

// Computed styles based on type
const iconStyle = computed(() => {
  if (props.type === 'danger') return 'bg-rose-100 text-rose-600';
  if (props.type === 'warning') return 'bg-amber-100 text-amber-600';
  return 'bg-blue-100 text-blue-600';
});

const buttonStyle = computed(() => {
  if (props.type === 'danger') return 'bg-rose-500 hover:bg-rose-600 text-white focus:ring-rose-500';
  if (props.type === 'warning') return 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500';
  return 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500';
});
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
    aria-modal="true">
    <!-- Backdrop overlay -->
    <div class="fixed inset-0 bg-black/10 bg-opacity-100 transition-opacity backdrop-blur-sm"
      @click="!isLoading && emit('close')" aria-hidden="true"></div>

    <!-- Modal Panel -->
    <div class="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div
        class="relative transform overflow-hidden rounded-lg bg-card text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-border"
        @click.stop>
        <div class="bg-card px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <!-- Icon -->
            <div class="mx-auto flex h-12 w-12  items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10"
              :class="iconStyle">
              <AlertTriangle v-if="type === 'danger' || type === 'warning'" class="h-6 w-6" aria-hidden="true" />
              <Info v-else class="h-6 w-6" aria-hidden="true" />
            </div>

            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 class="text-lg font-semibold leading-6 text-foreground" id="modal-title">
                {{ title }}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-muted-foreground whitespace-pre-wrap">
                  {{ message }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-muted px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button type="button"
            class="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:ml-3 sm:w-auto transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="[buttonStyle, isLoading ? 'opacity-70 cursor-not-allowed' : '']" @click="emit('confirm')"
            :disabled="isLoading">
            <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
            {{ confirmText }}
          </button>
          <button type="button"
            class="mt-3 inline-flex w-full justify-center rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-secondary sm:mt-0 sm:w-auto transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            @click="emit('close')" :disabled="isLoading">
            {{ cancelText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
