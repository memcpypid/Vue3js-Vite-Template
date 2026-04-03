import api from "./api";

/**
 * @typedef {Object} UserResponse
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} role
 * @property {boolean} is_verified
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Pagination
 * @property {number} limit
 * @property {number} page
 * @property {number} total_pages
 * @property {number} total
 * @property {boolean} has_next
 * @property {boolean} has_previous
 */

/**
 * @typedef {Object} UpdateUserRequest
 * @property {string} [name]
 * @property {string} [email]
 * @property {string} [password]
 * @property {string} [role]
 */

class UserService {
  /**
   * Fetch all users with pagination
   * @param {Object} [params] - Query params limit, page, sort, sort_by
   * @returns {Promise<import('axios').AxiosResponse<{success: boolean, message: string, data: {users: UserResponse[], pagination: Pagination}}>>}
   */
  getUsers(params = {}) {
    return api.get("/api/v1/users", { params });
  }

  /**
   * Get count of users
   * @returns {Promise<import('axios').AxiosResponse<{success: boolean, message: string, data: {count: number}}>>}
   */
  getCountUser() {
    return api.get("/api/v1/users/count");
  }

  /**
   * Update a user's details
   * @param {string} id
   * @param {UpdateUserRequest} payload
   * @returns {Promise<import('axios').AxiosResponse<{success: boolean, message: string, data: UserResponse}>>}
   */
  updateUser(id, payload) {
    return api.put(`/api/v1/users/${id}`, payload);
  }

  /**
   * Delete user by ID
   * @param {string} id
   * @returns {Promise<import('axios').AxiosResponse<{success: boolean, message: string}>>}
   */
  deleteUser(id) {
    return api.delete(`/api/v1/users/${id}`);
  }

  /**
   * Activate (verify) a user
   * @param {string} id
   * @returns {Promise<import('axios').AxiosResponse<{success: boolean, message: string}>>}
   */
  activateUser(id) {
    return api.patch(`/api/v1/users/${id}/activate`);
  }

  /**
   * Deactivate (unverify) a user
   * @param {string} id
   * @returns {Promise<import('axios').AxiosResponse<{success: boolean, message: string}>>}
   */
  deactivateUser(id) {
    return api.patch(`/api/v1/users/${id}/deactivate`);
  }
}

export default new UserService();
