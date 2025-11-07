import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Button, Badge, Card, FormControl, FormSelect } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTrash, 
  faEdit, 
  faPlus,
  faBuilding,
  faUsers,
  faRupeeSign,
  faSearch,
  faFilter,
  faRefresh,
  faSave,
} from '@fortawesome/free-solid-svg-icons'
import { Table, Modal, FormModal } from '../../components'
import BranchForm from '../../components/pages/branches/BranchForm'
import branchService from '../../services/branchService'
import photographersData from '../../mock/photographers.json'
import { useToast } from '../../components/common/ToastProvider'

const BranchesList = () => {
  const { success, error } = useToast()
  
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [branchToDelete, setBranchToDelete] = useState(null)
  const [branchStats, setBranchStats] = useState({})
  
  // Add/Edit Modal States
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [branchToEdit, setBranchToEdit] = useState(null)
  const [addLoading, setAddLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  
  // Refs for form components
  const addFormRef = useRef()
  const editFormRef = useRef()

  useEffect(() => {
    loadBranches()
    calculateBranchStats()
  }, [])

  // Calculate branch statistics from photographers data
  const calculateBranchStats = () => {
    const stats = {}
    
    photographersData.forEach(photographer => {
      const branchId = photographer.branch_id
      if (!branchId) return
      
      if (!stats[branchId]) {
        stats[branchId] = {
          revenue: 0,
          customers: 0,
          services: 0
        }
      }
      
      stats[branchId].revenue += photographer.total_earnings || photographer.total_amount || 0
      stats[branchId].customers += 1
      stats[branchId].services += photographer.total_orders || photographer.total_services || 0
    })
    
    setBranchStats(stats)
  }

  // Format currency in Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  // Get branch statistics
  const getBranchStats = (branchId) => {
    return branchStats[branchId] || { revenue: 0, customers: 0, services: 0 }
  }

  const loadBranches = async () => {
    try {
      setLoading(true)
      const response = await branchService.getBranches()
      if (response && response.success) {
        setBranches(response.data || [])
        // Recalculate stats after loading branches
        calculateBranchStats()
      } else {
        // If response is not successful, try to use mock data directly
        console.warn('Failed to load branches from API, using mock data')
        const mockResponse = branchService.getMockBranches()
        if (mockResponse && mockResponse.success) {
          setBranches(mockResponse.data || [])
          calculateBranchStats()
        }
      }
    } catch (error) {
      console.error('Error loading branches:', error)
      // Fallback to mock data on error
      try {
        const mockResponse = branchService.getMockBranches()
        if (mockResponse && mockResponse.success) {
          setBranches(mockResponse.data || [])
          calculateBranchStats()
        }
      } catch (mockError) {
        console.error('Error loading mock branches:', mockError)
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.branch_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.branch_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.city?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || branch.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'secondary'
      default: return 'secondary'
    }
  }

  const handleDeleteBranch = (branch) => {
    setBranchToDelete(branch)
    setShowDeleteModal(true)
  }

  const confirmDeleteBranch = async () => {
    try {
      const response = await branchService.deleteBranch(branchToDelete.id)
      if (response.success) {
        success('Branch deleted successfully')
        setShowDeleteModal(false)
        setBranchToDelete(null)
        loadBranches()
      } else {
        error(response.message || 'Failed to delete branch')
      }
    } catch (err) {
      console.error('Error deleting branch:', err)
      error('An error occurred while deleting branch')
    }
  }

  // Add Branch Handlers
  const handleAddBranch = () => {
    setShowAddModal(true)
  }

  const handleAddBranchSubmit = () => {
    if (addFormRef.current) {
      addFormRef.current.handleSubmit()
    }
  }

  const handleAddBranchFormSubmit = async (formData) => {
    try {
      setAddLoading(true)
      const response = await branchService.createBranch(formData)
      if (response.success) {
        success('Branch created successfully')
        setShowAddModal(false)
        loadBranches()
      } else {
        error(response.message || 'Failed to create branch')
      }
    } catch (err) {
      console.error('Error creating branch:', err)
      error('An error occurred while creating branch')
    } finally {
      setAddLoading(false)
    }
  }

  // Edit Branch Handlers
  const handleEditBranch = (branch) => {
    setBranchToEdit(branch)
    setShowEditModal(true)
  }

  const handleEditBranchSubmit = () => {
    if (editFormRef.current) {
      editFormRef.current.handleSubmit()
    }
  }

  const handleEditBranchFormSubmit = async (formData) => {
    try {
      setEditLoading(true)
      const response = await branchService.updateBranch(branchToEdit.id, formData)
      if (response.success) {
        success('Branch updated successfully')
        setShowEditModal(false)
        setBranchToEdit(null)
        loadBranches()
      } else {
        error(response.message || 'Failed to update branch')
      }
    } catch (err) {
      console.error('Error updating branch:', err)
      error('An error occurred while updating branch')
    } finally {
      setEditLoading(false)
    }
  }

  const columns = [
    {
      key: 'branch',
      label: 'Branch',
      render: (value, branch) => (
        <div>
          <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>{branch.branch_name}</div>
          <small className="text-muted" style={{ fontSize: '12px' }}>Code: {branch.branch_code}</small>
        </div>
      )
    },
    {
      key: 'revenue',
      label: 'Revenue',
      render: (value, branch) => {
        const stats = getBranchStats(branch.id)
        return (
          <div className="fw-semibold text-primary" style={{ fontSize: '14px' }}>
            {formatCurrency(stats.revenue)}
          </div>
        )
      }
    },
    {
      key: 'customers',
      label: 'Customers',
      render: (value, branch) => {
        const stats = getBranchStats(branch.id)
        return (
          <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>
            {stats.customers}
          </div>
        )
      }
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (value, branch) => (
        <div>
          <div style={{ fontSize: '13px' }}>{branch.contact_number || 'N/A'}</div>
          {branch.email && <small className="text-muted" style={{ fontSize: '11px' }}>{branch.email}</small>}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, branch) => (
        <Badge bg={getStatusColor(branch.status)} className="px-2 py-1" style={{ fontSize: '12px' }}>
          {branch.status || 'inactive'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, branch) => (
        <div className="d-flex gap-1 align-items-center" style={{ flexWrap: 'nowrap' }}>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleEditBranch(branch)}
            title="Edit Branch"
            style={{ minWidth: '32px', padding: '4px 8px' }}
          >
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleDeleteBranch(branch)}
            title="Delete Branch"
            style={{ minWidth: '32px', padding: '4px 8px' }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      )
    }
  ]

  const sortableColumns = ['branch', 'revenue', 'customers']

  // Calculate total statistics
  const totalStats = filteredBranches.reduce((acc, branch) => {
    const stats = getBranchStats(branch.id)
    acc.revenue += stats.revenue
    acc.customers += stats.customers
    acc.services += stats.services
    return acc
  }, { revenue: 0, customers: 0, services: 0 })

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          {/* Page Header */}
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faBuilding} className="me-3 text-primary fs-4" />
              <h2 className="mb-0 text-dark">Branch Management</h2>
            </div>
            <div className="ms-auto">
              <Button variant="primary" onClick={handleAddBranch} className="text-white">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Branch
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
                      <h4 className="mb-0">{filteredBranches.length}</h4>
                      <p className="mb-0 opacity-75">Total Branches</p>
                    </div>
                    <FontAwesomeIcon icon={faBuilding} className="fs-1 opacity-50" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-gradient-info text-white border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">{formatCurrency(totalStats.revenue)}</h4>
                      <p className="mb-0 opacity-75">Total Revenue</p>
                    </div>
                    <FontAwesomeIcon icon={faRupeeSign} className="fs-1 opacity-50" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-gradient-success text-white border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">{totalStats.customers}</h4>
                      <p className="mb-0 opacity-75">Total Customers</p>
                    </div>
                    <FontAwesomeIcon icon={faUsers} className="fs-1 opacity-50" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-gradient-warning text-white border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">{filteredBranches.filter(b => b.status === 'active').length}</h4>
                      <p className="mb-0 opacity-75">Active Branches</p>
                    </div>
                    <FontAwesomeIcon icon={faBuilding} className="fs-1 opacity-50" />
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
                <Col md={6}>
                  <div className="position-relative">
                    <FontAwesomeIcon 
                      icon={faSearch} 
                      className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                      style={{ zIndex: 10 }}
                    />
                    <FormControl
                      placeholder="Search by branch name, code, or city..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-2 ps-5"
                    />
                  </div>
                </Col>
                <Col md={3}>
                  <div className="position-relative">
                    <FontAwesomeIcon 
                      icon={faFilter} 
                      className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                      style={{ zIndex: 10 }}
                    />
                    <FormSelect
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border-2 ps-5"
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </FormSelect>
                  </div>
                </Col>
                <Col md={3}>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('')
                    }}
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
                <FontAwesomeIcon icon={faBuilding} className="me-3 text-primary fs-4" />
                <h4 className="mb-0 text-primary">Branches List</h4>
              </div>
              <div className="text-muted">
                Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredBranches.length)} of {filteredBranches.length} branches
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
                data={filteredBranches}
                columns={columns}
                sortableColumns={sortableColumns}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                loading={loading}
                pagination={true}
                sortable={true}
                totalItems={filteredBranches.length}
                emptyMessage="No branches found"
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setBranchToDelete(null)
        }}
        title="Delete Branch"
        onConfirm={confirmDeleteBranch}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      >
        <p>Are you sure you want to delete the branch <strong>"{branchToDelete?.branch_name}"</strong>?</p>
        <p className="text-muted">This action cannot be undone.</p>
      </Modal>

      {/* Add Branch Modal */}
      <FormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Branch"
        onSubmit={handleAddBranchSubmit}
        submitText="Create Branch"
        submitIcon={faPlus}
        loading={addLoading}
        loadingText="Creating..."
        size="lg"
      >
        <BranchForm
          ref={addFormRef}
          mode="create"
          onSubmit={handleAddBranchFormSubmit}
          onCancel={() => setShowAddModal(false)}
        />
      </FormModal>

      {/* Edit Branch Modal */}
      <FormModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setBranchToEdit(null)
        }}
        title="Edit Branch"
        onSubmit={handleEditBranchSubmit}
        submitText="Update Branch"
        submitIcon={faSave}
        loading={editLoading}
        loadingText="Updating..."
        size="lg"
      >
        <BranchForm
          ref={editFormRef}
          mode="edit"
          branchData={branchToEdit}
          onSubmit={handleEditBranchFormSubmit}
          onCancel={() => {
            setShowEditModal(false)
            setBranchToEdit(null)
          }}
        />
      </FormModal>
    </Container>
  )
}

export default BranchesList

