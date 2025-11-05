// Package Service - API calls for package management
import apiService from '../api'
import { API_ENDPOINTS } from '../constants/api'

class PackageService {
  // Get all packages
  async getPackages(params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.search) queryParams.append('search', params.search)
    if (params.package_type) queryParams.append('package_type', params.package_type)
    if (params.status) queryParams.append('status', params.status)

    const endpoint = `${API_ENDPOINTS.PACKAGES.LIST}?${queryParams.toString()}`
    return apiService.get(endpoint)
  }

  // Get package by ID
  async getPackageById(id) {
    return apiService.get(API_ENDPOINTS.PACKAGES.GET_BY_ID(id))
  }

  // Create new package
  async createPackage(packageData) {
    return apiService.post(API_ENDPOINTS.PACKAGES.CREATE, packageData)
  }

  // Update package
  async updatePackage(id, packageData) {
    return apiService.put(API_ENDPOINTS.PACKAGES.UPDATE(id), packageData)
  }

  // Delete package
  async deletePackage(id) {
    return apiService.delete(API_ENDPOINTS.PACKAGES.DELETE(id))
  }

  // Get package types
  getPackageTypes() {
    return [
      { value: 'Album', label: 'Album' },
      { value: 'PhotoShoot', label: 'PhotoShoot' },
      { value: 'Editing', label: 'Editing' },
      { value: 'Video', label: 'Video' },
    ]
  }

  // Validate package data
  validatePackageData(packageData, isUpdate = false) {
    const errors = {}

    if (!isUpdate || packageData.package_name !== undefined) {
      if (!packageData.package_name || packageData.package_name.trim() === '') {
        errors.package_name = 'Package name is required'
      }
    }

    if (!isUpdate || packageData.package_type !== undefined) {
      if (!packageData.package_type || packageData.package_type.trim() === '') {
        errors.package_type = 'Package type is required'
      }
    }

    if (!isUpdate || packageData.default_price !== undefined) {
      if (!packageData.default_price || packageData.default_price < 0) {
        errors.default_price = 'Default price is required and must be >= 0'
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }
}

// Create and export singleton instance
const packageService = new PackageService()
export default packageService

