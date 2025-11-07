// Package Service - API calls for package management
import apiService from '../api'
import { API_ENDPOINTS } from '../constants/api'

const mapPackageStatus = (status) => {
  if (typeof status === 'boolean') {
    return status ? 'active' : 'inactive'
  }

  if (typeof status === 'number') {
    return status === 1 ? 'active' : 'inactive'
  }

  if (typeof status === 'string') {
    return ['active', '1', 'true'].includes(status.toLowerCase()) ? 'active' : 'inactive'
  }

  return 'inactive'
}

const statusToBoolean = (status) => {
  if (typeof status === 'boolean') {
    return status
  }

  if (typeof status === 'number') {
    return status === 1
  }

  if (typeof status === 'string') {
    return ['active', '1', 'true'].includes(status.toLowerCase())
  }

  return true
}

const mapPackage = (pkg = {}) => ({
  ...pkg,
  status: mapPackageStatus(pkg.status ?? true),
  isActive: statusToBoolean(pkg.status ?? true),
})

const normalizePackagePayload = (pkg = {}) => ({
  package_name: pkg.package_name,
  package_type: pkg.package_type,
  default_price: pkg.default_price,
  description: pkg.description ?? null,
  status: statusToBoolean(pkg.status),
})

const packageService = {
  async getPackages(params = {}) {
    try {
      const response = await apiService.get(API_ENDPOINTS.PACKAGES.LIST, { params })
      const data = Array.isArray(response?.data) ? response.data : response
      const packages = Array.isArray(data) ? data.map(mapPackage) : []

      return {
        success: response?.success ?? true,
        data: packages,
        total: response?.total ?? packages.length,
        message: response?.message,
      }
    } catch (error) {
      return error
    }
  },

  async getPackageById(id) {
    try {
      const response = await apiService.get(API_ENDPOINTS.PACKAGES.GET_BY_ID(id))
      return {
        success: response?.success ?? true,
        data: mapPackage(response?.data ?? response),
        message: response?.message,
      }
    } catch (error) {
      return error
    }
  },

  async createPackage(packageData) {
    try {
      const payload = normalizePackagePayload(packageData)
      const response = await apiService.post(API_ENDPOINTS.PACKAGES.CREATE, payload)
      return {
        success: response?.success ?? true,
        data: mapPackage(response?.data ?? response),
        message: response?.message ?? 'Package created successfully',
      }
    } catch (error) {
      return error
    }
  },

  async updatePackage(id, packageData) {
    try {
      const payload = normalizePackagePayload(packageData)
      const response = await apiService.put(API_ENDPOINTS.PACKAGES.UPDATE(id), payload)
      return {
        success: response?.success ?? true,
        data: mapPackage(response?.data ?? response),
        message: response?.message ?? 'Package updated successfully',
      }
    } catch (error) {
      return error
    }
  },

  async deletePackage(id) {
    try {
      const response = await apiService.delete(API_ENDPOINTS.PACKAGES.DELETE(id))
      return {
        success: response?.success ?? true,
        message: response?.message ?? 'Package deleted successfully',
      }
    } catch (error) {
      return error
    }
  },

  getPackageTypes() {
    return [
      { value: 'Album', label: 'Album' },
      { value: 'PhotoShoot', label: 'PhotoShoot' },
      { value: 'Editing', label: 'Editing' },
      { value: 'Video', label: 'Video' },
    ]
  },

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
      if (packageData.default_price === undefined || Number(packageData.default_price) < 0) {
        errors.default_price = 'Default price is required and must be >= 0'
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  },
}

export default packageService

