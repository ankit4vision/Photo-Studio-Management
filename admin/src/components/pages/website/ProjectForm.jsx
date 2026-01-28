import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { FormRow, TextField } from '../../common/FormFields'
import { FormLabel, FormControl, FormText, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'

const ProjectForm = forwardRef(({ 
  mode = 'create', 
  projectData = null, 
  onSubmit, 
  onCancel,
  loading = false 
}, ref) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    thumbnail_image: '',
    album_id: '',
    category: '',
    tags: [],
    is_featured: false,
    is_active: true,
    order: 0
  })
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState({})

  // Load project data for edit mode
  useEffect(() => {
    if (mode === 'edit' && projectData) {
      setFormData({
        title: projectData.title || '',
        author: projectData.author || '',
        thumbnail_image: projectData.thumbnail_image || '',
        album_id: projectData.album_id || '',
        category: projectData.category || '',
        tags: projectData.tags || [],
        is_featured: projectData.is_featured || false,
        is_active: projectData.is_active !== undefined ? projectData.is_active : true,
        order: projectData.order || 0
      })
    }
  }, [mode, projectData])

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

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.thumbnail_image.trim()) {
      newErrors.thumbnail_image = 'Thumbnail image is required'
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
      author: formData.author.trim() || null,
      thumbnail_image: formData.thumbnail_image.trim(),
      album_id: formData.album_id ? parseInt(formData.album_id) : null,
      category: formData.category.trim() || null,
      tags: formData.tags.length > 0 ? formData.tags : null,
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
          placeholder="Project Title"
          required
          invalid={!!errors.title}
          feedback={errors.title}
        />
      </FormRow>

      <FormRow>
        <TextField
          label="Author/Photographer"
          name="author"
          id="author"
          value={formData.author}
          onChange={(e) => handleChange('author', e.target.value)}
          placeholder="Jonathon Willson"
          invalid={!!errors.author}
          feedback={errors.author}
        />
      </FormRow>

      <FormRow>
        <TextField
          label="Thumbnail Image Path"
          name="thumbnail_image"
          id="thumbnail_image"
          value={formData.thumbnail_image}
          onChange={(e) => handleChange('thumbnail_image', e.target.value)}
          placeholder="/assets/img/project/1.jpg"
          required
          invalid={!!errors.thumbnail_image}
          feedback={errors.thumbnail_image}
          helpText="Enter the path to the project thumbnail image"
        />
      </FormRow>

      <FormRow>
        <TextField
          label="Category"
          name="category"
          id="category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          placeholder="Wedding, Fashion, Portrait, etc."
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
          <FormText>Add tags to categorize this project</FormText>
        </Col>
      </FormRow>

      <FormRow>
        <TextField
          label="Album ID"
          name="album_id"
          id="album_id"
          type="number"
          value={formData.album_id}
          onChange={(e) => handleChange('album_id', e.target.value)}
          placeholder="Optional: Link to album"
          invalid={!!errors.album_id}
          feedback={errors.album_id}
          helpText="Optional: Link this project to an album"
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
            Show this project on homepage
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
            Enable or disable this project
          </small>
        </div>
      </FormRow>
    </div>
  )
})

ProjectForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  projectData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool
}

ProjectForm.displayName = 'ProjectForm'

export default ProjectForm

