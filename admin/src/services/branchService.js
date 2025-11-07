// Branch Service - API calls for branch management
import apiService from '../api'
import { API_ENDPOINTS } from '../constants/api'

const mapBranchResponse = (payload = {}) => {
  const data = payload.data ?? payload
  return {
    success: payload.success ?? true,
    data,
    total: payload.total ?? data?.length ?? 0,
    current_page: payload.current_page ?? payload.page ?? 1,
    per_page: payload.per_page ?? payload.limit ?? data?.length ?? 0,
    message: payload.message,
  }
}

const branchService = {
  async getBranches(params = {}) {
    try {
      const response = await apiService.get(API_ENDPOINTS.BRANCHES.LIST, {
        params,
      })

      return mapBranchResponse(response)
    } catch (error) {
      return error
    }
  },

  async getBranchById(id) {
    try {
      const response = await apiService.get(API_ENDPOINTS.BRANCHES.GET_BY_ID(id))
      const data = response?.data ?? response
      return {
        success: response?.success ?? true,
        data,
        message: response?.message,
      }
    } catch (error) {
      return error
    }
  },

  async createBranch(branchData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.BRANCHES.CREATE, branchData)
      return {
        success: response?.success ?? true,
        data: response?.data ?? response,
        message: response?.message ?? 'Branch created successfully',
      }
    } catch (error) {
      return error
    }
  },

  async updateBranch(id, branchData) {
    try {
      const response = await apiService.put(API_ENDPOINTS.BRANCHES.UPDATE(id), branchData)
      return {
        success: response?.success ?? true,
        data: response?.data ?? response,
        message: response?.message ?? 'Branch updated successfully',
      }
    } catch (error) {
      return error
    }
  },

  async deleteBranch(id) {
    try {
      const response = await apiService.delete(API_ENDPOINTS.BRANCHES.DELETE(id))
      return {
        success: response?.success ?? true,
        message: response?.message ?? 'Branch deleted successfully',
      }
    } catch (error) {
      return error
    }
  },

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
  },
}

export default branchService

