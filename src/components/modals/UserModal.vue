<script setup>
import { ref, computed } from 'vue';
import { EyeIcon, EyeOff } from 'lucide-vue-next';
import BaseModal from './BaseModal.vue';
import BaseButton from '../ui/BaseButton.vue';
import BaseInput from '../ui/BaseInput.vue';
import { useUserStore } from '../../stores/user';
import { ROLE_LABEL } from '../../constants/roles';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close', 'success']);
const userStore = useUserStore();

const errorMsg = ref('');
const visiblePassword = ref(false);

const title = computed(() => userStore.isEditing ? 'Edit User' : 'Add New User');
const submitText = computed(() => userStore.isEditing ? 'Save Changes' : 'Add User');
const isLoading = computed(() => userStore.isEditing ? userStore.loading.update : userStore.loading.create);

const togglePasswordVisibility = () => {
  visiblePassword.value = !visiblePassword.value;
};

const handleSubmit = async () => {
  errorMsg.value = '';

  // Simple validation
  if (!userStore.isEditing && userStore.form.password.length < 6) {
    errorMsg.value = 'Password must be at least 6 characters.';
    return;
  }

  try {
    await userStore.submitForm();
    emit('success');
    emit('close');
  } catch (err) {
    errorMsg.value = err.message || 'Operation failed';
  }
};
</script>

<template>
  <BaseModal :show="isOpen" :title="title" size="md" :loading="isLoading" @close="emit('close')">
    <div v-if="errorMsg"
      class="mb-6 p-4 text-xs font-bold uppercase tracking-widest bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl animate-fade-in">
      {{ errorMsg }}
    </div>

    <form id="userForm" @submit.prevent="handleSubmit" class="space-y-4 py-2">
      <BaseInput v-model="userStore.form.name" label="Full Name" placeholder="John Doe" required />

      <BaseInput v-model="userStore.form.email" type="email" label="Email Address" placeholder="john@example.com"
        required />

      <div class="space-y-2">
        <label class="text-xs font-bold text-foreground uppercase tracking-widest">User Role</label>
        <select v-model="userStore.form.role" required
          class="w-full h-12 bg-secondary border border-border rounded-2xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground cursor-pointer">
          <option v-for="(label, value) in ROLE_LABEL" :key="value" :value="value">
            {{ label }}
          </option>
        </select>
      </div>

      <div class="relative">
        <BaseInput v-model="userStore.form.password" :type="visiblePassword ? 'text' : 'password'"
          :label="userStore.isEditing ? 'Password (Optional)' : 'Password'"
          :placeholder="userStore.isEditing ? 'Leave blank to keep current' : 'Minimum 6 characters'" :required="!userStore.isEditing">
          <template #iconRight>
            <button type="button" @click="togglePasswordVisibility"
              class="text-muted-foreground hover:text-primary transition-colors pr-2">
              <EyeOff v-if="visiblePassword" class="w-4 h-4" />
              <EyeIcon v-else class="w-4 h-4" />
            </button>
          </template>
        </BaseInput>
      </div>
    </form>

    <template #footer>
      <BaseButton type="button" variant="ghost" fullWidth @click="emit('close')" :disabled="isLoading">
        Cancel
      </BaseButton>
      <BaseButton type="submit" form="userForm" variant="primary" fullWidth :loading="isLoading">
        {{ submitText }}
      </BaseButton>
    </template>
  </BaseModal>
</template>