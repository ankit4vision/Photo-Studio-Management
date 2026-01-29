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
import { Modal, FormModal } from '../../components'
import SliderForm from '../../components/pages/website/SliderForm'
import WebsiteCMSNav from '../../components/pages/website/WebsiteCMSNav'
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
        const sliders = response.data || []
        // Debug: Log first slider to see what we're getting
        if (import.meta.env.DEV && sliders.length > 0) {
          console.log('First slider data from API:', JSON.stringify(sliders[0], null, 2))
          console.log('Image URL:', sliders[0].image_url)
          console.log('Image Path:', sliders[0].image_path)
        }
        setSliders(sliders)
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
        // Refresh the list to get updated data with image_url
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

  // Helper function to get image URL
  const getImageUrl = (slider) => {
    // First, try to use image_url from backend
    if (slider.image_url) {
      return slider.image_url
    }
    
    // If no image_url, generate from image_path
    if (slider.image_path) {
      // If it's already a full URL, use it
      if (slider.image_path.startsWith('http://') || slider.image_path.startsWith('https://')) {
        return slider.image_path
      }
      
      // If it's a frontend asset path (from seeders)
      if (slider.image_path.startsWith('/assets/')) {
        const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'
        return `${frontendUrl}${slider.image_path}`
      }
      
      // If it's a storage path (uploaded images)
      // Path format: 'website/cms/slider/file.jpg'
      if (slider.image_path && !slider.image_path.includes('\\') && !slider.image_path.match(/^[A-Z]:/)) {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
        // Remove /api if present
        const baseUrl = apiUrl.replace(/\/api\/?$/, '')
        return `${baseUrl}/storage/${slider.image_path}`
      }
    }
    
    return null
  }

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
    <>
      <WebsiteCMSNav />
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

          {/* Grid View */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-2">Loading sliders...</p>
            </div>
          ) : sliders.length === 0 ? (
            <div className="text-center py-5">
              <FontAwesomeIcon icon={faImage} className="text-muted mb-3" size="3x" />
              <h5 className="text-muted">No sliders found</h5>
              <p className="text-muted">Get started by adding your first slider image.</p>
            </div>
          ) : (
            <>
              <Row className="g-3">
                {sliders.map((slider) => {
                  const imageUrl = getImageUrl(slider)
                  
                  return (
                    <Col key={slider.id} xs={12} sm={6} md={4} lg={3}>
                      <Card className="h-100 shadow-sm">
                        {/* Image */}
                        <div
                          style={{
                            width: '100%',
                            height: '200px',
                            overflow: 'hidden',
                            backgroundColor: '#f0f0f0',
                            position: 'relative'
                          }}
                        >
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={slider.alt_text || slider.title || 'Slider'}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                e.currentTarget.style.display = 'none'
                                const parent = e.currentTarget.parentElement
                                if (parent && !parent.querySelector('.error-message')) {
                                  const errorDiv = document.createElement('div')
                                  errorDiv.className = 'error-message'
                                  errorDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; height: 100%; font-size: 12px; color: #999;'
                                  errorDiv.textContent = 'Image Not Found'
                                  parent.appendChild(errorDiv)
                                }
                              }}
                            />
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
                              <FontAwesomeIcon icon={faImage} size="2x" />
                            </div>
                          )}
                          {/* Status Badge Overlay */}
                          <Badge
                            bg={slider.is_active ? 'success' : 'secondary'}
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px'
                            }}
                          >
                            {slider.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        
                        {/* Card Body */}
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="flex-grow-1">
                              <h6 className="mb-1 fw-semibold">
                                {slider.title || 'Untitled Slider'}
                              </h6>
                              {slider.description && (
                                <p className="text-muted small mb-2" style={{ fontSize: '12px' }}>
                                  {slider.description.length > 80
                                    ? `${slider.description.substring(0, 80)}...`
                                    : slider.description}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                              <small className="text-muted">Order:</small>
                              <span className="ms-1 fw-semibold">{slider.order}</span>
                            </div>
                            {slider.alt_text && (
                              <small className="text-muted" title={slider.alt_text}>
                                <FontAwesomeIcon icon={faImage} className="me-1" />
                                Alt Text
                              </small>
                            )}
                          </div>
                          
                          {/* Actions */}
                          <div className="d-flex gap-2">
                            {canUpdateSlider && (
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="flex-fill"
                                onClick={() => handleEditClick(slider)}
                              >
                                <FontAwesomeIcon icon={faEdit} className="me-1" />
                                Edit
                              </Button>
                            )}
                            {canDeleteSlider && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="flex-fill"
                                onClick={() => handleDeleteClick(slider)}
                              >
                                <FontAwesomeIcon icon={faTrash} className="me-1" />
                                Delete
                              </Button>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  )
                })}
              </Row>
              
              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                  <div className="text-muted small">
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, meta.total)} of {meta.total} sliders
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-muted small">
                      Page {currentPage} of {meta.totalPages}
                    </span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(meta.totalPages, prev + 1))}
                      disabled={currentPage === meta.totalPages}
                    >
                      Next
                    </Button>
                    <FormSelect
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value))
                        setCurrentPage(1)
                      }}
                      style={{ width: 'auto' }}
                      size="sm"
                    >
                      <option value={6}>6 per page</option>
                      <option value={12}>12 per page</option>
                      <option value={24}>24 per page</option>
                      <option value={48}>48 per page</option>
                    </FormSelect>
                  </div>
                </div>
              )}
            </>
          )}
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
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSliderToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteModal(false)
          setSliderToDelete(null)
        }}
        title="Confirm Delete"
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        loading={false}
        size="md"
      >
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
      </Modal>
      </Container>
    </>
  )
}

export default SliderList

