// Transaction Service - API calls for wallet/credit-debit management
import apiService from '../api'
import { API_ENDPOINTS } from '../constants/api'

const mapTransaction = (transaction = {}) => {
  if (!transaction) return null

  const customer = transaction.customer || {}
  const order = transaction.order || {}

  return {
    ...transaction,
    customer_id: transaction.customer_id ?? customer.id ?? null,
    customer_name: transaction.customer_name || customer.name || null,
    branch_id: transaction.branch_id ?? customer.branch_id ?? order.branch_id ?? null,
    order_id: transaction.order_id ?? order.id ?? null,
    order_number: order.orderNumber || (order.id ? `#${String(order.id).padStart(5, '0')}` : null),
    amount: Number(transaction.amount ?? 0),
    transaction_date: transaction.transaction_date,
    remarks: transaction.remarks || '',
    type: transaction.type,
  }
}

const mapTransactionListResponse = (response) => {
  const data = Array.isArray(response?.data) ? response.data : response
  const transactions = Array.isArray(data) ? data.map(mapTransaction) : []

  return {
    success: response?.success ?? true,
    data: transactions,
    total: response?.total ?? transactions.length,
    page: response?.current_page ?? response?.page ?? 1,
    limit: response?.per_page ?? response?.limit ?? transactions.length,
    message: response?.message,
  }
}

const normalizeTransactionPayload = (transaction = {}) => ({
  customer_id: Number(transaction.customer_id),
  branch_id: Number(transaction.branch_id),
  transaction_date: transaction.transaction_date,
  type: transaction.type,
  amount: Number(transaction.amount),
  remarks: transaction.remarks ?? null,
  order_id: transaction.order_id ? Number(transaction.order_id) : null,
})

const transactionService = {
  async getTransactions(params = {}) {
    const query = {
      page: params.page,
      limit: params.limit,
      customer_id: params.customer_id,
      order_id: params.order_id,
      type: params.type,
      branch_id: params.branch_id,
    }

    try {
      const response = await apiService.get(API_ENDPOINTS.TRANSACTIONS.LIST, { params: query })
      return mapTransactionListResponse(response)
    } catch (error) {
      return error
    }
  },

  async getTransactionById(id) {
    try {
      const response = await apiService.get(API_ENDPOINTS.TRANSACTIONS.GET_BY_ID(id))
      return {
        success: response?.success ?? true,
        data: mapTransaction(response?.data ?? response),
        message: response?.message,
      }
    } catch (error) {
      return error
    }
  },

  async createTransaction(transactionData) {
    try {
      const payload = normalizeTransactionPayload(transactionData)
      const response = await apiService.post(API_ENDPOINTS.TRANSACTIONS.CREATE, payload)
      return {
        success: response?.success ?? true,
        data: mapTransaction(response?.data ?? response),
        message: response?.message ?? 'Transaction created successfully',
      }
    } catch (error) {
      return error
    }
  },

  async updateTransaction(id, transactionData) {
    try {
      const payload = normalizeTransactionPayload(transactionData)
      const response = await apiService.put(API_ENDPOINTS.TRANSACTIONS.UPDATE(id), payload)
      return {
        success: response?.success ?? true,
        data: mapTransaction(response?.data ?? response),
        message: response?.message ?? 'Transaction updated successfully',
      }
    } catch (error) {
      return error
    }
  },

  async getTransactionsByCustomer(customerId, params = {}) {
    const response = await this.getTransactions({ ...params, customer_id: customerId })
    return response
  },

  async getTransactionsByOrder(orderId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.TRANSACTIONS.GET_BY_ORDER(orderId))
      return {
        success: response?.success ?? true,
        data: Array.isArray(response?.data) ? response.data.map(mapTransaction) : [],
        message: response?.message,
      }
    } catch (error) {
      return error
    }
  },

  getTransactionTypes() {
    return [
      { value: 'credit', label: 'Credit (+ Money IN)', color: 'success' },
      { value: 'debit', label: 'Debit (- Money OUT)', color: 'danger' },
    ]
  },

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
      if (!transactionData.amount || Number(transactionData.amount) <= 0) {
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
  },
}

export default transactionService

