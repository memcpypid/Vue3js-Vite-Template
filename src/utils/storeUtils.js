/**
 * Utility to handle loading states for store actions
 * @param {Object} loadingRef - A ref object containing loading states
 * @param {string} key - The key in loadingRef to toggle
 * @param {Function} callback - The async function to execute
 */
export async function withLoading(loadingRef, key, callback) {
  if (loadingRef.value[key] !== undefined) {
    loadingRef.value[key] = true;
  } else {
    loadingRef.value.action = true;
  }

  try {
    return await callback();
  } finally {
    if (loadingRef.value[key] !== undefined) {
      loadingRef.value[key] = false;
    } else {
      loadingRef.value.action = false;
    }
  }
}

/**
 * Standardize API response handling in stores
 * Automatically extracts error messages from Axios responses or standard API bodies
 * @param {Promise} apiCall - The axios promise
 * @returns {Promise<any>} - The data from response body
 */
export async function handleResponse(apiCall) {
  try {
    const response = await apiCall;
    const data = response.data;

    // Handle cases where API returns 200 OK but with success: false
    if (data && data.success === false) {
      const error = new Error(data.message || "Operasi gagal");
      error.statusCode = data.statusCode || response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // Extract the most relevant error message
    // 1. Check if it's an error we threw above (has no .response but has .message)
    // 2. Check if it's an Axios error (has .response.data.message)
    // 3. Fallback to generic Axios error message
    const errorMessage = error.response?.data?.message || error.message || "Terjadi kesalahan pada server";

    // If it's already an enhanced error, just re-throw
    if (error.statusCode) {
      console.error(`[API ERROR ${error.statusCode}]:`, errorMessage);
      throw error;
    }

    const enhancedError = new Error(errorMessage);
    enhancedError.response = error.response;
    enhancedError.statusCode = error.response?.status || 500;

    console.error(`[API ERROR ${enhancedError.statusCode}]:`, errorMessage);
    throw enhancedError;
  }
}
