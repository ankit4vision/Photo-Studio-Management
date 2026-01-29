import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Container, Row, Col, Button, Badge, Card, FormControl, FormSelect, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTrash,
  faEdit,
  faPlus,
  faImage,
  faSearch,
  faRefresh,
  faStar,
} from '@fortawesome/free-solid-svg-icons'
import { Table, Modal, FormModal } from '../../components'
import ProjectForm from '../../components/pages/website/ProjectForm'
import WebsiteCMSNav from '../../components/pages/website/WebsiteCMSNav'
import websiteService from '../../services/websiteService'
import { useToast } from '../../components'
import { usePermissions, useDebounce } from '../../hooks'
import { PERMISSIONS } from '../../constants/permissions'

const ProjectsList = () => {
  const { success, error } = useToast()
  const { hasPermission } = usePermissions()

  const [projects, setProjects] = useState([])
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
  const [projectToDelete, setProjectToDelete] = useState(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [projectToEdit, setProjectToEdit] = useState(null)
  const [addLoading, setAddLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  const addFormRef = useRef()
  const editFormRef = useRef()

  const debouncedSearch = useDebounce(searchTerm, 400)

  const canCreateProject = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_PROJECT_CREATE) || hasPermission(PERMISSIONS.WEBSITE_PROJECT_MANAGE)
    : true
  const canUpdateProject = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_PROJECT_EDIT) || hasPermission(PERMISSIONS.WEBSITE_PROJECT_MANAGE)
    : true
  const canDeleteProject = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_PROJECT_DELETE) || hasPermission(PERMISSIONS.WEBSITE_PROJECT_MANAGE)
    : true
  const canViewProject = hasPermission
    ? hasPermission(PERMISSIONS.WEBSITE_PROJECT_READ) || hasPermission(PERMISSIONS.WEBSITE_PROJECT_MANAGE)
    : true

  const fetchProjectsWithParams = useCallback(async () => {
    setLoading(true)
    const searchValue = (debouncedSearch || '').trim()
    try {
      const response = await websiteService.getProjects({
        page: currentPage,
        limit: pageSize,
        search: searchValue || undefined,
        is_active: activeFilter || undefined,
        is_featured: featuredFilter || undefined,
        sortBy: sortState.sortBy,
        sortDirection: sortState.sortDirection,
      })

      if (response && response.success) {
        setProjects(response.data || [])
        setMeta(response.meta || null)
      } else {
        error(response.message || 'Failed to fetch projects')
      }
    } catch (err) {
      console.error('Error fetching projects:', err)
      error('An error occurred while fetching projects')
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, debouncedSearch, activeFilter, featuredFilter, sortState, error])

  useEffect(() => {
    if (canViewProject) {
      fetchProjectsWithParams()
    }
  }, [fetchProjectsWithParams, canViewProject])

  const handleDeleteClick = (project) => {
    if (!canDeleteProject) {
      error('You do not have permission to delete projects')
      return
    }
    setProjectToDelete(project)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return

    try {
      const response = await websiteService.deleteProject(projectToDelete.id)
      if (response.success) {
        success('Project deleted successfully')
        setShowDeleteModal(false)
        setProjectToDelete(null)
        await fetchProjectsWithParams()
      } else {
        error(response.message || 'Failed to delete project')
      }
    } catch (err) {
      console.error('Error deleting project:', err)
      error('An error occurred while deleting project')
    }
  }

  const handleAddClick = () => {
    if (!canCreateProject) {
      error('You do not have permission to create projects')
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
      const response = await websiteService.createProject(formData)
      if (response.success) {
        success('Project created successfully')
        setShowAddModal(false)
        await fetchProjectsWithParams()
      } else {
        error(response.message || 'Failed to create project')
      }
    } catch (err) {
      console.error('Error creating project:', err)
      error('An error occurred while creating project')
    } finally {
      setAddLoading(false)
    }
  }

  const handleEditClick = async (project) => {
    if (!canUpdateProject) {
      error('You do not have permission to edit projects')
      return
    }
    
    try {
      // Fetch full project details with photos
      const response = await websiteService.getProjectById(project.id)
      if (response.success && response.data) {
        setProjectToEdit(response.data)
        setShowEditModal(true)
      } else {
        error('Failed to load project details')
      }
    } catch (err) {
      console.error('Error fetching project details:', err)
      error('An error occurred while loading project details')
      // Fallback to using the project data from list (without photos)
      setProjectToEdit(project)
      setShowEditModal(true)
    }
  }

  const handleEditSubmit = () => {
    if (editFormRef.current) {
      editFormRef.current.submit()
    }
  }

  const handleEditFormSubmit = async (formData) => {
    try {
      setEditLoading(true)
      const response = await websiteService.updateProject(projectToEdit.id, formData)
      if (response.success) {
        success('Project updated successfully')
        setShowEditModal(false)
        setProjectToEdit(null)
        await fetchProjectsWithParams()
      } else {
        error(response.message || 'Failed to update project')
      }
    } catch (err) {
      console.error('Error updating project:', err)
      error('An error occurred while updating project')
    } finally {
      setEditLoading(false)
    }
  }

  const sortKeyMap = {
    title: 'title',
    author: 'author',
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
      key: 'thumbnail',
      label: 'Thumbnail',
      render: (value, project) => {
        // Use thumbnail_image_url if available, otherwise construct from thumbnail_image
        const getThumbnailUrl = () => {
          if (project.thumbnail_image_url) {
            return project.thumbnail_image_url
          }
          if (project.thumbnail_image) {
            // If it's already a full URL, use it
            if (project.thumbnail_image.startsWith('http://') || project.thumbnail_image.startsWith('https://')) {
              return project.thumbnail_image
            }
            // If it's a frontend asset path, construct URL
            if (project.thumbnail_image.startsWith('/assets/')) {
              const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'
              return `${frontendUrl}${project.thumbnail_image}`
            }
            // If it's a storage path, construct storage URL
            if (project.thumbnail_image && !project.thumbnail_image.includes('\\') && !project.thumbnail_image.match(/^[A-Z]:/)) {
              const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
              const baseUrl = apiUrl.replace('/api', '')
              return `${baseUrl}/storage/${project.thumbnail_image}`
            }
          }
          return null
        }

        const thumbnailUrl = getThumbnailUrl()

        return (
          <div style={{ width: '80px', height: '50px', overflow: 'hidden', borderRadius: '4px', backgroundColor: '#f0f0f0' }}>
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={project.title || 'Project'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: #999; font-size: 10px;">No Image</div>'
                }}
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: '#999', fontSize: '10px' }}>
                No Image
              </div>
            )}
          </div>
        )
      },
    },
    {
      key: 'title',
      label: 'Title',
      render: (value, project) => (
        <div>
          <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>
            {project.title}
          </div>
          {project.author && (
            <small className="text-muted" style={{ fontSize: '12px' }}>
              By {project.author}
            </small>
          )}
          {project.category && (
            <div>
              <Badge bg="secondary" style={{ fontSize: '10px' }}>
                {project.category}
              </Badge>
            </div>
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
      render: (value, project) => (
        <div className="d-flex gap-2">
          {canUpdateProject && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleEditClick(project)}
              title="Edit"
            >
              <FontAwesomeIcon icon={faEdit} />
            </Button>
          )}
          {canDeleteProject && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDeleteClick(project)}
              title="Delete"
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          )}
        </div>
      ),
    },
  ]

  if (!canViewProject) {
    return (
      <Container fluid className="py-4">
        <Card>
          <Card.Body className="text-center py-5">
            <h5>Access Denied</h5>
            <p className="text-muted">You do not have permission to view projects.</p>
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
                Projects Gallery Management
              </h4>
              <p className="text-muted mb-0">Manage website projects gallery</p>
            </div>
            {canCreateProject && (
              <Button variant="primary" onClick={handleAddClick}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Project
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
                  placeholder="Search by title, author, or category..."
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
                <option value="">All Projects</option>
                <option value="true">Featured Only</option>
                <option value="false">Not Featured</option>
              </FormSelect>
            </Col>
            <Col md={2} className="text-end">
              <Button
                variant="outline-secondary"
                onClick={fetchProjectsWithParams}
                title="Refresh"
              >
                <FontAwesomeIcon icon={faRefresh} />
              </Button>
            </Col>
          </Row>

          <Table
            columns={columns}
            data={projects}
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
            emptyMessage="No projects found"
          />
        </Card.Body>
      </Card>

      {/* Add Modal */}
      <FormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Project"
        onSubmit={handleAddSubmit}
        submitText="Create"
        loading={addLoading}
        loadingText="Creating..."
      >
        <ProjectForm
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
          setProjectToEdit(null)
        }}
        title="Edit Project"
        onSubmit={handleEditSubmit}
        submitText="Update"
        loading={editLoading}
        loadingText="Updating..."
      >
        <ProjectForm
          ref={editFormRef}
          mode="edit"
          projectData={projectToEdit}
          onSubmit={handleEditFormSubmit}
          loading={editLoading}
        />
      </FormModal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false)
          setProjectToDelete(null)
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this project?</p>
          {projectToDelete && (
            <div className="mt-3">
              <strong>Title:</strong> {projectToDelete.title}
              <br />
              {projectToDelete.author && (
                <>
                  <strong>Author:</strong> {projectToDelete.author}
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
              setProjectToDelete(null)
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

export default ProjectsList

