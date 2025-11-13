// Order Management Service
import apiClient from '../config/apiClient'
import { API_ENDPOINTS } from '../constants/api'
import ordersMockData from '../mock/orders.json'
import { customerService } from './customerService'
import { handleApiError } from '../utils/errorHandler'

class OrderService {
  transformListResponse(payload) {
    if (!payload) {
      return {
        success: false,
        data: { orders: [], total: 0 },
        meta: null,
        message: 'No response received from server.',
      }
    }

    const data = Array.isArray(payload.data)
      ? payload.data
      : Array.isArray(payload.data?.data)
        ? payload.data.data
        : payload.data || []

    const meta = payload.meta ?? {}

    return {
      success: payload.success ?? true,
      data: {
        orders: data,
        total: meta.total ?? data.length,
      },
      meta: {
        total: meta.total ?? data.length,
        page: meta.page ?? 1,
        limit: meta.limit ?? (data.length || 1),
        totalPages: meta.totalPages ?? 1,
        hasNext: meta.hasNext ?? false,
        hasPrev: meta.hasPrev ?? false,
        sortBy: meta.sortBy ?? null,
        sortDirection: meta.sortDirection ?? null,
      },
      message: payload.message ?? '',
    }
  }

  transformItemResponse(payload) {
    if (!payload) {
      return {
        success: false,
        data: null,
        message: 'No response received from server.',
      }
    }

    return {
      success: payload.success ?? true,
      data: payload.data ?? payload,
      message: payload.message ?? '',
    }
  }

  buildQueryParams(params = {}) {
    const query = {}

    if (params.page) query.page = params.page
    if (params.limit) query.limit = params.limit
    if (params.search) query.search = params.search
    if (params.status) query.status = params.status
    if (params.paymentStatus || params.payment_status) query.payment_status = params.paymentStatus || params.payment_status
    if (params.paymentMethod || params.payment_method) query.payment_method = params.paymentMethod || params.payment_method
    if (params.customerId || params.customer_id) query.customer_id = params.customerId || params.customer_id
    if (params.branchId || params.branch_id) query.branch_id = params.branchId || params.branch_id
    if (params.startDate || params.start_date) query.start_date = params.startDate || params.start_date
    if (params.endDate || params.end_date) query.end_date = params.endDate || params.end_date
    if (params.dueDateFrom || params.due_date_from) query.due_date_from = params.dueDateFrom || params.due_date_from
    if (params.dueDateTo || params.due_date_to) query.due_date_to = params.dueDateTo || params.due_date_to
    if (params.minTotalAmount || params.min_total_amount) query.min_total_amount = params.minTotalAmount || params.min_total_amount
    if (params.maxTotalAmount || params.max_total_amount) query.max_total_amount = params.maxTotalAmount || params.max_total_amount
    if (params.minPaidAmount || params.min_paid_amount) query.min_paid_amount = params.minPaidAmount || params.min_paid_amount
    if (params.maxPaidAmount || params.max_paid_amount) query.max_paid_amount = params.maxPaidAmount || params.max_paid_amount
    if (params.minBalanceAmount || params.min_balance_amount) query.min_balance_amount = params.minBalanceAmount || params.min_balance_amount
    if (params.maxBalanceAmount || params.max_balance_amount) query.max_balance_amount = params.maxBalanceAmount || params.max_balance_amount
    if (params.sortBy || params.sort_by) query.sort_by = params.sortBy || params.sort_by
    if (params.sortDirection || params.sort_direction) query.sort_direction = params.sortDirection || params.sort_direction

    return query
  }

  // Get all orders with pagination and filters
  async getOrders(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDERS.LIST, {
        params: this.buildQueryParams(params),
      })

      const payload = this.transformListResponse(response?.data)

      if (payload.success) {
        return payload
      }

