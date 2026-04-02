<script setup>
import { ref, onMounted } from 'vue';
import { Loader2, Save } from 'lucide-vue-next';
import { useAuthStore } from '../../stores/auth';
import authService from '../../services/auth.service';
import { useToast } from '../../composables/useToast';

const authStore = useAuthStore();
const name = ref('');
const password = ref('');
const loading = ref(false);
const toast = useToast();

onMounted(() => {
  if (authStore.user) {
    name.value = authStore.user.name || '';
  }
});

const handleSave = async () => {
  loading.value = true;
  
  try {
    const payload = { name: name.value };
    // Only send password if user wants to change it
    if (password.value) {
      if (password.value.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      payload.password = password.value;
    }

    await authService.updateProfile(payload);
    
    // Refresh global user state after update
    await authStore.fetchProfile();
    
    toast.success('Profile updated successfully!');
    password.value = ''; // Clear password field for safety
  } catch (err) {
    toast.error(err.response?.data?.message || err.message || 'Failed to update profile settings');
  } finally {
    loading.value = false;
  }
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
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Account Email</label>
            <input 
              type="text" 
              disabled 
              :value="authStore.user?.email" 
              class="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
            />
            <p class="text-xs text-muted-foreground">Emails cannot be changed.</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Full Name</label>
            <input 
              v-model="name" 
              type="text" 
              required
              placeholder="e.g. John Doe"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">New Password <span class="font-normal text-muted-foreground">(optional)</span></label>
            <input 
              v-model="password" 
              type="password" 
              placeholder="Leave blank to keep current password"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
          </div>

          <div class="pt-4 flex justify-end">
            <button 
              type="submit" 
              :disabled="loading"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary-hover h-10 py-2 px-4 shadow hover:shadow-md"
            >
              <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
              <Save v-else class="w-4 h-4 mr-2" />
              {{ loading ? 'Saving Changes...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
