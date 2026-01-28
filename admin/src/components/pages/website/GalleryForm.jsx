import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { FormRow, TextField } from '../../common/FormFields'
import { FormLabel, FormControl, FormText, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'

const GalleryForm = forwardRef(({ 
  mode = 'create', 
  galleryData = null, 
  onSubmit, 
  onCancel,
  loading = false 
}, ref) => {
  const [formData, setFormData] = useState({
    image_path: '',
    title: '',
    description: '',
    alt_text: '',
    category: '',
    tags: [],
    order: 0,
    is_active: true
  })
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (mode === 'edit' && galleryData) {
      setFormData({
        image_path: galleryData.image_path || '',
        title: galleryData.title || '',
        description: galleryData.description || '',
        alt_text: galleryData.alt_text || '',
        category: galleryData.category || '',
        tags: galleryData.tags || [],
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

  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
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
      description: formData.description.trim() || null,
      alt_text: formData.alt_text.trim() || null,
      category: formData.category.trim() || null,
      tags: formData.tags.length > 0 ? formData.tags : null,
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
        <Col md={12}>
          <FormLabel htmlFor="description">Description</FormLabel>
          <FormControl
            as="textarea"
            rows={3}
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Image description..."
          />
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
        />
      </FormRow>

      <FormRow>
        <TextField
          label="Category"
          name="category"
          id="category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          placeholder="Wedding, Portrait, etc."
          invalid={!!errors.category}
          feedback={errors.category}
        />
      </FormRow>

      <FormRow>
        <Col md={12}>
          <FormLabel htmlFor="tags">Tags</FormLabel>
          <div className="d-flex gap-2 mb-2">
            <FormControl
              type="text"
              id="tagInput"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
              placeholder="Add tag and press Enter"
            />
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleAddTag}
            >
              Add
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span key={index} className="badge bg-primary d-flex align-items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    style={{ fontSize: '10px' }}
                    onClick={() => handleRemoveTag(tag)}
                    aria-label="Remove"
                  />
                </span>
              ))}
            </div>
          )}
          <FormText>Add tags to categorize this image</FormText>
        </Col>
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

GalleryForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  galleryData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool
}

GalleryForm.displayName = 'GalleryForm'

export default GalleryForm

