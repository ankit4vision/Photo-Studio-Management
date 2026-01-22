// Financial Service - API calls for financial transaction management
import apiClient from '../config/apiClient'
import { API_ENDPOINTS } from '../constants/api'
import { handleApiError } from '../utils/errorHandler'

class FinancialService {
  // Get all financial transactions
  async getTransactions(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.transaction_type || params.transactionType) queryParams.append('transaction_type', params.transaction_type || params.transactionType)
      if (params.category_id || params.categoryId) queryParams.append('category_id', params.category_id || params.categoryId)
      if (params.start_date || params.startDate) queryParams.append('start_date', params.start_date || params.startDate)
      if (params.end_date || params.endDate) queryParams.append('end_date', params.end_date || params.endDate)
      if (params.min_amount || params.minAmount) queryParams.append('min_amount', params.min_amount || params.minAmount)
      if (params.max_amount || params.maxAmount) queryParams.append('max_amount', params.max_amount || params.maxAmount)
      if (params.search) queryParams.append('search', params.search)
      if (params.sort_by || params.sortBy) queryParams.append('sort_by', params.sort_by || params.sortBy)
      if (params.sort_direction || params.sortDirection) queryParams.append('sort_direction', params.sort_direction || params.sortDirection)

      const url = `${API_ENDPOINTS.FINANCIAL_TRANSACTIONS.BASE}${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      const response = await apiClient.get(url)

      let transactions = []
      const responseData = response.data?.data ?? response.data

      if (Array.isArray(responseData)) {
        transactions = responseData
      } else if (Array.isArray(responseData?.data)) {
        transactions = responseData.data
      }
      
      return {
        success: true,
        data: transactions,
        meta: response.data?.meta || responseData?.meta || {},
        message: response.data?.message || 'Transactions retrieved successfully',
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Get transaction by ID
  async getTransactionById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.FINANCIAL_TRANSACTIONS.GET_BY_ID(id))
      
      return {
        success: response.data?.success ?? true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Transaction retrieved successfully',
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Create new financial transaction
  async createTransaction(transactionData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.FINANCIAL_TRANSACTIONS.CREATE, transactionData)
      
      return {
        success: response.data?.success ?? true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Transaction created successfully',
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Update financial transaction
  async updateTransaction(id, transactionData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.FINANCIAL_TRANSACTIONS.UPDATE(id), transactionData)
      
      return {
        success: response.data?.success ?? true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Transaction updated successfully',
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Delete financial transaction
  async deleteTransaction(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.FINANCIAL_TRANSACTIONS.DELETE(id))

      return {
        success: response.data?.success ?? true,
        data: response.data?.data || null,
        message: response.data?.message || 'Transaction deleted successfully',
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Get financial statistics
  async getStats(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      if (params.start_date || params.startDate) queryParams.append('start_date', params.start_date || params.startDate)
      if (params.end_date || params.endDate) queryParams.append('end_date', params.end_date || params.endDate)
      if (params.category_id || params.categoryId) queryParams.append('category_id', params.category_id || params.categoryId)
      if (params.transaction_type || params.transactionType) queryParams.append('transaction_type', params.transaction_type || params.transactionType)

      const url = `${API_ENDPOINTS.FINANCIAL_TRANSACTIONS.STATS}${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      const response = await apiClient.get(url)

      return {
        success: response.data?.success ?? true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Statistics retrieved successfully',
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Export single financial transaction to PDF
  async exportFinancialTransactionPdf(transactionId, receiptType = 'transaction', params = {}) {
    try {
      const queryParams = new URLSearchParams()
      // Add receipt_type parameter
      queryParams.append('receipt_type', receiptType)
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key])
      })
      
      const url = `${API_ENDPOINTS.FINANCIAL_TRANSACTIONS.EXPORT_PDF(transactionId)}${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      const response = await apiClient.get(url, { responseType: 'blob' })
      
      // Extract filename from Content-Disposition header
      let filename = `financial_transaction_${transactionId}.pdf`
      const contentDisposition = response.headers['content-disposition'] || response.headers['Content-Disposition']
      if (contentDisposition) {
        // Try to extract filename (handles both quoted and unquoted, and URL-encoded)
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '').trim()
          // Decode URL-encoded filename if needed
          try {
            filename = decodeURIComponent(filename)
          } catch (e) {
            // If decoding fails, use as-is
          }
        }
      }
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url_blob = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url_blob
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url_blob)
      
      return { success: true, message: 'PDF exported successfully' }
    } catch (error) {
      return handleApiError(error)
    }
  }
}

const financialService = new FinancialService()
export default financialService
