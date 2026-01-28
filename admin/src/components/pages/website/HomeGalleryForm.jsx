import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { FormRow, TextField } from '../../common/FormFields'
import PropTypes from 'prop-types'

const HomeGalleryForm = forwardRef(({ 
  mode = 'create', 
  galleryData = null, 
  onSubmit, 
  onCancel,
  loading = false 
}, ref) => {
  const [formData, setFormData] = useState({
    image_path: '',
    title: '',
    alt_text: '',
    order: 0,
    is_active: true
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (mode === 'edit' && galleryData) {
      setFormData({
        image_path: galleryData.image_path || '',
        title: galleryData.title || '',
        alt_text: galleryData.alt_text || '',
        order: galleryData.order || 0,
        is_active: galleryData.is_active !== undefined ? galleryData.is_active : true
      })
    }
  }, [mode, galleryData])

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    const submitData = {
      image_path: formData.image_path.trim(),
      title: formData.title.trim() || null,
      alt_text: formData.alt_text.trim() || null,
      order: parseInt(formData.order) || 0,
      is_active: formData.is_active
    }

    onSubmit(submitData)
  }

  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
    validate: validateForm
  }))

  return (
    <div>
      <FormRow>
        <TextField
          label="Image Path"
          name="image_path"
          id="image_path"
          value={formData.image_path}
          onChange={(e) => handleChange('image_path', e.target.value)}
          placeholder="/assets/img/gallery/1.jpg"
          required
          invalid={!!errors.image_path}
          feedback={errors.image_path}
          helpText="Enter the path to the gallery image"
        />
      </FormRow>

      <FormRow>
        <TextField
          label="Title"
          name="title"
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Gallery Image Title"
          invalid={!!errors.title}
          feedback={errors.title}
        />
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
            Enable or disable this gallery image
          </small>
        </div>
      </FormRow>
    </div>
  )
})

HomeGalleryForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  galleryData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool
}

HomeGalleryForm.displayName = 'HomeGalleryForm'

export default HomeGalleryForm

