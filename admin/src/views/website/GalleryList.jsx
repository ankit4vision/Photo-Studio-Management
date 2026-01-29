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
import GalleryForm from '../../components/pages/website/GalleryForm'
import WebsiteCMSNav from '../../components/pages/website/WebsiteCMSNav'
import websiteService from '../../services/websiteService'
import { useToast } from '../../components'
import { usePermissions, useDebounce } from '../../hooks'
import { PERMISSIONS } from '../../constants/permissions'

const GalleryList = () => {
  const { success, error } = useToast()
  const { hasPermission } = usePermissions()

  const [gallery, setGallery] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
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
    ? hasPermission(PERMISSIONS.WEBSITE_GALLERY_CREATE) || hasPermission(PERMISSIONS.WEBSITE_GALLERY_MANAGE)
    : true
  const canUpdateGallery = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_GALLERY_EDIT) || hasPermission(PERMISSIONS.WEBSITE_GALLERY_MANAGE)
    : true
  const canDeleteGallery = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_GALLERY_DELETE) || hasPermission(PERMISSIONS.WEBSITE_GALLERY_MANAGE)
    : true
  const canViewGallery = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_GALLERY_READ) || hasPermission(PERMISSIONS.WEBSITE_GALLERY_MANAGE)
    : true

  const fetchGalleryWithParams = useCallback(async () => {
    setLoading(true)
    const searchValue = (debouncedSearch || '').trim()
    try {
      const response = await websiteService.getGallery({
        page: currentPage,
        limit: pageSize,
        search: searchValue || undefined,
        is_active: activeFilter || undefined,
        category: categoryFilter || undefined,
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
  }, [currentPage, pageSize, debouncedSearch, activeFilter, categoryFilter, sortState, error])

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
      const response = await websiteService.deleteGallery(galleryToDelete.id)
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
      const response = await websiteService.createGallery(formData)
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
      const response = await websiteService.updateGallery(galleryToEdit.id, formData)
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
    category: 'category',
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
            src={item.image_url || item.image_path}
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
          {item.category && (
            <Badge bg="secondary" style={{ fontSize: '10px' }}>
              {item.category}
            </Badge>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="mt-1">
              {item.tags.slice(0, 2).map((tag, idx) => (
                <Badge key={idx} bg="info" className="me-1" style={{ fontSize: '9px' }}>
                  {tag}
                </Badge>
              ))}
              {item.tags.length > 2 && (
                <span className="text-muted" style={{ fontSize: '10px' }}>
                  +{item.tags.length - 2}
                </span>
              )}
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
      <>
        <WebsiteCMSNav />
        <Container fluid className="py-4">
          <Card>
            <Card.Body className="text-center py-5">
              <h5>Access Denied</h5>
              <p className="text-muted">You do not have permission to view gallery.</p>
            </Card.Body>
          </Card>
        </Container>
      </>
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
                <FontAwesomeIcon icon={faImages} className="me-2" />
                Gallery Images Management
              </h4>
              <p className="text-muted mb-0">Manage website gallery images</p>
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
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <FormControl
                  placeholder="Search by title, description, or category..."
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
            <Col md={3}>
              <FormControl
                placeholder="Filter by category..."
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </Col>
            <Col md={2} className="text-end">
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
        <GalleryForm
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
        <GalleryForm
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
    </>
  )
}

export default GalleryList

