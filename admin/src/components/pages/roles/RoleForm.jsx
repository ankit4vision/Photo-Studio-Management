import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { FormRow, TextField, SelectField } from '../../common/FormFields'
import PropTypes from 'prop-types'
import { FormCheck, Col } from 'react-bootstrap'

const RoleForm = forwardRef(({ 
  mode = 'create', 
  roleData = null, 
  onSubmit, 
  onCancel,
  loading = false 
}, ref) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [],
    isActive: true
  })
  const [errors, setErrors] = useState({})

  // Available permissions
  const availablePermissions = [
    { id: 'user:read', label: 'Read Users', category: 'User Management' },
    { id: 'user:write', label: 'Create/Edit Users', category: 'User Management' },
    { id: 'user:delete', label: 'Delete Users', category: 'User Management' },
    { id: 'user:export', label: 'Export Users', category: 'User Management' },
    { id: 'user:import', label: 'Import Users', category: 'User Management' },
    { id: 'role:read', label: 'Read Roles', category: 'Role Management' },
    { id: 'role:write', label: 'Create/Edit Roles', category: 'Role Management' },
    { id: 'role:delete', label: 'Delete Roles', category: 'Role Management' },
    { id: 'role:assign', label: 'Assign Roles', category: 'Role Management' },
    { id: 'dashboard:read', label: 'View Dashboard', category: 'System Access' },
    { id: 'dashboard:write', label: 'Edit Dashboard', category: 'System Access' },
    { id: 'dashboard:customize', label: 'Customize Dashboard', category: 'System Access' },
    { id: 'settings:access', label: 'System Settings', category: 'System Access' },
    { id: 'settings:backup', label: 'Backup & Restore', category: 'System Access' },
    { id: 'settings:logs', label: 'View System Logs', category: 'System Access' },
    { id: 'reports:read', label: 'View Reports', category: 'Reports' },
    { id: 'reports:write', label: 'Create Reports', category: 'Reports' },
    { id: 'reports:export', label: 'Export Reports', category: 'Reports' },
    { id: 'reports:schedule', label: 'Schedule Reports', category: 'Reports' },
    { id: 'branch:read', label: 'View Branches', category: 'Branch Management' },
    { id: 'branch:write', label: 'Create/Edit Branches', category: 'Branch Management' },
    { id: 'branch:delete', label: 'Delete Branches', category: 'Branch Management' },
    { id: 'package:read', label: 'View Packages', category: 'Package Management' },
    { id: 'package:write', label: 'Create/Edit Packages', category: 'Package Management' },
    { id: 'package:delete', label: 'Delete Packages', category: 'Package Management' },
    { id: 'customer:read', label: 'View Customers', category: 'Customer Management' },
    { id: 'customer:write', label: 'Create/Edit Customers', category: 'Customer Management' },
    { id: 'customer:delete', label: 'Delete Customers', category: 'Customer Management' },
    { id: 'customer:wallet', label: 'Manage Customer Wallet', category: 'Customer Management' },
    { id: 'order:read', label: 'View Orders', category: 'Order Management' },
    { id: 'order:write', label: 'Create/Edit Orders', category: 'Order Management' },
    { id: 'order:delete', label: 'Delete Orders', category: 'Order Management' },
    { id: 'transaction:read', label: 'View Transactions', category: 'Transaction Management' },
    { id: 'transaction:write', label: 'Create/Edit Transactions', category: 'Transaction Management' },
    { id: 'payment:read', label: 'View Payments', category: 'Payment Management' },
    { id: 'payment:write', label: 'Create Payments', category: 'Payment Management' },
    { id: 'analytics:read', label: 'View Analytics', category: 'Analytics' },
    { id: 'analytics:export', label: 'Export Analytics', category: 'Analytics' },
    { id: 'notifications:read', label: 'View Notifications', category: 'Notifications' },
    { id: 'notifications:write', label: 'Send Notifications', category: 'Notifications' },
    { id: 'api:read', label: 'API Read Access', category: 'API Management' },
    { id: 'api:write', label: 'API Write Access', category: 'API Management' },
    { id: 'security:audit', label: 'Security Audit', category: 'Security' },
    { id: 'security:monitor', label: 'Security Monitoring', category: 'Security' }
  ]

  // Load role data for edit mode
  useEffect(() => {
    if (mode === 'edit' && roleData) {
      setFormData({
        name: roleData.name || '',
        description: roleData.description || '',
        permissions: roleData.permissions || [],
        isActive: roleData.isActive !== undefined ? roleData.isActive : true
      })
    }
  }, [mode, roleData])

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handlePermissionChange = (permissionId, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId)
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Role name must be at least 2 characters'
    }

    if (!formData.description.trim()) {
      // Description is optional, so no error for empty description
    } else if (formData.description.trim().length < 5) {
      newErrors.description = 'Description must be at least 5 characters if provided'
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = 'Please select at least one permission'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      permissions: formData.permissions,
      isActive: formData.isActive
    }

    onSubmit(submitData)
  }

  // Expose handleSubmit to parent component via ref
  useImperativeHandle(ref, () => ({
    handleSubmit: handleSubmit
  }), [formData])

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]

  // Group permissions by category
  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {})

  return (
    <div>
      <FormRow>
        <TextField
          id="name"
          label="Role Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter role name"
          required
          col={6}
          invalid={!!errors.name}
          feedback={errors.name}
        />
        <SelectField
          id="status"
          label="Status"
          value={formData.isActive ? 'active' : 'inactive'}
          onChange={(e) => handleChange('isActive', e.target.value === 'active')}
          options={statusOptions}
          col={6}
          invalid={!!errors.status}
          feedback={errors.status}
        />
      </FormRow>

      <FormRow>
        <TextField
          id="description"
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter role description (optional)"
          helpText="Brief description of what this role can do. (Optional)"
          col={12}
          invalid={!!errors.description}
          feedback={errors.description}
        />
      </FormRow>

      <FormRow>
        <Col md={12}>
          <label className="form-label">
            Permissions <span className="text-danger">*</span>
          </label>
          <div className="border rounded p-3">
            <div className="row">
              {Object.entries(groupedPermissions).map(([category, permissions]) => (
                <div key={category} className="col-md-6 mb-3">
                  <h6 className="text-primary">{category}</h6>
                  {permissions.map((permission) => (
                    <div key={permission.id} className="form-check">
                      <FormCheck
                        id={permission.id}
                        label={permission.label}
                        checked={formData.permissions.includes(permission.id)}
                        onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {errors.permissions && (
              <div className="invalid-feedback d-block text-danger mt-2">
                {errors.permissions}
              </div>
            )}
          </div>
        </Col>
      </FormRow>
    </div>
  )
})

RoleForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  roleData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool
}

export default RoleForm
