import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Badge, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTrash, 
  faEdit, 
  faPlus,
  faBuilding,
  faUsers,
  faRupeeSign,
} from '@fortawesome/free-solid-svg-icons'
import { Table, Modal } from '../../components'
import branchService from '../../services/branchService'
import { customerService } from '../../services/customerService'

const BranchesList = () => {
  const navigate = useNavigate()
  
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [branchToDelete, setBranchToDelete] = useState(null)
  const [branchStats, setBranchStats] = useState({})

  useEffect(() => {
    loadBranches()
    calculateBranchStats()
  }, [])

  // Calculate branch statistics from customer data
  const calculateBranchStats = async () => {
    try {
      const response = await customerService.getCustomers({ limit: 500 })
      if (!response?.success) {
        return
      }

      const stats = {}
      const customers = Array.isArray(response.data) ? response.data : []

      customers.forEach((customer) => {
        const branchId = customer.branch_id
        if (!branchId) return

        if (!stats[branchId]) {
          stats[branchId] = {
            revenue: 0,
            customers: 0,
            services: 0,
          }
        }

        stats[branchId].revenue += Number(customer.total_earnings || customer.total_amount || 0)
        stats[branchId].customers += 1
        stats[branchId].services += Number(customer.total_services || customer.total_orders || 0)
      })

      setBranchStats(stats)
    } catch (error) {
      console.error('Error calculating branch stats:', error)
      setBranchStats({})
    }
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
      if (response?.success) {
        const branchList = Array.isArray(response.data) ? response.data : []
        setBranches(branchList)
        await calculateBranchStats()
      }
    } catch (error) {
      console.error('Error loading branches:', error)
      setBranches([])
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
        setShowDeleteModal(false)
        setBranchToDelete(null)
        loadBranches()
      }
    } catch (error) {
      console.error('Error deleting branch:', error)
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
            variant="outline-info"
            size="sm"
            onClick={() => navigate(`/branches/edit/${branch.id}`)}
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

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faBuilding} className="me-3 text-success fs-4" />
              <h2 className="mb-0 text-dark">Branch Management</h2>
            </div>
            <div className="ms-auto">
              <Button variant="success" onClick={() => navigate('/branches/create')} className="text-white">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Branch
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <Row className="mb-4">
            {filteredBranches.map(branch => {
              const stats = getBranchStats(branch.id)
              return (
                <Col md={6} key={branch.id} className="mb-3">
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <div className="fw-bold text-dark mb-1" style={{ fontSize: '18px' }}>{branch.branch_name}</div>
                          <small className="text-muted">{branch.branch_code}</small>
                        </div>
                        <Badge bg={getStatusColor(branch.status)} className="px-3 py-2">
                          {branch.status || 'inactive'}
                        </Badge>
                      </div>
                      <Row className="g-3">
                        <Col xs={6}>
                          <div className="p-3 bg-light rounded">
                            <div className="text-muted small mb-1">
                              <FontAwesomeIcon icon={faRupeeSign} className="me-1" />
                              Revenue
                            </div>
                            <div className="h5 mb-0 fw-bold text-primary">
                              {formatCurrency(stats.revenue)}
                            </div>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="p-3 bg-light rounded">
                            <div className="text-muted small mb-1">
                              <FontAwesomeIcon icon={faUsers} className="me-1" />
                              Customers
                            </div>
                            <div className="h5 mb-0 fw-bold text-dark">
                              {stats.customers}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              )
            })}
          </Row>

          {/* Branches Table */}
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-success border-2">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faBuilding} className="me-3 text-success fs-4" />
                <h4 className="mb-0 text-success">Branches List</h4>
              </div>
            </div>

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
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                loading={loading}
                pagination={true}
              />
            </div>
          </div>
        </Col>
      </Row>

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
    </Container>
  )
}

export default BranchesList

