<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../../stores/user';
import ConfirmModal from '../../components/modals/ConfirmModal.vue';
import UserModal from '../../components/modals/UserModal.vue';
import { useToast } from '../../composables/useToast';
import { useTable } from '../../composables/useTable';
import { useConfirm } from '../../composables/useConfirm';
import BaseTable from '../../components/ui/BaseTable.vue';
import { CheckCircle, Edit, Plus, Trash2, XCircle, Home } from 'lucide-vue-next';
import { ROLE_LABEL } from '../../constants/roles';
import BaseButton from '../../components/ui/BaseButton.vue';
import SectionHeader from '../../components/ui/SectionHeader.vue';
import StatusBadge from '../../components/ui/StatusBadge.vue';
import BaseBreadcrumbs from '../../components/ui/BaseBreadcrumbs.vue';
import BaseAvatar from '../../components/ui/BaseAvatar.vue';

// Store & Global State
const userStore = useUserStore();
let { searchQuery, startDate, endDate, pagination, loading, sort, sortBy } = storeToRefs(userStore);
const toast = useToast();

// Composables
const { handleTable } = useTable(userStore.fetchUsers, {
  searchQuery,
  startDate,
  endDate,
  sort,
  sortBy,
  pagination,
  loading
});

const { 
  isConfirmModalOpen, 
  isProcessingAction, 
  confirmModalConfig, 
  openConfirm, 
  handleConfirm 
} = useConfirm();

const headerTable = ref([
  { text: 'Nama', align: 'left', sortable: true, value: 'name' },
  { text: 'Email', align: 'left', sortable: true, value: 'email' },
  { text: 'Peran', align: 'left', sortable: true, value: 'role' },
  { text: 'Status', align: 'left' },
  { text: 'Aksi', align: 'right' }
]);

onMounted(() => {
  userStore.fetchUsers();
});

// User Modal State (Create/Edit)
const isUserModalOpen = ref(false);

// --- Add/Edit User ---
const openCreateUserModal = () => {
  userStore.resetForm();
  isUserModalOpen.value = true;
};

const openEditUserModal = async (user) => {
  try {
    await userStore.fetchUserById(user.id);
    isUserModalOpen.value = true;
  } catch (err) {
    // Error handled by store
  }
};

const handleUserModalSuccess = () => {
  toast.success(userStore.isEditing ? 'Pengguna berhasil diperbarui' : 'Pengguna berhasil ditambahkan');
};

// --- Action Triggers (Confirm Modal) ---
const confirmDelete = (user) => {
  openConfirm({
    title: 'Hapus Pengguna',
    message: `Apakah Anda yakin ingin menghapus "${user.name}"? Tindakan ini tidak dapat dibatalkan.`,
    type: 'danger',
    confirmText: 'Hapus'
  }, async () => {
    await userStore.deleteUser(user.id);
    toast.success('Pengguna berhasil dihapus');
  });
};

