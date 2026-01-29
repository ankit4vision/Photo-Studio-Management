import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { FormRow, TextField } from '../../common/FormFields'
import { FormLabel, FormControl, FormText, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import ImagePathSelector from '../../common/ImagePathSelector'

const AlbumForm = forwardRef(({ 
  mode = 'create', 
  albumData = null, 
  onSubmit, 
  onCancel,
  loading = false 
}, ref) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cover_image: '',
    slug: '',
    category: '',
    tags: [],
    event_date: '',
    is_featured: false,
    is_active: true,
    order: 0
  })
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (mode === 'edit' && albumData) {
      setFormData({
        title: albumData.title || '',
        description: albumData.description || '',
        cover_image: albumData.cover_image || '',
        slug: albumData.slug || '',
        category: albumData.category || '',
        tags: albumData.tags || [],
        event_date: albumData.event_date || '',
        is_featured: albumData.is_featured || false,
        is_active: albumData.is_active !== undefined ? albumData.is_active : true,
        order: albumData.order || 0
      })
    }
  }, [mode, albumData])

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

    // Auto-generate slug from title
    if (field === 'title' && mode === 'create') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
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

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
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
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      cover_image: formData.cover_image.trim() || null,
      slug: formData.slug.trim() || null,
      category: formData.category.trim() || null,
      tags: formData.tags.length > 0 ? formData.tags : null,
      event_date: formData.event_date || null,
      is_featured: formData.is_featured,
      is_active: formData.is_active,
      order: parseInt(formData.order) || 0
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
          label="Title"
          name="title"
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Album Title"
          required
          invalid={!!errors.title}
          feedback={errors.title}
        />
      </FormRow>

      <FormRow>
        <TextField
          label="Slug"
          name="slug"
          id="slug"
          value={formData.slug}
          onChange={(e) => handleChange('slug', e.target.value)}
          placeholder="album-title"
          invalid={!!errors.slug}
          feedback={errors.slug}
          helpText="URL-friendly identifier (auto-generated from title)"
        />
      </FormRow>

      <FormRow>
        <Col md={12}>
          <FormLabel htmlFor="description">Description</FormLabel>
          <FormControl
            as="textarea"
            rows={4}
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Album description..."
          />
        </Col>
      </FormRow>

      <ImagePathSelector
        label="Cover Image"
        name="cover_image"
        id="cover_image"
        value={formData.cover_image}
        onChange={(path) => handleChange('cover_image', path)}
        uploadFolder="albums"
        invalid={!!errors.cover_image}
        feedback={errors.cover_image}
        helpText="Upload a cover image for this album (JPEG, PNG, WebP)."
      />

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
          <FormText>Add tags to categorize this album</FormText>
        </Col>
      </FormRow>

      <FormRow>
        <TextField
          label="Event Date"
          name="event_date"
          id="event_date"
          type="date"
          value={formData.event_date}
          onChange={(e) => handleChange('event_date', e.target.value)}
          invalid={!!errors.event_date}
          feedback={errors.event_date}
          helpText="Optional: Date of the event/photoshoot"
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
            id="is_featured"
            checked={formData.is_featured}
            onChange={(e) => handleChange('is_featured', e.target.checked)}
          />
          <label className="form-check-label" htmlFor="is_featured">
            Featured
          </label>
          <small className="form-text text-muted d-block">
            Show this album prominently
          </small>
        </div>
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
            Enable or disable this album
          </small>
        </div>
      </FormRow>
    </div>
  )
})

AlbumForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  albumData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool
}

AlbumForm.displayName = 'AlbumForm'

export default AlbumForm

