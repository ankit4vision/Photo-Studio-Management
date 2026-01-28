import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Container, Row, Col, Button, Badge, Card, FormControl, FormSelect, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTrash,
  faEdit,
  faPlus,
  faCog,
  faSearch,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons'
import { Table, Modal, FormModal } from '../../components'
import ServiceForm from '../../components/pages/website/ServiceForm'
import websiteService from '../../services/websiteService'
import { useToast } from '../../components'
import { usePermissions, useDebounce } from '../../hooks'
import { PERMISSIONS } from '../../constants/permissions'

const ServicesList = () => {
  const { success, error } = useToast()
  const { hasPermission } = usePermissions()

  const [services, setServices] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortState, setSortState] = useState({
    columnKey: 'order',
    sortBy: 'order',
    sortDirection: 'asc',
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [serviceToEdit, setServiceToEdit] = useState(null)
  const [addLoading, setAddLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  const addFormRef = useRef()
  const editFormRef = useRef()

  const debouncedSearch = useDebounce(searchTerm, 400)

  const canCreateService = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_SERVICE_CREATE) || hasPermission(PERMISSIONS.WEBSITE_SERVICE_MANAGE)
    : true
  const canUpdateService = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_SERVICE_EDIT) || hasPermission(PERMISSIONS.WEBSITE_SERVICE_MANAGE)
    : true
  const canDeleteService = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_SERVICE_DELETE) || hasPermission(PERMISSIONS.WEBSITE_SERVICE_MANAGE)
    : true
  const canViewService = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_SERVICE_READ) || hasPermission(PERMISSIONS.WEBSITE_SERVICE_MANAGE)
    : true

  const fetchServicesWithParams = useCallback(async () => {
    setLoading(true)
    const searchValue = (debouncedSearch || '').trim()
    try {
      const response = await websiteService.getServices({
        page: currentPage,
        limit: pageSize,
        search: searchValue || undefined,
        is_active: activeFilter || undefined,
        sortBy: sortState.sortBy,
        sortDirection: sortState.sortDirection,
      })

      if (response && response.success) {
        setServices(response.data || [])
        setMeta(response.meta || null)
      } else {
        error(response.message || 'Failed to fetch services')
      }
    } catch (err) {
      console.error('Error fetching services:', err)
      error('An error occurred while fetching services')
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, debouncedSearch, activeFilter, sortState, error])

  useEffect(() => {
    if (canViewService) {
      fetchServicesWithParams()
    }
  }, [fetchServicesWithParams, canViewService])

  const handleDeleteClick = (service) => {
    if (!canDeleteService) {
      error('You do not have permission to delete services')
      return
    }
    setServiceToDelete(service)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return

    try {
      const response = await websiteService.deleteService(serviceToDelete.id)
      if (response.success) {
        success('Service deleted successfully')
        setShowDeleteModal(false)
        setServiceToDelete(null)
        await fetchServicesWithParams()
      } else {
        error(response.message || 'Failed to delete service')
      }
    } catch (err) {
      console.error('Error deleting service:', err)
      error('An error occurred while deleting service')
    }
  }

  const handleAddClick = () => {
    if (!canCreateService) {
      error('You do not have permission to create services')
      return
    }
    setShowAddModal(true)
  }

  const handleAddSubmit = () => {
    if (addFormRef.current) {
      addFormRef.current.submit()
    }
  }

  const handleAddFormSubmit = async (formData) => {
    try {
      setAddLoading(true)
      const response = await websiteService.createService(formData)
      if (response.success) {
        success('Service created successfully')
        setShowAddModal(false)
        await fetchServicesWithParams()
      } else {
        error(response.message || 'Failed to create service')
      }
    } catch (err) {
      console.error('Error creating service:', err)
      error('An error occurred while creating service')
    } finally {
      setAddLoading(false)
    }
  }

  const handleEditClick = (service) => {
    if (!canUpdateService) {
      error('You do not have permission to edit services')
      return
    }
    setServiceToEdit(service)
    setShowEditModal(true)
  }

  const handleEditSubmit = () => {
    if (editFormRef.current) {
      editFormRef.current.submit()
    }
  }

  const handleEditFormSubmit = async (formData) => {
    try {
      setEditLoading(true)
      const response = await websiteService.updateService(serviceToEdit.id, formData)
      if (response.success) {
        success('Service updated successfully')
        setShowEditModal(false)
        setServiceToEdit(null)
        await fetchServicesWithParams()
      } else {
        error(response.message || 'Failed to update service')
      }
    } catch (err) {
      console.error('Error updating service:', err)
      error('An error occurred while updating service')
    } finally {
      setEditLoading(false)
    }
  }

  const sortKeyMap = {
    title: 'title',
    order: 'order',
    is_active: 'is_active',
    created_at: 'created_at',
  }

  const handleSortChange = (columnKey, direction) => {
    const sortBy = sortKeyMap[columnKey]
    if (!sortBy) {
      return
    }
    setSortState({
      columnKey,
      sortBy,
      sortDirection: direction,
    })
    setCurrentPage(1)
  }

  const columns = [
    {
      key: 'icon',
      label: 'Icon',
      render: (value, service) => (
        <div className="text-center">
          {service.icon_class ? (
            <i className={`bi ${service.icon_class}`} style={{ fontSize: '24px' }}></i>
          ) : (
            <FontAwesomeIcon icon={faCog} style={{ fontSize: '20px', color: '#6c757d' }} />
          )}
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Title',
      render: (value, service) => (
        <div>
          <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>
            {service.title}
          </div>
          {service.service_number && (
            <small className="text-muted" style={{ fontSize: '12px' }}>
              #{service.service_number}
            </small>
          )}
          {service.description && (
            <div>
              <small className="text-muted" style={{ fontSize: '12px' }}>
                {service.description.substring(0, 60)}
                {service.description.length > 60 ? '...' : ''}
              </small>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'order',
      label: 'Order',
      render: (value) => <span className="text-muted">{value}</span>,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (value) => (
        <Badge bg={value ? 'success' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, service) => (
        <div className="d-flex gap-2">
          {canUpdateService && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleEditClick(service)}
              title="Edit"
            >
              <FontAwesomeIcon icon={faEdit} />
            </Button>
          )}
          {canDeleteService && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDeleteClick(service)}
              title="Delete"
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          )}
        </div>
      ),
    },
  ]

  if (!canViewService) {
    return (
      <Container fluid className="py-4">
        <Card>
          <Card.Body className="text-center py-5">
            <h5>Access Denied</h5>
            <p className="text-muted">You do not have permission to view services.</p>
          </Card.Body>
        </Card>
      </Container>
    )
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1">
                <FontAwesomeIcon icon={faCog} className="me-2" />
                Services Management
              </h4>
              <p className="text-muted mb-0">Manage website services section</p>
            </div>
            {canCreateService && (
              <Button variant="primary" onClick={handleAddClick}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Service
              </Button>
            )}
          </div>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <FormControl
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <FormSelect
                value={activeFilter}
                onChange={(e) => {
                  setActiveFilter(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </FormSelect>
            </Col>
            <Col md={3} className="text-end">
              <Button
                variant="outline-secondary"
                onClick={fetchServicesWithParams}
                title="Refresh"
              >
                <FontAwesomeIcon icon={faRefresh} />
              </Button>
            </Col>
          </Row>

          <Table
            columns={columns}
            data={services}
            loading={loading}
            pagination={{
              currentPage,
              pageSize,
              total: meta?.total || 0,
              totalPages: meta?.totalPages || 1,
              onPageChange: setCurrentPage,
              onPageSizeChange: setPageSize,
            }}
            sorting={{
              sortBy: sortState.columnKey,
              sortDirection: sortState.sortDirection,
              onSortChange: handleSortChange,
            }}
            emptyMessage="No services found"
          />
        </Card.Body>
      </Card>

      {/* Add Modal */}
      <FormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Service"
        onSubmit={handleAddSubmit}
        submitText="Create"
        loading={addLoading}
        loadingText="Creating..."
      >
        <ServiceForm
          ref={addFormRef}
          mode="create"
          onSubmit={handleAddFormSubmit}
          loading={addLoading}
        />
      </FormModal>

      {/* Edit Modal */}
      <FormModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setServiceToEdit(null)
        }}
        title="Edit Service"
        onSubmit={handleEditSubmit}
        submitText="Update"
        loading={editLoading}
        loadingText="Updating..."
      >
        <ServiceForm
          ref={editFormRef}
          mode="edit"
          serviceData={serviceToEdit}
          onSubmit={handleEditFormSubmit}
          loading={editLoading}
        />
      </FormModal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false)
          setServiceToDelete(null)
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this service?</p>
          {serviceToDelete && (
            <div className="mt-3">
              <strong>Title:</strong> {serviceToDelete.title}
              <br />
              {serviceToDelete.service_number && (
                <>
                  <strong>Number:</strong> {serviceToDelete.service_number}
                  <br />
                </>
              )}
            </div>
          )}
          <p className="text-danger mt-3 mb-0">
            <small>This action cannot be undone.</small>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowDeleteModal(false)
              setServiceToDelete(null)
            }}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default ServicesList

