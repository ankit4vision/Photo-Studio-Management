import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Container, Row, Col, Button, Badge, Card, FormControl, FormSelect, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTrash,
  faEdit,
  faPlus,
  faImages,
  faSearch,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons'
import { Table, Modal, FormModal } from '../../components'
import HomeGalleryForm from '../../components/pages/website/HomeGalleryForm'
import websiteService from '../../services/websiteService'
import { useToast } from '../../components'
import { usePermissions, useDebounce } from '../../hooks'
import { PERMISSIONS } from '../../constants/permissions'

const HomeGalleryList = () => {
  const { success, error } = useToast()
  const { hasPermission } = usePermissions()

  const [gallery, setGallery] = useState([])
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
  const [galleryToDelete, setGalleryToDelete] = useState(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [galleryToEdit, setGalleryToEdit] = useState(null)
  const [addLoading, setAddLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  const addFormRef = useRef()
  const editFormRef = useRef()

  const debouncedSearch = useDebounce(searchTerm, 400)

  const canCreateGallery = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_HOME_GALLERY_CREATE) || hasPermission(PERMISSIONS.WEBSITE_HOME_GALLERY_MANAGE)
    : true
  const canUpdateGallery = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_HOME_GALLERY_EDIT) || hasPermission(PERMISSIONS.WEBSITE_HOME_GALLERY_MANAGE)
    : true
  const canDeleteGallery = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_HOME_GALLERY_DELETE) || hasPermission(PERMISSIONS.WEBSITE_HOME_GALLERY_MANAGE)
    : true
  const canViewGallery = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_HOME_GALLERY_READ) || hasPermission(PERMISSIONS.WEBSITE_HOME_GALLERY_MANAGE)
    : true

  const fetchGalleryWithParams = useCallback(async () => {
    setLoading(true)
    const searchValue = (debouncedSearch || '').trim()
    try {
      const response = await websiteService.getHomeGallery({
        page: currentPage,
        limit: pageSize,
        search: searchValue || undefined,
        is_active: activeFilter || undefined,
        sortBy: sortState.sortBy,
        sortDirection: sortState.sortDirection,
      })

      if (response && response.success) {
        setGallery(response.data || [])
        setMeta(response.meta || null)
      } else {
        error(response.message || 'Failed to fetch gallery')
      }
    } catch (err) {
      console.error('Error fetching gallery:', err)
      error('An error occurred while fetching gallery')
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, debouncedSearch, activeFilter, sortState, error])

  useEffect(() => {
    if (canViewGallery) {
      fetchGalleryWithParams()
    }
  }, [fetchGalleryWithParams, canViewGallery])

  const handleDeleteClick = (item) => {
    if (!canDeleteGallery) {
      error('You do not have permission to delete gallery images')
      return
    }
    setGalleryToDelete(item)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!galleryToDelete) return

    try {
      const response = await websiteService.deleteHomeGallery(galleryToDelete.id)
      if (response.success) {
        success('Gallery image deleted successfully')
        setShowDeleteModal(false)
        setGalleryToDelete(null)
        await fetchGalleryWithParams()
      } else {
        error(response.message || 'Failed to delete gallery image')
      }
    } catch (err) {
      console.error('Error deleting gallery:', err)
      error('An error occurred while deleting gallery image')
    }
  }

  const handleAddClick = () => {
    if (!canCreateGallery) {
      error('You do not have permission to create gallery images')
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
      const response = await websiteService.createHomeGallery(formData)
      if (response.success) {
        success('Gallery image created successfully')
        setShowAddModal(false)
        await fetchGalleryWithParams()
      } else {
        error(response.message || 'Failed to create gallery image')
      }
    } catch (err) {
      console.error('Error creating gallery:', err)
      error('An error occurred while creating gallery image')
    } finally {
      setAddLoading(false)
    }
  }

  const handleEditClick = (item) => {
    if (!canUpdateGallery) {
      error('You do not have permission to edit gallery images')
      return
    }
    setGalleryToEdit(item)
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
      const response = await websiteService.updateHomeGallery(galleryToEdit.id, formData)
      if (response.success) {
        success('Gallery image updated successfully')
        setShowEditModal(false)
        setGalleryToEdit(null)
        await fetchGalleryWithParams()
      } else {
        error(response.message || 'Failed to update gallery image')
      }
    } catch (err) {
      console.error('Error updating gallery:', err)
      error('An error occurred while updating gallery image')
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
      key: 'image',
      label: 'Image',
      render: (value, item) => (
        <div style={{ width: '80px', height: '50px', overflow: 'hidden', borderRadius: '4px' }}>
          <img
            src={item.image_path}
            alt={item.alt_text || item.title || 'Gallery'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/80x50?text=No+Image'
            }}
          />
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Title',
      render: (value, item) => (
        <div>
          <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>
            {item.title || 'Untitled'}
          </div>
          {item.alt_text && (
            <small className="text-muted" style={{ fontSize: '12px' }}>
              {item.alt_text}
            </small>
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
      render: (value, item) => (
        <div className="d-flex gap-2">
          {canUpdateGallery && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleEditClick(item)}
              title="Edit"
            >
              <FontAwesomeIcon icon={faEdit} />
            </Button>
          )}
          {canDeleteGallery && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDeleteClick(item)}
              title="Delete"
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          )}
        </div>
      ),
    },
  ]

  if (!canViewGallery) {
    return (
      <Container fluid className="py-4">
        <Card>
          <Card.Body className="text-center py-5">
            <h5>Access Denied</h5>
            <p className="text-muted">You do not have permission to view home gallery.</p>
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
                <FontAwesomeIcon icon={faImages} className="me-2" />
                Home Gallery Management
              </h4>
              <p className="text-muted mb-0">Manage homepage gallery images</p>
            </div>
            {canCreateGallery && (
              <Button variant="primary" onClick={handleAddClick}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Image
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
                  placeholder="Search by title or alt text..."
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
                onClick={fetchGalleryWithParams}
                title="Refresh"
              >
                <FontAwesomeIcon icon={faRefresh} />
              </Button>
            </Col>
          </Row>

          <Table
            columns={columns}
            data={gallery}
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
            emptyMessage="No gallery images found"
          />
        </Card.Body>
      </Card>

      {/* Add Modal */}
      <FormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Gallery Image"
        onSubmit={handleAddSubmit}
        submitText="Create"
        loading={addLoading}
        loadingText="Creating..."
      >
        <HomeGalleryForm
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
          setGalleryToEdit(null)
        }}
        title="Edit Gallery Image"
        onSubmit={handleEditSubmit}
        submitText="Update"
        loading={editLoading}
        loadingText="Updating..."
      >
        <HomeGalleryForm
          ref={editFormRef}
          mode="edit"
          galleryData={galleryToEdit}
          onSubmit={handleEditFormSubmit}
          loading={editLoading}
        />
      </FormModal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false)
          setGalleryToDelete(null)
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this gallery image?</p>
          {galleryToDelete && (
            <div className="mt-3">
              <strong>Title:</strong> {galleryToDelete.title || 'Untitled'}
              <br />
              <strong>Image:</strong> {galleryToDelete.image_path}
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
              setGalleryToDelete(null)
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

export default HomeGalleryList

