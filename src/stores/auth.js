import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/auth.service';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const token = ref(localStorage.getItem('token') || null);
  const loading = ref(false);
  const error = ref(null);
  
  const router = useRouter();

  // Internal helpers
  const setAuthData = (userData, accessToken, refreshToken = null) => {
    user.value = userData;
    token.value = accessToken;
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  };

  const clearAuthData = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
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
        throw new Error('Invalid response structure: No token received.');
      }

      const { user: userData, access_token, refresh_token } = resData;
      setAuthData(userData, access_token, refresh_token);
      
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    try {
      if (token.value) {
        await authService.logout();
      }
    } catch (err) {
      console.error('Server-side logout failed:', err);
    } finally {
      clearAuthData();
      loading.value = false;
      router.push({ name: 'Login' });
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
        localStorage.setItem('user', JSON.stringify(user.value));
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
      if (err.response?.status === 401) {
        await logout();
      }
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
    user,
    token,
    loading,
    error,
    // Actions
    login,
    logout,
    fetchProfile,
    clearError,
    // Getters / Checks
    hasRole,
    isAuthenticated,
  };
});
