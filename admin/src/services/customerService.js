// Customer Service - API calls for customer management
import apiService from '../api'
import { API_ENDPOINTS } from '../constants/api'

const formatStatus = (status) => {
  if (typeof status === 'boolean') {
    return status ? 'active' : 'inactive'
  }

  if (typeof status === 'number') {
    return status === 1 ? 'active' : 'inactive'
  }

  if (typeof status === 'string') {
    const lower = status.toLowerCase()
    if (['active', '1', 'true'].includes(lower)) {
      return 'active'
    }
    return 'inactive'
  }

  return 'inactive'
}

const statusToBoolean = (status) => {
  if (typeof status === 'boolean') {
    return status
  }

  if (typeof status === 'number') {
    return status === 1
  }

  if (typeof status === 'string') {
    return ['active', '1', 'true'].includes(status.toLowerCase())
  }

  return true
}

const buildCustomerCode = (id) => `#${String(id ?? '').padStart(5, '0')}`

const mapCustomer = (customer = {}) => {
  if (!customer) {
    return null
  }

  const statusBoolean = statusToBoolean(customer.status)
  const status = formatStatus(customer.status)
  const branch = customer.branch || {}

  return {
    ...customer,
    status,
    isActive: statusBoolean,
    branch_id: customer.branch_id ?? branch.id ?? null,
    branch_name: branch.branch_name ?? customer.branch_name ?? null,
    branch_code: branch.branch_code ?? customer.branch_code ?? null,
    phone: customer.phone ?? customer.mobile ?? '',
    mobile: customer.mobile ?? customer.phone ?? '',
    customerId: customer.customerId ?? buildCustomerCode(customer.id),
    photographerId: customer.photographerId ?? customer.customerId ?? buildCustomerCode(customer.id),
    joinedDate: customer.joinedDate || customer.created_at || customer.createdAt,
    createdAt: customer.createdAt || customer.created_at,
    updatedAt: customer.updatedAt || customer.updated_at,
    total_orders: customer.total_orders ?? customer.orders_count ?? 0,
    totalOrders: customer.totalOrders ?? customer.total_orders ?? customer.orders_count ?? 0,
    total_services: customer.total_services ?? customer.total_orders ?? customer.orders_count ?? 0,
    totalSpent: customer.totalSpent ?? customer.total_amount ?? 0,
    total_amount: customer.total_amount ?? 0,
    total_earnings: customer.total_earnings ?? customer.total_amount ?? 0,
    paid_amount: customer.paid_amount ?? 0,
    remaining_amount: customer.remaining_amount ?? 0,
    wallet_balance: Number(customer.wallet_balance ?? 0),
  }
}

const normalizeCustomerPayload = (payload = {}) => ({
  branch_id: payload.branch_id,
  name: payload.name,
  mobile: payload.mobile,
  email: payload.email ?? null,
  address: payload.address ?? null,
  dob: payload.dob ?? null,
  anniversary_date: payload.anniversary_date ?? null,
  status: statusToBoolean(payload.status),
})

