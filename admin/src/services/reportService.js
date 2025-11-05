// Report Service - API calls for reports
import apiService from '../api'
import { API_ENDPOINTS } from '../constants/api'

class ReportService {
  // Get sales report
  async getSalesReport(params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)
    if (params.branch_id) queryParams.append('branch_id', params.branch_id)
    if (params.groupBy) queryParams.append('groupBy', params.groupBy)

    const endpoint = `${API_ENDPOINTS.REPORTS.SALES}?${queryParams.toString()}`
    return apiService.get(endpoint)
  }

  // Get ledger report
  async getLedgerReport(params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.customer_id) queryParams.append('customer_id', params.customer_id)
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)
    if (params.branch_id) queryParams.append('branch_id', params.branch_id)

    const endpoint = `${API_ENDPOINTS.REPORTS.LEDGER}?${queryParams.toString()}`
    return apiService.get(endpoint)
  }

  // Get branch report
  async getBranchReport(params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.branch_id) queryParams.append('branch_id', params.branch_id)
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)

    const endpoint = `${API_ENDPOINTS.REPORTS.BRANCH}?${queryParams.toString()}`
    return apiService.get(endpoint)
  }

  // Get staff report
  async getStaffReport(params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.user_id) queryParams.append('user_id', params.user_id)
    if (params.branch_id) queryParams.append('branch_id', params.branch_id)
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)

    const endpoint = `${API_ENDPOINTS.REPORTS.STAFF}?${queryParams.toString()}`
    return apiService.get(endpoint)
  }

  // Export report
  async exportReport(type, format = 'csv', params = {}) {
    const queryParams = new URLSearchParams()
    queryParams.append('format', format)
    
    Object.keys(params).forEach(key => {
      if (params[key]) queryParams.append(key, params[key])
    })

    const endpoint = `${API_ENDPOINTS.REPORTS.EXPORT(type)}?${queryParams.toString()}`
    return apiService.get(endpoint, { responseType: 'blob' })
  }
}

// Create and export singleton instance
const reportService = new ReportService()
export default reportService

