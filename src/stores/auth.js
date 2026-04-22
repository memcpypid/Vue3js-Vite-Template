import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import authService from "@/services/auth.service";
import { useToast } from "@/composables/useToast";
import { getCookie, setCookie, removeCookie } from "@/utils/cookie";

export const useAuthStore = defineStore("auth", () => {
  const toast = useToast();
  // State
  const user = ref(null);
  const token = ref(null);
  const refreshToken = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Initialize state from cookies (safely for both SSR and Client)
  const initFromCookies = (cookies = '') => {
    token.value = getCookie('token', cookies);
    refreshToken.value = getCookie('refreshToken', cookies);
    const userCookie = getCookie('user', cookies);
    if (userCookie) {
      try {
        user.value = JSON.parse(decodeURIComponent(userCookie));
      } catch (e) {
        user.value = null;
      }
    }
  };

  // Profile Form specific state
  const profileForm = ref({
    name: '',
    password: ''
  });

  const initProfileForm = () => {
    if (user.value) {
      profileForm.value.name = user.value.name || '';
      profileForm.value.password = '';
    }
  };
  
  const router = useRouter();

  // Internal helpers
  const setAuthData = (userData, accessToken, refreshTok = null) => {
    user.value = userData;
    token.value = accessToken;
    refreshToken.value = refreshTok;
    
    // Set Cookies (Browser only)
    if (typeof document !== 'undefined') {
      setCookie('token', accessToken);
      if (refreshTok) setCookie('refreshToken', refreshTok);
      setCookie('user', encodeURIComponent(JSON.stringify(userData)));
      
      // Keep localStorage as backup/legacy if needed, but cookies are primary for SSR
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", accessToken);
    }
  };

  const clearAuthData = () => {
    user.value = null;
    token.value = null;
    refreshToken.value = null;
    
    if (typeof document !== 'undefined') {
      removeCookie('token');
      removeCookie('refreshToken');
      removeCookie('user');
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
  };

  // Actions
  const login = async (credentials) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await authService.login(credentials);

      // Adapt directly to Go SuccessResponse -> Data -> LoginResponse
      const resData = response.data?.data;
      if (!resData || !resData.access_token) {
        throw new Error("Invalid response structure: No token received.");
      }

      const { user: userData, access_token, refresh_token } = resData;
      setAuthData(userData, access_token, refresh_token);

      return response;
    } catch (err) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials.";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    try {
      if (token.value) {
        await authService.logout(refreshToken.value);
      }
    } catch (err) {
      console.error("Server-side logout failed:", err);
    } finally {
      clearAuthData();
      loading.value = false;
      router.push({ name: "Login" });
    }
  };

  const fetchProfile = async () => {
    loading.value = true;
    try {
      const response = await authService.fetchProfile();
      // Maps to Go SuccessResponse -> Data (Assuming it returns UserResponse directly)
      const resData = response.data?.data;
      if (resData) {
        user.value = resData;
        localStorage.setItem("user", JSON.stringify(user.value));
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
      if (err.response?.status === 401) {
        await logout();
      }
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async () => {
    loading.value = true;
    try {
      const payload = { name: profileForm.value.name };
      // Only send password if user wants to change it
      if (profileForm.value.password) {
        if (profileForm.value.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        payload.password = profileForm.value.password;
      }
      
      const res = await authService.updateProfile(payload);
      
      // Refresh global user state after update
      await fetchProfile();
      
      toast.success('Profile updated successfully!');
      profileForm.value.password = ''; // clear password field for safety
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update profile settings');
      // throw err; // optional: throw if components need to know, but we handle it here
    } finally {
      loading.value = false;
    }
  };

  const register = async (payload) => {
    loading.value = true;
    try {
      const res = await authService.register(payload);
      toast.success('User created successfully');
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Operation failed');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Getters (in Setup Stores these are simply functions or computed properties)
  const hasRole = (role) => {
    return user.value?.role === role;
  };

  const isAuthenticated = () => {
    return !!token.value;
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    // State properties
    // State properties
    user,
    token,
    refreshToken,
    loading,
    error,
    profileForm,
    // Actions
    initFromCookies,
    initProfileForm,
    login,
    logout,
    fetchProfile,
    updateProfile,
    register,
    clearError,
    // Getters / Checks
    hasRole,
    isAuthenticated,
  };
});
