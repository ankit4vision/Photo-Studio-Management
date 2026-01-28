import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Container, Row, Col, Button, Badge, Card, FormControl, FormSelect, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTrash,
  faEdit,
  faPlus,
  faVideo,
  faSearch,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons'
import { Table, Modal, FormModal } from '../../components'
import GalleryVideoForm from '../../components/pages/website/GalleryVideoForm'
import websiteService from '../../services/websiteService'
import { useToast } from '../../components'
import { usePermissions, useDebounce } from '../../hooks'
import { PERMISSIONS } from '../../constants/permissions'

const GalleryVideosList = () => {
  const { success, error } = useToast()
  const { hasPermission } = usePermissions()

  const [videos, setVideos] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [platformFilter, setPlatformFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortState, setSortState] = useState({
    columnKey: 'order',
    sortBy: 'order',
    sortDirection: 'asc',
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [videoToDelete, setVideoToDelete] = useState(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [videoToEdit, setVideoToEdit] = useState(null)
  const [addLoading, setAddLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  const addFormRef = useRef()
  const editFormRef = useRef()

  const debouncedSearch = useDebounce(searchTerm, 400)

  const canCreateVideo = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_GALLERY_VIDEO_CREATE) || hasPermission(PERMISSIONS.WEBSITE_GALLERY_VIDEO_MANAGE)
    : true
  const canUpdateVideo = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_GALLERY_VIDEO_EDIT) || hasPermission(PERMISSIONS.WEBSITE_GALLERY_VIDEO_MANAGE)
    : true
  const canDeleteVideo = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_GALLERY_VIDEO_DELETE) || hasPermission(PERMISSIONS.WEBSITE_GALLERY_VIDEO_MANAGE)
    : true
  const canViewVideo = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_GALLERY_VIDEO_READ) || hasPermission(PERMISSIONS.WEBSITE_GALLERY_VIDEO_MANAGE)
    : true

  const fetchVideosWithParams = useCallback(async () => {
    setLoading(true)
    const searchValue = (debouncedSearch || '').trim()
    try {
      const response = await websiteService.getGalleryVideos({
        page: currentPage,
        limit: pageSize,
        search: searchValue || undefined,
        is_active: activeFilter || undefined,
        platform: platformFilter || undefined,
        sortBy: sortState.sortBy,
        sortDirection: sortState.sortDirection,
      })

      if (response && response.success) {
        setVideos(response.data || [])
        setMeta(response.meta || null)
      } else {
        error(response.message || 'Failed to fetch videos')
      }
    } catch (err) {
      console.error('Error fetching videos:', err)
      error('An error occurred while fetching videos')
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, debouncedSearch, activeFilter, platformFilter, sortState, error])

  useEffect(() => {
    if (canViewVideo) {
      fetchVideosWithParams()
    }
  }, [fetchVideosWithParams, canViewVideo])

  const handleDeleteClick = (video) => {
    if (!canDeleteVideo) {
      error('You do not have permission to delete videos')
      return
    }
    setVideoToDelete(video)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!videoToDelete) return

    try {
      const response = await websiteService.deleteGalleryVideo(videoToDelete.id)
      if (response.success) {
        success('Video deleted successfully')
        setShowDeleteModal(false)
        setVideoToDelete(null)
        await fetchVideosWithParams()
      } else {
        error(response.message || 'Failed to delete video')
      }
    } catch (err) {
      console.error('Error deleting video:', err)
      error('An error occurred while deleting video')
    }
  }

  const handleAddClick = () => {
    if (!canCreateVideo) {
      error('You do not have permission to create videos')
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
      const response = await websiteService.createGalleryVideo(formData)
      if (response.success) {
        success('Video created successfully')
        setShowAddModal(false)
        await fetchVideosWithParams()
      } else {
        error(response.message || 'Failed to create video')
      }
    } catch (err) {
      console.error('Error creating video:', err)
      error('An error occurred while creating video')
    } finally {
      setAddLoading(false)
    }
  }

  const handleEditClick = (video) => {
    if (!canUpdateVideo) {
      error('You do not have permission to edit videos')
      return
    }
    setVideoToEdit(video)
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
      const response = await websiteService.updateGalleryVideo(videoToEdit.id, formData)
      if (response.success) {
        success('Video updated successfully')
        setShowEditModal(false)
        setVideoToEdit(null)
        await fetchVideosWithParams()
      } else {
        error(response.message || 'Failed to update video')
      }
    } catch (err) {
      console.error('Error updating video:', err)
      error('An error occurred while updating video')
    } finally {
      setEditLoading(false)
    }
  }

  const sortKeyMap = {
    title: 'title',
    platform: 'platform',
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
      key: 'thumbnail',
      label: 'Thumbnail',
      render: (value, video) => (
        <div style={{ width: '80px', height: '50px', overflow: 'hidden', borderRadius: '4px', backgroundColor: '#f0f0f0' }}>
          {video.thumbnail_path ? (
            <img
              src={video.thumbnail_path}
              alt={video.title || 'Video'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/80x50?text=Video'
              }}
            />
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100">
              <FontAwesomeIcon icon={faVideo} className="text-muted" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Title',
      render: (value, video) => (
        <div>
          <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>
            {video.title || 'Untitled'}
          </div>
          <Badge bg={video.platform === 'youtube' ? 'danger' : 'primary'} style={{ fontSize: '10px' }}>
            {video.platform === 'youtube' ? 'YouTube' : 'Vimeo'}
          </Badge>
          {video.description && (
            <small className="text-muted d-block mt-1" style={{ fontSize: '12px' }}>
              {video.description.substring(0, 50)}{video.description.length > 50 ? '...' : ''}
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
      render: (value, video) => (
        <div className="d-flex gap-2">
          {canUpdateVideo && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleEditClick(video)}
              title="Edit"
            >
              <FontAwesomeIcon icon={faEdit} />
            </Button>
          )}
          {canDeleteVideo && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDeleteClick(video)}
              title="Delete"
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          )}
        </div>
      ),
    },
  ]

  if (!canViewVideo) {
    return (
      <Container fluid className="py-4">
        <Card>
          <Card.Body className="text-center py-5">
            <h5>Access Denied</h5>
            <p className="text-muted">You do not have permission to view gallery videos.</p>
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
                <FontAwesomeIcon icon={faVideo} className="me-2" />
                Gallery Videos Management
              </h4>
              <p className="text-muted mb-0">Manage website gallery videos</p>
            </div>
            {canCreateVideo && (
              <Button variant="primary" onClick={handleAddClick}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Video
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
                  placeholder="Search by title or description..."
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
                value={platformFilter}
                onChange={(e) => {
                  setPlatformFilter(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="">All Platforms</option>
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
              </FormSelect>
            </Col>
            <Col md={2} className="text-end">
              <Button
                variant="outline-secondary"
                onClick={fetchVideosWithParams}
                title="Refresh"
              >
                <FontAwesomeIcon icon={faRefresh} />
              </Button>
            </Col>
          </Row>

          <Table
            columns={columns}
            data={videos}
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
            emptyMessage="No videos found"
          />
        </Card.Body>
      </Card>

      {/* Add Modal */}
      <FormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Video"
        onSubmit={handleAddSubmit}
        submitText="Create"
        loading={addLoading}
        loadingText="Creating..."
      >
        <GalleryVideoForm
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
          setVideoToEdit(null)
        }}
        title="Edit Video"
        onSubmit={handleEditSubmit}
        submitText="Update"
        loading={editLoading}
        loadingText="Updating..."
      >
        <GalleryVideoForm
          ref={editFormRef}
          mode="edit"
          videoData={videoToEdit}
          onSubmit={handleEditFormSubmit}
          loading={editLoading}
        />
      </FormModal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false)
          setVideoToDelete(null)
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this video?</p>
          {videoToDelete && (
            <div className="mt-3">
              <strong>Title:</strong> {videoToDelete.title || 'Untitled'}
              <br />
              <strong>Platform:</strong> {videoToDelete.platform === 'youtube' ? 'YouTube' : 'Vimeo'}
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
              setVideoToDelete(null)
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

export default GalleryVideosList

