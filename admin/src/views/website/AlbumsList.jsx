import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Container, Row, Col, Button, Badge, Card, FormControl, FormSelect, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTrash,
  faEdit,
  faPlus,
  faFolder,
  faSearch,
  faRefresh,
  faStar,
} from '@fortawesome/free-solid-svg-icons'
import { Table, Modal, FormModal } from '../../components'
import AlbumForm from '../../components/pages/website/AlbumForm'
import websiteService from '../../services/websiteService'
import { useToast } from '../../components'
import { usePermissions, useDebounce } from '../../hooks'
import { PERMISSIONS } from '../../constants/permissions'

const AlbumsList = () => {
  const { success, error } = useToast()
  const { hasPermission } = usePermissions()

  const [albums, setAlbums] = useState([])
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
  const [albumToDelete, setAlbumToDelete] = useState(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [albumToEdit, setAlbumToEdit] = useState(null)
  const [addLoading, setAddLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  const addFormRef = useRef()
  const editFormRef = useRef()

  const debouncedSearch = useDebounce(searchTerm, 400)

  const canCreateAlbum = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_ALBUM_CREATE) || hasPermission(PERMISSIONS.WEBSITE_ALBUM_MANAGE)
    : true
  const canUpdateAlbum = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_ALBUM_EDIT) || hasPermission(PERMISSIONS.WEBSITE_ALBUM_MANAGE)
    : true
  const canDeleteAlbum = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_ALBUM_DELETE) || hasPermission(PERMISSIONS.WEBSITE_ALBUM_MANAGE)
    : true
  const canViewAlbum = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_ALBUM_READ) || hasPermission(PERMISSIONS.WEBSITE_ALBUM_MANAGE)
    : true

  const fetchAlbumsWithParams = useCallback(async () => {
    setLoading(true)
    const searchValue = (debouncedSearch || '').trim()
    try {
      const response = await websiteService.getAlbums({
        page: currentPage,
        limit: pageSize,
        search: searchValue || undefined,
        is_active: activeFilter || undefined,
        is_featured: featuredFilter || undefined,
        sortBy: sortState.sortBy,
        sortDirection: sortState.sortDirection,
      })

      if (response && response.success) {
        setAlbums(response.data || [])
        setMeta(response.meta || null)
      } else {
        error(response.message || 'Failed to fetch albums')
      }
    } catch (err) {
      console.error('Error fetching albums:', err)
      error('An error occurred while fetching albums')
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, debouncedSearch, activeFilter, featuredFilter, sortState, error])

  useEffect(() => {
    if (canViewAlbum) {
      fetchAlbumsWithParams()
    }
  }, [fetchAlbumsWithParams, canViewAlbum])

  const handleDeleteClick = (album) => {
    if (!canDeleteAlbum) {
      error('You do not have permission to delete albums')
      return
    }
    setAlbumToDelete(album)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!albumToDelete) return

    try {
      const response = await websiteService.deleteAlbum(albumToDelete.id)
      if (response.success) {
        success('Album deleted successfully')
        setShowDeleteModal(false)
        setAlbumToDelete(null)
        await fetchAlbumsWithParams()
      } else {
        error(response.message || 'Failed to delete album')
      }
    } catch (err) {
      console.error('Error deleting album:', err)
      error('An error occurred while deleting album')
    }
  }

  const handleAddClick = () => {
    if (!canCreateAlbum) {
      error('You do not have permission to create albums')
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
      const response = await websiteService.createAlbum(formData)
      if (response.success) {
        success('Album created successfully')
        setShowAddModal(false)
        await fetchAlbumsWithParams()
      } else {
        error(response.message || 'Failed to create album')
      }
    } catch (err) {
      console.error('Error creating album:', err)
      error('An error occurred while creating album')
    } finally {
      setAddLoading(false)
    }
  }

  const handleEditClick = (album) => {
    if (!canUpdateAlbum) {
      error('You do not have permission to edit albums')
      return
    }
    setAlbumToEdit(album)
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
      const response = await websiteService.updateAlbum(albumToEdit.id, formData)
      if (response.success) {
        success('Album updated successfully')
        setShowEditModal(false)
        setAlbumToEdit(null)
        await fetchAlbumsWithParams()
      } else {
        error(response.message || 'Failed to update album')
      }
    } catch (err) {
      console.error('Error updating album:', err)
      error('An error occurred while updating album')
    } finally {
      setEditLoading(false)
    }
  }

  const sortKeyMap = {
    title: 'title',
    category: 'category',
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

  const columns = [
    {
      key: 'cover',
      label: 'Cover',
      render: (value, album) => (
        <div style={{ width: '80px', height: '50px', overflow: 'hidden', borderRadius: '4px' }}>
          {album.cover_image ? (
            <img
              src={album.cover_image}
              alt={album.title || 'Album'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/80x50?text=No+Image'
              }}
            />
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100 bg-light">
              <FontAwesomeIcon icon={faFolder} className="text-muted" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Title',
      render: (value, album) => (
        <div>
          <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>
            {album.title}
          </div>
          {album.category && (
            <Badge bg="secondary" className="me-1" style={{ fontSize: '10px' }}>
              {album.category}
            </Badge>
          )}
          {album.slug && (
            <small className="text-muted d-block" style={{ fontSize: '11px' }}>
              /{album.slug}
            </small>
          )}
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
      render: (value, album) => (
        <div className="d-flex gap-2">
          {canUpdateAlbum && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleEditClick(album)}
              title="Edit"
            >
              <FontAwesomeIcon icon={faEdit} />
            </Button>
          )}
          {canDeleteAlbum && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDeleteClick(album)}
              title="Delete"
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          )}
        </div>
      ),
    },
  ]

  if (!canViewAlbum) {
    return (
      <Container fluid className="py-4">
        <Card>
          <Card.Body className="text-center py-5">
            <h5>Access Denied</h5>
            <p className="text-muted">You do not have permission to view albums.</p>
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
                <FontAwesomeIcon icon={faFolder} className="me-2" />
                Albums Management
              </h4>
              <p className="text-muted mb-0">Manage website albums</p>
            </div>
            {canCreateAlbum && (
              <Button variant="primary" onClick={handleAddClick}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Album
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
                <option value="">All Albums</option>
                <option value="true">Featured Only</option>
                <option value="false">Not Featured</option>
              </FormSelect>
            </Col>
            <Col md={2} className="text-end">
              <Button
                variant="outline-secondary"
                onClick={fetchAlbumsWithParams}
                title="Refresh"
              >
                <FontAwesomeIcon icon={faRefresh} />
              </Button>
            </Col>
          </Row>

          <Table
            columns={columns}
            data={albums}
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
            emptyMessage="No albums found"
          />
        </Card.Body>
      </Card>

      {/* Add Modal */}
      <FormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Album"
        onSubmit={handleAddSubmit}
        submitText="Create"
        loading={addLoading}
        loadingText="Creating..."
      >
        <AlbumForm
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
          setAlbumToEdit(null)
        }}
        title="Edit Album"
        onSubmit={handleEditSubmit}
        submitText="Update"
        loading={editLoading}
        loadingText="Updating..."
      >
        <AlbumForm
          ref={editFormRef}
          mode="edit"
          albumData={albumToEdit}
          onSubmit={handleEditFormSubmit}
          loading={editLoading}
        />
      </FormModal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false)
          setAlbumToDelete(null)
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this album?</p>
          {albumToDelete && (
            <div className="mt-3">
              <strong>Title:</strong> {albumToDelete.title}
              <br />
              {albumToDelete.slug && (
                <>
                  <strong>Slug:</strong> {albumToDelete.slug}
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
              setAlbumToDelete(null)
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

export default AlbumsList

