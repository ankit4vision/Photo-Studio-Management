// Order Management Service
import apiService from '../api'
import { API_ENDPOINTS } from '../constants/api'

const buildOrderNumber = (id) => `#${String(id ?? '').padStart(5, '0')}`

const computePaymentStatus = (order) => {
  const total = Number(order.total_amount ?? 0)
  const paid = Number(order.paid_amount ?? 0)
  const balance = Number(order.balance_amount ?? total - paid)

  if (balance <= 0) return 'paid'
  if (paid > 0 && paid < total) return 'partial'
  return 'pending'
}

const mapOrderItem = (item = {}) => ({
  id: item.id,
  order_id: item.order_id,
  package_id: item.package_id,
  package_name: item.package_name,
  qty: Number(item.qty ?? item.quantity ?? 1),
  price: Number(item.price ?? 0),
  amount: Number(item.amount ?? (Number(item.price ?? 0) * Number(item.qty ?? 1))),
})

const mapOrder = (order = {}) => {
  if (!order) return null

  const customer = order.customer || {}
  const branch = order.branch || {}
  const items = Array.isArray(order.items) ? order.items.map(mapOrderItem) : []
  const paymentStatus = computePaymentStatus(order)
  const backendStatus = order.status || 'pending'
  const normalizedStatus = backendStatus === 'in_progress' ? 'processing' : backendStatus

  return {
    ...order,
    orderNumber: order.orderNumber || buildOrderNumber(order.id),
    customer_id: order.customer_id ?? customer.id ?? null,
    customer_name: order.customer_name || customer.name || null,
    customer: {
      id: customer.id ?? order.customer_id,
      name: customer.name || order.customer_name || null,
      email: customer.email || null,
      phone: customer.phone || customer.mobile || null,
      mobile: customer.mobile || customer.phone || null,
    },
    branch_id: order.branch_id ?? branch.id ?? null,
    branch_name: branch.branch_name ?? order.branch_name ?? null,
    order_date: order.order_date,
    due_date: order.due_date,
    total_amount: Number(order.total_amount ?? 0),
    paid_amount: Number(order.paid_amount ?? 0),
    balance_amount: Number(order.balance_amount ?? 0),
    flat_discount: Number(order.flat_discount ?? 0),
    status: normalizedStatus,
    rawStatus: backendStatus,
    paymentStatus,
    items,
  }
}

const normalizeOrderPayload = (order = {}) => ({
  customer_id: Number(order.customer_id || order.customerId),
  branch_id: Number(order.branch_id || order.branchId),
  order_date: order.order_date,
  due_date: order.due_date ?? null,
  flat_discount: Number(order.flat_discount ?? 0),
  items: (order.items || []).map((item) => ({
    package_id: Number(item.package_id),
    price: Number(item.price ?? 0),
    qty: Number(item.qty ?? 1),
  })),
})

const mapOrderListResponse = (response) => {
  const data = Array.isArray(response?.data) ? response.data : response
  const orders = Array.isArray(data) ? data : []

  const mappedOrders = orders.map(mapOrder)

  return {
    success: response?.success ?? true,
    data: {
      orders: mappedOrders,
      total: response?.total ?? mappedOrders.length,
      page: response?.current_page ?? response?.page ?? 1,
      limit: response?.per_page ?? response?.limit ?? mappedOrders.length,
    },
    message: response?.message,
  }
}

