// Profile Management Service
import apiService from '../api'
import { API_ENDPOINTS } from '../constants/api'

const mapProfile = (profile = {}) => {
  if (!profile) return null

  const name = profile.name || ''
  const nameParts = name.trim().split(' ')
  const firstName = profile.firstName || nameParts[0] || ''
  const lastName = profile.lastName || nameParts.slice(1).join(' ') || ''

  return {
    ...profile,
    firstName,
    lastName,
    phone: profile.mobile || profile.phone || '',
  }
}

const profileService = {
  async getProfile() {
    try {
      const response = await apiService.get(API_ENDPOINTS.USERS.GET_PROFILE)
      return {
        success: response?.success ?? true,
        data: mapProfile(response?.data ?? response),
        message: response?.message ?? 'Profile fetched successfully',
      }
    } catch (error) {
      return error
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await apiService.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, profileData)
      return {
        success: response?.success ?? true,
        data: mapProfile(response?.data ?? response),
        message: response?.message ?? 'Profile updated successfully',
      }
    } catch (error) {
      return error
    }
  },

  async uploadAvatar(file) {
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await apiService.post(API_ENDPOINTS.USERS.UPLOAD_AVATAR, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return {
        success: response?.success ?? true,
        data: response?.data ?? response,
        message: response?.message ?? 'Avatar uploaded successfully',
      }
    } catch (error) {
      return error
    }
  },

  async deleteAvatar() {
    try {
      const response = await apiService.delete(API_ENDPOINTS.USERS.UPLOAD_AVATAR)
      return {
        success: response?.success ?? true,
        data: response?.data ?? response,
        message: response?.message ?? 'Avatar deleted successfully',
      }
    } catch (error) {
      return error
    }
  },

  validateProfileData(data) {
    const errors = {}

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

    if (data.phone && !/^[\+]?\d{7,15}$/.test(data.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  },

  formatProfileData(data) {
    return {
      name: `${data.firstName?.trim() || ''} ${data.lastName?.trim() || ''}`.trim(),
      mobile: data.phone?.trim() || null,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      zip_code: data.zipCode || null,
      country: data.country || null,
      bio: data.bio || null,
    }
  },
}

export default profileService
