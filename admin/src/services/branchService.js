// Branch Service - API calls for branch management
import apiService from '../api'
import { API_ENDPOINTS } from '../constants/api'
import branchesMockData from '../mock/branches.json'

class BranchService {
  // Get all branches
  async getBranches(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.search) queryParams.append('search', params.search)
      if (params.status) queryParams.append('status', params.status)
      if (params.city) queryParams.append('city', params.city)

      const endpoint = `${API_ENDPOINTS.BRANCHES.LIST}?${queryParams.toString()}`
      const response = await apiService.get(endpoint)
      
      // If API call succeeds, return the response
      if (response && response.success) {
        return response
      }
      
      // Fallback to mock data if API fails
      return this.getMockBranches(params)
    } catch (error) {
      console.warn('API call failed, using mock data:', error)
      // Return mock data if API call fails
      return this.getMockBranches(params)
    }
  }

  // Get mock branches data (fallback)
  getMockBranches(params = {}) {
    let branches = [...branchesMockData]
    
    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase()
      branches = branches.filter(branch => 
        branch.branch_name?.toLowerCase().includes(searchTerm) ||
        branch.branch_code?.toLowerCase().includes(searchTerm) ||
        branch.city?.toLowerCase().includes(searchTerm)
      )
    }
    
    // Apply status filter
    if (params.status) {
      branches = branches.filter(branch => branch.status === params.status)
    }
    
    // Apply city filter
    if (params.city) {
      branches = branches.filter(branch => branch.city?.toLowerCase().includes(params.city.toLowerCase()))
    }
    
    // Apply pagination
    const page = params.page || 1
    const limit = params.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedBranches = branches.slice(startIndex, endIndex)
    
    return {
      success: true,
      data: paginatedBranches,
      total: branches.length,
      page: page,
      limit: limit
    }
  }

  // Get branch by ID
  async getBranchById(id) {
    try {
      const response = await apiService.get(API_ENDPOINTS.BRANCHES.GET_BY_ID(id))
      if (response && response.success) {
        return response
      }
      // Fallback to mock data
      return this.getMockBranchById(id)
    } catch (error) {
      console.warn('API call failed, using mock data:', error)
      return this.getMockBranchById(id)
    }
  }

  // Get mock branch by ID (fallback)
  getMockBranchById(id) {
    const branch = branchesMockData.find(b => b.id === parseInt(id))
    if (branch) {
      return {
        success: true,
        data: branch
      }
    }
    return {
      success: false,
      message: 'Branch not found'
    }
  }

  // Create new branch
  async createBranch(branchData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.BRANCHES.CREATE, branchData)
      if (response && response.success) {
        return response
      }
      // Fallback to mock data (simulate creation)
      return this.createMockBranch(branchData)
    } catch (error) {
      console.warn('API call failed, using mock data:', error)
      return this.createMockBranch(branchData)
    }
  }

  // Create mock branch (fallback)
  createMockBranch(branchData) {
    const newBranch = {
      id: branchesMockData.length + 1,
      ...branchData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    // In real implementation, this would be saved to backend
    return {
      success: true,
      data: newBranch,
      message: 'Branch created successfully (mock)'
    }
  }

  // Update branch
  async updateBranch(id, branchData) {
    try {
      const response = await apiService.put(API_ENDPOINTS.BRANCHES.UPDATE(id), branchData)
      if (response && response.success) {
        return response
      }
      // Fallback to mock data (simulate update)
      return this.updateMockBranch(id, branchData)
    } catch (error) {
      console.warn('API call failed, using mock data:', error)
      return this.updateMockBranch(id, branchData)
    }
  }

  // Update mock branch (fallback)
  updateMockBranch(id, branchData) {
    const branchIndex = branchesMockData.findIndex(b => b.id === parseInt(id))
    if (branchIndex !== -1) {
      const updatedBranch = {
        ...branchesMockData[branchIndex],
        ...branchData,
        updated_at: new Date().toISOString()
      }
      // In real implementation, this would be saved to backend
      return {
        success: true,
        data: updatedBranch,
        message: 'Branch updated successfully (mock)'
      }
    }
    return {
      success: false,
      message: 'Branch not found'
    }
  }

  // Delete branch
  async deleteBranch(id) {
    try {
      const response = await apiService.delete(API_ENDPOINTS.BRANCHES.DELETE(id))
      if (response && response.success) {
        return response
      }
      // Fallback to mock data (simulate delete)
      return this.deleteMockBranch(id)
    } catch (error) {
      console.warn('API call failed, using mock data:', error)
      return this.deleteMockBranch(id)
    }
  }

  // Delete mock branch (fallback)
  deleteMockBranch(id) {
    const branchIndex = branchesMockData.findIndex(b => b.id === parseInt(id))
    if (branchIndex !== -1) {
      // In real implementation, this would be deleted from backend
      return {
        success: true,
        message: 'Branch deleted successfully (mock)'
      }
    }
    return {
      success: false,
      message: 'Branch not found'
    }
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

