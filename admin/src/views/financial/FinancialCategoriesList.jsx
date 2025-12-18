import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Button, FormControl, FormSelect, Badge, Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTrash, 
  faEdit, 
  faPlus,
  faTag,
  faSearch, 
  faRefresh,
  faFilter,
} from '@fortawesome/free-solid-svg-icons'
import { Table, Modal, FormModal } from '../../components'
import FinancialCategoryForm from '../../components/pages/financial/FinancialCategoryForm'
import financialCategoryService from '../../services/financialCategoryService'
import { useToast } from '../../components/common/ToastProvider'
import { usePermissions } from '../../hooks'
import { PERMISSIONS } from '../../constants/permissions'

const FinancialCategoriesList = () => {
  const { success, error: showError } = useToast()
  const { hasPermission } = usePermissions()
  
  // Permission checks
  const canCreateCategory = hasPermission
    ? hasPermission(PERMISSIONS.FINANCIAL_CATEGORY_WRITE) || hasPermission(PERMISSIONS.FINANCIAL_CATEGORY_MANAGE)
    : false
  const canEditCategory = hasPermission
    ? hasPermission(PERMISSIONS.FINANCIAL_CATEGORY_EDIT) || hasPermission(PERMISSIONS.FINANCIAL_CATEGORY_MANAGE)
    : false
  const canDeleteCategory = hasPermission
    ? hasPermission(PERMISSIONS.FINANCIAL_CATEGORY_DELETE) || hasPermission(PERMISSIONS.FINANCIAL_CATEGORY_MANAGE)
    : false
  
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [paginationMeta, setPaginationMeta] = useState({
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  
  // Add/Edit Modal States
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState(null)
  const [addLoading, setAddLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  
  // Refs for form components
  const addFormRef = useRef()
  const editFormRef = useRef()

  // Load categories when filters, search, or pagination changes
  useEffect(() => {
    loadCategories()
  }, [currentPage, pageSize, searchTerm, typeFilter, statusFilter])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sort_by: 'created_at',
        sort_direction: 'desc',
      }
      
      const response = await financialCategoryService.getCategories(params)
      if (response && response.success) {
        setCategories(response.data || [])
        if (response.meta) {
          setPaginationMeta({
            total: response.meta.total || 0,
            totalPages: response.meta.totalPages || 1,
            hasNext: response.meta.hasNext || false,
            hasPrev: response.meta.hasPrev || false,
          })
        }
      } else {
        showError(response.message || 'Failed to load categories')
        setCategories([])
      }
    } catch (err) {
      console.error('Error loading categories:', err)
      showError('An error occurred while loading categories')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const getTypeBadge = (type) => {
    if (type === 'income') {
      return <Badge bg="success" className="px-2 py-1">Income</Badge>
    }
    return <Badge bg="danger" className="px-2 py-1">Expense</Badge>
  }

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <Badge bg="success" className="px-2 py-1">Active</Badge>
    }
    return <Badge bg="secondary" className="px-2 py-1">Inactive</Badge>
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleEditCategory = (category) => {
    setCategoryToEdit(category)
    setShowEditModal(true)
  }

  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category)
    setShowDeleteModal(true)
  }

  const confirmDeleteCategory = async () => {
    try {
      const response = await financialCategoryService.deleteCategory(categoryToDelete.id)
      if (response.success) {
        success('Category deleted successfully')
        setShowDeleteModal(false)
        setCategoryToDelete(null)
        loadCategories()
      } else {
        showError(response.message || 'Failed to delete category')
      }
    } catch (err) {
      console.error('Error deleting category:', err)
      showError('An error occurred while deleting category')
    }
  }

  // Add Category Handlers
  const handleAddCategory = () => {
    setShowAddModal(true)
  }

  const handleAddCategorySubmit = () => {
    if (addFormRef.current) {
      addFormRef.current.handleSubmit()
    }
  }

  const handleAddCategoryFormSubmit = async (formData) => {
    try {
      setAddLoading(true)
      const response = await financialCategoryService.createCategory(formData)
      if (response.success) {
        success('Category created successfully')
        setShowAddModal(false)
        loadCategories()
      } else {
        showError(response.message || 'Failed to create category')
      }
    } catch (err) {
      console.error('Error creating category:', err)
      showError('An error occurred while creating category')
    } finally {
      setAddLoading(false)
    }
  }

  // Edit Category Handlers
  const handleEditCategorySubmit = () => {
    if (editFormRef.current) {
      editFormRef.current.handleSubmit()
    }
  }

  const handleEditCategoryFormSubmit = async (formData) => {
    try {
      setEditLoading(true)
      const response = await financialCategoryService.updateCategory(categoryToEdit.id, formData)
      if (response.success) {
        success('Category updated successfully')
        setShowEditModal(false)
        setCategoryToEdit(null)
        loadCategories()
      } else {
        showError(response.message || 'Failed to update category')
      }
    } catch (err) {
      console.error('Error updating category:', err)
      showError('An error occurred while updating category')
    } finally {
      setEditLoading(false)
    }
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setTypeFilter('all')
    setStatusFilter('all')
    setCurrentPage(1)
  }

  const columns = [
    {
      key: 'type',
      label: 'Type',
      render: (value, category) => getTypeBadge(category.type)
    },
    {
      key: 'name',
      label: 'Category Name',
      render: (value, category) => (
        <span className="fw-semibold">{category.name}</span>
      )
    },
    {
      key: 'description',
      label: 'Description',
      render: (value, category) => (
        <span className="text-truncate d-inline-block" style={{ maxWidth: '300px' }} title={category.description || ''}>
          {category.description || '-'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, category) => getStatusBadge(category.status)
    },
    {
      key: 'created_at',
      label: 'Created At',
      render: (value, category) => formatDate(category.createdAt || category.created_at)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, category) => (
        <div className="d-flex gap-2">
          {canEditCategory && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleEditCategory(category)}
              title="Edit"
            >
              <FontAwesomeIcon icon={faEdit} />
            </Button>
          )}
          {canDeleteCategory && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDeleteCategory(category)}
              title="Delete"
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          )}
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
              <h2 className="mb-0 text-dark">Financial Categories</h2>
            </div>
            <div className="ms-auto">
              {canCreateCategory && (
                <Button variant="primary" onClick={handleAddCategory}>
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Add Category
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
            <div className="mb-3">
              <div className="d-flex align-items-center mb-3 pb-2 border-bottom">
                <FontAwesomeIcon icon={faFilter} className="me-2 text-primary" />
                <h5 className="mb-0 text-primary">Filters</h5>
              </div>
              <Row className="g-3">
                <Col md={3}>
                  <FormSelect
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="border-2"
                  >
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </FormSelect>
                </Col>
                <Col md={3}>
                  <FormSelect
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border-2"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </FormSelect>
                </Col>
                <Col md={4}>
                  <FormControl
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-2"
                  />
                </Col>
                <Col md={2}>
                  <div className="d-flex gap-2">
                    <Button variant="outline-secondary" onClick={handleResetFilters}>
                      <FontAwesomeIcon icon={faFilter} className="me-2" />
                      Reset
                    </Button>
                    <Button variant="outline-primary" onClick={loadCategories}>
                      <FontAwesomeIcon icon={faRefresh} className="me-2" />
                      Refresh
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          {/* Categories Table */}
          <div className="bg-white rounded-3 shadow-sm p-4">
            <Table
              data={categories}
              columns={columns}
              loading={loading}
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={paginationMeta.total}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pagination={true}
              serverSide={true}
            />
          </div>
        </Col>
      </Row>

      {/* Add Category Modal */}
      <FormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Financial Category"
        onConfirm={handleAddCategorySubmit}
        confirmText="Create"
        loading={addLoading}
        size="lg"
      >
        <FinancialCategoryForm
          ref={addFormRef}
          mode="create"
          onSubmit={handleAddCategoryFormSubmit}
          onCancel={() => setShowAddModal(false)}
          loading={addLoading}
        />
      </FormModal>

      {/* Edit Category Modal */}
      <FormModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setCategoryToEdit(null)
        }}
        title="Edit Financial Category"
        onConfirm={handleEditCategorySubmit}
        confirmText="Update"
        loading={editLoading}
        size="lg"
      >
        {categoryToEdit && (
          <FinancialCategoryForm
            ref={editFormRef}
            mode="edit"
            categoryData={categoryToEdit}
            onSubmit={handleEditCategoryFormSubmit}
            onCancel={() => {
              setShowEditModal(false)
              setCategoryToEdit(null)
            }}
            loading={editLoading}
          />
        )}
      </FormModal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setCategoryToDelete(null)
        }}
        title="Delete Category"
        onConfirm={confirmDeleteCategory}
        confirmText="Delete"
        type="danger"
      >
        <p>Are you sure you want to delete this category?</p>
        {categoryToDelete && (
          <div className="alert alert-warning">
            <strong>Category:</strong> {categoryToDelete.name}<br />
            <strong>Type:</strong> {categoryToDelete.type}<br />
            <strong>Status:</strong> {categoryToDelete.status}
          </div>
        )}
        <p className="text-danger small mt-2">
          <strong>Note:</strong> This action cannot be undone. Make sure no transactions are using this category.
        </p>
      </Modal>
    </Container>
  )
}

export default FinancialCategoriesList