      return this.getMockOrders(params)
    } catch (error) {
      console.warn('API call failed, using mock data:', error)
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
      const response = await apiClient.get(API_ENDPOINTS.ORDERS.GET_BY_ID(orderId))
      return this.transformItemResponse(response?.data)
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
      // Transform frontend format to backend format
      const backendData = {
        customer_id: orderData.customer_id || orderData.customerId,
        branch_id: orderData.branch_id || orderData.branchId,
        order_date: orderData.order_date || orderData.orderDate || new Date().toISOString().split('T')[0],
        due_date: orderData.due_date || orderData.dueDate,
        discount: orderData.discount || orderData.flat_discount || 0,
        paid_amount: orderData.paid_amount || orderData.paidAmount || 0,
        status: orderData.status || 'pending',
        payment_status: orderData.payment_status || orderData.paymentStatus || 'pending',
        payment_method: orderData.payment_method || orderData.paymentMethod,
        notes: orderData.notes,
        items: (orderData.items || []).map(item => ({
          package_id: item.package_id || item.packageId,
          quantity: item.quantity || item.qty || 1,
          unit_price: item.unit_price || item.unitPrice || item.price || 0,
        })),
      }

      const response = await apiClient.post(API_ENDPOINTS.ORDERS.CREATE, backendData)
      return this.transformItemResponse(response?.data)
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
    try {
      // Transform frontend format to backend format
      const backendData = {
        customer_id: orderData.customer_id || orderData.customerId,
        branch_id: orderData.branch_id || orderData.branchId,
        order_date: orderData.order_date || orderData.orderDate,
        due_date: orderData.due_date || orderData.dueDate,
        discount: orderData.discount || orderData.flat_discount,
        paid_amount: orderData.paid_amount || orderData.paidAmount,
        status: orderData.status,
        payment_status: orderData.payment_status || orderData.paymentStatus,
        payment_method: orderData.payment_method || orderData.paymentMethod,
        notes: orderData.notes,
        items: orderData.items ? (orderData.items || []).map(item => ({
          package_id: item.package_id || item.packageId,
          quantity: item.quantity || item.qty || 1,
          unit_price: item.unit_price || item.unitPrice || item.price || 0,
        })) : undefined,
      }

      const response = await apiClient.put(API_ENDPOINTS.ORDERS.UPDATE(orderId), backendData)
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.warn('API call failed:', error)
      return handleApiError(error)
    }
  }

  // Delete order
  async deleteOrder(orderId) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.ORDERS.DELETE(orderId))
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.warn('API call failed:', error)
      return handleApiError(error)
    }
  }

  // Update order status
  async updateOrderStatus(orderId, status, notes = '') {
    try {
      const response = await apiClient.put(API_ENDPOINTS.ORDERS.UPDATE_STATUS(orderId), { 
        status, 
        notes 
      })
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.warn('API call failed:', error)
      return handleApiError(error)
    }
  }

  // Update payment status
  async updatePaymentStatus(orderId, paymentStatus, paymentMethod = '', paidAmount = null) {
    try {
      const data = { payment_status: paymentStatus }
      if (paymentMethod) data.payment_method = paymentMethod
      if (paidAmount !== null) data.paid_amount = paidAmount

      const response = await apiClient.put(API_ENDPOINTS.ORDERS.UPDATE_PAYMENT_STATUS(orderId), data)
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.warn('API call failed:', error)
      return handleApiError(error)
    }
  }

  // Get order statistics
  async getOrderStats(params = {}) {
    try {
      // Calculate stats from orders list
      const response = await this.getOrders({ ...params, limit: 10000 })
      if (response.success && response.data) {
        const orders = response.data.orders || []
        const totalOrders = orders.length
        const pendingOrders = orders.filter(o => o.status === 'pending').length
        const processingOrders = orders.filter(o => o.status === 'processing').length
        const completedOrders = orders.filter(o => o.status === 'completed').length
        const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0)
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

        return {
          success: true,
          data: {
            totalOrders,
            pendingOrders,
            processingOrders,
            completedOrders,
            totalRevenue,
            averageOrderValue,
          },
          message: 'Order statistics fetched successfully'
        }
      }
      return this.getMockOrderStats()
    } catch (error) {
      console.warn('API call failed, using mock data:', error)
      return this.getMockOrderStats()
    }
  }

  // Get mock order statistics (fallback)
  getMockOrderStats() {
    const orders = ordersMockData.orders || []
    const totalOrders = orders.length
    const pendingOrders = orders.filter(o => o.status === 'pending').length
    const processingOrders = orders.filter(o => o.status === 'processing').length
    const completedOrders = orders.filter(o => o.status === 'completed').length
    const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0)
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    return {
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        totalRevenue,
        averageOrderValue,
      },
      message: 'Order statistics fetched successfully (mock)'
    }
  }

  // Get orders by customer
  async getOrdersByCustomer(customerId, params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDERS.GET_BY_CUSTOMER(customerId), {
        params: this.buildQueryParams(params),
      })
      return this.transformListResponse(response?.data)
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
