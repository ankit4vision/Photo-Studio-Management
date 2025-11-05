// Order Management Service
import apiService from '../api'
import { API_ENDPOINTS } from '../constants/api'

class OrderService {
  // Get all orders with pagination and filters
  async getOrders(params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.search) queryParams.append('search', params.search)
    if (params.status) queryParams.append('status', params.status)
    if (params.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus)
    if (params.customerId) queryParams.append('customerId', params.customerId)
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)
    if (params.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)

    const endpoint = `${API_ENDPOINTS.ORDERS.LIST}?${queryParams.toString()}`
    return apiService.get(endpoint)
  }

  // Get order by ID
  async getOrderById(orderId) {
    return apiService.get(API_ENDPOINTS.ORDERS.GET_BY_ID(orderId))
  }

  // Create new order
  async createOrder(orderData) {
    return apiService.post(API_ENDPOINTS.ORDERS.CREATE, orderData)
  }

  // Update order
  async updateOrder(orderId, orderData) {
    return apiService.put(API_ENDPOINTS.ORDERS.UPDATE(orderId), orderData)
  }

  // Delete order
  async deleteOrder(orderId) {
    return apiService.delete(API_ENDPOINTS.ORDERS.DELETE(orderId))
  }

  // Update order status
  async updateOrderStatus(orderId, status, notes = '') {
    return apiService.patch(API_ENDPOINTS.ORDERS.UPDATE_STATUS(orderId), { 
      status, 
      notes 
    })
  }

  // Update payment status
  async updatePaymentStatus(orderId, paymentStatus, paymentMethod = '') {
    return apiService.patch(API_ENDPOINTS.ORDERS.UPDATE_PAYMENT_STATUS(orderId), { 
      paymentStatus, 
      paymentMethod 
    })
  }

  // Update shipping information
  async updateShippingInfo(orderId, shippingData) {
    return apiService.patch(API_ENDPOINTS.ORDERS.UPDATE_SHIPPING(orderId), shippingData)
  }

  // Cancel order
  async cancelOrder(orderId, reason = '') {
    return apiService.patch(API_ENDPOINTS.ORDERS.CANCEL(orderId), { reason })
  }

  // Refund order
  async refundOrder(orderId, amount, reason = '') {
    return apiService.post(API_ENDPOINTS.ORDERS.REFUND(orderId), { 
      amount, 
      reason 
    })
  }

  // Bulk update orders
  async bulkUpdateOrders(orderIds, updateData) {
    return apiService.patch(API_ENDPOINTS.ORDERS.BULK_UPDATE, { 
      orderIds, 
      ...updateData 
    })
  }

  // Bulk delete orders
  async bulkDeleteOrders(orderIds) {
    return apiService.post(API_ENDPOINTS.ORDERS.BULK_DELETE, { orderIds })
  }

  // Search orders
  async searchOrders(query, filters = {}) {
    const searchParams = { query, ...filters }
    return apiService.post(API_ENDPOINTS.ORDERS.SEARCH, searchParams)
  }

  // Export orders
  async exportOrders(format = 'csv', filters = {}) {
    const queryParams = new URLSearchParams()
    queryParams.append('format', format)
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) queryParams.append(key, filters[key])
    })

    const endpoint = `${API_ENDPOINTS.ORDERS.EXPORT}?${queryParams.toString()}`
    return apiService.get(endpoint, { responseType: 'blob' })
  }

  // Get order statistics
  async getOrderStats(params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)
    if (params.groupBy) queryParams.append('groupBy', params.groupBy)

    const endpoint = `${API_ENDPOINTS.ORDERS.STATS}?${queryParams.toString()}`
    return apiService.get(endpoint)
  }

  // Get order timeline/history
  async getOrderHistory(orderId) {
    return apiService.get(API_ENDPOINTS.ORDERS.GET_HISTORY(orderId))
  }

  // Add note to order
  async addOrderNote(orderId, note, isInternal = false) {
    return apiService.post(API_ENDPOINTS.ORDERS.ADD_NOTE(orderId), { 
      note, 
      isInternal 
    })
  }

  // Get order notes
  async getOrderNotes(orderId) {
    return apiService.get(API_ENDPOINTS.ORDERS.GET_NOTES(orderId))
  }

  // Send order confirmation email
  async sendOrderConfirmation(orderId) {
    return apiService.post(API_ENDPOINTS.ORDERS.SEND_CONFIRMATION(orderId))
  }

  // Send order update email
  async sendOrderUpdate(orderId, updateType) {
    return apiService.post(API_ENDPOINTS.ORDERS.SEND_UPDATE(orderId), { updateType })
  }

  // Get orders by customer
  async getOrdersByCustomer(customerId, params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.status) queryParams.append('status', params.status)

    const endpoint = `${API_ENDPOINTS.ORDERS.GET_BY_CUSTOMER(customerId)}?${queryParams.toString()}`
    return apiService.get(endpoint)
  }

  // Get order items
  async getOrderItems(orderId) {
    return apiService.get(API_ENDPOINTS.ORDERS.GET_ITEMS(orderId))
  }

  // Update order item
  async updateOrderItem(orderId, itemId, itemData) {
    return apiService.put(API_ENDPOINTS.ORDERS.UPDATE_ITEM(orderId, itemId), itemData)
  }

  // Remove order item
  async removeOrderItem(orderId, itemId) {
    return apiService.delete(API_ENDPOINTS.ORDERS.REMOVE_ITEM(orderId, itemId))
  }

  // Add item to order
  async addOrderItem(orderId, itemData) {
    return apiService.post(API_ENDPOINTS.ORDERS.ADD_ITEM(orderId), itemData)
  }

  // Print order invoice
  async printOrderInvoice(orderId) {
    return apiService.get(API_ENDPOINTS.ORDERS.PRINT_INVOICE(orderId), { 
      responseType: 'blob' 
    })
  }

  // Print order receipt
  async printOrderReceipt(orderId) {
    return apiService.get(API_ENDPOINTS.ORDERS.PRINT_RECEIPT(orderId), { 
      responseType: 'blob' 
    })
  }

  // Get order analytics
  async getOrderAnalytics(params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)
    if (params.metrics) queryParams.append('metrics', params.metrics.join(','))
    if (params.groupBy) queryParams.append('groupBy', params.groupBy)

    const endpoint = `${API_ENDPOINTS.ORDERS.ANALYTICS}?${queryParams.toString()}`
    return apiService.get(endpoint)
  }

  // Validate order data
  validateOrderData(orderData, isUpdate = false) {
    const errors = {}

    if (!isUpdate || orderData.customerId !== undefined) {
      if (!orderData.customerId) {
        errors.customerId = 'Customer is required'
      }
    }

    if (!isUpdate || orderData.items !== undefined) {
      if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
        errors.items = 'At least one item is required'
      }
    }

    if (!isUpdate || orderData.shippingAddress !== undefined) {
      if (!orderData.shippingAddress) {
        errors.shippingAddress = 'Shipping address is required'
      }
    }

    if (!isUpdate || orderData.paymentMethod !== undefined) {
      if (!orderData.paymentMethod) {
        errors.paymentMethod = 'Payment method is required'
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }

  // Get order status options
  getOrderStatusOptions() {
    return [
      { value: 'pending', label: 'Pending', color: 'warning' },
      { value: 'confirmed', label: 'Confirmed', color: 'info' },
      { value: 'processing', label: 'Processing', color: 'primary' },
      { value: 'completed', label: 'Completed', color: 'success' },
      { value: 'cancelled', label: 'Cancelled', color: 'danger' },
    ]
  }

  // Get payment status options
  getPaymentStatusOptions() {
    return [
      { value: 'pending', label: 'Pending', color: 'warning' },
      { value: 'paid', label: 'Paid', color: 'success' },
      { value: 'failed', label: 'Failed', color: 'danger' },
      { value: 'refunded', label: 'Refunded', color: 'secondary' },
      { value: 'partial', label: 'Partial', color: 'info' },
    ]
  }

  // Get payment method options
  getPaymentMethodOptions() {
    return [
      { value: 'cash', label: 'Cash' },
      { value: 'upi', label: 'UPI' },
      { value: 'card', label: 'Card' },
      { value: 'bank_transfer', label: 'Bank Transfer' },
    ]
  }
}

// Create and export singleton instance
const orderService = new OrderService()
export default orderService
