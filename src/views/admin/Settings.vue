<script setup>
import { onMounted } from 'vue';
import { Loader2, Save } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';

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

    <div class="bg-card border border-border rounded-xl shadow-sm overflow-hidden max-w-2xl">
      <div class="p-6 border-b border-border">
        <h2 class="text-lg font-semibold text-foreground">My Profile</h2>
        <p class="text-sm text-muted-foreground">Update your personal information and change your password.</p>
      </div>

      <div class="p-6 space-y-6">

        <form @submit.prevent="handleSave" class="space-y-4">
          <Input 
            id="email" 
            :model-value="authStore.user?.email" 
            label="Account Email" 
            disabled 
            helpText="Emails cannot be changed." 
          />

          <Input 
            id="name" 
            v-model="authStore.profileForm.name" 
            label="Full Name" 
            required 
            placeholder="e.g. John Doe" 
          />

          <Input 
            id="password" 
            v-model="authStore.profileForm.password" 
            type="password" 
            label="New Password"
            placeholder="Leave blank to keep current password"
          >
            <template #label-extra>
              <span class="font-normal text-muted-foreground text-xs">(optional)</span>
            </template>
          </Input>

          <div class="pt-4 flex justify-end">
            <Button type="submit" :loading="authStore.loading">
              <template #icon-left><Save class="w-4 h-4 mr-2" /></template>
              {{ authStore.loading ? 'Saving Changes...' : 'Save Changes' }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
