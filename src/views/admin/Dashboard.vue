<script setup>
import { ref, onMounted } from 'vue';
import userService from '../../services/user.service';
import { Loader2, Loader2Icon } from 'lucide-vue-next';

const countUser = ref(0);
const loading = ref(false);
const getCountUser = async () => {
  try {
    loading.value = true;
    const response = await userService.getCountUser();
    countUser.value = response.data.data.count;
  } catch (error) {
    console.error('Error fetching count user:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getCountUser();
});
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
      <p class="text-muted-foreground mt-2">Overview of your application key metrics.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm">
        <h3 class="text-sm font-medium text-muted-foreground">Total Users</h3>
        <div v-if="loading">
          <Loader2 class="w-8 h-8 mt-2 animate-spin" />
        </div>
        <div v-else>
          <p class="text-3xl font-bold mt-2 text-foreground">{{ countUser }}</p>
        </div>
      </div>
      <div class="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm">
        <h3 class="text-sm font-medium text-muted-foreground">Active Sessions</h3>
        <p class="text-3xl font-bold mt-2 text-foreground">142</p>
      </div>
      <div class="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm">
        <h3 class="text-sm font-medium text-muted-foreground">Revenue</h3>
        <p class="text-3xl font-bold mt-2 text-foreground">$12,450</p>
      </div>
    </div>

    <div class="bg-card border border-border rounded-xl shadow-sm overflow-hidden mt-8">
      <div class="p-6 border-b border-border">
        <h2 class="text-lg font-semibold text-foreground">Recent Activity</h2>
      </div>
      <div class="p-6">
        <p class="text-muted-foreground text-sm">No recent activity to show.</p>
      </div>
    </div>
  </div>
</template>
