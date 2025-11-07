import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, FormControl, FormSelect, Badge, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTrash, 
  faEdit, 
  faPlus,
  faTag,
  faSearch, 
  faRefresh,
} from '@fortawesome/free-solid-svg-icons'
import { Table, Modal } from '../../components'
import packageService from '../../services/packageService'

const PackagesList = () => {
  const navigate = useNavigate()
  
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [packageToDelete, setPackageToDelete] = useState(null)

  useEffect(() => {
    loadPackages()
  }, [])

  const loadPackages = async () => {
    try {
      setLoading(true)
      const response = await packageService.getPackages()
      if (response && response.success) {
        setPackages(response.data || [])
      } else {
        // If response is not successful, try to use mock data directly
        console.warn('Failed to load packages from API, using mock data')
        const mockResponse = packageService.getMockPackages()
        if (mockResponse && mockResponse.success) {
          setPackages(mockResponse.data || [])
        }
      }
    } catch (error) {
      console.error('Error loading packages:', error)
      // Fallback to mock data on error
      try {
        const mockResponse = packageService.getMockPackages()
        if (mockResponse && mockResponse.success) {
          setPackages(mockResponse.data || [])
        }
      } catch (mockError) {
        console.error('Error loading mock packages:', mockError)
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.package_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !typeFilter || pkg.package_type === typeFilter
    const matchesStatus = !statusFilter || pkg.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'secondary'
      default: return 'secondary'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0)
  }

  const handleDeletePackage = (pkg) => {
    setPackageToDelete(pkg)
    setShowDeleteModal(true)
  }

  const confirmDeletePackage = async () => {
    try {
      const response = await packageService.deletePackage(packageToDelete.id)
      if (response.success) {
        setShowDeleteModal(false)
        setPackageToDelete(null)
        loadPackages()
      }
    } catch (error) {
      console.error('Error deleting package:', error)
    }
  }

  const packageTypes = packageService.getPackageTypes()

  const columns = [
    {
      key: 'package',
      label: 'Package',
      render: (value, pkg) => (
        <div>
          <div className="fw-semibold text-dark">{pkg.package_name}</div>
          <small className="text-muted">Type: {pkg.package_type}</small>
        </div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      render: (value, pkg) => (
        <div className="text-muted">
          {pkg.description || 'No description'}
        </div>
      )
    },
    {
      key: 'price',
      label: 'Default Price',
      render: (value, pkg) => (
        <div className="fw-semibold text-success">
          {formatCurrency(pkg.default_price)}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, pkg) => (
        <Badge bg={getStatusColor(pkg.status)} className="px-2 py-1">
          {pkg.status || 'inactive'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, pkg) => (
        <div className="d-flex gap-2">
          <Button
            variant="outline-warning"
            size="sm"
            onClick={() => navigate(`/packages/edit/${pkg.id}`)}
            title="Edit Package"
          >
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleDeletePackage(pkg)}
            title="Delete Package"
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
              <FontAwesomeIcon icon={faTag} className="me-3 text-dark fs-4" />
              <h2 className="mb-0 text-dark">Package Management</h2>
            </div>
            <div className="ms-auto">
              <Button variant="primary" onClick={() => navigate('/packages/create')}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Package
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-3 shadow-sm p-4">
            <div className="mb-4">
              <Row className="g-3">
                <Col md={3}>
                  <FormControl
                    placeholder="Search packages"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-2"
                  />
                </Col>
                <Col md={2}>
                  <FormSelect
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="border-2"
                  >
                    <option value="">All Types</option>
                    {packageTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </FormSelect>
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
                  <Button variant="outline-secondary" onClick={loadPackages}>
                    <FontAwesomeIcon icon={faRefresh} className="me-2" />
                    Refresh
                  </Button>
                </Col>
              </Row>
            </div>

            <Table
              data={filteredPackages}
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
          setPackageToDelete(null)
        }}
        title="Delete Package"
        onConfirm={confirmDeletePackage}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      >
        <p>Are you sure you want to delete the package <strong>"{packageToDelete?.package_name}"</strong>?</p>
        <p className="text-muted">This action cannot be undone.</p>
      </Modal>
    </Container>
  )
}

export default PackagesList

