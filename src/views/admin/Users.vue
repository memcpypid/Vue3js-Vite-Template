<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import UserModal from '@/components/modals/UserModal.vue';
import Badge from '@/components/ui/Badge.vue';
import Skeleton from '@/components/ui/Skeleton.vue';
import { Trash2, CheckCircle, XCircle, Loader2, Edit, Plus, ChevronLeft, ChevronRight, Search, RefreshCw } from 'lucide-vue-next';

// State
const userStore = useUserStore();
const users = ref([]);
const errorMsg = ref('');

// Filter State
const searchQuery = ref('');
let searchTimeout = null;

// Pagination State
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  total_pages: 0,
  has_next: false,
  has_previous: false
});

// Confirm Modal State
const isConfirmModalOpen = ref(false);
const confirmModalConfig = ref({
  title: '',
  message: '',
  type: 'danger',
  confirmText: 'Confirm'
});
const activeAction = ref(null); // 'delete', 'activate', 'deactivate'
const selectedUserId = ref(null);

// User Modal State (Create/Edit)
const isUserModalOpen = ref(false);
const editingUser = ref(null);

const loadUsers = async () => {
  errorMsg.value = '';
  try {
    const params = {
      page: pagination.value.page,
      limit: pagination.value.limit,
      sort: 'desc',
      sort_by: 'created_at'
    };

    if (searchQuery.value) {
      params.search = searchQuery.value;
    }

    const res = await userStore.getUsers(params);
    const responseData = res.data?.data || {};
    const meta = res.data.meta

    // Fallback parser allowing for both structural formats safely based on user edits
    users.value = responseData.users || responseData || [];

    if (meta) {
      pagination.value = meta;
    }
  } catch (err) {
    errorMsg.value = err.response?.data?.message || err.message || 'Failed to load users';
  } finally {
    // loading state managed by userStore
  }
};

onMounted(() => {
  loadUsers();
});

// Filter Triggers
const handleSearchInput = () => {
  // Debounce search so we don't spam the API on every keystroke
  if (searchTimeout) clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    pagination.value.page = 1; // Reset to first page
    loadUsers();
  }, 500);
};

const handleLimitChange = () => {
  pagination.value.page = 1; // Reset to first page
  loadUsers();
};

// Pagination Navigation
const nextPage = () => {
  if (pagination.value.has_next) {
    pagination.value.page += 1;
    loadUsers();
  }
};

const prevPage = () => {
  if (pagination.value.has_previous) {
    pagination.value.page -= 1;
    loadUsers();
  }
};

// --- Add/Edit User ---
const openCreateUserModal = () => {
  editingUser.value = null; // null means create mode
  isUserModalOpen.value = true;
};

const openEditUserModal = async (user) => {
  selectedUserId.value = user.id;
  try {
    const res = await userStore.getUserById(user.id);
    editingUser.value = res.data.data;
    isUserModalOpen.value = true;
  } catch (err) {
    // Error handled by store toast
  }
};

const handleUserModalSuccess = () => {
  // refresh table after user is created or edited
  loadUsers();
};

// --- Action Triggers (Confirm Modal) ---
const confirmDelete = (id) => {
  selectedUserId.value = id;
  activeAction.value = 'delete';
  confirmModalConfig.value = {
    title: 'Delete User',
    message: 'Are you sure you want to delete this user? This action cannot be undone.',
    type: 'danger',
    confirmText: 'Delete'
  };
  isConfirmModalOpen.value = true;
};

const confirmActivate = (id) => {
  selectedUserId.value = id;
  activeAction.value = 'activate';
  confirmModalConfig.value = {
    title: 'Verify Account',
    message: 'Are you sure you want to verify and activate this user account?',
    type: 'info',
    confirmText: 'Verify User'
  };
  isConfirmModalOpen.value = true;
};

const confirmDeactivate = (id) => {
  selectedUserId.value = id;
  activeAction.value = 'deactivate';
  confirmModalConfig.value = {
    title: 'Deactivate Account',
    message: 'Are you sure you want to suspend/unverify this account? They will not be able to log in.',
    type: 'warning',
    confirmText: 'Deactivate'
  };
  isConfirmModalOpen.value = true;
};

