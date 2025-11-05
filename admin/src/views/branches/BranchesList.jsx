import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, FormControl, FormSelect, Badge, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTrash, 
  faEdit, 
  faPlus,
  faBuilding,
  faSearch, 
  faRefresh,
} from '@fortawesome/free-solid-svg-icons'
import { Table, Modal } from '../../components'
import branchService from '../../services/branchService'

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

  useEffect(() => {
    loadBranches()
  }, [])

  const loadBranches = async () => {
    try {
      setLoading(true)
      const response = await branchService.getBranches()
      if (response.success) {
        setBranches(response.data || [])
      }
    } catch (error) {
      console.error('Error loading branches:', error)
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
          <div className="fw-semibold text-dark">{branch.branch_name}</div>
          <small className="text-muted">Code: {branch.branch_code}</small>
        </div>
      )
    },
    {
      key: 'address',
      label: 'Address',
      render: (value, branch) => (
        <div>
          <div className="fw-semibold text-dark">{branch.address}</div>
          <small className="text-muted">{branch.city}</small>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (value, branch) => (
        <div>
          <div>{branch.contact_number}</div>
          {branch.email && <small className="text-muted">{branch.email}</small>}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, branch) => (
        <Badge bg={getStatusColor(branch.status)} className="px-2 py-1">
          {branch.status || 'inactive'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, branch) => (
        <div className="d-flex gap-2">
          <Button
            variant="outline-warning"
            size="sm"
            onClick={() => navigate(`/branches/edit/${branch.id}`)}
            title="Edit Branch"
          >
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleDeleteBranch(branch)}
            title="Delete Branch"
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
              <FontAwesomeIcon icon={faBuilding} className="me-3 text-dark fs-4" />
              <h2 className="mb-0 text-dark">Branch Management</h2>
            </div>
            <div className="ms-auto">
              <Button variant="primary" onClick={() => navigate('/branches/create')}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Branch
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-3 shadow-sm p-4">
            <div className="mb-4">
              <Row className="g-3">
                <Col md={4}>
                  <FormControl
                    placeholder="Search by name, code, or city"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-2"
                  />
                </Col>
                <Col md={2}>
                  <FormSelect
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border-2"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </FormSelect>
                </Col>
                <Col md={2}>
                  <Button variant="outline-secondary" onClick={loadBranches}>
                    <FontAwesomeIcon icon={faRefresh} className="me-2" />
                    Refresh
                  </Button>
                </Col>
              </Row>
            </div>

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

