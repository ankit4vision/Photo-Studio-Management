// Customer Service - API calls for customer management
import customersData from '../mock/customers.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const customerService = {
  // Get all customers
  getCustomers: async (params = {}) => {
    await delay(500)
    return {
      success: true,
      data: customersData,
      message: 'Customers fetched successfully'
    }
  },

  // Get customer by ID
  getCustomerById: async (id) => {
    await delay(300)
    const customer = customersData.find(c => c.id === parseInt(id))
    if (customer) {
      return {
        success: true,
        data: customer,
        message: 'Customer fetched successfully'
      }
    } else {
      return {
        success: false,
        data: null,
        message: 'Customer not found'
      }
    }
  },

  // Create new customer
  createCustomer: async (customerData) => {
    await delay(800)
    
    // Generate new ID
    const existingIds = customersData.map(c => parseInt(c.id)).filter(id => !isNaN(id))
    const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1
    
    const newCustomer = {
      id: newId,
      customerId: `#${String(newId).padStart(5, '0')}`,
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      email: customerData.email,
      phone: customerData.phone,
      address: customerData.address || {},
      location: customerData.location || {},
      status: customerData.status || 'active',
      totalOrders: 0,
      totalSpent: 0,
      joinedDate: new Date().toISOString(),
      lastOrderDate: null,
      avatar: customerData.avatar || '',
      notes: customerData.notes || '',
      preferences: customerData.preferences || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    customersData.push(newCustomer)
    
    return {
      success: true,
      data: newCustomer,
      message: 'Customer created successfully'
    }
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    await delay(800)
    
    const customerIndex = customersData.findIndex(c => c.id === parseInt(id))
    if (customerIndex !== -1) {
      const existingCustomer = customersData[customerIndex]
      
      customersData[customerIndex] = {
        ...existingCustomer,
        firstName: customerData.firstName || existingCustomer.firstName,
        lastName: customerData.lastName || existingCustomer.lastName,
        email: customerData.email || existingCustomer.email,
        phone: customerData.phone || existingCustomer.phone,
        address: customerData.address !== undefined ? customerData.address : existingCustomer.address,
        location: customerData.location !== undefined ? customerData.location : existingCustomer.location,
        status: customerData.status !== undefined ? customerData.status : existingCustomer.status,
        avatar: customerData.avatar !== undefined ? customerData.avatar : existingCustomer.avatar,
        notes: customerData.notes !== undefined ? customerData.notes : existingCustomer.notes,
        preferences: customerData.preferences !== undefined ? customerData.preferences : existingCustomer.preferences,
        updatedAt: new Date().toISOString()
      }
      
      return {
        success: true,
        data: customersData[customerIndex],
        message: 'Customer updated successfully'
      }
    } else {
      return {
        success: false,
        data: null,
        message: 'Customer not found'
      }
    }
  },

  // Delete customer
  deleteCustomer: async (id) => {
    await delay(600)
    
    const customerIndex = customersData.findIndex(c => c.id === parseInt(id))
    if (customerIndex !== -1) {
      const deletedCustomer = customersData.splice(customerIndex, 1)[0]
      
      return {
        success: true,
        data: deletedCustomer,
        message: 'Customer deleted successfully'
      }
    } else {
      return {
        success: false,
        data: null,
        message: 'Customer not found'
      }
    }
  },

  // Update customer status
  updateCustomerStatus: async (id, status) => {
    await delay(300)
    
    const customerIndex = customersData.findIndex(c => c.id === parseInt(id))
    if (customerIndex !== -1) {
      customersData[customerIndex].status = status
      customersData[customerIndex].updatedAt = new Date().toISOString()
      
      return {
        success: true,
        data: customersData[customerIndex],
        message: 'Customer status updated successfully'
      }
    } else {
      return {
        success: false,
        data: null,
        message: 'Customer not found'
      }
    }
  },

  // Suspend customer with detailed information
  suspendCustomer: async (id, suspensionData) => {
    await delay(800)
    
    const customerIndex = customersData.findIndex(c => c.id === parseInt(id))
    if (customerIndex !== -1) {
      const customer = customersData[customerIndex]
      
      // Update customer status
      customer.status = 'suspended'
      customer.updatedAt = new Date().toISOString()
      
      // Add suspension details
      customer.suspensionDetails = {
        reason: suspensionData.reason,
        durationType: suspensionData.durationType,
        durationValue: suspensionData.durationValue,
        durationUnit: suspensionData.durationUnit,
        notes: suspensionData.notes,
        suspendedAt: new Date().toISOString(),
        suspendedBy: 'admin', // In real app, this would be the current user
        notifications: {
          emailSent: suspensionData.sendEmailNotification,
          supportNotified: suspensionData.notifySupportTeam,
          supportTicketCreated: suspensionData.createSupportTicket
        }
      }
      
      // Calculate suspension end date if temporary
      if (suspensionData.durationType === 'temporary') {
        const endDate = new Date()
        const duration = parseInt(suspensionData.durationValue)
        
        switch (suspensionData.durationUnit) {
          case 'day':
            endDate.setDate(endDate.getDate() + duration)
            break
          case 'week':
            endDate.setDate(endDate.getDate() + (duration * 7))
            break
          case 'month':
            endDate.setMonth(endDate.getMonth() + duration)
            break
        }
        
        customer.suspensionDetails.suspendedUntil = endDate.toISOString()
      }
      
      return {
        success: true,
        data: customer,
        message: 'Customer suspended successfully'
      }
    } else {
      return {
        success: false,
        data: null,
        message: 'Customer not found'
      }
    }
  },

  // Activate suspended customer
  activateCustomer: async (id) => {
    await delay(500)
    
    const customerIndex = customersData.findIndex(c => c.id === parseInt(id))
    if (customerIndex !== -1) {
      const customer = customersData[customerIndex]
      
      // Update customer status
      customer.status = 'active'
      customer.updatedAt = new Date().toISOString()
      
      // Add activation details
      if (customer.suspensionDetails) {
        customer.suspensionDetails.activatedAt = new Date().toISOString()
        customer.suspensionDetails.activatedBy = 'admin' // In real app, this would be the current user
      }
      
      return {
        success: true,
        data: customer,
        message: 'Customer activated successfully'
      }
    } else {
      return {
        success: false,
        data: null,
        message: 'Customer not found'
      }
    }
  },

  // Get customer statistics
  getCustomerStats: async () => {
    await delay(300)
    
    const totalCustomers = customersData.length
    const activeCustomers = customersData.filter(c => c.status === 'active').length
    const suspendedCustomers = customersData.filter(c => c.status === 'suspended').length
    const newThisMonth = customersData.filter(c => {
      const joinedDate = new Date(c.joinedDate)
      const now = new Date()
      return joinedDate.getMonth() === now.getMonth() && joinedDate.getFullYear() === now.getFullYear()
    }).length
    
    return {
      success: true,
      data: {
        totalCustomers,
        activeCustomers,
        suspendedCustomers,
        newThisMonth
      },
      message: 'Customer statistics fetched successfully'
    }
  },

  // Search customers
  searchCustomers: async (searchTerm, filters = {}) => {
    await delay(300)
    
    let filteredCustomers = customersData
    
    if (searchTerm) {
      filteredCustomers = filteredCustomers.filter(c => 
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (filters.status) {
      filteredCustomers = filteredCustomers.filter(c => c.status === filters.status)
    }
    
    if (filters.location) {
      filteredCustomers = filteredCustomers.filter(c => 
        c.location.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
        c.location.country?.toLowerCase().includes(filters.location.toLowerCase())
      )
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
      
      filteredCustomers = filteredCustomers.filter(c => new Date(c.joinedDate) >= filterDate)
    }
    
    return {
      success: true,
      data: filteredCustomers,
      message: 'Customers searched successfully'
    }
  },

  // Export customers
  exportCustomers: async (format = 'csv', filters = {}) => {
    await delay(1000)
    
    // Simulate export functionality
    const filteredCustomers = customersData // In real app, apply filters here
    
    return {
      success: true,
      data: filteredCustomers,
      message: 'Customers exported successfully'
    }
  }
}

export { customerService }
