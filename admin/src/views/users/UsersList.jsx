import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Button, FormControl, FormSelect, Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPencil, faTrash, faInfo, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../components'
import { useUserManagement, usePermissions } from '../../hooks'
import { Table, Modal, FormModal, UserForm } from '../../components'

const UsersList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  
  // Add User Modal States
  const [showAddModal, setShowAddModal] = useState(false)
  const [addUserLoading, setAddUserLoading] = useState(false)
  
  // Edit User Modal States
  const [showEditModal, setShowEditModal] = useState(false)
  const [userToEdit, setUserToEdit] = useState(null)
  const [editUserLoading, setEditUserLoading] = useState(false)
  
  // View User Modal States
  const [showViewModal, setShowViewModal] = useState(false)
  const [userToView, setUserToView] = useState(null)
  
  // Refs for form components
  const addUserFormRef = useRef()
  const editUserFormRef = useRef()

  const navigate = useNavigate()
  const { success, error } = useToast()
  const { users, loading, fetchUsers, deleteUser } = useUserManagement()
  const { hasPermission } = usePermissions()

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    // Debounce search implementation
  }

  const handleCreateUser = () => {
    setShowAddModal(true)
  }

  const handleAddUser = async () => {
    if (addUserFormRef.current) {
      addUserFormRef.current.handleSubmit()
    }
  }

  const handleAddUserSubmit = async (userData) => {
    setAddUserLoading(true)
    try {
      // Simulate API call - in real app, this would be actual API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      success('User created successfully!')
      setShowAddModal(false)
      // In real app, you would refresh the users list here
    } catch (err) {
      error('Failed to create user')
    } finally {
      setAddUserLoading(false)
    }
  }

  const handleEditUser = async () => {
    if (editUserFormRef.current) {
      editUserFormRef.current.handleSubmit()
    }
  }

  const handleEditUserSubmit = async (userData) => {
    setEditUserLoading(true)
    try {
      // Simulate API call - in real app, this would be actual API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      success('User updated successfully!')
      setShowEditModal(false)
      setUserToEdit(null)
      // In real app, you would refresh the users list here
    } catch (err) {
      error('Failed to update user')
    } finally {
      setEditUserLoading(false)
    }
  }

  const handleOpenEditModal = (user) => {
    setUserToEdit(user)
    setShowEditModal(true)
  }

  const handleEditUserOld = (user) => {
    navigate(`/users/edit/${user.id}`)
  }

  const handleViewUser = (user) => {
    setUserToView(user)
    setShowViewModal(true)
  }

  const handleDeleteUser = (user) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const confirmDeleteUser = async () => {
    try {
      await deleteUser(userToDelete.id)
      success('User deleted successfully!')
      setShowDeleteModal(false)
      setUserToDelete(null)
    } catch (err) {
      error('Failed to delete user')
    }
  }

  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) {
      error('Please select users to delete')
      return
    }
    // Implement bulk delete
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesRole = !roleFilter || user.role === roleFilter
    const matchesStatus = !statusFilter || user.isActive === (statusFilter === 'active')
    return matchesSearch && matchesRole && matchesStatus
  })

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value, user, index) => (
        <div className="d-flex align-items-center">
          <div 
            className="rounded-circle me-2 d-flex align-items-center justify-content-center text-white fw-bold"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: user.avatar ? 'transparent' : '#6c757d',
              backgroundImage: user.avatar ? `url(${user.avatar})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!user.avatar && (user.firstName?.charAt(0) || 'U')}
          </div>
          <div>
            <div className="fw-semibold">{user.firstName} {user.lastName}</div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      render: (value, user, index) => (
        <span className="text-muted">{user.email}</span>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (value, user, index) => (
        <span className="fw-semibold">{user.role}</span>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value, user, index) => (
        <span className="text-muted">{user.phone || 'N/A'}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, user, index) => (
        <span 
          className={`fw-semibold ${
            user.isActive ? 'text-success' : 'text-secondary'
          }`}
        >
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value, user, index) => new Date(user.createdAt).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, user, index) => (
        <div className="d-flex gap-2">
          <Button
            variant="info"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleViewUser(user)
            }}
            title="View User"
          >
            <FontAwesomeIcon icon={faInfo} />
          </Button>
          <Button
            variant="warning"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleOpenEditModal(user)
            }}
            title="Edit User"
          >
            <FontAwesomeIcon icon={faPencil} />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteUser(user)
            }}
            title="Delete User"
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      )
    }
  ]

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          {/* Users Table Card */}
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center w-100">
                <Card.Title className="mb-0">Users</Card.Title>
                <Button
                  variant="primary"
                  onClick={handleCreateUser}
                >
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Add User
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {/* Filters */}
              <div className="d-flex gap-2 align-items-center mb-3">
                <FormControl
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ width: '200px' }}
                />
                <FormSelect
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  style={{ width: '120px' }}
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="user">User</option>
                </FormSelect>
                <FormSelect
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ width: '120px' }}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </FormSelect>
                {selectedUsers.length > 0 && (
                  <Button
                    variant="danger"
                    onClick={handleBulkDelete}
                  >
                    Delete ({selectedUsers.length})
                  </Button>
                )}
              </div>
              <Table
                data={filteredUsers}
                columns={columns}
                loading={loading}
                hover
                pagination={true}
                sortable={true}
                sortableColumns={['name', 'email', 'phone']}
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={filteredUsers.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User"
        onConfirm={confirmDeleteUser}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      >
        <p>Are you sure you want to delete user <strong>{userToDelete?.firstName} {userToDelete?.lastName}</strong>?</p>
        <p className="text-muted">This action cannot be undone.</p>
      </Modal>

      {/* Add User Modal */}
      <FormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New User"
        onSubmit={handleAddUser}
        submitText="Create User"
        submitIcon={faPlus}
        loading={addUserLoading}
        loadingText="Creating..."
      >
        <UserForm ref={addUserFormRef} mode="create" onSubmit={handleAddUserSubmit} />
      </FormModal>

      {/* Edit User Modal */}
      <FormModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setUserToEdit(null)
        }}
        title="Edit User"
        onSubmit={handleEditUser}
        submitText="Update User"
        submitIcon={faPencil}
        loading={editUserLoading}
        loadingText="Updating..."
      >
        <UserForm 
          ref={editUserFormRef}
          mode="edit" 
          userData={userToEdit} 
          onSubmit={handleEditUserSubmit} 
        />
      </FormModal>

      {/* View User Modal */}
      <Modal
        visible={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setUserToView(null)
        }}
        title="User Details"
        size="lg"
        showFooter={false}
        type="info"
      >
        {userToView && (
          <div className="row">
            <div className="col-md-4 text-center mb-3">
              <div 
                className="rounded-circle mx-auto d-flex align-items-center justify-content-center text-white fw-bold"
                style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: userToView.avatar ? 'transparent' : '#6c757d',
                  backgroundImage: userToView.avatar ? `url(${userToView.avatar})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!userToView.avatar && (userToView.firstName?.charAt(0) || 'U')}
              </div>
              <h5 className="mt-2 mb-0">{userToView.firstName} {userToView.lastName}</h5>
              <p className="text-muted mb-0">{userToView.email}</p>
            </div>
            <div className="col-md-8">
              <div className="row mb-3">
                <div className="col-sm-4"><strong>First Name:</strong></div>
                <div className="col-sm-8">{userToView.firstName}</div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4"><strong>Last Name:</strong></div>
                <div className="col-sm-8">{userToView.lastName}</div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4"><strong>Email:</strong></div>
                <div className="col-sm-8">{userToView.email}</div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4"><strong>Phone:</strong></div>
                <div className="col-sm-8">{userToView.phone || 'N/A'}</div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4"><strong>Role:</strong></div>
                <div className="col-sm-8">
                  <span className="fw-semibold">{userToView.role}</span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4"><strong>Status:</strong></div>
                <div className="col-sm-8">
                  <span 
                    className={`fw-semibold ${
                      userToView.isActive ? 'text-success' : 'text-secondary'
                    }`}
                  >
                    {userToView.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4"><strong>Created:</strong></div>
                <div className="col-sm-8">{new Date(userToView.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4"><strong>Last Updated:</strong></div>
                <div className="col-sm-8">{new Date(userToView.updatedAt || userToView.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Container>
  )
}

export default UsersList
