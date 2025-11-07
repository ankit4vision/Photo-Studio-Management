import apiClient from './config/apiClient'
import { formatSuccessResponse, handleApiError } from './utils/errorHandler'

const extractData = (response) => response?.data ?? response

const apiService = {
  async request(method, endpoint, data, options = {}) {
    try {
      const config = { ...options, method }
      if (data !== undefined) {
        config.data = data
      }

      const response = await apiClient.request({ url: endpoint, ...config })
      return extractData(response)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async get(endpoint, options = {}) {
    try {
      const response = await apiClient.get(endpoint, options)
      return extractData(response)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async post(endpoint, data, options = {}) {
    return this.request('post', endpoint, data, options)
  },

  async put(endpoint, data, options = {}) {
    return this.request('put', endpoint, data, options)
  },

  async patch(endpoint, data, options = {}) {
    return this.request('patch', endpoint, data, options)
  },

  async delete(endpoint, options = {}) {
    return this.request('delete', endpoint, undefined, options)
  },

  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials)
      const payload = extractData(response)

      const accessToken = payload?.access_token || payload?.token || payload?.data?.access_token
      const user = payload?.user || payload?.data?.user || payload?.data

      if (accessToken) {
        localStorage.setItem('access_token', accessToken)
      }

      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      }

      return {
        success: true,
        token: accessToken,
        user,
        message: payload?.message || 'Login successful',
      }
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      // Even if API logout fails, continue clearing local storage
      console.warn('Logout request failed', error)
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
    }

    return {
      success: true,
      message: 'Logout successful',
    }
  },

  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData)
      return formatSuccessResponse(response)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async forgotPassword(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email })
      return formatSuccessResponse(response)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async resetPassword(token, password) {
    try {
      const response = await apiClient.post('/auth/reset-password', { token, password })
      return formatSuccessResponse(response)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  getAuthToken() {
    return localStorage.getItem('access_token')
  },

  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  isAuthenticated() {
    return !!(this.getAuthToken() && this.getUser())
  },
}

export default apiService
