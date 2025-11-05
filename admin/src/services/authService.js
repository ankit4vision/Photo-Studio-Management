// Authentication Service - API calls for authentication
import apiClient from '../config/apiClient'
import { handleApiError, formatSuccessResponse } from '../utils/errorHandler'

const authService = {
  /**
   * Login user
   * @param {Object} credentials - User credentials { email, password }
   * @returns {Promise} Login response with token and user data
   */
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials)
      
      // Handle successful login
      const { access_token, user } = response.data
      
      // Store token and user data
      if (access_token) {
        localStorage.setItem('access_token', access_token)
      }
      
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      }
      
      return {
        success: true,
        data: {
          token: access_token,
          user: user,
        },
        message: 'Login successful',
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  /**
   * Logout user
   * @returns {Promise} Logout response
   */
  async logout() {
    try {
      // Call logout endpoint if available
      // await apiClient.post('/auth/logout')
      
      // Clear local storage
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      
      return {
        success: true,
        message: 'Logout successful',
      }
    } catch (error) {
      // Even if logout fails, clear local storage
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      
      return {
        success: true,
        message: 'Logout successful',
      }
    }
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Registration response
   */
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData)
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  /**
   * Forgot password
   * @param {String} email - User email
   * @returns {Promise} Forgot password response
   */
  async forgotPassword(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email })
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  /**
   * Reset password
   * @param {String} token - Reset token
   * @param {String} password - New password
   * @returns {Promise} Reset password response
   */
  async resetPassword(token, password) {
    try {
      const response = await apiClient.post('/auth/reset-password', { token, password })
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  /**
   * Refresh auth token
   * @returns {Promise} Token refresh response
   */
  async refreshToken() {
    try {
      const response = await apiClient.post('/auth/refresh')
      
      const { access_token } = response.data
      
      if (access_token) {
        localStorage.setItem('access_token', access_token)
      }
      
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  /**
   * Check if user is authenticated
   * @returns {Boolean}
   */
  isAuthenticated() {
    const token = localStorage.getItem('access_token')
    return !!token
  },

  /**
   * Get current auth token
   * @returns {String|null}
   */
  getToken() {
    return localStorage.getItem('access_token')
  },

  /**
   * Get current user data
   * @returns {Object|null}
   */
  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },
}

export default authService

