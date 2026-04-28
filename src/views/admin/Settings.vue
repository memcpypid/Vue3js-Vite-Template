<script setup>
import { onMounted } from 'vue';
import { Save } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseCard from '@/components/ui/BaseCard.vue';

const authStore = useAuthStore();

onMounted(() => {
  authStore.initProfileForm();
});

const handleSave = async () => {
  await authStore.updateProfile();
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
      <p class="text-muted-foreground mt-2">Manage your platform account configurations.</p>
    </div>

    <BaseCard customClass="max-w-2xl" bodyClass="p-0">
      <template #header>
        <div class="p-6 border-b border-border">
          <h2 class="text-lg font-semibold text-foreground">My Profile</h2>
          <p class="text-sm text-muted-foreground">Update your personal information and change your password.</p>
        </div>
      </template>

      <div class="p-6 space-y-6">
        <form @submit.prevent="handleSave" class="space-y-4">
          <BaseInput 
            id="email" 
            :model-value="authStore.user?.email" 
            label="Account Email" 
            disabled 
            helpText="Emails cannot be changed." 
          />

          <BaseInput 
            id="name" 
            v-model="authStore.profileForm.name" 
            label="Full Name" 
            required 
            placeholder="e.g. John Doe" 
          />

          <BaseInput 
            id="password" 
            v-model="authStore.profileForm.password" 
            type="password" 
            label="New Password"
            placeholder="Leave blank to keep current password"
          />

          <div class="pt-4 flex justify-end">
            <BaseButton type="submit" :loading="authStore.loading.update" variant="primary">
              <Save class="w-4 h-4 mr-2" />
              {{ authStore.loading.update ? 'Saving Changes...' : 'Save Changes' }}
            </BaseButton>
          </div>
        </form>
      </div>
    </BaseCard>
  </div>
</template>
