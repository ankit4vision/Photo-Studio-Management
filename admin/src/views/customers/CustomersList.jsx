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
  faCheckCircle,
  faPlus,
  faEdit,
  faFilePdf,
  faCamera,
  faFileExport
} from '@fortawesome/free-solid-svg-icons'
import { Table, Modal, useToast } from '../../components'
import CustomerDetailsModal from '../../components/pages/customers/CustomerDetailsModal'
import SuspendCustomerModal from '../../components/pages/customers/SuspendCustomerModal'
import { customerService } from '../../services/customerService'
import photographersData from '../../mock/photographers.json'
import { exportPhotographersToPDF, exportSinglePhotographerToPDF } from '../../utils/pdfExport'

const CustomersList = () => {
  const navigate = useNavigate()
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
      // Using photographers mock data
      setCustomers(photographersData)
    } catch (error) {
      console.error('Error loading photographers:', error)
      error('Failed to load photographers')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const totalCustomers = photographersData.length
      const activeCustomers = photographersData.filter(p => p.status === 'active').length
      const suspendedCustomers = photographersData.filter(p => p.status === 'suspended').length
      const newThisMonth = photographersData.filter(p => {
        const joinedDate = new Date(p.joinedDate)
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

  // Filter photographers
  const filteredCustomers = customers.filter(photographer => {
    const photographerName = photographer.name || `${photographer.firstName || ''} ${photographer.lastName || ''}`.trim()
    const matchesSearch = photographerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photographer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photographer.mobile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photographer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photographer.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photographer.photographerId?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || photographer.status === statusFilter
    const matchesLocation = !locationFilter || 
                           photographer.address?.toLowerCase().includes(locationFilter.toLowerCase()) ||
                           photographer.location?.city?.toLowerCase().includes(locationFilter.toLowerCase())
    
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
      
      const joinDate = photographer.created_at || photographer.joinedDate
      matchesRegistrationDate = joinDate ? new Date(joinDate) >= filterDate : true
    }
    
    return matchesSearch && matchesStatus && matchesLocation && matchesRegistrationDate
  })

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
      key: 'photographer',
      label: 'Photographer',
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
                backgroundColor: '#22c55e',
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
              <small className="text-muted" style={{ fontSize: '11px' }}>{photographer.photographerId || 'N/A'}</small>
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
        const totalAmount = photographer.total_earnings || photographer.total_amount || 0
        const remainingAmount = photographer.remaining_amount || 0
        const paidAmount = photographer.paid_amount || photographer.wallet_balance || (totalAmount - remainingAmount)
        return (
          <div className="fw-semibold text-success" style={{ fontSize: '13px', whiteSpace: 'nowrap', minWidth: '110px' }}>
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
        const totalAmount = photographer.total_earnings || photographer.total_amount || 0
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
          {formatDate(customer.joinedDate)}
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
            title="View Photographer"
            style={{ minWidth: '32px', padding: '4px 8px', flexShrink: 0 }}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/customers/edit/${photographer.id}`)
            }}
            title="Edit Photographer"
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
    setSearchTerm(e.target.value)
    setCurrentPage(1)
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

  const handleExport = () => {
    try {
      const result = exportPhotographersToPDF(filteredCustomers, {
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
        success(`PDF export initiated for ${photographer.name || 'photographer'}. Check your print dialog.`)
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
    <>
    <div style={{ width: '100%', padding: 0, margin: 0 }}>
      <Container fluid style={{ paddingLeft: 0, paddingRight: 0, maxWidth: '100%' }}>
        <Row style={{ marginLeft: 0, marginRight: 0 }}>
          <Col xs={12} style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
          {/* Page Header */}
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faCamera} className="me-3 text-success fs-4" />
              <h2 className="mb-0 text-dark">Photographer Management</h2>
            </div>
            <div className="ms-auto d-flex align-items-center gap-3">
              <Button variant="success" onClick={() => navigate('/customers/create')} className="text-white">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Photographer
              </Button>
              <Button variant="danger" onClick={handleExport} className="text-white">
                <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                Export PDF
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
                      <div className="text-muted small fw-semibold mb-1">Total Photographers</div>
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
                      <div className="text-muted small fw-semibold mb-1">Active Photographers</div>
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

          {/* Search and Filter Section */}
          <div className="mb-4">
            <Row className="g-3">
              <Col md={3}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Search Photographer</label>
                  <FormControl
                    placeholder="Name, email, phone, or ID"
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

          {/* Photographers Table */}
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-success border-2">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faCamera} className="me-3 text-success fs-4" />
                <h4 className="mb-0 text-success">Photographers List</h4>
              </div>
              <div className="text-muted">
                Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredCustomers.length)} of {filteredCustomers.length} photographers
              </div>
            </div>
          </div>
        </Col>
      </Row>
      
      {/* Full Width Table */}
      <div 
        style={{ 
          width: '100%',
          overflowX: 'auto',
          overflowY: 'visible',
          WebkitOverflowScrolling: 'touch',
          marginLeft: 0,
          marginRight: 0,
          paddingLeft: 0,
          paddingRight: 0
        }}
      >
        <div style={{ minWidth: '1200px', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
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
        title="Delete Photographer"
        onConfirm={confirmDeleteCustomer}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      >
        <p>Are you sure you want to delete the photographer <strong>"{customerToDelete?.name || `${customerToDelete?.firstName || ''} ${customerToDelete?.lastName || ''}`.trim()}"</strong>?</p>
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
        title="Activate Photographer"
        onConfirm={confirmActivateCustomer}
        confirmText="Activate"
        cancelText="Cancel"
        type="success"
      >
        <p>Are you sure you want to activate the photographer <strong>"{customerToActivate?.name || `${customerToActivate?.firstName || ''} ${customerToActivate?.lastName || ''}`.trim()}"</strong>?</p>
        <p className="text-muted">The photographer will be able to accept orders again.</p>
      </Modal>
    </>
  )
}

export default CustomersList
