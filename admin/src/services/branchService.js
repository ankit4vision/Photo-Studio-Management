// Branch Service - API calls for branch management
import apiService from '../api'
import { API_ENDPOINTS } from '../constants/api'

class BranchService {
  // Get all branches
  async getBranches(params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.search) queryParams.append('search', params.search)
    if (params.status) queryParams.append('status', params.status)
    if (params.city) queryParams.append('city', params.city)

    const endpoint = `${API_ENDPOINTS.BRANCHES.LIST}?${queryParams.toString()}`
    return apiService.get(endpoint)
  }

  // Get branch by ID
  async getBranchById(id) {
    return apiService.get(API_ENDPOINTS.BRANCHES.GET_BY_ID(id))
  }

  // Create new branch
  async createBranch(branchData) {
    return apiService.post(API_ENDPOINTS.BRANCHES.CREATE, branchData)
  }

  // Update branch
  async updateBranch(id, branchData) {
    return apiService.put(API_ENDPOINTS.BRANCHES.UPDATE(id), branchData)
  }

  // Delete branch
  async deleteBranch(id) {
    return apiService.delete(API_ENDPOINTS.BRANCHES.DELETE(id))
  }

  // Validate branch data
  validateBranchData(branchData, isUpdate = false) {
    const errors = {}

    if (!isUpdate || branchData.branch_name !== undefined) {
      if (!branchData.branch_name || branchData.branch_name.trim() === '') {
        errors.branch_name = 'Branch name is required'
      }
    }

    if (!isUpdate || branchData.branch_code !== undefined) {
      if (!branchData.branch_code || branchData.branch_code.trim() === '') {
        errors.branch_code = 'Branch code is required'
      }
    }

    if (!isUpdate || branchData.address !== undefined) {
      if (!branchData.address || branchData.address.trim() === '') {
        errors.address = 'Address is required'
      }
    }

    if (!isUpdate || branchData.city !== undefined) {
      if (!branchData.city || branchData.city.trim() === '') {
        errors.city = 'City is required'
      }
    }

    if (!isUpdate || branchData.contact_number !== undefined) {
      if (!branchData.contact_number || branchData.contact_number.trim() === '') {
        errors.contact_number = 'Contact number is required'
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }
}

// Create and export singleton instance
const branchService = new BranchService()
export default branchService

