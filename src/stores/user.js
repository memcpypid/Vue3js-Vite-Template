import { defineStore } from "pinia";
import { ref } from "vue";
import userService from "@/services/user.service";
import { useToast } from "@/composables/useToast";

export const useUserStore = defineStore("user", () => {
  const toast = useToast();
  
  const loading = ref({
    fetchAll: false,
    fetchById: false,
    create: false,
    update: false,
    delete: false,
    action: false
  });

  const getUsers = async (params = {}) => {
    loading.value.fetchAll = true;
    try {
      return await userService.getUsers(params);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to fetch users",
      );
      throw err;
    } finally {
      loading.value.fetchAll = false;
    }
  };

  const getUserById = async (id) => {
    loading.value.fetchById = true;
    try {
      return await userService.getUserById(id);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to fetch user",
      );
      throw err;
    } finally {
      loading.value.fetchById = false;
    }
  };

  const getCountUser = async () => {
    try {
      return await userService.getCountUser();
    } catch (err) {
      console.error("Error fetching count user:", err);
      throw err;
    }
  };

  const updateUser = async (id, payload) => {
    loading.value.update = true;
    try {
      const res = await userService.updateUser(id, payload);
      toast.success("User updated successfully");
      return res;
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to update user",
      );
      throw err;
    } finally {
      loading.value.update = false;
    }
  };

  const deleteUser = async (id) => {
    loading.value.delete = true;
    try {
      const res = await userService.deleteUser(id);
      toast.success("User deleted successfully");
      return res;
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to delete user",
      );
      throw err;
    } finally {
      loading.value.delete = false;
    }
  };

  const activateUser = async (id) => {
    loading.value.action = true;
    try {
      const res = await userService.activateUser(id);
      toast.success("User status updated successfully");
      return res;
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to verify account",
      );
      throw err;
    } finally {
      loading.value.action = false;
    }
  };

  const deactivateUser = async (id) => {
    loading.value.action = true;
    try {
      const res = await userService.deactivateUser(id);
      toast.success("User status updated successfully");
      return res;
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to deactivate account",
      );
      throw err;
    } finally {
      loading.value.action = false;
    }
  };

  return {
    loading,
    getUsers,
    getUserById,
    getCountUser,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
  };
});
