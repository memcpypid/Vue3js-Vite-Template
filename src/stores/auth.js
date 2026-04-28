import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import authService from "@/services/auth.service";
import { useToast } from "@/composables/useToast";
import { withLoading, handleResponse } from "@/utils/storeUtils";

export const useAuthStore = defineStore("auth", () => {
  const toast = useToast();
  const router = useRouter();

  // State
  const user = ref(JSON.parse(localStorage.getItem("user")) || null);
  const token = ref(localStorage.getItem("token") || null);
  const refreshToken = ref(localStorage.getItem("refreshToken") || null);
  const loading = ref({
    login: false,
    logout: false,
    profile: false,
    update: false,
    register: false,
    action: false,
  });
  const error = ref(null);

  // Profile Form specific state
  const profileForm = ref({
    name: "",
    password: "",
  });

  // Getters
  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === "admin");
  const currentUser = computed(() => user.value);

  const initProfileForm = () => {
    if (user.value) {
      profileForm.value.name = user.value.name || "";
      profileForm.value.password = "";
    }
  };

  // Internal helpers
  const setAuthData = (userData, accessToken, refreshTok = null) => {
    user.value = userData;
    token.value = accessToken;
    refreshToken.value = refreshTok;
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", accessToken);
    if (refreshTok) {
      localStorage.setItem("refreshToken", refreshTok);
    }
  };

  const clearAuthData = () => {
    user.value = null;
    token.value = null;
    refreshToken.value = null;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  };

  // Actions
  const login = async (credentials) => {
    error.value = null;
    return withLoading(loading, "login", async () => {
      try {
        const res = await handleResponse(authService.login(credentials));
        const { user: userData, access_token, refresh_token } = res.data;

        if (!access_token) throw new Error("No token received");

        setAuthData(userData, access_token, refresh_token);
        return res;
      } catch (err) {
        error.value = err.message || "Login failed";
        throw err;
      }
    });
  };

  const logout = async () => {
    return withLoading(loading, "logout", async () => {
      try {
        if (token.value) {
          await authService.logout(refreshToken.value);
        }
      } catch (err) {
        console.error("Server-side logout failed:", err);
      } finally {
        clearAuthData();
        router.push({ name: "Login" });
      }
    });
  };

  const fetchProfile = async () => {
    return withLoading(loading, "profile", async () => {
      try {
        const res = await handleResponse(authService.fetchProfile());
        if (res && res.data) {
          user.value = res.data;
          localStorage.setItem("user", JSON.stringify(user.value));
        }
      } catch (err) {
        if (err.response?.status === 401) {
          await logout();
        }
        throw err;
      }
    });
  };

  const updateProfile = async () => {
    return withLoading(loading, "update", async () => {
      try {
        const payload = { name: profileForm.value.name };
        if (profileForm.value.password) {
          if (profileForm.value.password.length < 6) {
            throw new Error("Password must be at least 6 characters");
          }
          payload.password = profileForm.value.password;
        }

        await handleResponse(authService.updateProfile(payload));
        await fetchProfile();

        toast.success("Profile updated successfully!");
        profileForm.value.password = "";
      } catch (err) {
        toast.error(err.message || "Failed to update profile settings");
        throw err;
      }
    });
  };

  const register = async (payload) => {
    return withLoading(loading, "register", async () => {
      try {
        const res = await handleResponse(authService.register(payload));
        toast.success("User created successfully");
        return res.data;
      } catch (err) {
        toast.error(err.message || "Operation failed");
        throw err;
      }
    });
  };

  const hasRole = (role) => user.value?.role === role;

  const clearError = () => {
    error.value = null;
  };

  return {
    user,
    token,
    refreshToken,
    loading,
    error,
    profileForm,
    // Getters
    isAuthenticated,
    isAdmin,
    currentUser,
    // Actions
    initProfileForm,
    login,
    logout,
    fetchProfile,
    updateProfile,
    register,
    clearError,
    hasRole,
  };
});
