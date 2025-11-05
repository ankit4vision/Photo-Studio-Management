import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { FormRow, TextField, SelectField } from '../../common/FormFields'
import PropTypes from 'prop-types'

const UserForm = forwardRef(({ 
  mode = 'create', 
  userData = null, 
  onSubmit, 
  onCancel,
  loading = false 
}, ref) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
    isActive: true
  })
  const [errors, setErrors] = useState({})

  // Load user data for edit mode
  useEffect(() => {
    if (mode === 'edit' && userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        password: '',
        confirmPassword: '',
        role: userData.role || '',
        isActive: userData.isActive !== undefined ? userData.isActive : true
      })
    }
  }, [mode, userData])

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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role'
    }

    if (mode === 'create') {
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    const submitData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      role: formData.role,
      phone: formData.phone.trim(),
      isActive: formData.isActive
    }

    if (mode === 'create') {
      submitData.password = formData.password
    }

    onSubmit(submitData)
  }

  // Expose handleSubmit to parent component via ref
  useImperativeHandle(ref, () => ({
    handleSubmit: handleSubmit
  }), [formData])

  const roleOptions = [
    { value: '', label: 'Select Role' },
    { value: 'user', label: 'User' },
    { value: 'manager', label: 'Manager' },
    { value: 'admin', label: 'Admin' }
  ]

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]

  return (
    <div>
      <FormRow>
        <TextField
          id="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          placeholder="Enter first name"
          required
          col={6}
          invalid={!!errors.firstName}
          feedback={errors.firstName}
        />
        <TextField
          id="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          placeholder="Enter last name"
          required
          col={6}
          invalid={!!errors.lastName}
          feedback={errors.lastName}
        />
      </FormRow>
      
      <FormRow>
        <TextField
          id="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="Enter email address"
          required
          helpText="We'll never share your email with anyone else."
          col={6}
          invalid={!!errors.email}
          feedback={errors.email}
        />
        <TextField
          id="phone"
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="Enter phone number"
          col={6}
          invalid={!!errors.phone}
          feedback={errors.phone}
        />
      </FormRow>

      {mode === 'create' && (
        <FormRow>
          <TextField
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="Enter password"
            required
            col={6}
            invalid={!!errors.password}
            feedback={errors.password}
          />
          <TextField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            placeholder="Confirm password"
            required
            col={6}
            invalid={!!errors.confirmPassword}
            feedback={errors.confirmPassword}
          />
        </FormRow>
      )}

      <FormRow>
        <SelectField
          id="role"
          label="Role"
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          options={roleOptions}
          required
          col={6}
          invalid={!!errors.role}
          feedback={errors.role}
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
    </div>
  )
})

UserForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  userData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool
}

export default UserForm