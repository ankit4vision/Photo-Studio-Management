// Transaction Service - API calls for wallet/credit-debit management
import apiService from '../api'
import { API_ENDPOINTS } from '../constants/api'

class TransactionService {
  // Get all transactions
  async getTransactions(params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.customer_id) queryParams.append('customer_id', params.customer_id)
    if (params.order_id) queryParams.append('order_id', params.order_id)
    if (params.type) queryParams.append('type', params.type)
    if (params.branch_id) queryParams.append('branch_id', params.branch_id)
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)

    const endpoint = `${API_ENDPOINTS.TRANSACTIONS.LIST}?${queryParams.toString()}`
    return apiService.get(endpoint)
  }

  // Get transaction by ID
  async getTransactionById(id) {
    return apiService.get(API_ENDPOINTS.TRANSACTIONS.GET_BY_ID(id))
  }

  // Create new transaction
  async createTransaction(transactionData) {
    return apiService.post(API_ENDPOINTS.TRANSACTIONS.CREATE, transactionData)
  }

  // Update transaction
  async updateTransaction(id, transactionData) {
    return apiService.put(API_ENDPOINTS.TRANSACTIONS.UPDATE(id), transactionData)
  }

  // Get transactions by customer
  async getTransactionsByCustomer(customerId, params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.type) queryParams.append('type', params.type)
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)

    const endpoint = `${API_ENDPOINTS.TRANSACTIONS.GET_BY_CUSTOMER(customerId)}?${queryParams.toString()}`
    return apiService.get(endpoint)
  }

  // Get transactions by order
  async getTransactionsByOrder(orderId) {
    return apiService.get(API_ENDPOINTS.TRANSACTIONS.GET_BY_ORDER(orderId))
  }

  // Get transaction types
  getTransactionTypes() {
    return [
      { value: 'credit', label: 'Credit', color: 'success' },
      { value: 'debit', label: 'Debit', color: 'danger' },
    ]
  }

  // Validate transaction data
  validateTransactionData(transactionData, isUpdate = false) {
    const errors = {}

    if (!isUpdate || transactionData.customer_id !== undefined) {
      if (!transactionData.customer_id) {
        errors.customer_id = 'Customer is required'
      }
    }

    if (!isUpdate || transactionData.branch_id !== undefined) {
      if (!transactionData.branch_id) {
        errors.branch_id = 'Branch is required'
      }
    }

    if (!isUpdate || transactionData.type !== undefined) {
      if (!transactionData.type || !['credit', 'debit'].includes(transactionData.type)) {
        errors.type = 'Transaction type is required (credit or debit)'
      }
    }

    if (!isUpdate || transactionData.amount !== undefined) {
      if (!transactionData.amount || transactionData.amount <= 0) {
        errors.amount = 'Amount is required and must be > 0'
      }
    }

    if (!isUpdate || transactionData.transaction_date !== undefined) {
      if (!transactionData.transaction_date) {
        errors.transaction_date = 'Transaction date is required'
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }
}

// Create and export singleton instance
const transactionService = new TransactionService()
export default transactionService