const orderService = {
  async getOrders(params = {}) {
    const normalizedStatusParam = params.status === 'processing' ? 'in_progress' : params.status

    const query = {
      page: params.page,
      limit: params.limit,
      search: params.search,
      status: normalizedStatusParam && normalizedStatusParam !== 'all' ? normalizedStatusParam : undefined,
      customer_id: params.customerId ?? params.customer_id,
      branch_id: params.branch_id,
    }

    try {
      const response = await apiService.get(API_ENDPOINTS.ORDERS.LIST, { params: query })
      const mapped = mapOrderListResponse(response)
      let orders = mapped.data.orders || []

      if (params.customer) {
        const term = params.customer.toLowerCase()
        orders = orders.filter((order) => {
          const name = order.customer_name || order.customer?.name || ''
          return name.toLowerCase().includes(term)
        })
      }

      if (params.paymentStatus && params.paymentStatus !== 'all') {
        orders = orders.filter((order) => order.paymentStatus === params.paymentStatus)
      }

      if (params.dateRange && params.dateRange !== 'all') {
        const now = new Date()
        let startDate = null

        switch (params.dateRange) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            break
          case 'week':
            startDate = new Date(now)
            startDate.setDate(now.getDate() - 7)
            break
          case 'month':
            startDate = new Date(now)
            startDate.setMonth(now.getMonth() - 1)
            break
          case 'year':
            startDate = new Date(now)
            startDate.setFullYear(now.getFullYear() - 1)
            break
          default:
            break
        }

        if (startDate) {
          orders = orders.filter((order) => {
            const orderDate = order.order_date ? new Date(order.order_date) : null
            if (!orderDate) return false
            return orderDate >= startDate
          })
        }
      }

      return {
        success: mapped.success,
        data: {
          orders,
          total: orders.length,
          page: mapped.data.page,
          limit: mapped.data.limit,
        },
        message: mapped.message,
      }
    } catch (error) {
      return error
    }
  },

  async getOrderById(orderId) {
    try {
      const response = await apiService.get(API_ENDPOINTS.ORDERS.GET_BY_ID(orderId))
      return {
        success: response?.success ?? true,
        data: mapOrder(response?.data ?? response),
        message: response?.message,
      }
    } catch (error) {
      return error
    }
  },

  async createOrder(orderData) {
    try {
      const payload = normalizeOrderPayload(orderData)
      const response = await apiService.post(API_ENDPOINTS.ORDERS.CREATE, payload)
      return {
        success: response?.success ?? true,
        data: mapOrder(response?.data ?? response),
        message: response?.message ?? 'Order created successfully',
      }
    } catch (error) {
      return error
    }
  },

  async updateOrder(orderId, orderData) {
    try {
      const payload = normalizeOrderPayload(orderData)
      const response = await apiService.put(API_ENDPOINTS.ORDERS.UPDATE(orderId), payload)
      return {
        success: response?.success ?? true,
        data: mapOrder(response?.data ?? response),
        message: response?.message ?? 'Order updated successfully',
      }
    } catch (error) {
      return error
    }
  },

  async deleteOrder(orderId) {
    try {
      const response = await apiService.delete(API_ENDPOINTS.ORDERS.DELETE(orderId))
      return {
        success: response?.success ?? true,
        message: response?.message ?? 'Order deleted successfully',
      }
    } catch (error) {
      return error
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const normalizedStatus = status === 'processing' ? 'in_progress' : status
      const response = await apiService.put(API_ENDPOINTS.ORDERS.UPDATE(orderId), { status: normalizedStatus })
      return {
        success: response?.success ?? true,
        data: mapOrder(response?.data ?? response),
        message: response?.message ?? 'Order status updated successfully',
      }
    } catch (error) {
      return error
    }
  },

  async getOrdersByCustomer(customerId, params = {}) {
    const response = await this.getOrders({ ...params, customerId })
    if (!response.success) {
      return response
    }

    return {
      success: true,
      data: response.data,
    }
  },

  async getOrderStats(params = {}) {
    const response = await this.getOrders({ ...params, limit: params.limit ?? 100 })
    if (!response.success) {
      return response
    }

    const orders = response.data.orders || []

    const stats = orders.reduce(
      (acc, order) => {
        acc.totalOrders += 1
        acc.totalRevenue += Number(order.total_amount ?? 0)

        switch (order.status) {
          case 'pending':
            acc.pendingOrders += 1
            break
          case 'processing':
          case 'in_progress':
            acc.processingOrders += 1
            break
          case 'completed':
            acc.completedOrders += 1
            break
          case 'cancelled':
            acc.cancelledOrders += 1
            break
          default:
            break
        }

        return acc
      },
      {
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
      }
    )

    return {
      success: true,
      data: stats,
    }
  },

  getOrderStatusOptions() {
    return [
      { value: 'pending', label: 'Pending', color: 'warning' },
      { value: 'in_progress', label: 'In Progress', color: 'primary' },
      { value: 'processing', label: 'Processing', color: 'primary' },
      { value: 'completed', label: 'Completed', color: 'success' },
      { value: 'cancelled', label: 'Cancelled', color: 'danger' },
    ]
  },

  getPaymentStatusOptions() {
    return [
      { value: 'pending', label: 'Pending', color: 'warning' },
      { value: 'partial', label: 'Partial', color: 'info' },
      { value: 'paid', label: 'Paid', color: 'success' },
    ]
  },
}

export default orderService
