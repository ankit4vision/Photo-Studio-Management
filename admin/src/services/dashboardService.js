import apiClient from '../config/apiClient'
import { handleApiError } from '../utils/errorHandler'

const dashboardService = {
  async getSummary(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      if (params.startDate) queryParams.append('start_date', params.startDate)
      if (params.endDate) queryParams.append('end_date', params.endDate)

      const url = `/dashboard/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get(url)
      return {
        success: response.data?.success ?? true,
        data: response.data?.data || response.data,
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async getRevenueTrend(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      if (params.range) queryParams.append('range', params.range)
      if (params.endDate) queryParams.append('end_date', params.endDate)

      const url = `/dashboard/revenue-trend${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get(url)
      return {
        success: response.data?.success ?? true,
        data: response.data?.data || response.data,
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  async getRecentActivities() {
    try {
      const response = await apiClient.get('/dashboard/recent-activities')
      return {
        success: response.data?.success ?? true,
        data: response.data?.data || response.data,
      }
    } catch (error) {
      return handleApiError(error)
    }
  },
}

export default dashboardService

