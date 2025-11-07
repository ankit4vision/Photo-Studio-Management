// Package Service - API calls for package management
import apiService from '../api'
import { API_ENDPOINTS } from '../constants/api'
import packagesMockData from '../mock/packages.json'

class PackageService {
  // Get all packages
  async getPackages(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.search) queryParams.append('search', params.search)
      if (params.package_type) queryParams.append('package_type', params.package_type)
      if (params.status) queryParams.append('status', params.status)

      const endpoint = `${API_ENDPOINTS.PACKAGES.LIST}?${queryParams.toString()}`
      const response = await apiService.get(endpoint)
      
      // If API call succeeds, return the response
      if (response && response.success) {
        return response
      }
      
      // Fallback to mock data if API fails
      return this.getMockPackages(params)
    } catch (error) {
      console.warn('API call failed, using mock data:', error)
      // Return mock data if API call fails
      return this.getMockPackages(params)
    }
  }

  // Get mock packages data (fallback)
  getMockPackages(params = {}) {
    let packages = [...packagesMockData]
    
    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase()
      packages = packages.filter(pkg => 
        pkg.package_name?.toLowerCase().includes(searchTerm) ||
        pkg.description?.toLowerCase().includes(searchTerm) ||
        pkg.package_type?.toLowerCase().includes(searchTerm)
      )
    }
    
    // Apply package type filter
    if (params.package_type) {
      packages = packages.filter(pkg => pkg.package_type === params.package_type)
    }
    
    // Apply status filter
    if (params.status) {
      packages = packages.filter(pkg => pkg.status === params.status)
    }
    
    // Apply pagination
    const page = params.page || 1
    const limit = params.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPackages = packages.slice(startIndex, endIndex)
    
    return {
      success: true,
      data: paginatedPackages,
      total: packages.length,
      page: page,
      limit: limit
    }
  }

  // Get package by ID
  async getPackageById(id) {
    try {
      const response = await apiService.get(API_ENDPOINTS.PACKAGES.GET_BY_ID(id))
      if (response && response.success) {
        return response
      }
      // Fallback to mock data
      return this.getMockPackageById(id)
    } catch (error) {
      console.warn('API call failed, using mock data:', error)
      return this.getMockPackageById(id)
    }
  }

  // Get mock package by ID (fallback)
  getMockPackageById(id) {
    const pkg = packagesMockData.find(p => p.id === parseInt(id))
    if (pkg) {
      return {
        success: true,
        data: pkg
      }
    }
    return {
      success: false,
      message: 'Package not found'
    }
  }

  // Create new package
  async createPackage(packageData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.PACKAGES.CREATE, packageData)
      if (response && response.success) {
        return response
      }
      // Fallback to mock data (simulate creation)
      return this.createMockPackage(packageData)
    } catch (error) {
      console.warn('API call failed, using mock data:', error)
      return this.createMockPackage(packageData)
    }
  }

  // Create mock package (fallback)
  createMockPackage(packageData) {
    const newPackage = {
      id: packagesMockData.length + 1,
      ...packageData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    // In real implementation, this would be saved to backend
    return {
      success: true,
      data: newPackage,
      message: 'Package created successfully (mock)'
    }
  }

  // Update package
  async updatePackage(id, packageData) {
    try {
      const response = await apiService.put(API_ENDPOINTS.PACKAGES.UPDATE(id), packageData)
      if (response && response.success) {
        return response
      }
      // Fallback to mock data (simulate update)
      return this.updateMockPackage(id, packageData)
    } catch (error) {
      console.warn('API call failed, using mock data:', error)
      return this.updateMockPackage(id, packageData)
    }
  }

  // Update mock package (fallback)
  updateMockPackage(id, packageData) {
    const packageIndex = packagesMockData.findIndex(p => p.id === parseInt(id))
    if (packageIndex !== -1) {
      const updatedPackage = {
        ...packagesMockData[packageIndex],
        ...packageData,
        updated_at: new Date().toISOString()
      }
      // In real implementation, this would be saved to backend
      return {
        success: true,
        data: updatedPackage,
        message: 'Package updated successfully (mock)'
      }
    }
    return {
      success: false,
      message: 'Package not found'
    }
  }

  // Delete package
  async deletePackage(id) {
    try {
      const response = await apiService.delete(API_ENDPOINTS.PACKAGES.DELETE(id))
      if (response && response.success) {
        return response
      }
      // Fallback to mock data (simulate delete)
      return this.deleteMockPackage(id)
    } catch (error) {
      console.warn('API call failed, using mock data:', error)
      return this.deleteMockPackage(id)
    }
  }

  // Delete mock package (fallback)
  deleteMockPackage(id) {
    const packageIndex = packagesMockData.findIndex(p => p.id === parseInt(id))
    if (packageIndex !== -1) {
      // In real implementation, this would be deleted from backend
      return {
        success: true,
        message: 'Package deleted successfully (mock)'
      }
    }
    return {
      success: false,
      message: 'Package not found'
    }
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

