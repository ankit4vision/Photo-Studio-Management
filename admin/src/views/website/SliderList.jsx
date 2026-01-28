import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Container, Row, Col, Button, Badge, Card, Form, FormControl, FormSelect, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTrash,
  faEdit,
  faPlus,
  faImage,
  faSearch,
  faFilter,
  faRefresh,
  faArrowsUpDown,
} from '@fortawesome/free-solid-svg-icons'
import { Table, Modal, FormModal } from '../../components'
import SliderForm from '../../components/pages/website/SliderForm'
import websiteService from '../../services/websiteService'
import { useToast } from '../../components'
import { usePermissions, useDebounce } from '../../hooks'
import { PERMISSIONS } from '../../constants/permissions'

const SliderList = () => {
  const { success, error, warning } = useToast()
  const { hasPermission } = usePermissions()

  const [sliders, setSliders] = useState([])
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
  const [sliderToDelete, setSliderToDelete] = useState(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [sliderToEdit, setSliderToEdit] = useState(null)
  const [addLoading, setAddLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  const addFormRef = useRef()
  const editFormRef = useRef()

  const debouncedSearch = useDebounce(searchTerm, 400)

  const canCreateSlider = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_SLIDER_CREATE) || hasPermission(PERMISSIONS.WEBSITE_SLIDER_MANAGE)
    : true
  const canUpdateSlider = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_SLIDER_EDIT) || hasPermission(PERMISSIONS.WEBSITE_SLIDER_MANAGE)
    : true
  const canDeleteSlider = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_SLIDER_DELETE) || hasPermission(PERMISSIONS.WEBSITE_SLIDER_MANAGE)
    : true
  const canViewSlider = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_SLIDER_READ) || hasPermission(PERMISSIONS.WEBSITE_SLIDER_MANAGE)
    : true

  const fetchSlidersWithParams = useCallback(async () => {
    setLoading(true)
    const searchValue = (debouncedSearch || '').trim()
    try {
      const response = await websiteService.getSliders({
        page: currentPage,
        limit: pageSize,
        search: searchValue || undefined,
        is_active: activeFilter || undefined,
        sortBy: sortState.sortBy,
        sortDirection: sortState.sortDirection,
      })

      if (response && response.success) {
        setSliders(response.data || [])
        setMeta(response.meta || null)
      } else {
        error(response.message || 'Failed to fetch sliders')
      }
    } catch (err) {
      console.error('Error fetching sliders:', err)
      error('An error occurred while fetching sliders')
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, debouncedSearch, activeFilter, sortState, error])

  useEffect(() => {
    if (canViewSlider) {
      fetchSlidersWithParams()
    }
  }, [fetchSlidersWithParams, canViewSlider])

  const handleDeleteClick = (slider) => {
    if (!canDeleteSlider) {
      error('You do not have permission to delete sliders')
      return
    }
    setSliderToDelete(slider)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!sliderToDelete) return

    try {
      const response = await websiteService.deleteSlider(sliderToDelete.id)
      if (response.success) {
        success('Slider deleted successfully')
        setShowDeleteModal(false)
        setSliderToDelete(null)
        await fetchSlidersWithParams()
      } else {
        error(response.message || 'Failed to delete slider')
      }
    } catch (err) {
      console.error('Error deleting slider:', err)
      error('An error occurred while deleting slider')
    }
  }

  const handleAddClick = () => {
    if (!canCreateSlider) {
      error('You do not have permission to create sliders')
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
      const response = await websiteService.createSlider(formData)
      if (response.success) {
        success('Slider created successfully')
        setShowAddModal(false)
        await fetchSlidersWithParams()
      } else {
        error(response.message || 'Failed to create slider')
      }
    } catch (err) {
      console.error('Error creating slider:', err)
      error('An error occurred while creating slider')
    } finally {
      setAddLoading(false)
    }
  }

  const handleEditClick = (slider) => {
    if (!canUpdateSlider) {
      error('You do not have permission to edit sliders')
      return
    }
    setSliderToEdit(slider)
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
      const response = await websiteService.updateSlider(sliderToEdit.id, formData)
      if (response.success) {
        success('Slider updated successfully')
        setShowEditModal(false)
        setSliderToEdit(null)
        await fetchSlidersWithParams()
      } else {
        error(response.message || 'Failed to update slider')
      }
    } catch (err) {
      console.error('Error updating slider:', err)
      error('An error occurred while updating slider')
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
      render: (value, slider) => (
        <div style={{ width: '80px', height: '50px', overflow: 'hidden', borderRadius: '4px' }}>
          <img
            src={slider.image_path}
            alt={slider.alt_text || slider.title || 'Slider'}
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
      render: (value, slider) => (
        <div>
          <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>
            {slider.title || 'Untitled Slider'}
          </div>
          {slider.description && (
            <small className="text-muted" style={{ fontSize: '12px' }}>
              {slider.description.substring(0, 50)}
              {slider.description.length > 50 ? '...' : ''}
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
      render: (value, slider) => (
        <div className="d-flex gap-2">
          {canUpdateSlider && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleEditClick(slider)}
              title="Edit"
            >
              <FontAwesomeIcon icon={faEdit} />
            </Button>
          )}
          {canDeleteSlider && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDeleteClick(slider)}
              title="Delete"
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          )}
        </div>
      ),
    },
  ]

  if (!canViewSlider) {
    return (
      <Container fluid className="py-4">
        <Card>
          <Card.Body className="text-center py-5">
            <h5>Access Denied</h5>
            <p className="text-muted">You do not have permission to view sliders.</p>
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
                <FontAwesomeIcon icon={faImage} className="me-2" />
                Hero Slider Management
              </h4>
              <p className="text-muted mb-0">Manage website hero slider images</p>
            </div>
            {canCreateSlider && (
              <Button variant="primary" onClick={handleAddClick}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Slider
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
                  placeholder="Search by title, description, or alt text..."
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
                onClick={fetchSlidersWithParams}
                title="Refresh"
              >
                <FontAwesomeIcon icon={faRefresh} />
              </Button>
            </Col>
          </Row>

          <Table
            columns={columns}
            data={sliders}
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
            emptyMessage="No sliders found"
          />
        </Card.Body>
      </Card>

      {/* Add Modal */}
      <FormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Slider"
        onSubmit={handleAddSubmit}
        submitText="Create"
        loading={addLoading}
        loadingText="Creating..."
      >
        <SliderForm
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
          setSliderToEdit(null)
        }}
        title="Edit Slider"
        onSubmit={handleEditSubmit}
        submitText="Update"
        loading={editLoading}
        loadingText="Updating..."
      >
        <SliderForm
          ref={editFormRef}
          mode="edit"
          sliderData={sliderToEdit}
          onSubmit={handleEditFormSubmit}
          loading={editLoading}
        />
      </FormModal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false)
          setSliderToDelete(null)
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this slider?</p>
          {sliderToDelete && (
            <div className="mt-3">
              <strong>Title:</strong> {sliderToDelete.title || 'Untitled'}
              <br />
              <strong>Image:</strong> {sliderToDelete.image_path}
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
              setSliderToDelete(null)
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

export default SliderList

