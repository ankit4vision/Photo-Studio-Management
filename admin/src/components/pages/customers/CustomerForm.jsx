import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { FormRow, TextField, SelectField } from '../../common/FormFields'
import { Col } from 'react-bootstrap'
import PropTypes from 'prop-types'

const CustomerForm = forwardRef(({ 
  mode = 'create', 
  customerData = null, 
  branches = [],
  onSubmit, 
  onCancel,
  loading = false 
}, ref) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    dob: '',
    anniversary_date: '',
    branch_id: '',
    status: 'active'
  })
  const [errors, setErrors] = useState({})

  // Load customer data for edit mode
  useEffect(() => {
    if (mode === 'edit' && customerData) {
      setFormData({
        name: customerData.name || '',
        mobile: customerData.mobile || '',
        email: customerData.email || '',
        address: customerData.address || '',
        dob: customerData.dob ? customerData.dob.split('T')[0] : '',
        anniversary_date: customerData.anniversary_date ? customerData.anniversary_date.split('T')[0] : '',
        branch_id: customerData.branch_id || '',
        status: customerData.status || 'active'
      })
    }
  }, [mode, customerData])

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

    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Customer name must be at least 2 characters'
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required'
    } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Please enter a valid mobile number'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.branch_id) {
      newErrors.branch_id = 'Branch selection is required'
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
      mobile: formData.mobile.trim(),
      email: formData.email.trim() || null,
      address: formData.address.trim() || null,
      dob: formData.dob || null,
      anniversary_date: formData.anniversary_date || null,
      branch_id: parseInt(formData.branch_id),
      status: formData.status
    }

    onSubmit(submitData)
  }

  // Expose handleSubmit to parent component via ref
  useImperativeHandle(ref, () => ({
    handleSubmit: handleSubmit
  }), [formData])

  const branchOptions = [
    { value: '', label: 'Select Branch' },
    ...branches.map(branch => ({
      value: branch.id.toString(),
      label: `${branch.branch_name} (${branch.branch_code})`
    }))
  ]

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]

  return (
    <div>
      <FormRow>
        <TextField
          id="name"
          label="Customer Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter customer name"
          required
          col={6}
          invalid={!!errors.name}
          feedback={errors.name}
        />
        <TextField
          id="mobile"
          label="Mobile Number"
          value={formData.mobile}
          onChange={(e) => handleChange('mobile', e.target.value)}
          placeholder="Enter mobile number"
          required
          col={6}
          invalid={!!errors.mobile}
          feedback={errors.mobile}
        />
      </FormRow>

      <FormRow>
        <TextField
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="Enter email (optional)"
          col={6}
          invalid={!!errors.email}
          feedback={errors.email}
        />
        <SelectField
          id="branch_id"
          label="Branch"
          value={formData.branch_id}
          onChange={(e) => handleChange('branch_id', e.target.value)}
          options={branchOptions}
          required
          col={6}
          invalid={!!errors.branch_id}
          feedback={errors.branch_id}
        />
      </FormRow>

      <FormRow>
        <Col md={12}>
          <TextField
            id="address"
            label="Address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Enter address (optional)"
            col={12}
          />
        </Col>
      </FormRow>

      <FormRow>
        <TextField
          id="dob"
          label="Date of Birth"
          type="date"
          value={formData.dob}
          onChange={(e) => handleChange('dob', e.target.value)}
          col={6}
        />
        <TextField
          id="anniversary_date"
          label="Anniversary Date"
          type="date"
          value={formData.anniversary_date}
          onChange={(e) => handleChange('anniversary_date', e.target.value)}
          col={6}
        />
      </FormRow>

      <FormRow>
        <SelectField
          id="status"
          label="Status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          options={statusOptions}
          col={6}
          invalid={!!errors.status}
          feedback={errors.status}
        />
      </FormRow>
    </div>
  )
})

CustomerForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  customerData: PropTypes.object,
  branches: PropTypes.array,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool
}

export default CustomerForm

