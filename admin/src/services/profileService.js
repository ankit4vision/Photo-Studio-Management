// Profile Management Service
import apiService from '../api'
import { API_ENDPOINTS } from '../constants/api'
import profileMockData from '../mock/profile.json'

// Mock delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ProfileService {
  // Get current user profile
  async getProfile() {
    try {
      // For development, return mock data
      return {
        success: true,
        data: profileMockData.profile,
        message: 'Profile fetched successfully'
      }
      
      // Uncomment for real API integration
      // const response = await apiService.get(API_ENDPOINTS.USERS.GET_PROFILE)
      // return {
      //   success: true,
      //   data: response.data,
      //   message: 'Profile fetched successfully'
      // }
    } catch (error) {
      console.error('Error fetching profile:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch profile'
      }
    }
  }

  // Update current user profile
  async updateProfile(profileData) {
    try {
      // For development, simulate successful update
      const updatedProfile = {
        ...profileMockData.profile,
        ...profileData,
        updatedAt: new Date().toISOString()
      }
      
      return {
        success: true,
        data: updatedProfile,
        message: 'Profile updated successfully'
      }
      
      // Uncomment for real API integration
      // const response = await apiService.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, profileData)
      // return {
      //   success: true,
      //   data: response.data,
      //   message: 'Profile updated successfully'
      // }
    } catch (error) {
      console.error('Error updating profile:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to update profile'
      }
    }
  }

  // Change user password
  async changePassword(passwordData) {
    try {
      // For development, simulate successful password change
      return {
        success: true,
        data: { message: 'Password changed successfully' },
        message: 'Password changed successfully'
      }
      
      // Uncomment for real API integration
      // const response = await apiService.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData)
      // return {
      //   success: true,
      //   data: response.data,
      //   message: 'Password changed successfully'
      // }
    } catch (error) {
      console.error('Error changing password:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to change password'
      }
    }
  }

  // Upload profile avatar
  async uploadAvatar(file) {
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await apiService.post(API_ENDPOINTS.USERS.UPLOAD_AVATAR, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return {
        success: true,
        data: response.data,
        message: 'Avatar uploaded successfully'
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to upload avatar'
      }
    }
  }

  // Delete profile avatar
  async deleteAvatar() {
    try {
      const response = await apiService.delete(API_ENDPOINTS.USERS.UPLOAD_AVATAR)
      return {
        success: true,
        data: response.data,
        message: 'Avatar deleted successfully'
      }
    } catch (error) {
      console.error('Error deleting avatar:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to delete avatar'
      }
    }
  }

  // Get user activity logs
  async getActivityLogs(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.startDate) queryParams.append('startDate', params.startDate)
      if (params.endDate) queryParams.append('endDate', params.endDate)
      if (params.activity) queryParams.append('activity', params.activity)

      const endpoint = `${API_ENDPOINTS.USERS.GET_PROFILE}/activity?${queryParams.toString()}`
      const response = await apiService.get(endpoint)
      
      return {
        success: true,
        data: response.data,
        message: 'Activity logs fetched successfully'
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch activity logs'
      }
    }
  }

  // Export profile data
  async exportProfileData(format = 'json') {
    try {
      const response = await apiService.get(`${API_ENDPOINTS.USERS.GET_PROFILE}/export?format=${format}`, {
        responseType: 'blob'
      })
      
      return {
        success: true,
        data: response.data,
        message: 'Profile data exported successfully'
      }
    } catch (error) {
      console.error('Error exporting profile data:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to export profile data'
      }
    }
  }

  // Update profile preferences
  async updatePreferences(preferences) {
    try {
      const response = await apiService.put(`${API_ENDPOINTS.USERS.GET_PROFILE}/preferences`, preferences)
      return {
        success: true,
        data: response.data,
        message: 'Preferences updated successfully'
      }
    } catch (error) {
      console.error('Error updating preferences:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to update preferences'
      }
    }
  }

  // Get profile statistics
  async getProfileStats() {
    try {
      const response = await apiService.get(`${API_ENDPOINTS.USERS.GET_PROFILE}/stats`)
      return {
        success: true,
        data: response.data,
        message: 'Profile statistics fetched successfully'
      }
    } catch (error) {
      console.error('Error fetching profile statistics:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch profile statistics'
      }
    }
  }

  // Validate profile data
  validateProfileData(data) {
    const errors = {}

    // Required fields
    if (!data.firstName?.trim()) {
      errors.firstName = 'First name is required'
    }
    if (!data.lastName?.trim()) {
      errors.lastName = 'Last name is required'
    }
    if (!data.email?.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Optional field validations
    if (data.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(data.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number'
    }

    if (data.dateOfBirth) {
      const birthDate = new Date(data.dateOfBirth)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      
      if (age < 13) {
        errors.dateOfBirth = 'You must be at least 13 years old'
      } else if (age > 120) {
        errors.dateOfBirth = 'Please enter a valid birth date'
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  // Format profile data for API
  formatProfileData(data) {
    return {
      firstName: data.firstName?.trim(),
      lastName: data.lastName?.trim(),
      email: data.email?.trim(),
      phone: data.phone?.trim(),
      address: data.address?.trim(),
      city: data.city?.trim(),
      state: data.state?.trim(),
      zipCode: data.zipCode?.trim(),
      country: data.country?.trim(),
      bio: data.bio?.trim(),
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      avatar: data.avatar
    }
  }
}

// Create and export service instance
export const profileService = new ProfileService()

// Export class for testing
export { ProfileService }

export default profileService