const confirmToggleStatus = (user) => {
  const isVerifying = !user.is_verified;
  openConfirm({
    title: isVerifying ? 'Verifikasi Akun' : 'Nonaktifkan Akun',
    message: isVerifying 
      ? `Apakah Anda yakin ingin memverifikasi "${user.name}"?`
      : `Apakah Anda yakin ingin menangguhkan akun "${user.name}"?`,
    type: isVerifying ? 'info' : 'warning',
    confirmText: isVerifying ? 'Verifikasi' : 'Nonaktifkan'
  }, async () => {
    await userStore.toggleUserStatus(user.id, user.is_verified);
    toast.success('Status pengguna berhasil diperbarui');
  });
};
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <BaseBreadcrumbs :items="[
      { label: 'Dashboard', to: '/admin/dashboard', hasIcon: true },
      { label: 'Manajemen Akses' }
    ]">
      <template #icon>
        <Home class="w-3 h-3 mr-1.5" />
      </template>
    </BaseBreadcrumbs>

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 pb-8 border-b border-border/50">
      <SectionHeader badge="Manajemen Akses" title="Kelola" accent="Otoritas."
        description="Atur peran dan akses pengguna platform pildubas secara tersentralisasi." class="mb-0!" />

      <BaseButton variant="bordeaux" size="md" @click="openCreateUserModal">
        <template #iconLeft>
          <Plus class="w-4 h-4" />
        </template>
        Tambah Akses Pengguna
      </BaseButton>
    </div>

    <!-- Enhanced BaseTable -->
    <BaseTable :headers="headerTable" :items="userStore.allUsers" :loading="userStore.loading.fetchAll"
      :pagination="userStore.pagination" v-model:searchQuery="searchQuery" v-model:startDate="startDate"
      v-model:endDate="endDate" v-model:sort="sort" v-model:sortBy="sortBy" showDateFilter
      searchPlaceholder="Cari nama atau email..." @update:startDate="handleTable('fetch')"
      @update:endDate="handleTable('fetch')" @search="handleTable('search')" @sort="handleTable('sort', $event)"
      @reload="handleTable('reload')" @change-limit="val => handleTable('limit', val)"
      @next-page="handleTable('paginate', 'next')" @prev-page="handleTable('paginate', 'prev')">
      <template #row="{ item: user }">
        <td class="px-6 py-4">
          <div class="flex items-center gap-3">
            <BaseAvatar :name="user.name" size="sm" variant="secondary" />
            <span class="font-heading font-black text-xs text-foreground uppercase tracking-wider">{{ user.name
            }}</span>
          </div>
        </td>
        <td class="px-6 py-4 text-xs font-body text-muted-foreground">
          {{ user.email }}
        </td>
        <td class="px-6 py-4">
          <span
            class="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-heading font-black uppercase tracking-widest border border-primary/20">
            {{ ROLE_LABEL[user.role] }}
          </span>
        </td>
        <td class="px-6 py-4">
          <StatusBadge :status="user.is_verified ? 'Verified' : 'Unverified'" />
        </td>

        <td class="px-6 py-4">
          <div class="flex justify-end items-center gap-1">
            <BaseButton variant="ghost" size="xs" @click="openEditUserModal(user)" title="Edit">
              <template #iconLeft>
                <Edit class="w-3.5 h-3.5" />
              </template>
            </BaseButton>

            <BaseButton variant="ghost" size="xs" @click="confirmToggleStatus(user)"
              :class="user.is_verified ? 'text-amber-500' : 'text-emerald-500'">
              <template #iconLeft>
                <XCircle v-if="user.is_verified" class="w-3.5 h-3.5" />
                <CheckCircle v-else class="w-3.5 h-3.5" />
              </template>
            </BaseButton>

            <BaseButton variant="ghost" size="xs" @click="confirmDelete(user)" class="text-rose-500">
              <template #iconLeft>
                <Trash2 class="w-3.5 h-3.5" />
              </template>
            </BaseButton>
          </div>
        </td>
      </template>

      <!-- Mobile-optimized row -->
      <template #mobile-row="{ item: user }">
        <div class="flex flex-col gap-6 p-2">
          <div class="flex justify-between items-start">
            <div class="flex items-center gap-4">
              <BaseAvatar :name="user.name" size="lg" variant="secondary" />
              <div class="flex flex-col gap-1">
                <p class="font-heading font-black text-sm text-foreground uppercase tracking-wider leading-tight">{{
                  user.name }}</p>
                <div class="flex items-center gap-2">
                  <div
                    :class="user.is_verified ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'"
                    class="w-1.5 h-1.5 rounded-full"></div>
                  <p
                    class="text-[9px] font-heading font-black text-muted-foreground uppercase tracking-widest opacity-60">
                    {{ user.email }}</p>
                </div>
              </div>
            </div>
            <span
              class="px-3 py-1 bg-primary/10 text-primary rounded-full text-[8px] font-heading font-black uppercase tracking-[0.2em] border border-primary/20 scale-110 origin-right">
              {{ ROLE_LABEL[user.role] }}
            </span>
          </div>

          <div class="p-4 bg-secondary/20 rounded-3xl border border-border/50 backdrop-blur-sm">
            <div class="flex items-center justify-between px-2">
              <div class="flex flex-col">
                <p class="text-[8px] font-heading font-black text-muted-foreground/50 uppercase tracking-widest">Status
                  Akun</p>
                <div class="mt-1">
                  <StatusBadge :status="user.is_verified ? 'Verified' : 'Unverified'" class="scale-90 origin-left" />
                </div>
              </div>

              <div class="flex items-center gap-1.5">
                <BaseButton variant="secondary" size="xs" @click="openEditUserModal(user)"
                  class="w-10 h-10 p-0 rounded-xl shadow-xs">
                  <template #iconLeft>
                    <Edit class="w-4 h-4 text-blue-500" />
                  </template>
                </BaseButton>

                <BaseButton variant="secondary" size="xs" @click="confirmToggleStatus(user)"
                  class="w-10 h-10 p-0 rounded-xl shadow-xs">
                  <template #iconLeft>
                    <XCircle v-if="user.is_verified" class="w-4 h-4 text-amber-500" />
                    <CheckCircle v-else class="w-4 h-4 text-emerald-500" />
                  </template>
                </BaseButton>

                <BaseButton variant="secondary" size="xs" @click="confirmDelete(user)"
                  class="text-rose-500 w-10 h-10 p-0 rounded-xl shadow-xs">
                  <template #iconLeft>
                    <Trash2 class="w-4 h-4" />
                  </template>
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </template>
    </BaseTable>

    <!-- Multi-purpose Action Modal -->
    <ConfirmModal :is-open="isConfirmModalOpen" :title="confirmModalConfig.title" :message="confirmModalConfig.message"
      :type="confirmModalConfig.type" :confirm-text="confirmModalConfig.confirmText" 
      :is-loading="userStore.loading.delete || userStore.loading.action"
      @close="isConfirmModalOpen = false" @confirm="handleConfirm" />

    <!-- User Modal (Create/Edit) -->
    <UserModal :is-open="isUserModalOpen" @close="isUserModalOpen = false"
      @success="handleUserModalSuccess" />
  </div>
</template>