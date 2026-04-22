<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { Loader2 } from 'lucide-vue-next';
import Card from '@/components/ui/Card.vue';
import Skeleton from '@/components/ui/Skeleton.vue';

const userStore = useUserStore();
const countUser = ref(0);
const loading = ref(false);
const getCountUser = async () => {
  try {
    loading.value = true;
    const response = await userStore.getCountUser();
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
      <Card>
        <template #header>
          <h3 class="text-sm font-medium text-muted-foreground">Total Users</h3>
        </template>
        <div v-if="loading" class="mt-2">
          <Skeleton height="2.25rem" width="80px" />
        </div>
        <div v-else>
          <p class="text-3xl font-bold mt-2 text-foreground">{{ countUser }}</p>
        </div>
      </Card>
      
      <Card>
        <template #header>
          <h3 class="text-sm font-medium text-muted-foreground">Active Sessions</h3>
        </template>
        <p class="text-3xl font-bold mt-2 text-foreground">142</p>
      </Card>
      
      <Card>
        <template #header>
          <h3 class="text-sm font-medium text-muted-foreground">Revenue</h3>
        </template>
        <p class="text-3xl font-bold mt-2 text-foreground">$12,450</p>
      </Card>
    </div>

    <Card customClass="mt-8" bodyClass="p-0">
      <template #header>
        <div class="p-0 pb-6 border-b border-border">
          <h2 class="text-lg font-semibold text-foreground">Recent Activity</h2>
        </div>
      </template>
      <div class="p-6">
        <p class="text-muted-foreground text-sm">No recent activity to show.</p>
      </div>
    </Card>
  </div>
</template>
