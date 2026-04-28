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
    default: 'Konfirmasi Aksi'
  },
  message: {
    type: String,
    default: 'Apakah Anda yakin ingin melakukan aksi ini?'
  },
  confirmText: {
    type: String,
    default: 'Konfirmasi'
  },
  cancelText: {
    type: String,
    default: 'Batal'
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
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog"
      aria-modal="true">
      <!-- Backdrop overlay -->
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="!isLoading && emit('close')"
        aria-hidden="true"></div>

      <!-- Modal Panel -->
      <div class="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-[32px] bg-card text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-white/10"
          @click.stop>
          <div class="bg-card px-4 pb-4 pt-5 sm:p-8 sm:pb-6">
            <div class="sm:flex sm:items-start">
              <!-- Icon -->
              <div
                class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl sm:mx-0 sm:h-12 sm:w-12 shadow-inner"
                :class="iconStyle">
                <AlertTriangle v-if="type === 'danger' || type === 'warning'" class="h-6 w-6" aria-hidden="true" />
                <Info v-else class="h-6 w-6" aria-hidden="true" />
              </div>

              <div class="mt-3 text-center sm:ml-6 sm:mt-0 sm:text-left">
                <h3 class="text-xl font-heading font-black leading-6 text-foreground uppercase tracking-tight"
                  id="modal-title">
                  {{ title }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-muted-foreground font-body leading-relaxed">
                    {{ message }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="px-4 py-4 sm:flex sm:flex-row-reverse sm:px-8 border-t border-white/5 bg-secondary/30 gap-3">
            <button type="button"
              class="inline-flex w-full justify-center rounded-2xl px-6 py-3 text-sm font-black uppercase tracking-widest shadow-lg transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              :class="buttonStyle" @click="emit('confirm')" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
              {{ confirmText }}
            </button>
            <button type="button"
              class="mt-3 inline-flex w-full justify-center rounded-2xl bg-transparent px-6 py-3 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all sm:mt-0 sm:w-auto"
              @click="emit('close')" :disabled="isLoading">
              {{ cancelText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>