// --- Dispatch Action after confirmation ---
const handleConfirmModalConfirm = async () => {
  if (!selectedUserId.value || !activeAction.value) return;

  try {
    if (activeAction.value === 'delete') {
      await userStore.deleteUser(selectedUserId.value);
    } else if (activeAction.value === 'activate') {
      await userStore.activateUser(selectedUserId.value);
    } else if (activeAction.value === 'deactivate') {
      await userStore.deactivateUser(selectedUserId.value);
    }

    // Refresh table
    await loadUsers();

    isConfirmModalOpen.value = false;
  } catch (err) {
    // Error is handled by store toast
  } finally {
    // action loading states are managed by userStore
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-foreground">Users Management</h1>
        <p class="text-muted-foreground mt-2">Manage all the users in your platform.</p>
      </div>
      <div>
        <button @click="openCreateUserModal"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-sm">
          <Plus class="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>
    </div>

    <div class="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
      <!-- Search & Filter Controls -->
      <div class="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
        <!-- Search -->
        <div class="relative w-full sm:w-80">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input v-model="searchQuery" @input="handleSearchInput" type="text" placeholder="Search by name or email..."
            class="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground" />
        </div>

        <!-- Controls: Limit & Refresh -->
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div class="flex items-center gap-2">
            <label class="text-sm text-muted-foreground hidden sm:block">Per Page:</label>
            <select v-model="pagination.limit" @change="handleLimitChange"
              class="h-9 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
            </select>
          </div>
          <button @click="loadUsers"
            class="h-9 w-9 inline-flex justify-center items-center bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            title="Refresh Data">
            <RefreshCw class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div v-if="errorMsg" class="p-6 text-center text-rose-500">
        {{ errorMsg }}
      </div>

      <div v-else class="overflow-x-auto flex-1">
        <table class="w-full text-sm text-left text-muted-foreground">
          <thead class="text-xs text-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th scope="col" class="px-6 py-4 font-medium">Name</th>
              <th scope="col" class="px-6 py-4 font-medium">Email</th>
              <th scope="col" class="px-6 py-4 font-medium">Role</th>
              <th scope="col" class="px-6 py-4 font-medium">Status</th>
              <th scope="col" class="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Skeleton Loading Rows -->
            <template v-if="userStore.loading.fetchAll">
              <tr v-for="i in pagination.limit" :key="i" class="bg-card border-b border-border">
                <td class="px-6 py-4"><Skeleton height="1.25rem" width="120px" /></td>
                <td class="px-6 py-4"><Skeleton height="1.25rem" width="180px" /></td>
                <td class="px-6 py-4"><Skeleton height="1.5rem" width="60px" /></td>
                <td class="px-6 py-4"><Skeleton height="1.25rem" width="100px" /></td>
                <td class="px-6 py-4 text-right flex justify-end gap-2"><Skeleton height="2rem" width="2rem" circle /><Skeleton height="2rem" width="2rem" circle /><Skeleton height="2rem" width="2rem" circle /></td>
              </tr>
            </template>

            <!-- Actual Data Rows -->
            <template v-else>
              <tr v-if="users.length === 0">
                <td colspan="5" class="px-6 py-8 text-center bg-card">No users found.</td>
              </tr>
              <tr v-for="user in users" :key="user.id"
                class="bg-card border-b border-border hover:bg-muted/30 transition-colors">
                <td class="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                  {{ user.name }}
                </td>
                <td class="px-6 py-4">
                  {{ user.email }}
                </td>
                <td class="px-6 py-4">
                  <Badge>
                    {{ user.role }}
                  </Badge>
                </td>
                <td class="px-6 py-4">
                  <Badge :variant="user.is_verified ? 'success' : 'danger'">
                    <div :class="user.is_verified ? 'bg-emerald-500' : 'bg-rose-500'" class="w-1.5 h-1.5 rounded-full mr-1.5 shrink-0"></div>
                    {{ user.is_verified ? 'Verified' : 'Unverified' }}
                  </Badge>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end items-center gap-2">
                    <button @click="openEditUserModal(user)"
                      :disabled="userStore.loading.fetchById"
                      class="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Edit User">
                      <Loader2 v-if="userStore.loading.fetchById && selectedUserId === user.id" class="w-4 h-4 animate-spin" />
                      <Edit v-else class="w-4 h-4" />
                    </button>

                    <div class="w-px h-4 bg-border mx-1"></div>

                    <button v-if="!user.is_verified" @click="confirmActivate(user.id)"
                      class="p-2 text-emerald-500 hover:bg-emerald-100 rounded-lg transition-colors border border-transparent hover:border-emerald-200 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      title="Verify Account">
                      <CheckCircle class="w-4 h-4" />
                    </button>
                    <button v-else @click="confirmDeactivate(user.id)"
                      class="p-2 text-amber-500 hover:bg-amber-100 rounded-lg transition-colors border border-transparent hover:border-amber-200 focus:outline-none focus:ring-1 focus:ring-amber-400"
                      title="Deactivate Account">
                      <XCircle class="w-4 h-4" />
                    </button>
                    <button @click="confirmDelete(user.id)"
                      class="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors border border-transparent hover:border-rose-200 focus:outline-none focus:ring-1 focus:ring-rose-400"
                      title="Delete Account">
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div v-if="!userStore.loading.fetchAll && users.length > 0"
        class="p-4 border-t border-border bg-muted/30 flex items-center justify-between">
        <div class="text-sm text-muted-foreground">
          Showing <span class="font-medium text-foreground">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
          to <span class="font-medium text-foreground">{{ Math.min(pagination.page * pagination.limit, pagination.total)
          }}</span>
          of <span class="font-medium text-foreground">{{ pagination.total }}</span> results
        </div>
        <div class="flex items-center gap-2">
          <button @click="prevPage" :disabled="!pagination.has_previous"
            class="p-2 rounded-md border border-border bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <ChevronLeft class="w-4 h-4" />
          </button>

          <span class="text-sm font-medium px-2 text-foreground">Page {{ pagination.page }} of {{ pagination.total_pages
          }}</span>

          <button @click="nextPage" :disabled="!pagination.has_next"
            class="p-2 rounded-md border border-border bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Multi-purpose Action Modal -->
    <ConfirmModal :is-open="isConfirmModalOpen" :title="confirmModalConfig.title" :message="confirmModalConfig.message"
      :type="confirmModalConfig.type" :confirm-text="confirmModalConfig.confirmText" :is-loading="userStore.loading.delete || userStore.loading.action"
      @close="isConfirmModalOpen = false" @confirm="handleConfirmModalConfirm" />

    <!-- User Modal (Create/Edit) -->
    <UserModal :is-open="isUserModalOpen" :user="editingUser" @close="isUserModalOpen = false"
      @success="handleUserModalSuccess" />
  </div>
</template>
