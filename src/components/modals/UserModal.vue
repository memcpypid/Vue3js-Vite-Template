<script setup>
import { ref, watch, computed } from 'vue';
import { Loader2, X } from 'lucide-vue-next';
import authService from '../../services/auth.service';
import userService from '../../services/user.service';

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

const loading = ref(false);
const errorMsg = ref('');

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

  loading.value = true;
  
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
      
      await userService.updateUser(props.user.id, payload);
    } else {
      // Create user using the auth register endpoints
      await authService.register(formData.value);
    }
    
    emit('success');
    emit('close');
  } catch (err) {
    errorMsg.value = err.response?.data?.message || err.message || 'Operation failed';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Backdrop overlay -->
    <div class="fixed inset-0 bg-black/10 transition-opacity backdrop-blur-sm" @click="!loading && emit('close')" aria-hidden="true"></div>

    <!-- Modal Panel -->
    <div class="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div 
        class="relative transform overflow-hidden rounded-lg bg-card text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-border"
        @click.stop
      >
        <div class="bg-card px-4 pb-4 pt-5 sm:p-6">
          <div class="flex justify-between items-center mb-5">
            <h3 class="text-lg font-semibold leading-6 text-foreground" id="modal-title">
              {{ title }}
            </h3>
            <button @click="emit('close')" :disabled="loading" class="text-muted-foreground hover:text-foreground">
              <X class="w-5 h-5" />
            </button>
          </div>
          
          <div v-if="errorMsg" class="mb-4 p-3 text-sm bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg">
            {{ errorMsg }}
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Full Name</label>
              <input 
                v-model="formData.name" 
                type="text" 
                required
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                placeholder="John Doe"
              />
            </div>
            
            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Email</label>
              <input 
                v-model="formData.email" 
                type="email" 
                required
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                placeholder="john@example.com"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Role</label>
              <select 
                v-model="formData.role"
                required
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 text-foreground"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">
                Password 
                <span v-if="isEditMode" class="text-muted-foreground font-normal">(Leave blank to keep current)</span>
              </label>
              <input 
                v-model="formData.password" 
                type="password" 
                :required="!isEditMode"
                placeholder="Minimum 6 characters"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              />
            </div>

            <div class="pt-4 flex justify-end gap-3 border-t border-border mt-6">
              <button 
                type="button" 
                class="inline-flex w-full justify-center rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-secondary sm:w-auto transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                @click="emit('close')"
                :disabled="loading"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:w-auto transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary-hover focus:ring-primary"
                :class="{'opacity-70 cursor-not-allowed': loading}"
                :disabled="loading"
              >
                <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
                {{ submitText }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
