import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, FormControl, FormSelect, Badge, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
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
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'
import { Table, Modal } from '../../components'
import CustomerDetailsModal from '../../components/pages/customers/CustomerDetailsModal'
import SuspendCustomerModal from '../../components/pages/customers/SuspendCustomerModal'
import { customerService } from '../../services/customerService'
import customersData from '../../mock/customers.json'

const CustomersList = () => {
  const navigate = useNavigate()
  
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
  

  // Load customers
  useEffect(() => {
    loadCustomers()
    loadStats()
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      // For now, use mock data. Replace with actual API call later
      // const response = await customerService.getCustomers()
      // if (response.success) {
      //   setCustomers(response.data)
      // }
      setCustomers(customersData)
    } catch (error) {
      console.error('Error loading customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      // For now, calculate from mock data. Replace with actual API call later
      // const response = await customerService.getCustomerStats()
      // if (response.success) {
      //   setStats(response.data)
      // }
      
      const totalCustomers = customersData.length
      const activeCustomers = customersData.filter(c => c.status === 'active').length
      const suspendedCustomers = customersData.filter(c => c.status === 'suspended').length
      const newThisMonth = customersData.filter(c => {
        const joinedDate = new Date(c.joinedDate)
        const now = new Date()
        return joinedDate.getMonth() === now.getMonth() && joinedDate.getFullYear() === now.getFullYear()
      }).length
      
      setStats({
        totalCustomers,
        activeCustomers,
        suspendedCustomers,
        newThisMonth
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || customer.status === statusFilter
    const matchesLocation = !locationFilter || 
                           customer.location?.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
                           customer.location?.country?.toLowerCase().includes(locationFilter.toLowerCase())
    
    let matchesRegistrationDate = true
    if (registrationDateFilter) {
      const now = new Date()
      const filterDate = new Date()
      
      switch (registrationDateFilter) {
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
      
      matchesRegistrationDate = new Date(customer.joinedDate) >= filterDate
    }
    
    return matchesSearch && matchesStatus && matchesLocation && matchesRegistrationDate
  })

  // Get unique locations for filter
  const locations = [...new Set(customers.map(c => c.location?.city).filter(Boolean))]

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'suspended': return 'danger'
      case 'pending': return 'warning'
      default: return 'secondary'
    }
  }

  // Generate initials for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD'
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-NZ', {
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
      render: (value, customer, index) => (
        <div className="d-flex align-items-center">
          <div 
            className="d-flex align-items-center justify-content-center rounded-circle me-3"
            style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: '#8b5cf6',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {getInitials(customer.firstName, customer.lastName)}
          </div>
          <div>
            <div className="fw-semibold text-dark">{customer.firstName} {customer.lastName}</div>
            <small className="text-muted">{customer.customerId}</small>
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (value, customer, index) => (
        <div>
          <div className="fw-semibold text-dark">{customer.email}</div>
          <small className="text-muted">{customer.phone}</small>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (value, customer, index) => (
        <div>
          <div className="fw-semibold text-dark">{customer.location?.city}</div>
          <small className="text-muted">{customer.location?.country}</small>
        </div>
      )
    },
    {
      key: 'orders',
      label: 'Orders',
      render: (value, customer, index) => (
        <Badge bg="info" className="px-2 py-1">
          {customer.totalOrders}
        </Badge>
      )
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      render: (value, customer, index) => (
        <div className="fw-semibold text-success">
          {formatCurrency(customer.totalSpent)}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, customer, index) => (
        <Badge bg={getStatusColor(customer.status)} className="px-2 py-1">
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
        <div className="text-muted">
          {formatDate(customer.joinedDate)}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, customer, index) => (
        <div className="d-flex gap-2">
          <Button
            variant="outline-info"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleViewCustomer(customer)
            }}
            title="View Customer"
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
          {customer.status === 'active' ? (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleSuspendCustomer(customer)
              }}
              title="Suspend Customer"
            >
              <FontAwesomeIcon icon={faBan} />
            </Button>
          ) : customer.status === 'suspended' ? (
            <Button
              variant="outline-success"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleActivateCustomer(customer)
              }}
              title="Activate Customer"
            >
              <FontAwesomeIcon icon={faCheckCircle} />
            </Button>
          ) : (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteCustomer(customer)
              }}
              title="Delete Customer"
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          )}
        </div>
      )
    }
  ]

  // Sortable columns
  const sortableColumns = ['firstName', 'email', 'totalOrders', 'totalSpent', 'status', 'joinedDate']

  // Event handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }



  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer)
    setShowDetailsModal(true)
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

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export customers')
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
        setShowDeleteModal(false)
        setCustomerToDelete(null)
        loadCustomers()
        loadStats()
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
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
    <Container fluid>
      <Row>
        <Col xs={12}>
          {/* Page Header */}
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faUsers} className="me-3 text-dark fs-4" />
              <h2 className="mb-0 text-dark">Customer Management</h2>
            </div>
            <div className="ms-auto d-flex align-items-center gap-3">
              <Button variant="primary" onClick={handleExport}>
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <Row className="mb-5">
            <Col md={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-3 bg-gradient-success text-white">
                        <FontAwesomeIcon icon={faUsers} size="lg" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-4">
                      <div className="text-muted small fw-semibold mb-1">Total Customers</div>
                      <div className="h3 mb-2 fw-bold text-dark">{stats.totalCustomers}</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-3 bg-gradient-info text-white">
                        <FontAwesomeIcon icon={faUser} size="lg" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-4">
                      <div className="text-muted small fw-semibold mb-1">Active Customers</div>
                      <div className="h3 mb-2 fw-bold text-dark">{stats.activeCustomers}</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-3 bg-gradient-warning text-white">
                        <FontAwesomeIcon icon={faBan} size="lg" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-4">
                      <div className="text-muted small fw-semibold mb-1">Suspended Accounts</div>
                      <div className="h3 mb-2 fw-bold text-dark">{stats.suspendedCustomers}</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-3 bg-gradient-primary text-white">
                        <FontAwesomeIcon icon={faUser} size="lg" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-4">
                      <div className="text-muted small fw-semibold mb-1">New This Month</div>
                      <div className="h3 mb-2 fw-bold text-dark">{stats.newThisMonth}</div>
                    </div>
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
                <Col md={3}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Search Customer</label>
                    <FormControl
                      placeholder="Name, email, or phone"
                      value={searchTerm}
                      onChange={handleSearch}
                      className="border-2"
                    />
                  </div>
                </Col>
                <Col md={2}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Status</label>
                    <FormSelect
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border-2"
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </FormSelect>
                  </div>
                </Col>
                <Col md={2}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Location</label>
                    <FormSelect
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="border-2"
                    >
                      <option value="">All Locations</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </FormSelect>
                  </div>
                </Col>
                <Col md={2}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Registration Date</label>
                    <FormSelect
                      value={registrationDateFilter}
                      onChange={(e) => setRegistrationDateFilter(e.target.value)}
                      className="border-2"
                    >
                      <option value="">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </FormSelect>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">&nbsp;</label>
                    <div className="d-flex gap-2">
                      <Button variant="success" onClick={() => {}} className="text-white">
                        <FontAwesomeIcon icon={faSearch} className="me-2" />
                        Search
                      </Button>
                      <Button variant="outline-secondary" onClick={handleReset}>
                        <FontAwesomeIcon icon={faRefresh} className="me-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Customers Table */}
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-success border-2">
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faUsers} className="me-3 text-success fs-4" />
                  <h4 className="mb-0 text-success">Customer List</h4>
                </div>
                <div className="text-muted">
                  Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredCustomers.length)} of {filteredCustomers.length} customers
                </div>
              </div>
              
              <Table
                data={filteredCustomers}
                columns={columns}
                sortableColumns={sortableColumns}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                loading={loading}
                hover
                pagination={true}
                sortable={true}
                totalItems={filteredCustomers.length}
              />
            </div>
          </div>
        </Col>
      </Row>



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
        <p>Are you sure you want to delete the customer <strong>"{customerToDelete?.firstName} {customerToDelete?.lastName}"</strong>?</p>
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
        <p>Are you sure you want to activate the customer <strong>"{customerToActivate?.firstName} {customerToActivate?.lastName}"</strong>?</p>
        <p className="text-muted">The customer will be able to place orders again.</p>
      </Modal>
    </Container>
  )
}

export default CustomersList
