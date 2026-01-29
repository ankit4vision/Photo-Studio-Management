import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Container, Row, Col, Button, Badge, Card, FormControl, FormSelect, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTrash,
  faEdit,
  faPlus,
  faStar,
  faSearch,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons'
import { Table, Modal, FormModal } from '../../components'
import TestimonialForm from '../../components/pages/website/TestimonialForm'
import WebsiteCMSNav from '../../components/pages/website/WebsiteCMSNav'
import websiteService from '../../services/websiteService'
import { useToast } from '../../components'
import { usePermissions, useDebounce } from '../../hooks'
import { PERMISSIONS } from '../../constants/permissions'

const TestimonialsList = () => {
  const { success, error } = useToast()
  const { hasPermission } = usePermissions()

  const [testimonials, setTestimonials] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [featuredFilter, setFeaturedFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortState, setSortState] = useState({
    columnKey: 'order',
    sortBy: 'order',
    sortDirection: 'asc',
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [testimonialToDelete, setTestimonialToDelete] = useState(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [testimonialToEdit, setTestimonialToEdit] = useState(null)
  const [addLoading, setAddLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  const addFormRef = useRef()
  const editFormRef = useRef()

  const debouncedSearch = useDebounce(searchTerm, 400)

  const canCreateTestimonial = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_TESTIMONIAL_CREATE) || hasPermission(PERMISSIONS.WEBSITE_TESTIMONIAL_MANAGE)
    : true
  const canUpdateTestimonial = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_TESTIMONIAL_EDIT) || hasPermission(PERMISSIONS.WEBSITE_TESTIMONIAL_MANAGE)
    : true
  const canDeleteTestimonial = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_TESTIMONIAL_DELETE) || hasPermission(PERMISSIONS.WEBSITE_TESTIMONIAL_MANAGE)
    : true
  const canViewTestimonial = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_TESTIMONIAL_READ) || hasPermission(PERMISSIONS.WEBSITE_TESTIMONIAL_MANAGE)
    : true

  const fetchTestimonialsWithParams = useCallback(async () => {
    setLoading(true)
    const searchValue = (debouncedSearch || '').trim()
    try {
      const response = await websiteService.getTestimonials({
        page: currentPage,
        limit: pageSize,
        search: searchValue || undefined,
        is_active: activeFilter || undefined,
        is_featured: featuredFilter || undefined,
        sortBy: sortState.sortBy,
        sortDirection: sortState.sortDirection,
      })

      if (response && response.success) {
        setTestimonials(response.data || [])
        setMeta(response.meta || null)
      } else {
        error(response.message || 'Failed to fetch testimonials')
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err)
      error('An error occurred while fetching testimonials')
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, debouncedSearch, activeFilter, featuredFilter, sortState, error])

  useEffect(() => {
    if (canViewTestimonial) {
      fetchTestimonialsWithParams()
    }
  }, [fetchTestimonialsWithParams, canViewTestimonial])

  const handleDeleteClick = (testimonial) => {
    if (!canDeleteTestimonial) {
      error('You do not have permission to delete testimonials')
      return
    }
    setTestimonialToDelete(testimonial)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!testimonialToDelete) return

    try {
      const response = await websiteService.deleteTestimonial(testimonialToDelete.id)
      if (response.success) {
        success('Testimonial deleted successfully')
        setShowDeleteModal(false)
        setTestimonialToDelete(null)
        await fetchTestimonialsWithParams()
      } else {
        error(response.message || 'Failed to delete testimonial')
      }
    } catch (err) {
      console.error('Error deleting testimonial:', err)
      error('An error occurred while deleting testimonial')
    }
  }

  const handleAddClick = () => {
    if (!canCreateTestimonial) {
      error('You do not have permission to create testimonials')
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
      const response = await websiteService.createTestimonial(formData)
      if (response.success) {
        success('Testimonial created successfully')
        setShowAddModal(false)
        await fetchTestimonialsWithParams()
      } else {
        error(response.message || 'Failed to create testimonial')
      }
    } catch (err) {
      console.error('Error creating testimonial:', err)
      error('An error occurred while creating testimonial')
    } finally {
      setAddLoading(false)
    }
  }

  const handleEditClick = (testimonial) => {
    if (!canUpdateTestimonial) {
      error('You do not have permission to edit testimonials')
      return
    }
    setTestimonialToEdit(testimonial)
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
      const response = await websiteService.updateTestimonial(testimonialToEdit.id, formData)
      if (response.success) {
        success('Testimonial updated successfully')
        setShowEditModal(false)
        setTestimonialToEdit(null)
        await fetchTestimonialsWithParams()
      } else {
        error(response.message || 'Failed to update testimonial')
      }
    } catch (err) {
      console.error('Error updating testimonial:', err)
      error('An error occurred while updating testimonial')
    } finally {
      setEditLoading(false)
    }
  }

  const sortKeyMap = {
    customer_name: 'customer_name',
    location: 'location',
    rating: 'rating',
    order: 'order',
    is_featured: 'is_featured',
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={faStar}
        className={i < rating ? 'text-warning' : 'text-muted'}
        style={{ opacity: i < rating ? 1 : 0.3 }}
      />
    ))
  }

  const columns = [
    {
      key: 'photo',
      label: 'Photo',
      render: (value, testimonial) => {
        // Use photo_url if available, otherwise construct from photo_path
        const getPhotoUrl = () => {
          if (testimonial.photo_url && !testimonial.photo_url.includes('via.placeholder.com') && !testimonial.photo_url.includes('placeholder')) {
            return testimonial.photo_url
          }
          if (testimonial.photo_path) {
            // If it's already a full URL, use it
            if (testimonial.photo_path.startsWith('http://') || testimonial.photo_path.startsWith('https://')) {
              return testimonial.photo_path
            }
            // If it's a frontend asset path, construct URL
            if (testimonial.photo_path.startsWith('/assets/')) {
              const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'
              return `${frontendUrl}${testimonial.photo_path}`
            }
            // If it's a storage path, construct storage URL
            if (testimonial.photo_path && !testimonial.photo_path.includes('\\') && !testimonial.photo_path.match(/^[A-Z]:/)) {
              const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
              const baseUrl = apiUrl.replace('/api', '')
              return `${baseUrl}/storage/${testimonial.photo_path}`
            }
          }
          return null
        }

        const photoUrl = getPhotoUrl()

        return (
          <div style={{ width: '50px', height: '50px', overflow: 'hidden', borderRadius: '50%', backgroundColor: '#f0f0f0' }}>
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={testimonial.customer_name || 'Customer'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: #999; font-size: 10px;">No Photo</div>'
                }}
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: '#999', fontSize: '10px' }}>
                No Photo
              </div>
            )}
          </div>
        )
      },
    },
    {
      key: 'customer_name',
      label: 'Customer',
      render: (value, testimonial) => (
        <div>
          <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>
            {testimonial.customer_name}
          </div>
          {testimonial.location && (
            <small className="text-muted" style={{ fontSize: '12px' }}>
              {testimonial.location}
            </small>
          )}
          <div className="mt-1">
            {renderStars(testimonial.rating || 5)}
          </div>
        </div>
      ),
    },
    {
      key: 'testimonial_text',
      label: 'Testimonial',
      render: (value) => (
        <div style={{ maxWidth: '400px' }}>
          <small className="text-muted">
            {value && value.length > 100 ? `${value.substring(0, 100)}...` : value}
          </small>
        </div>
      ),
    },
    {
      key: 'is_featured',
      label: 'Featured',
      render: (value) => (
        value ? (
          <Badge bg="warning" text="dark">
            <FontAwesomeIcon icon={faStar} className="me-1" />
            Featured
          </Badge>
        ) : (
          <span className="text-muted">-</span>
        )
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
      render: (value, testimonial) => (
        <div className="d-flex gap-2">
          {canUpdateTestimonial && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleEditClick(testimonial)}
              title="Edit"
            >
              <FontAwesomeIcon icon={faEdit} />
            </Button>
          )}
          {canDeleteTestimonial && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDeleteClick(testimonial)}
              title="Delete"
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          )}
        </div>
      ),
    },
  ]

  if (!canViewTestimonial) {
    return (
      <Container fluid className="py-4">
        <Card>
          <Card.Body className="text-center py-5">
            <h5>Access Denied</h5>
            <p className="text-muted">You do not have permission to view testimonials.</p>
          </Card.Body>
        </Card>
      </Container>
    )
  }

  return (
    <>
      <WebsiteCMSNav />
      <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1">
                <FontAwesomeIcon icon={faStar} className="me-2" />
                Testimonials Management
              </h4>
              <p className="text-muted mb-0">Manage customer testimonials</p>
            </div>
            {canCreateTestimonial && (
              <Button variant="primary" onClick={handleAddClick}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Testimonial
              </Button>
            )}
          </div>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <FormControl
                  placeholder="Search by name, location, or testimonial..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </InputGroup>
            </Col>
            <Col md={2}>
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
            <Col md={2}>
              <FormSelect
                value={featuredFilter}
                onChange={(e) => {
                  setFeaturedFilter(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="">All Testimonials</option>
                <option value="true">Featured Only</option>
                <option value="false">Not Featured</option>
              </FormSelect>
            </Col>
            <Col md={2} className="text-end">
              <Button
                variant="outline-secondary"
                onClick={fetchTestimonialsWithParams}
                title="Refresh"
              >
                <FontAwesomeIcon icon={faRefresh} />
              </Button>
            </Col>
          </Row>

          <Table
            columns={columns}
            data={testimonials}
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
            emptyMessage="No testimonials found"
          />
        </Card.Body>
      </Card>

      {/* Add Modal */}
      <FormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Testimonial"
        onSubmit={handleAddSubmit}
        submitText="Create"
        loading={addLoading}
        loadingText="Creating..."
      >
        <TestimonialForm
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
          setTestimonialToEdit(null)
        }}
        title="Edit Testimonial"
        onSubmit={handleEditSubmit}
        submitText="Update"
        loading={editLoading}
        loadingText="Updating..."
      >
        <TestimonialForm
          ref={editFormRef}
          mode="edit"
          testimonialData={testimonialToEdit}
          onSubmit={handleEditFormSubmit}
          loading={editLoading}
        />
      </FormModal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false)
          setTestimonialToDelete(null)
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this testimonial?</p>
          {testimonialToDelete && (
            <div className="mt-3">
              <strong>Customer:</strong> {testimonialToDelete.customer_name}
              <br />
              {testimonialToDelete.location && (
                <>
                  <strong>Location:</strong> {testimonialToDelete.location}
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
              setTestimonialToDelete(null)
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
    </>
  )
}

export default TestimonialsList

