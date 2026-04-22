<script setup>
import { ref, watch, computed } from 'vue';
import { Loader2, X } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';
import Select from '@/components/ui/Select.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  user: {
    type: Object,
    default: null // If null, mode is Create. If object, mode is Edit.
  }
});

const emit = defineEmits(['close', 'success']);
const authStore = useAuthStore();
const userStore = useUserStore();
const errorMsg = ref('');
const isSubmitting = computed(() => isEditMode.value ? userStore.loading.update : authStore.loading);

// Form Data
const formData = ref({
  name: '',
  email: '',
  password: '',
  role: 'user'
});

const isEditMode = computed(() => !!props.user);
const title = computed(() => isEditMode.value ? 'Edit User' : 'Create New User');
const submitText = computed(() => isEditMode.value ? 'Save Changes' : 'Create User');

// Watch for prop changes to populate form when editing
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    errorMsg.value = '';
    if (props.user) {
      formData.value = {
        name: props.user.name || '',
        email: props.user.email || '',
        password: '', // blank by default for edit
        role: props.user.role || 'user'
      };
    } else {
      // Reset for create
      formData.value = {
        name: '',
        email: '',
        password: '',
        role: 'user'
      };
    }
  }
});

const handleSubmit = async () => {
  errorMsg.value = '';

  if (!isEditMode.value && formData.value.password.length < 6) {
    errorMsg.value = 'Password must be at least 6 characters.';
    return;
  }

  if (isEditMode.value && formData.value.password && formData.value.password.length < 6) {
    errorMsg.value = 'Password must be at least 6 characters.';
    return;
  }

  try {
    if (isEditMode.value) {
      // Create a clean payload, omit password if blank
      const payload = {
        name: formData.value.name,
        email: formData.value.email,
        role: formData.value.role,
      };
      if (formData.value.password) {
        payload.password = formData.value.password;
      }

      await userStore.updateUser(props.user.id, payload);
    } else {
      // Create user using the auth register endpoints
      await authStore.register(formData.value);
    }

    emit('success');
    emit('close');
  } catch (err) {
    errorMsg.value = err.response?.data?.message || err.message || 'Operation failed';
  } finally {
    // loading managed by stores
  }
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
    aria-modal="true">
    <!-- Backdrop overlay -->
    <div class="fixed inset-0 bg-black/10 transition-opacity backdrop-blur-sm" @click="!isSubmitting && emit('close')"
      aria-hidden="true"></div>

    <!-- Modal Panel -->
    <div class="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div
        class="relative transform overflow-hidden rounded-lg bg-card text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-border"
        @click.stop>
        <div class="bg-card px-4 pb-4 pt-5 sm:p-6">
          <div class="flex justify-between items-center mb-5">
            <h3 class="text-lg font-semibold leading-6 text-foreground" id="modal-title">
              {{ title }}
            </h3>
            <button @click="emit('close')" :disabled="isSubmitting" class="text-muted-foreground hover:text-foreground">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div v-if="errorMsg"
            class="mb-4 p-3 text-sm bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg">
            {{ errorMsg }}
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <Input 
              id="name" 
              v-model="formData.name" 
              type="text" 
              label="Full Name" 
              required 
              placeholder="John Doe" 
            />

            <Input 
              id="email" 
              v-model="formData.email" 
              type="email" 
              label="Email" 
              required 
              placeholder="john@example.com" 
            />

            <Select 
              id="role" 
              v-model="formData.role" 
              label="Role" 
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Select>

            <Input 
              id="password" 
              v-model="formData.password" 
              type="password" 
              label="Password" 
              :required="!isEditMode" 
              placeholder="Minimum 6 characters"
            >
              <template #label-extra>
                <span v-if="isEditMode" class="text-muted-foreground font-normal text-xs">(Leave blank to keep current)</span>
              </template>
            </Input>

            <div class="pt-4 flex justify-end gap-3 border-t border-border mt-6">
              <Button type="button" variant="outline" @click="emit('close')" :disabled="isSubmitting" customClass="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" :loading="isSubmitting" customClass="w-full sm:w-auto">
                {{ submitText }}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
