// Order Management Service
import apiService from '../api'
import { API_ENDPOINTS } from '../constants/api'
import ordersMockData from '../mock/orders.json'
import { customerService } from './customerService'

class OrderService {
  // Get all orders with pagination and filters
  async getOrders(params = {}) {
    try {
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
      const response = await apiService.get(endpoint)
      
      // If API call succeeds, return the response
      if (response && response.success) {
        return response
      }
      
      // Fallback to mock data if API fails
      return this.getMockOrders(params)
    } catch (error) {
      console.warn('API call failed, using mock data:', error)
      // Return mock data if API call fails
      return this.getMockOrders(params)
    }
  }

  // Get mock orders data (fallback)
  getMockOrders(params = {}) {
    let orders = [...ordersMockData.orders || []]
    
    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase()
      orders = orders.filter(order => 
        order.orderNumber?.toLowerCase().includes(searchTerm) ||
        order.customer_name?.toLowerCase().includes(searchTerm) ||
        order.customer?.name?.toLowerCase().includes(searchTerm) ||
        order.customer?.firstName?.toLowerCase().includes(searchTerm) ||
        order.customer?.lastName?.toLowerCase().includes(searchTerm) ||
        order.customer?.email?.toLowerCase().includes(searchTerm) ||
        order.customer?.phone?.toLowerCase().includes(searchTerm) ||
        order.customer?.mobile?.toLowerCase().includes(searchTerm)
      )
    }
    
    // Apply status filter
    if (params.status) {
      orders = orders.filter(order => order.status === params.status)
    }
    
    // Apply payment status filter
    if (params.paymentStatus) {
      orders = orders.filter(order => order.paymentStatus === params.paymentStatus)
    }
    
    // Apply customer filter
    if (params.customerId) {
      orders = orders.filter(order => order.customerId === parseInt(params.customerId))
    }
    
    // Apply pagination
    const page = params.page || 1
    const limit = params.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOrders = orders.slice(startIndex, endIndex)
    
