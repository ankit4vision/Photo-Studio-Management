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
    
    // Handle both name format (single name field) and firstName/lastName format
    let firstName = customerData.firstName || ''
    let lastName = customerData.lastName || ''
    
    if (!firstName && !lastName && customerData.name) {
      // Split single name field into firstName and lastName
      const nameParts = customerData.name.trim().split(' ')
      firstName = nameParts[0] || ''
      lastName = nameParts.slice(1).join(' ') || ''
    }
    
    const newCustomer = {
      id: newId,
      customerId: `#${String(newId).padStart(5, '0')}`,
      name: customerData.name || `${firstName} ${lastName}`.trim(),
      firstName: firstName,
      lastName: lastName,
      email: customerData.email || null,
      phone: customerData.mobile || customerData.phone || '',
      mobile: customerData.mobile || customerData.phone || '',
      address: typeof customerData.address === 'string' ? customerData.address : (customerData.address || {}),
      location: customerData.location || {},
      branch_id: customerData.branch_id || null,
      status: customerData.status || 'active',
      totalOrders: 0,
      totalSpent: 0,
      joinedDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      lastOrderDate: null,
      avatar: customerData.avatar || '',
      notes: customerData.notes || '',
      preferences: customerData.preferences || {},
      dob: customerData.dob || null,
      anniversary_date: customerData.anniversary_date || null
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
      
      // Merge all fields from customerData, keeping existing values if not provided
      customersData[customerIndex] = {
        ...existingCustomer,
        ...customerData, // Spread new data first
        // Override with existing values if new data is undefined (to preserve existing data)
        id: existingCustomer.id, // Never change ID
        customerId: customerData.customerId !== undefined ? customerData.customerId : existingCustomer.customerId,
        firstName: customerData.firstName !== undefined ? customerData.firstName : existingCustomer.firstName,
        lastName: customerData.lastName !== undefined ? customerData.lastName : existingCustomer.lastName,
        name: customerData.name !== undefined ? customerData.name : (existingCustomer.name || `${existingCustomer.firstName || ''} ${existingCustomer.lastName || ''}`.trim()),
        email: customerData.email !== undefined ? customerData.email : existingCustomer.email,
        phone: customerData.phone !== undefined ? customerData.phone : existingCustomer.phone,
        mobile: customerData.mobile !== undefined ? customerData.mobile : (existingCustomer.mobile || existingCustomer.phone),
        address: customerData.address !== undefined ? customerData.address : existingCustomer.address,
        location: customerData.location !== undefined ? customerData.location : existingCustomer.location,
        branch_id: customerData.branch_id !== undefined ? customerData.branch_id : existingCustomer.branch_id,
        status: customerData.status !== undefined ? customerData.status : existingCustomer.status,
        avatar: customerData.avatar !== undefined ? customerData.avatar : existingCustomer.avatar,
        notes: customerData.notes !== undefined ? customerData.notes : existingCustomer.notes,
        preferences: customerData.preferences !== undefined ? customerData.preferences : existingCustomer.preferences,
        // Order-related fields
        totalOrders: customerData.totalOrders !== undefined ? customerData.totalOrders : existingCustomer.totalOrders,
        total_orders: customerData.total_orders !== undefined ? customerData.total_orders : (existingCustomer.total_orders || existingCustomer.totalOrders),
        total_services: customerData.total_services !== undefined ? customerData.total_services : (existingCustomer.total_services || existingCustomer.total_orders || existingCustomer.totalOrders),
        totalSpent: customerData.totalSpent !== undefined ? customerData.totalSpent : existingCustomer.totalSpent,
        total_amount: customerData.total_amount !== undefined ? customerData.total_amount : (existingCustomer.total_amount || existingCustomer.totalSpent),
        total_earnings: customerData.total_earnings !== undefined ? customerData.total_earnings : (existingCustomer.total_earnings || existingCustomer.total_amount || existingCustomer.totalSpent),
        paid_amount: customerData.paid_amount !== undefined ? customerData.paid_amount : existingCustomer.paid_amount,
        remaining_amount: customerData.remaining_amount !== undefined ? customerData.remaining_amount : existingCustomer.remaining_amount,
        wallet_balance: customerData.wallet_balance !== undefined ? customerData.wallet_balance : existingCustomer.wallet_balance,
        lastOrderDate: customerData.lastOrderDate !== undefined ? customerData.lastOrderDate : existingCustomer.lastOrderDate,
        dob: customerData.dob !== undefined ? customerData.dob : existingCustomer.dob,
        anniversary_date: customerData.anniversary_date !== undefined ? customerData.anniversary_date : existingCustomer.anniversary_date,
        joinedDate: customerData.joinedDate !== undefined ? customerData.joinedDate : existingCustomer.joinedDate,
        createdAt: existingCustomer.createdAt || existingCustomer.created_at || existingCustomer.joinedDate, // Preserve creation date
        created_at: existingCustomer.created_at || existingCustomer.createdAt || existingCustomer.joinedDate,
        updatedAt: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
