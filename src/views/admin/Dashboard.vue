<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { Loader2 } from 'lucide-vue-next';
import BaseCard from '@/components/ui/BaseCard.vue';
import BaseSkeleton from '@/components/ui/BaseSkeleton.vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';

const userStore = useUserStore();
const countUser = ref(0);
const getCountUser = async () => {
  const response = await userStore.getCountUser();
  countUser.value = response.count;
};

onMounted(() => {
  getCountUser();
});
</script>

<template>
  <div class="space-y-6">
    <SectionHeader badge="Monitoring" title="Admin" accent="Dashboard."
      description="Pantau performa dan metrik utama e-voting & transaksi Anda secara real-time." />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BaseCard>
        <template #header>
          <h3 class="text-sm font-medium text-muted-foreground">Total Users</h3>
        </template>
        <div v-if="userStore.loading.action" class="mt-2">
          <BaseSkeleton height="2.25rem" width="80px" />
        </div>
        <div v-else>
          <p class="text-3xl font-bold mt-2 text-foreground">{{ countUser }}</p>
        </div>
      </BaseCard>

      <BaseCard>
        <template #header>
          <h3 class="text-sm font-medium text-muted-foreground">Active Sessions</h3>
        </template>
        <p class="text-3xl font-bold mt-2 text-foreground">142</p>
      </BaseCard>

      <BaseCard>
        <template #header>
          <h3 class="text-sm font-medium text-muted-foreground">Revenue</h3>
        </template>
        <p class="text-3xl font-bold mt-2 text-foreground">$12,450</p>
      </BaseCard>
    </div>

    <BaseCard customClass="mt-8" bodyClass="p-0">
      <template #header>
        <div class="p-0 pb-6 border-b border-border">
          <h2 class="text-lg font-semibold text-foreground">Recent Activity</h2>
        </div>
      </template>
      <div class="p-6">
        <p class="text-muted-foreground text-sm">No recent activity to show.</p>
      </div>
    </BaseCard>
  </div>
</template>
