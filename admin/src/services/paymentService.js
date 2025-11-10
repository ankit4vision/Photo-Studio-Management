// Payment Service - API calls for payment management
import apiService from '../api'
import { API_ENDPOINTS } from '../constants/api'

class PaymentService {
  // Get all payments
  async getPayments() {
    return apiService.get(API_ENDPOINTS.PAYMENTS.BASE)
  }

  // Create new payment
  async createPayment(paymentData) {
    return apiService.post(API_ENDPOINTS.PAYMENTS.CREATE, paymentData)
  }

  // Get payment by ID
  async getPaymentById(id) {
    return apiService.get(API_ENDPOINTS.PAYMENTS.GET_BY_ID(id))
  }

  // Update payment
  async updatePayment(id, paymentData) {
    return apiService.put(API_ENDPOINTS.PAYMENTS.GET_BY_ID(id), paymentData)
  }

  // Get payments by order
  async getPaymentsByOrder(orderId) {
    return apiService.get(API_ENDPOINTS.PAYMENTS.GET_BY_ORDER(orderId))
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

