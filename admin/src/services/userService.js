// User Management Service
import apiService from '../api'
import { API_ENDPOINTS } from '../constants/api'

class UserService {
  // Get all users with pagination and filters
  async getUsers(params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.search) queryParams.append('search', params.search)
    if (params.role) queryParams.append('role', params.role)
    if (params.status) queryParams.append('status', params.status)
    if (params.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)

    const endpoint = `${API_ENDPOINTS.USERS.LIST}?${queryParams.toString()}`
    return apiService.get(endpoint)
  }

  // Get user by ID
  async getUserById(userId) {
    return apiService.get(API_ENDPOINTS.USERS.GET_BY_ID(userId))
  }

  // Create new user
  async createUser(userData) {
    return apiService.post(API_ENDPOINTS.USERS.CREATE, userData)
  }

  // Update user
  async updateUser(userId, userData) {
    return apiService.put(API_ENDPOINTS.USERS.UPDATE(userId), userData)
  }

  // Delete user
  async deleteUser(userId) {
    return apiService.delete(API_ENDPOINTS.USERS.DELETE(userId))
  }

  // Bulk delete users
  async bulkDeleteUsers(userIds) {
    return apiService.post(API_ENDPOINTS.USERS.BULK_DELETE, { userIds })
  }

  // Search users
  async searchUsers(query, filters = {}) {
    const searchParams = { query, ...filters }
    return apiService.post(API_ENDPOINTS.USERS.SEARCH, searchParams)
  }

  // Export users
  async exportUsers(format = 'csv', filters = {}) {
    const queryParams = new URLSearchParams()
    queryParams.append('format', format)
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) queryParams.append(key, filters[key])
    })

    const endpoint = `${API_ENDPOINTS.USERS.EXPORT}?${queryParams.toString()}`
    return apiService.get(endpoint, { responseType: 'blob' })
  }

  // Import users
  async importUsers(file, options = {}) {
    const formData = new FormData()
    formData.append('file', file)
    
    Object.keys(options).forEach(key => {
      formData.append(key, options[key])
    })

    return apiService.post(API_ENDPOINTS.USERS.IMPORT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  // Get user profile
  async getUserProfile() {
    return apiService.get(API_ENDPOINTS.USERS.GET_PROFILE)
  }

  // Update user profile
  async updateUserProfile(profileData) {
    return apiService.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, profileData)
  }

  // Upload user avatar
  async uploadAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)

    return apiService.post(API_ENDPOINTS.USERS.UPLOAD_AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  // Change user status (active/inactive)
  async changeUserStatus(userId, status) {
    return apiService.patch(API_ENDPOINTS.USERS.CHANGE_STATUS(userId), { status })
  }

  // Reset user password
  async resetUserPassword(userId, newPassword) {
    return apiService.post(API_ENDPOINTS.USERS.RESET_PASSWORD(userId), { 
      password: newPassword 
    })
  }

  // Get users by role
  async getUsersByRole(roleId) {
    return apiService.get(API_ENDPOINTS.ROLES.GET_USERS_WITH_ROLE(roleId))
  }

  // Assign role to user
  async assignRoleToUser(userId, roleId) {
    return apiService.post(`/users/${userId}/roles`, { roleId })
  }

  // Remove role from user
  async removeRoleFromUser(userId, roleId) {
    return apiService.delete(`/users/${userId}/roles/${roleId}`)
  }

  // Get user permissions
  async getUserPermissions(userId) {
    return apiService.get(`/users/${userId}/permissions`)
  }

  // Assign permissions to user
  async assignPermissionsToUser(userId, permissions) {
    return apiService.post(`/users/${userId}/permissions`, { permissions })
  }

  // Remove permissions from user
  async removePermissionsFromUser(userId, permissions) {
    return apiService.delete(`/users/${userId}/permissions`, { 
      data: { permissions } 
    })
  }

  // Get user activity logs
  async getUserActivityLogs(userId, params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)

    const endpoint = `/users/${userId}/activity-logs?${queryParams.toString()}`
    return apiService.get(endpoint)
  }

  // Get user statistics
  async getUserStats() {
    return apiService.get('/users/stats')
  }

  // Validate user data
  validateUserData(userData, isUpdate = false) {
    const errors = {}

    if (!isUpdate || userData.firstName !== undefined) {
      if (!userData.firstName || userData.firstName.trim() === '') {
        errors.firstName = 'First name is required'
      }
    }

    if (!isUpdate || userData.lastName !== undefined) {
      if (!userData.lastName || userData.lastName.trim() === '') {
        errors.lastName = 'Last name is required'
      }
    }

    if (!isUpdate || userData.email !== undefined) {
      if (!userData.email || userData.email.trim() === '') {
        errors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        errors.email = 'Please enter a valid email address'
      }
    }

    if (!isUpdate || userData.password !== undefined) {
      if (!isUpdate && (!userData.password || userData.password.trim() === '')) {
        errors.password = 'Password is required'
      } else if (userData.password && userData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long'
      }
    }

    if (!isUpdate || userData.role !== undefined) {
      if (!userData.role || userData.role.trim() === '') {
        errors.role = 'Role is required'
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }
}

// Create and export singleton instance
const userService = new UserService()
export default userService
