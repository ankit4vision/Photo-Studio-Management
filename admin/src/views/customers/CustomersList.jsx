import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Button, FormControl, FormSelect, Badge, Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTrash, 
  faEye, 
  faSearch, 
  faRefresh, 
  faUsers, 
  faUser,
  faDownload,
  faBan,
  faCheckCircle,
  faPlus,
  faEdit,
  faFilePdf,
  faCamera,
  faFileExport,
  faSave,
  faFilter,
} from '@fortawesome/free-solid-svg-icons'
import { Table, Modal, FormModal, useToast } from '../../components'
import CustomerForm from '../../components/pages/customers/CustomerForm'
import CustomerDetailsModal from '../../components/pages/customers/CustomerDetailsModal'
import SuspendCustomerModal from '../../components/pages/customers/SuspendCustomerModal'
import { customerService } from '../../services/customerService'
import branchService from '../../services/branchService'
import photographersData from '../../mock/photographers.json'
import { exportPhotographersToPDF, exportSinglePhotographerToPDF } from '../../utils/pdfExport'
import { useLocation } from 'react-router-dom'

const CustomersList = () => {
  const location = useLocation()
  const { success, error } = useToast()
  
  // State management
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [registrationDateFilter, setRegistrationDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [showSuspendDetailsModal, setShowSuspendDetailsModal] = useState(false)
  const [showActivateModal, setShowActivateModal] = useState(false)
  
  // Add/Edit Modal States
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [customerToEdit, setCustomerToEdit] = useState(null)
  const [branches, setBranches] = useState([])
  const [addLoading, setAddLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  
  // Refs for form components
  const addFormRef = useRef()
  const editFormRef = useRef()
  
  // Data states
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customerToDelete, setCustomerToDelete] = useState(null)
  const [customerToSuspend, setCustomerToSuspend] = useState(null)
  const [customerToActivate, setCustomerToActivate] = useState(null)
  
  // Stats state
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    suspendedCustomers: 0,
    newThisMonth: 0
  })
  

  // Pagination meta state
  const [paginationMeta, setPaginationMeta] = useState({
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  })

  // Load customers and branches
  useEffect(() => {
    loadBranches()
  }, [])

  // Load customers when filters, search, or pagination changes
  useEffect(() => {
    loadCustomers()
  }, [currentPage, pageSize, searchTerm, statusFilter, locationFilter, registrationDateFilter])

  // Load stats separately (can be optimized later)
  useEffect(() => {
    loadStats()
  }, [customers])

  const loadBranches = async () => {
    try {
      const response = await branchService.getBranches()
      if (response.success) {
        setBranches(response.data || [])
      }
    } catch (err) {
      console.error('Error loading branches:', err)
    }
  }

  const loadCustomers = async () => {
    try {
      setLoading(true)
      // Build params for server-side pagination and filtering
      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        city: locationFilter || undefined,
      }
      
      // Load from service with server-side pagination
      const response = await customerService.getCustomers(params)
      
      if (response && response.success && response.data && Array.isArray(response.data)) {
        const convertedCustomers = response.data.map(customer => ({
          ...customer,
          name: customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
          mobile: customer.mobile || customer.phone,
          phone: customer.phone || customer.mobile,
          joinedDate: customer.joinedDate || customer.createdAt || customer.created_at,
          created_at: customer.created_at || customer.createdAt || customer.joinedDate,
          // Map customer fields to photographer fields for table compatibility
          photographerId: customer.photographerId || customer.customerId || customer.customer_code || `#${customer.id}`,
          total_earnings: customer.total_earnings || customer.total_amount || customer.totalSpent || 0,
          total_amount: customer.total_amount || customer.total_earnings || customer.totalSpent || 0,
          paid_amount: customer.paid_amount || 0,
          remaining_amount: customer.remaining_amount || (customer.total_amount || customer.total_earnings || customer.totalSpent || 0),
          total_orders: customer.total_orders || customer.total_services || customer.totalOrders || 0,
          total_services: customer.total_services || customer.total_orders || customer.totalOrders || 0,
          wallet_balance: customer.wallet_balance || 0,
          // Ensure branch_id and branch_name for branch indicator
          branch_id: customer.branch_id || null,
          branch_name: customer.branch_name || null
        }))
        
        setCustomers(convertedCustomers)
        
        // Update pagination meta
        if (response.meta) {
          setPaginationMeta({
            total: response.meta.total || 0,
            totalPages: response.meta.totalPages || 1,
            hasNext: response.meta.hasNext || false,
            hasPrev: response.meta.hasPrev || false,
          })
        }
        
        console.log('Loaded customers:', convertedCustomers.length, 'items (server-side)')
      } else {
        // Fallback to photographers mock data if API fails
        console.warn('API response not successful, using mock data')
        setCustomers(photographersData)
        setPaginationMeta({
          total: photographersData.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        })
      }
    } catch (err) {
      console.error('Error loading customers:', err)
      // Fallback to photographers mock data on error
      setCustomers(photographersData)
      setPaginationMeta({
        total: photographersData.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      })
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      // Use current customers state for stats
      const allCustomers = customers.length > 0 ? customers : photographersData
      const totalCustomers = allCustomers.length
      const activeCustomers = allCustomers.filter(p => p.status === 'active').length
      const suspendedCustomers = allCustomers.filter(p => p.status === 'suspended').length
      const newThisMonth = allCustomers.filter(p => {
        const joinedDate = p.joinedDate || p.createdAt || p.created_at
        if (!joinedDate) return false
        const joinDate = new Date(joinedDate)
        const now = new Date()
        return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear()
      }).length
      
      setStats({
        totalCustomers,
        activeCustomers,
        suspendedCustomers,
        newThisMonth
      })
    } catch (err) {
      console.error('Error loading stats:', err)
    }
  }

  // Update stats when customers change
  useEffect(() => {
    if (customers.length > 0) {
      loadStats()
    }
  }, [customers])

  // Handle filter changes - reset to page 1
  const handleFilterChange = (filterType, value) => {
    if (filterType === 'status') {
      setStatusFilter(value)
    } else if (filterType === 'location') {
      setLocationFilter(value)
    } else if (filterType === 'registrationDate') {
      setRegistrationDateFilter(value)
    }
    setCurrentPage(1) // Reset to first page when filter changes
  }

  // Handle search - reset to page 1
  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page when search changes
  }

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Handle page size change
  const handlePageSizeChange = (size) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when page size changes
  }

  // Get unique locations for filter
  const locations = [...new Set(customers.map(p => p.location?.city).filter(Boolean))]

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'suspended': return 'danger'
      case 'pending': return 'warning'
      default: return 'secondary'
    }
  }

  // Get branch indicator (L for Lunawada, V for Vadodara)
  const getBranchIndicator = (photographer) => {
    if (!photographer) return ''
    
    const branchName = (photographer.branch_name || '').toLowerCase().trim()
    const branchCode = (photographer.branch_code || '').toUpperCase().trim()
    const branchId = photographer.branch_id
    
    // Check branch name first
    if (branchName.includes('lunawada') || branchName.includes('luna') || branchName.includes('main')) {
      return 'L'
    }
    if (branchName.includes('vadodara') || branchName.includes('vado') || branchName.includes('baroda') || branchName.includes('mumbai')) {
      return 'V'
    }
    
    // Check branch code - if starts with L or V
    if (branchCode && branchCode.length > 0) {
      const firstChar = branchCode.charAt(0)
      if (firstChar === 'L') return 'L'
      if (firstChar === 'V') return 'V'
      // If starts with M, check if it's MB001 (Lunawada) or MB002 (Vadodara)
      if (firstChar === 'M' && branchCode.includes('001')) return 'L'
      if (firstChar === 'M' && branchCode.includes('002')) return 'V'
    }
    
    // Check branch_id - branch_id 1 = Lunawada (L), branch_id 2 = Vadodara (V)
    if (branchId) {
      if (branchId === 1) return 'L'
      if (branchId === 2) return 'V'
    }
    
    return ''
  }

  // Generate initials for avatar
  const getInitials = (customer) => {
    if (customer.name) {
      const names = customer.name.split(' ')
      if (names.length >= 2) {
        return `${names[0]?.charAt(0) || ''}${names[names.length - 1]?.charAt(0) || ''}`.toUpperCase()
      }
      return customer.name.substring(0, 2).toUpperCase()
    }
    return `${customer.firstName?.charAt(0) || ''}${customer.lastName?.charAt(0) || ''}`.toUpperCase()
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0)
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Table columns
  const columns = [
    {
      key: 'customer',
      label: 'Customer',
      render: (value, photographer, index) => {
        const photographerName = photographer.name || `${photographer.firstName || ''} ${photographer.lastName || ''}`.trim()
        const branchIndicator = getBranchIndicator(photographer)
        const displayName = branchIndicator ? `${photographerName} (${branchIndicator})` : photographerName
        return (
          <div className="d-flex align-items-center" style={{ minWidth: '140px' }}>
            <div 
              className="d-flex align-items-center justify-content-center rounded-circle me-2"
              style={{ 
                width: '35px', 
                height: '35px', 
                backgroundColor: '#8b5cf6',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                flexShrink: 0
              }}
            >
              {getInitials(photographer)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="fw-semibold text-dark" style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
              <small className="text-muted" style={{ fontSize: '11px' }}>{photographer.photographerId || photographer.customerId || `#${photographer.id}` || 'N/A'}</small>
            </div>
          </div>
        )
      }
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (value, photographer, index) => (
        <div style={{ minWidth: '130px' }}>
          <div className="fw-semibold text-dark" style={{ fontSize: '13px' }}>{photographer.mobile || photographer.phone || 'N/A'}</div>
          <small className="text-muted" style={{ fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{photographer.email || 'No email'}</small>
        </div>
      )
    },
    {
      key: 'total_amount',
      label: 'Total Amount',
      render: (value, photographer, index) => {
        const totalAmount = photographer.total_earnings || photographer.total_amount || 0
        return (
          <div className="fw-semibold text-primary" style={{ fontSize: '13px', whiteSpace: 'nowrap', minWidth: '110px' }}>
            {formatCurrency(totalAmount)}
          </div>
        )
      }
    },
    {
      key: 'paid_amount',
      label: 'Paid Amount',
      render: (value, photographer, index) => {
        const totalAmount = photographer.total_earnings || photographer.total_amount || photographer.totalSpent || 0
        const remainingAmount = photographer.remaining_amount || 0
        const paidAmount = photographer.paid_amount || photographer.wallet_balance || (totalAmount - remainingAmount)
        return (
          <div className="fw-semibold text-primary" style={{ fontSize: '13px', whiteSpace: 'nowrap', minWidth: '110px' }}>
            {formatCurrency(paidAmount >= 0 ? paidAmount : 0)}
          </div>
        )
      }
    },
    {
      key: 'orders',
      label: 'Services',
      render: (value, photographer, index) => (
        <Badge bg="info" className="px-2 py-1" style={{ fontSize: '12px' }}>
          {photographer.total_orders || photographer.totalOrders || photographer.total_services || 0}
        </Badge>
      )
    },
    {
      key: 'remaining_amount',
      label: 'Remaining',
      render: (value, photographer, index) => {
        const totalAmount = photographer.total_earnings || photographer.total_amount || photographer.totalSpent || 0
        const paidAmount = photographer.paid_amount || photographer.wallet_balance || 0
        const remainingAmount = photographer.remaining_amount || (totalAmount - paidAmount)
        return (
          <div className={`fw-semibold ${remainingAmount > 0 ? 'text-danger' : 'text-success'}`} style={{ fontSize: '13px', whiteSpace: 'nowrap', minWidth: '110px' }}>
            {formatCurrency(remainingAmount >= 0 ? remainingAmount : 0)}
          </div>
        )
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, customer, index) => (
        <Badge bg={getStatusColor(customer.status)} className="px-2 py-1" style={{ fontSize: '12px' }}>
          {customer.status === 'active' ? 'Active' : 
           customer.status === 'suspended' ? 'Suspended' : 
           customer.status === 'pending' ? 'Pending' : customer.status}
        </Badge>
      )
    },
    {
      key: 'joined',
      label: 'Joined',
      render: (value, customer, index) => (
        <div className="text-muted" style={{ fontSize: '13px', whiteSpace: 'nowrap', minWidth: '100px' }}>
          {formatDate(customer.joinedDate || customer.createdAt || customer.created_at)}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, photographer, index) => (
        <div className="d-flex gap-1 align-items-center" style={{ flexWrap: 'nowrap', minWidth: '110px', justifyContent: 'flex-start' }}>
          <Button
            variant="outline-info"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleViewCustomer(photographer)
            }}
            title="View Customer"
            style={{ minWidth: '32px', padding: '4px 8px', flexShrink: 0 }}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleEditCustomer(photographer)
            }}
            title="Edit Customer"
            style={{ minWidth: '32px', padding: '4px 8px', flexShrink: 0 }}
          >
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleExportSingle(photographer)
            }}
            title="Export PDF"
            className="text-danger"
            style={{ minWidth: '32px', padding: '4px 8px', flexShrink: 0 }}
          >
            <FontAwesomeIcon icon={faFilePdf} />
          </Button>
        </div>
      )
    }
  ]

  // Sortable columns
  const sortableColumns = ['firstName', 'email', 'totalOrders', 'totalSpent', 'status', 'joinedDate']

  // Event handlers
  const handleSearch = (e) => {
    handleSearchChange(e.target.value)
  }



  const handleViewCustomer = (customer) => {
    console.log('View customer clicked:', customer)
    if (!customer) {
      console.error('Customer is null or undefined')
      return
    }
    setSelectedCustomer(customer)
    setShowDetailsModal(true)
    console.log('Modal should be visible now')
  }

  const handleDeleteCustomer = (customer) => {
    setCustomerToDelete(customer)
    setShowDeleteModal(true)
  }

  const handleSuspendCustomer = (customer) => {
    setCustomerToSuspend(customer)
    setShowSuspendDetailsModal(true)
  }

  const handleActivateCustomer = (customer) => {
    setCustomerToActivate(customer)
    setShowActivateModal(true)
  }

  const handleExport = async () => {
    try {
      // For export, fetch all customers matching current filters (without pagination)
      const exportParams = {
        limit: 10000, // Large limit to get all matching records
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        city: locationFilter || undefined,
      }
      const exportResponse = await customerService.getCustomers(exportParams)
      const customersToExport = exportResponse?.data || customers
      
      const result = exportPhotographersToPDF(customersToExport, {
        status: statusFilter,
        search: searchTerm
      })
      if (result.success) {
        success('PDF export initiated. Check your print dialog.')
      } else {
        error(result.message || 'Failed to export PDF')
      }
    } catch (err) {
      console.error('Export error:', err)
      error('Failed to export PDF')
    }
  }

  const handleExportSingle = (photographer) => {
    try {
      const result = exportSinglePhotographerToPDF(photographer)
      if (result.success) {
        success(`PDF export initiated for ${photographer.name || 'customer'}. Check your print dialog.`)
      } else {
        error(result.message || 'Failed to export PDF')
      }
    } catch (err) {
      console.error('Export error:', err)
      error('Failed to export PDF')
    }
  }

  const handleReset = () => {
    setSearchTerm('')
    setStatusFilter('')
    setLocationFilter('')
    setRegistrationDateFilter('')
    setCurrentPage(1)
  }



  const confirmDeleteCustomer = async () => {
    try {
      const response = await customerService.deleteCustomer(customerToDelete.id)
      if (response.success) {
        success('Customer deleted successfully')
        setShowDeleteModal(false)
        setCustomerToDelete(null)
        loadCustomers()
        loadStats()
      } else {
        error(response.message || 'Failed to delete customer')
      }
    } catch (err) {
      console.error('Error deleting customer:', err)
      error('An error occurred while deleting customer')
    }
  }

  // Add Customer Handlers
  const handleAddCustomer = () => {
    setShowAddModal(true)
  }

  const handleAddCustomerSubmit = () => {
    if (addFormRef.current) {
      addFormRef.current.handleSubmit()
    }
  }

  const handleAddCustomerFormSubmit = async (formData) => {
    try {
      setAddLoading(true)
      const response = await customerService.createCustomer(formData)
      if (response.success) {
        success('Customer created successfully')
        setShowAddModal(false)
        loadCustomers()
        loadStats()
      } else {
        error(response.message || 'Failed to create customer')
      }
    } catch (err) {
      console.error('Error creating customer:', err)
      error('An error occurred while creating customer')
    } finally {
      setAddLoading(false)
    }
  }

  // Edit Customer Handlers
  const handleEditCustomer = (customer) => {
    setCustomerToEdit(customer)
    setShowEditModal(true)
  }

  const handleEditCustomerSubmit = () => {
    if (editFormRef.current) {
      editFormRef.current.handleSubmit()
    }
  }

  const handleEditCustomerFormSubmit = async (formData) => {
    try {
      setEditLoading(true)
      const response = await customerService.updateCustomer(customerToEdit.id, formData)
      if (response.success) {
        success('Customer updated successfully')
        setShowEditModal(false)
        setCustomerToEdit(null)
        loadCustomers()
        loadStats()
      } else {
        error(response.message || 'Failed to update customer')
      }
    } catch (err) {
      console.error('Error updating customer:', err)
      error('An error occurred while updating customer')
    } finally {
      setEditLoading(false)
    }
  }

  const handleSuspendCustomerSubmit = async (customerId, suspensionData) => {
    try {
      const response = await customerService.suspendCustomer(customerId, suspensionData)
      if (response.success) {
        setShowSuspendDetailsModal(false)
        setCustomerToSuspend(null)
        loadCustomers()
        loadStats()
      }
    } catch (error) {
      console.error('Error suspending customer:', error)
    }
  }

  const confirmActivateCustomer = async () => {
    try {
      const response = await customerService.activateCustomer(customerToActivate.id)
      if (response.success) {
        setShowActivateModal(false)
        setCustomerToActivate(null)
        loadCustomers()
        loadStats()
      }
    } catch (error) {
      console.error('Error activating customer:', error)
    }
  }

  return (
    <>
    <div style={{ width: '100%', padding: 0, margin: 0 }}>
      <Container fluid style={{ paddingLeft: 0, paddingRight: 0, maxWidth: '100%' }}>
        <Row style={{ marginLeft: 0, marginRight: 0 }}>
          <Col xs={12} style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
          {/* Page Header */}
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faUsers} className="me-3 text-primary fs-4" />
              <h2 className="mb-0 text-dark">Customer Management</h2>
            </div>
            <div className="ms-auto d-flex align-items-center gap-3">
              <Button variant="primary" onClick={handleAddCustomer} className="text-white">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Customer
              </Button>
              <Button variant="danger" onClick={handleExport} className="text-white">
                <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="bg-gradient-primary text-white border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">{stats.totalCustomers}</h4>
                      <p className="mb-0 opacity-75">Total Customers</p>
                    </div>
                    <FontAwesomeIcon icon={faUsers} className="fs-1 opacity-50" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-gradient-success text-white border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">{stats.activeCustomers}</h4>
                      <p className="mb-0 opacity-75">Active Customers</p>
                    </div>
                    <FontAwesomeIcon icon={faUser} className="fs-1 opacity-50" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-gradient-warning text-white border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">{stats.suspendedCustomers}</h4>
                      <p className="mb-0 opacity-75">Suspended Accounts</p>
                    </div>
                    <FontAwesomeIcon icon={faBan} className="fs-1 opacity-50" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-gradient-info text-white border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">{stats.newThisMonth}</h4>
                      <p className="mb-0 opacity-75">New This Month</p>
                    </div>
                    <FontAwesomeIcon icon={faUser} className="fs-1 opacity-50" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Main Content Container */}
          <div className="bg-white rounded-3 shadow-sm p-4">
            {/* Search and Filter Section */}
            <div className="mb-4">
              <Row className="g-3">
                <Col md={4}>
                  <div className="position-relative">
                    <FontAwesomeIcon 
                      icon={faSearch} 
                      className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                      style={{ zIndex: 10 }}
                    />
                    <FormControl
                      placeholder="Search by name, email, phone, or ID..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="border-2 ps-5"
                    />
                  </div>
                </Col>
                <Col md={2}>
                  <div className="position-relative">
                    <FontAwesomeIcon 
                      icon={faFilter} 
                      className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                      style={{ zIndex: 10 }}
                    />
                    <FormSelect
                      value={statusFilter}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="border-2 ps-5"
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </FormSelect>
                  </div>
                </Col>
                <Col md={2}>
                  <div className="position-relative">
                    <FontAwesomeIcon 
                      icon={faFilter} 
                      className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                      style={{ zIndex: 10 }}
                    />
                    <FormSelect
                      value={locationFilter}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="border-2 ps-5"
                    >
                      <option value="">All Locations</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </FormSelect>
                  </div>
                </Col>
                <Col md={2}>
                  <div className="position-relative">
                    <FontAwesomeIcon 
                      icon={faFilter} 
                      className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                      style={{ zIndex: 10 }}
                    />
                    <FormSelect
                      value={registrationDateFilter}
                      onChange={(e) => handleFilterChange('registrationDate', e.target.value)}
                      className="border-2 ps-5"
                    >
                      <option value="">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </FormSelect>
                  </div>
                </Col>
                <Col md={2}>
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleReset}
                    className="w-100"
                  >
                    <FontAwesomeIcon icon={faRefresh} className="me-2" />
                    Reset
                  </Button>
                </Col>
              </Row>
            </div>

            {/* Section Header */}
            <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-primary border-2">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faUsers} className="me-3 text-primary fs-4" />
                <h4 className="mb-0 text-primary">Customers List</h4>
              </div>
              <div className="text-muted">
                Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, paginationMeta.total)} of {paginationMeta.total} customers
              </div>
            </div>

            {/* Table */}
            <div 
              style={{ 
                width: '100%',
                overflowX: 'auto',
                overflowY: 'visible',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <Table
                data={customers}
                columns={columns}
                sortableColumns={sortableColumns}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                loading={loading}
                hover
                pagination={true}
                serverSide={true}
                sortable={true}
                totalItems={paginationMeta.total}
                emptyMessage="No customers found"
              />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
    </div>

    {/* Customer Details Modal */}
      <CustomerDetailsModal
        visible={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedCustomer(null)
        }}
        customer={selectedCustomer}
        onSuspend={handleSuspendCustomer}
        onActivate={handleActivateCustomer}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setCustomerToDelete(null)
        }}
        title="Delete Customer"
        onConfirm={confirmDeleteCustomer}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      >
        <p>Are you sure you want to delete the customer <strong>"{customerToDelete?.name || `${customerToDelete?.firstName || ''} ${customerToDelete?.lastName || ''}`.trim()}"</strong>?</p>
        <p className="text-muted">This action cannot be undone.</p>
      </Modal>

      {/* Suspend Customer Details Modal */}
      <SuspendCustomerModal
        visible={showSuspendDetailsModal}
        onClose={() => {
          setShowSuspendDetailsModal(false)
          setCustomerToSuspend(null)
        }}
        customer={customerToSuspend}
        onSuspend={handleSuspendCustomerSubmit}
        loading={false}
      />

      {/* Activate Confirmation Modal */}
      <Modal
        visible={showActivateModal}
        onClose={() => {
          setShowActivateModal(false)
          setCustomerToActivate(null)
        }}
        title="Activate Customer"
        onConfirm={confirmActivateCustomer}
        confirmText="Activate"
        cancelText="Cancel"
        type="success"
      >
        <p>Are you sure you want to activate the customer <strong>"{customerToActivate?.name || `${customerToActivate?.firstName || ''} ${customerToActivate?.lastName || ''}`.trim()}"</strong>?</p>
        <p className="text-muted">The customer will be able to place orders again.</p>
      </Modal>

      {/* Add Customer Modal */}
      <FormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Customer"
        onSubmit={handleAddCustomerSubmit}
        submitText="Create Customer"
        submitIcon={faPlus}
        loading={addLoading}
        loadingText="Creating..."
        size="lg"
      >
        <CustomerForm
          ref={addFormRef}
          mode="create"
          branches={branches}
          onSubmit={handleAddCustomerFormSubmit}
          onCancel={() => setShowAddModal(false)}
        />
      </FormModal>

      {/* Edit Customer Modal */}
      <FormModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setCustomerToEdit(null)
        }}
        title="Edit Customer"
        onSubmit={handleEditCustomerSubmit}
        submitText="Update Customer"
        submitIcon={faSave}
        loading={editLoading}
        loadingText="Updating..."
        size="lg"
      >
        <CustomerForm
          ref={editFormRef}
          mode="edit"
          customerData={customerToEdit}
          branches={branches}
          onSubmit={handleEditCustomerFormSubmit}
          onCancel={() => {
            setShowEditModal(false)
            setCustomerToEdit(null)
          }}
        />
      </FormModal>
    </>
  )
}

export default CustomersList

