import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { FormRow, TextField } from '../../common/FormFields'
import { FormLabel, FormControl, FormText, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import ImagePathSelector from '../../common/ImagePathSelector'

const SliderForm = forwardRef(({ 
  mode = 'create', 
  sliderData = null, 
  onSubmit, 
  onCancel,
  loading = false 
}, ref) => {
  const [formData, setFormData] = useState({
    image_path: '',
    title: '',
    description: '',
    alt_text: '',
    order: 0,
    link_url: '',
    is_active: true
  })
  const [errors, setErrors] = useState({})

  // Load slider data for edit mode
  useEffect(() => {
    if (mode === 'edit' && sliderData) {
      setFormData({
        image_path: sliderData.image_path || '',
        title: sliderData.title || '',
        description: sliderData.description || '',
        alt_text: sliderData.alt_text || '',
        order: sliderData.order || 0,
        link_url: sliderData.link_url || '',
        is_active: sliderData.is_active !== undefined ? sliderData.is_active : true
      })
    } else if (mode === 'create') {
      // Reset form for create mode
      setFormData({
        image_path: '',
        title: '',
        description: '',
        alt_text: '',
        order: 0,
        link_url: '',
        is_active: true
      })
    }
  }, [mode, sliderData])

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

    if (!formData.image_path.trim()) {
      newErrors.image_path = 'Image path is required'
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
      image_path: formData.image_path.trim() || null,
      title: formData.title.trim() || null,
      description: formData.description.trim() || null,
      alt_text: formData.alt_text.trim() || null,
      order: parseInt(formData.order) || 0,
      link_url: formData.link_url.trim() || null,
      is_active: formData.is_active
    }
    
    // For update mode, only include fields that have values (to avoid overwriting with null)
    if (mode === 'edit') {
      // Remove null/empty values except for is_active and order
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === null || submitData[key] === '') {
          if (key !== 'is_active' && key !== 'order') {
            delete submitData[key]
          }
        }
      })
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
      <ImagePathSelector
        label="Slider Image"
        name="image_path"
        id="image_path"
        value={formData.image_path}
        onChange={(path) => handleChange('image_path', path)}
        uploadFolder="slider"
        required
        invalid={!!errors.image_path}
        feedback={errors.image_path}
        helpText="Upload a slider image (JPEG, PNG, WebP)."
      />

      <FormRow>
        <TextField
          label="Title"
          name="title"
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Slider Title"
          invalid={!!errors.title}
          feedback={errors.title}
          helpText="Optional title for the slider"
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
            placeholder="Slider description"
            isInvalid={!!errors.description}
          />
          {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
          <FormText>Optional description for the slider</FormText>
        </Col>
      </FormRow>

      <FormRow>
        <TextField
          label="Alt Text"
          name="alt_text"
          id="alt_text"
          value={formData.alt_text}
          onChange={(e) => handleChange('alt_text', e.target.value)}
          placeholder="Image alt text for SEO"
          invalid={!!errors.alt_text}
          feedback={errors.alt_text}
          helpText="Alt text for the image (important for SEO and accessibility)"
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
          helpText="Optional URL to link when slider is clicked"
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
            Enable or disable this slider
          </small>
        </div>
      </FormRow>
    </div>
  )
})

SliderForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  sliderData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool
}

SliderForm.displayName = 'SliderForm'

export default SliderForm

