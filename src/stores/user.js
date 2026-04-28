import { defineStore } from "pinia";
import { ref, computed } from "vue";
import UserService from "../services/user.service";
import { withLoading, handleResponse } from "../utils/storeUtils";

export const useUserStore = defineStore("user", () => {
  // --- 1. STATE ---

  // Data State
  const users = ref([]);
  const currentUser = ref(null);

  // Form State
  const initialForm = {
    name: "",
    email: "",
    password: "",
    role: "user",
  };
  const form = ref({ ...initialForm });

  // UI State (Loading, Pagination, Filters)
  const loading = ref({
    fetchAll: false,
    fetchById: false,
    create: false,
    update: false,
    delete: false,
    action: false,
  });

  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
  });

  const searchQuery = ref("");
  const startDate = ref("");
  const endDate = ref("");
  const sort = ref("desc");
  const sortBy = ref("created_at");

  // --- 2. GETTERS ---

  const allUsers = computed(() => users.value);
  const isEditing = computed(() => !!currentUser.value);

  // --- 3. ACTIONS ---

  /**
   * Form Management
   */
  const resetForm = () => {
    form.value = { ...initialForm };
    currentUser.value = null;
  };

  const setForm = (userData) => {
    currentUser.value = userData;
    form.value = {
      name: userData.name || "",
      email: userData.email || "",
      password: "", // Usually keep empty on edit
      role: userData.role || "user",
    };
  };

  /**
   * API Actions
   */
  const fetchUsers = async (params = {}) => {
    return withLoading(loading, "fetchAll", async () => {
      const fetchParams = {
        page: pagination.value.page || 1,
        limit: pagination.value.limit || 10,
        sort: sort.value,
        sort_by: sortBy.value,
        search: searchQuery.value,
        start_date: startDate.value,
        end_date: endDate.value,
        ...params,
      };
      const res = await handleResponse(UserService.getUsers(fetchParams));

      // Update state based on standard response format
      // res is response.data -> { success, data: { users, pagination } }
      if (res.data) {
        users.value = res.data || [];
        pagination.value = res.meta || pagination.value;
      }

      return res;
    });
  };

  const fetchUserById = async (id) => {
    return withLoading(loading, "fetchById", async () => {
      const res = await handleResponse(UserService.getUserById(id));
      if (res.data) {
        setForm(res.data);
      }
      return res.data;
    });
  };

  const submitForm = async () => {
    const action = isEditing.value ? "update" : "create";
    return withLoading(loading, action, async () => {
      let res;
      if (isEditing.value) {
        res = await handleResponse(
          UserService.updateUser(currentUser.value.id, form.value),
        );
      } else {
        res = await handleResponse(UserService.createUser(form.value));
      }
      resetForm();
      await fetchUsers(); // Refresh list
      return res.data;
    });
  };

  const deleteUser = async (id) => {
    return withLoading(loading, "delete", async () => {
      await handleResponse(UserService.deleteUser(id));
      await fetchUsers(); // Refresh list
      return true;
    });
  };

  const toggleUserStatus = async (id, isVerified) => {
    return withLoading(loading, "action", async () => {
      if (isVerified) {
        await handleResponse(UserService.deactivateUser(id));
      } else {
        await handleResponse(UserService.activateUser(id));
      }
      await fetchUsers(); // Refresh list
      return true;
    });
  };

  const getCountUser = async () => {
    return withLoading(loading, "action", async () => {
      const res = await handleResponse(UserService.getCountUser());
      return res.data;
    });
  };

  return {
    // State
    users,
    currentUser,
    form,
    loading,
    pagination,
    searchQuery,
    startDate,
    endDate,
    sort,
    sortBy,
    // Getters
    allUsers,
    isEditing,
    // Actions
    resetForm,
    setForm,
    fetchUsers,
    fetchUserById,
    submitForm,
    deleteUser,
    toggleUserStatus,
    getCountUser,
  };
});
