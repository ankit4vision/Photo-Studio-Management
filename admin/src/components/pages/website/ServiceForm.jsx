import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { FormRow, TextField } from '../../common/FormFields'
import { FormLabel, FormControl, FormText, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'

const ServiceForm = forwardRef(({ 
  mode = 'create', 
  serviceData = null, 
  onSubmit, 
  onCancel,
  loading = false 
}, ref) => {
  const [formData, setFormData] = useState({
    icon_class: '',
    title: '',
    description: '',
    service_number: '',
    order: 0,
    link_url: '',
    is_active: true
  })
  const [errors, setErrors] = useState({})

  // Load service data for edit mode
  useEffect(() => {
    if (mode === 'edit' && serviceData) {
      setFormData({
        icon_class: serviceData.icon_class || '',
        title: serviceData.title || '',
        description: serviceData.description || '',
        service_number: serviceData.service_number || '',
        order: serviceData.order || 0,
        link_url: serviceData.link_url || '',
        is_active: serviceData.is_active !== undefined ? serviceData.is_active : true
      })
    }
  }, [mode, serviceData])

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

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (formData.order < 0) {
      newErrors.order = 'Order must be 0 or greater'
    }

    if (formData.link_url && !/^https?:\/\/.+/.test(formData.link_url.trim())) {
      newErrors.link_url = 'Please enter a valid URL (starting with http:// or https://)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    const submitData = {
      icon_class: formData.icon_class.trim() || null,
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      service_number: formData.service_number.trim() || null,
      order: parseInt(formData.order) || 0,
      link_url: formData.link_url.trim() || null,
      is_active: formData.is_active
    }

    onSubmit(submitData)
  }

  // Expose submit method to parent via ref
  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
    validate: validateForm
  }))

  return (
    <div>
      <FormRow>
        <TextField
          label="Title"
          name="title"
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Service Title"
          required
          invalid={!!errors.title}
          feedback={errors.title}
          helpText="Enter the service title (e.g., Wedding Photography)"
        />
      </FormRow>

      <FormRow>
        <Col md={12}>
          <FormLabel htmlFor="description">
            Description
          </FormLabel>
          <FormControl
            as="textarea"
            rows={3}
            id="description"
            name="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Service description"
            isInvalid={!!errors.description}
          />
          {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
          <FormText>Enter a brief description of the service</FormText>
        </Col>
      </FormRow>

      <FormRow>
        <TextField
          label="Icon Class"
          name="icon_class"
          id="icon_class"
          value={formData.icon_class}
          onChange={(e) => handleChange('icon_class', e.target.value)}
          placeholder="bi-camera"
          invalid={!!errors.icon_class}
          feedback={errors.icon_class}
          helpText="Bootstrap icon class (e.g., bi-camera, bi-camera-video, bi-heart)"
        />
      </FormRow>

      <FormRow>
        <TextField
          label="Service Number"
          name="service_number"
          id="service_number"
          value={formData.service_number}
          onChange={(e) => handleChange('service_number', e.target.value)}
          placeholder="01"
          invalid={!!errors.service_number}
          feedback={errors.service_number}
          helpText="Service number to display (e.g., 01, 02, 03)"
        />
      </FormRow>

      <FormRow>
        <TextField
          label="Order"
          name="order"
          id="order"
          type="number"
          value={formData.order.toString()}
          onChange={(e) => handleChange('order', parseInt(e.target.value) || 0)}
          placeholder="0"
          invalid={!!errors.order}
          feedback={errors.order}
          helpText="Display order (lower numbers appear first)"
        />
      </FormRow>

      <FormRow>
        <TextField
          label="Link URL"
          name="link_url"
          id="link_url"
          value={formData.link_url}
          onChange={(e) => handleChange('link_url', e.target.value)}
          placeholder="https://example.com"
          invalid={!!errors.link_url}
          feedback={errors.link_url}
          helpText="Optional URL to link when service is clicked"
        />
      </FormRow>

      <FormRow>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => handleChange('is_active', e.target.checked)}
          />
          <label className="form-check-label" htmlFor="is_active">
            Active
          </label>
          <small className="form-text text-muted d-block">
            Enable or disable this service
          </small>
        </div>
      </FormRow>
    </div>
  )
})

ServiceForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  serviceData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool
}

ServiceForm.displayName = 'ServiceForm'

export default ServiceForm