    return {
      success: true,
      data: {
        orders: paginatedOrders,
        total: orders.length,
        page: page,
        limit: limit
      }
    }
  }

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.ORDERS.GET_BY_ID(orderId))
      if (response && response.success) {
        return response
      }
      // Fallback to mock data
      return this.getMockOrderById(orderId)
    } catch (error) {
      console.warn('API call failed, using mock data:', error)
      return this.getMockOrderById(orderId)
    }
  }

  // Get mock order by ID (fallback)
  getMockOrderById(orderId) {
    const orders = ordersMockData.orders || []
    const order = orders.find(o => o.id === parseInt(orderId) || o.id === orderId)
    if (order) {
      return {
        success: true,
        data: order
      }
    }
    return {
      success: false,
      message: 'Order not found'
    }
  }

  // Create new order
  async createOrder(orderData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.ORDERS.CREATE, orderData)
      if (response && response.success) {
        return response
      }
      // Fallback to mock data (simulate creation)
      return this.createMockOrder(orderData)
    } catch (error) {
      console.warn('API call failed, using mock data:', error)
      return this.createMockOrder(orderData)
    }
  }

  // Create mock order (fallback)
  async createMockOrder(orderData) {
    const orders = ordersMockData.orders || []
    
    // Generate new order ID (handle both string and numeric IDs)
    let newOrderId
    if (orders.length > 0) {
      const maxId = Math.max(...orders.map(o => {
        const id = typeof o.id === 'string' ? parseInt(o.id) : o.id
        return id || 0
      }))
      newOrderId = (maxId + 1).toString()
    } else {
      newOrderId = '12352' // Start after existing mock orders
    }
    
    const orderNumber = `#${newOrderId}`
    const now = new Date().toISOString()
    const orderDate = orderData.order_date ? `${orderData.order_date}T00:00:00Z` : now
    
    // Calculate subtotal from items
    const subtotal = (orderData.items || []).reduce((sum, item) => {
      return sum + (item.amount || item.price * item.qty || 0)
    }, 0)
    
    const totalAmount = orderData.total_amount || (subtotal - (orderData.flat_discount || 0))
    
    const newOrder = {
      id: newOrderId,
      orderNumber: orderNumber,
      customer_id: orderData.customer_id,
      customerId: orderData.customer_id,
      branch_id: orderData.branch_id,
      order_date: orderData.order_date || new Date().toISOString().split('T')[0],
      orderDate: orderDate,
      due_date: orderData.due_date || null,
      dueDate: orderData.due_date ? `${orderData.due_date}T00:00:00Z` : null,
      flat_discount: orderData.flat_discount || 0,
      discount: orderData.flat_discount || 0,
      total_amount: totalAmount,
      total: totalAmount,
      subtotal: subtotal,
      paid_amount: 0,
      balance_amount: totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: null,
      items: (orderData.items || []).map((item, index) => ({
        id: index + 1,
        package_id: item.package_id,
        package_name: item.package_name,
        productName: item.package_name,
        quantity: item.qty || item.quantity || 1,
        qty: item.qty || item.quantity || 1,
        price: item.price,
        unitPrice: item.price,
        amount: item.amount || (item.price * (item.qty || 1)),
        totalPrice: item.amount || (item.price * (item.qty || 1))
      })),
      created_at: now,
      createdAt: now,
      updated_at: now,
      updatedAt: now,
      timeline: [
        {
          id: 1,
          status: 'pending',
          title: 'Order Placed',
          description: 'Order was successfully placed',
          date: now,
          isCompleted: true
        }
      ]
    }
    
    // Fetch customer data and add to order
    try {
      const customerResponse = await customerService.getCustomerById(orderData.customer_id)
      if (customerResponse && customerResponse.success && customerResponse.data) {
        const customer = customerResponse.data
        newOrder.customer_name = customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
        newOrder.customer = {
          id: customer.id,
          name: customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          mobile: customer.mobile || customer.phone
        }
      }
    } catch (err) {
      console.warn('Failed to fetch customer data for order:', err)
    }
    
    // Add order to mock data (in memory)
    if (ordersMockData.orders) {
      ordersMockData.orders.push(newOrder)
    }
    
    // Update customer data when order is created
    try {
      const itemsCount = (orderData.items || []).length
      await this.updateCustomerOnOrderCreate(orderData.customer_id, totalAmount, itemsCount)
    } catch (err) {
      console.warn('Failed to update customer data:', err)
    }
    
    return {
      success: true,
      data: newOrder,
      message: 'Order created successfully (mock)'
    }
  }

  // Update customer data when order is created
  async updateCustomerOnOrderCreate(customerId, orderAmount, itemsCount = 1) {
    try {
      // Get customer by ID
      const customerResponse = await customerService.getCustomerById(customerId)
      if (customerResponse && customerResponse.success && customerResponse.data) {
        const customer = customerResponse.data
        
        // Calculate total services based on items count (number of packages/services in the order)
        const currentServices = customer.total_services || customer.total_orders || customer.totalOrders || 0
        const newServicesCount = currentServices + itemsCount
        
        // Update customer stats
        const updatedCustomer = {
          ...customer,
          totalOrders: (customer.totalOrders || 0) + 1,
          total_orders: (customer.total_orders || customer.totalOrders || 0) + 1,
          total_services: newServicesCount, // Add items count, not just +1
          totalSpent: (customer.totalSpent || 0) + orderAmount,
          total_amount: (customer.total_amount || customer.totalSpent || 0) + orderAmount,
          total_earnings: (customer.total_earnings || customer.total_amount || customer.totalSpent || 0) + orderAmount,
          remaining_amount: (customer.remaining_amount || customer.total_amount || customer.totalSpent || 0) + orderAmount,
          lastOrderDate: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        // Update customer in service
        await customerService.updateCustomer(customerId, updatedCustomer)
      }
    } catch (err) {
      console.error('Error updating customer on order create:', err)
      // Don't throw error, just log it
    }
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

    try {
      const response = await apiService.get(endpoint)
      if (response && response.success) {
        return response
      }
      return this.getMockOrdersByCustomer(customerId, params)
    } catch (error) {
      console.warn('API call failed, using mock data:', error)
      return this.getMockOrdersByCustomer(customerId, params)
    }
  }

  getMockOrdersByCustomer(customerId, params = {}) {
    const mockParams = {
      ...params,
      customerId: customerId
    }
    return this.getMockOrders(mockParams)
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
