// Payment Service - API calls for payment management
import apiClient from '../config/apiClient'
import { API_ENDPOINTS } from '../constants/api'
import { handleApiError } from '../utils/errorHandler'

class PaymentService {
  // Get all payments
  async getPayments(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.order_id || params.orderId) queryParams.append('order_id', params.order_id || params.orderId)
      if (params.customer_id || params.customerId) queryParams.append('customer_id', params.customer_id || params.customerId)
      if (params.branch_id) queryParams.append('branch_id', params.branch_id)
      if (params.payment_type || params.paymentType) queryParams.append('payment_type', params.payment_type || params.paymentType)
      if (params.payment_method || params.paymentMethod) queryParams.append('payment_method', params.payment_method || params.paymentMethod)
      if (params.search) queryParams.append('search', params.search)
      if (params.start_date || params.startDate) queryParams.append('start_date', params.start_date || params.startDate)
      if (params.end_date || params.endDate) queryParams.append('end_date', params.end_date || params.endDate)

      const url = `${API_ENDPOINTS.PAYMENTS.BASE}${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data?.data || response.data || [],
        meta: response.data?.meta || {},
        message: response.data?.message || 'Payments retrieved successfully',
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Create new payment
  async createPayment(paymentData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PAYMENTS.CREATE, paymentData)
      
      return {
        success: response.data?.success ?? true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Payment recorded successfully',
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Get payment by ID
  async getPaymentById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PAYMENTS.GET_BY_ID(id))
      
      return {
        success: response.data?.success ?? true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Payment retrieved successfully',
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Update payment
  async updatePayment(id, paymentData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.PAYMENTS.GET_BY_ID(id), paymentData)
      
      return {
        success: response.data?.success ?? true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Payment updated successfully',
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Get payments by order
  async getPaymentsByOrder(orderId, params = {}) {
    try {
      const queryParams = new URLSearchParams()
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)

      const url = `${API_ENDPOINTS.PAYMENTS.GET_BY_ORDER(orderId)}${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data?.data || response.data || [],
        meta: response.data?.meta || {},
        message: response.data?.message || 'Payments retrieved successfully',
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Get payment methods
  getPaymentMethods() {
    return [
      { value: 'cash', label: 'Cash' },
      { value: 'upi', label: 'UPI' },
      { value: 'card', label: 'Card' },
      { value: 'bank_transfer', label: 'Bank Transfer' },
    ]
  }

  // Validate payment data
  validatePaymentData(paymentData, isUpdate = false) {
    const errors = {}

    if (!isUpdate || paymentData.order_id !== undefined) {
      if (!paymentData.order_id) {
        errors.order_id = 'Order is required'
      }
    }

    if (!isUpdate || paymentData.amount !== undefined) {
      if (!paymentData.amount || paymentData.amount <= 0) {
        errors.amount = 'Amount is required and must be > 0'
      }
    }

    if (!isUpdate || paymentData.payment_method !== undefined) {
      if (!paymentData.payment_method) {
        errors.payment_method = 'Payment method is required'
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }
}

// Create and export singleton instance
const paymentService = new PaymentService()
export default paymentService