export const customerService = {
  async getCustomers(params = {}) {
    try {
      const query = { ...params }
      if (query.status) {
        query.status = statusToBoolean(query.status)
      }
      if (query.branch_id === '') {
        delete query.branch_id
      }

      const response = await apiService.get(API_ENDPOINTS.CUSTOMERS.LIST, { params: query })
      const data = Array.isArray(response?.data) ? response.data : response

      const customers = Array.isArray(data)
        ? data.map(mapCustomer)
        : []

      return {
        success: response?.success ?? true,
        data: customers,
        total: response?.total ?? customers.length,
        message: response?.message,
      }
    } catch (error) {
      return error
    }
  },

  async getCustomerById(id) {
    try {
      const response = await apiService.get(API_ENDPOINTS.CUSTOMERS.GET_BY_ID(id))
      return {
        success: response?.success ?? true,
        data: mapCustomer(response?.data ?? response),
        message: response?.message,
      }
    } catch (error) {
      return error
    }
  },

  async createCustomer(customerData) {
    try {
      const payload = normalizeCustomerPayload(customerData)
      const response = await apiService.post(API_ENDPOINTS.CUSTOMERS.CREATE, payload)
      return {
        success: response?.success ?? true,
        data: mapCustomer(response?.data ?? response),
        message: response?.message ?? 'Customer created successfully',
      }
    } catch (error) {
      return error
    }
  },

  async updateCustomer(id, customerData) {
    try {
      const payload = normalizeCustomerPayload(customerData)
      const response = await apiService.put(API_ENDPOINTS.CUSTOMERS.UPDATE(id), payload)
      return {
        success: response?.success ?? true,
        data: mapCustomer(response?.data ?? response),
        message: response?.message ?? 'Customer updated successfully',
      }
    } catch (error) {
      return error
    }
  },

  async deleteCustomer(id) {
    try {
      const response = await apiService.delete(API_ENDPOINTS.CUSTOMERS.DELETE(id))
      return {
        success: response?.success ?? true,
        message: response?.message ?? 'Customer deleted successfully',
      }
    } catch (error) {
      return error
    }
  },

  async updateCustomerStatus(id, status) {
    try {
      const response = await apiService.put(API_ENDPOINTS.CUSTOMERS.UPDATE(id), {
        status: statusToBoolean(status),
      })

      return {
        success: response?.success ?? true,
        data: mapCustomer(response?.data ?? response),
        message: response?.message ?? 'Customer status updated successfully',
      }
    } catch (error) {
      return error
    }
  },

  async suspendCustomer(id, suspensionData = {}) {
    const payload = {
      status: false,
      suspension_reason: suspensionData.reason ?? null,
      suspension_notes: suspensionData.notes ?? null,
    }

    try {
      const response = await apiService.put(API_ENDPOINTS.CUSTOMERS.UPDATE(id), payload)
      const mappedCustomer = mapCustomer(response?.data ?? response)

      return {
        success: response?.success ?? true,
        data: {
          ...mappedCustomer,
          suspensionDetails: {
            reason: suspensionData.reason ?? 'Suspended by admin',
            notes: suspensionData.notes ?? '',
            suspendedAt: new Date().toISOString(),
          },
        },
        message: response?.message ?? 'Customer suspended successfully',
      }
    } catch (error) {
      return error
    }
  },

  async activateCustomer(id) {
    try {
      const response = await apiService.put(API_ENDPOINTS.CUSTOMERS.UPDATE(id), {
        status: true,
      })

      return {
        success: response?.success ?? true,
        data: mapCustomer(response?.data ?? response),
        message: response?.message ?? 'Customer activated successfully',
      }
    } catch (error) {
      return error
    }
  },

  async getCustomerStats() {
    try {
      const response = await this.getCustomers({ limit: 500 })
      if (!response.success) {
        return response
      }

      const customers = response.data || []
      const now = new Date()

      const stats = {
        totalCustomers: customers.length,
        activeCustomers: customers.filter(c => formatStatus(c.status) === 'active').length,
        suspendedCustomers: customers.filter(c => formatStatus(c.status) !== 'active').length,
        newThisMonth: customers.filter(c => {
          if (!c.joinedDate) return false
          const joined = new Date(c.joinedDate)
          return joined.getMonth() === now.getMonth() && joined.getFullYear() === now.getFullYear()
        }).length,
      }

      return {
        success: true,
        data: stats,
        message: 'Customer statistics fetched successfully',
      }
    } catch (error) {
      return error
    }
  },

  async searchCustomers(searchTerm, filters = {}) {
    try {
      const params = {
        search: searchTerm,
        status: filters.status,
        branch_id: filters.branch_id,
      }

      const response = await this.getCustomers(params)
      if (!response.success) {
        return response
      }

      const customers = response.data || []

      // Additional client-side filters
      let filtered = customers

      if (filters.location) {
        const locationFilter = filters.location.toLowerCase()
        filtered = filtered.filter(c => {
          const address = typeof c.address === 'string' ? c.address : ''
          return address.toLowerCase().includes(locationFilter)
        })
      }

      if (filters.registrationDate) {
        const now = new Date()
        const filterDate = new Date()

        switch (filters.registrationDate) {
          case 'today':
            filterDate.setDate(now.getDate() - 1)
            break
          case 'week':
            filterDate.setDate(now.getDate() - 7)
            break
          case 'month':
            filterDate.setMonth(now.getMonth() - 1)
            break
          case 'year':
            filterDate.setFullYear(now.getFullYear() - 1)
            break
          default:
            break
        }

        filtered = filtered.filter(c => {
          if (!c.joinedDate) return false
          return new Date(c.joinedDate) >= filterDate
        })
      }

      return {
        success: true,
        data: filtered,
        message: 'Customers searched successfully',
      }
    } catch (error) {
      return error
    }
  },

  async exportCustomers(format = 'csv', filters = {}) {
    try {
      const response = await this.getCustomers(filters)
      if (!response.success) {
        return response
      }

      return {
        success: true,
        data: response.data,
        format,
        message: 'Customers fetched successfully',
      }
    } catch (error) {
      return error
    }
  },

  async getCustomerWallet(id) {
    try {
      const response = await apiService.get(API_ENDPOINTS.CUSTOMERS.WALLET(id))
      return {
        success: response?.success ?? true,
        data: response?.data ?? response,
        message: response?.message ?? 'Wallet fetched successfully',
      }
    } catch (error) {
      return error
    }
  },

  async getCustomerLedger(id) {
    try {
      const response = await apiService.get(API_ENDPOINTS.CUSTOMERS.LEDGER(id))
      const payload = response?.data ?? response

      if (!payload) {
        return {
          success: false,
          data: null,
          message: 'Unable to fetch customer ledger',
        }
      }

      return {
        success: response?.success ?? true,
        data: {
          ...payload,
          customer: mapCustomer(payload.customer),
        },
        message: response?.message ?? 'Customer ledger fetched successfully',
      }
    } catch (error) {
      return error
    }
  },
}
