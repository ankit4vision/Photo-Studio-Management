import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { FormRow, TextField } from '../../common/FormFields'
import { FormLabel, FormControl, FormText, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import ImagePathSelector from '../../common/ImagePathSelector'

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
    hero_image: '',
    description: '',
    event_date: '',
    location: '',
    photographer: '',
    album_id: '',
    category: '',
    tags: [],
    photos: [], // Array of { image_path, order }
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
        hero_image: projectData.hero_image || '',
        description: projectData.description || '',
        event_date: projectData.event_date || '',
        location: projectData.location || '',
        photographer: projectData.photographer || '',
        album_id: projectData.album_id || '',
        category: projectData.category || '',
        tags: projectData.tags || [],
        photos: (Array.isArray(projectData.photos) && projectData.photos.length > 0) 
          ? projectData.photos.map((photo, index) => ({
              id: photo.id,
              image_path: photo.image_path || '',
              order: photo.order !== undefined ? photo.order : index
            }))
          : [],
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

  const handleAddPhoto = (imagePath) => {
    if (formData.photos.length >= 12) {
      setErrors(prev => ({ ...prev, photos: 'Maximum 12 photos allowed' }))
      return
    }
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, { image_path: imagePath, order: prev.photos.length }]
    }))
    if (errors.photos) {
      setErrors(prev => ({ ...prev, photos: '' }))
    }
  }

  const handleRemovePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index).map((photo, i) => ({ ...photo, order: i }))
    }))
  }

  const handleReorderPhoto = (index, direction) => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === formData.photos.length - 1)) {
      return
    }
    const newPhotos = [...formData.photos]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[newPhotos[index], newPhotos[newIndex]] = [newPhotos[newIndex], newPhotos[index]]
    setFormData(prev => ({
      ...prev,
      photos: newPhotos.map((photo, i) => ({ ...photo, order: i }))
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
      hero_image: formData.hero_image.trim() || null,
      description: formData.description.trim() || null,
      event_date: formData.event_date || null,
      location: formData.location.trim() || null,
      photographer: formData.photographer.trim() || null,
      album_id: formData.album_id ? parseInt(formData.album_id) : null,
      category: formData.category.trim() || null,
      tags: formData.tags.length > 0 ? formData.tags : null,
      photos: formData.photos.map((photo, index) => ({
        id: photo.id,
        image_path: photo.image_path,
        order: photo.order !== undefined ? photo.order : index
      })),
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

      <ImagePathSelector
        label="Thumbnail Image (for Our Works page)"
        name="thumbnail_image"
        id="thumbnail_image"
        value={formData.thumbnail_image}
        onChange={(path) => handleChange('thumbnail_image', path)}
        uploadFolder="projects"
        required
        invalid={!!errors.thumbnail_image}
        feedback={errors.thumbnail_image}
        helpText="Upload a project thumbnail image (JPEG, PNG, WebP). This will be used in Our Works page."
      />

      <ImagePathSelector
        label="Hero Image (for detail page)"
        name="hero_image"
        id="hero_image"
        value={formData.hero_image}
        onChange={(path) => handleChange('hero_image', path)}
        uploadFolder="projects"
        invalid={!!errors.hero_image}
        feedback={errors.hero_image}
        helpText="Upload hero image for detail page. If not provided, thumbnail image will be used."
      />

      <FormRow>
        <Col md={12}>
          <FormLabel htmlFor="description">
            Description <span className="text-danger">*</span>
          </FormLabel>
          <FormControl
            as="textarea"
            rows={6}
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter project description (rich text editor can be added later)"
            isInvalid={!!errors.description}
          />
          {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
          <FormText>Project/Album description. Rich text editor can be integrated later.</FormText>
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
        />
        <TextField
          label="Location"
          name="location"
          id="location"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="New York, USA"
          invalid={!!errors.location}
          feedback={errors.location}
        />
      </FormRow>

      <FormRow>
        <TextField
          label="Photographer"
          name="photographer"
          id="photographer"
          value={formData.photographer}
          onChange={(e) => handleChange('photographer', e.target.value)}
          placeholder="Photographer name (overrides author if provided)"
          invalid={!!errors.photographer}
          feedback={errors.photographer}
          helpText="If provided, this will override the Author field in detail page"
        />
      </FormRow>

      <FormRow>
        <Col md={12}>
          <FormLabel htmlFor="photos">
            Gallery Photos (Max 12) {formData.photos.length > 0 && <span className="text-muted">({formData.photos.length}/12)</span>}
          </FormLabel>
          {formData.photos.length < 12 && (
            <div className="mb-3">
              <ImagePathSelector
                label=""
                name="add_photo"
                id="add_photo"
                value=""
                onChange={handleAddPhoto}
                uploadFolder="projects"
                helpText="Add a photo to the gallery (max 12 photos)"
              />
            </div>
          )}
          {errors.photos && <div className="text-danger mb-2">{errors.photos}</div>}
          {formData.photos.length > 0 && (
            <div className="row g-2">
              {formData.photos.map((photo, index) => {
                const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
                const baseUrl = apiUrl.replace('/api', '')
                const previewUrl = photo.image_path?.startsWith('http') 
                  ? photo.image_path 
                  : photo.image_path?.startsWith('/assets/')
                  ? `${import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'}${photo.image_path}`
                  : photo.image_path 
                  ? `${baseUrl}/storage/${photo.image_path}`
                  : null
                return (
                  <div key={index} className="col-md-3 mb-2">
                    <div className="border rounded p-2 position-relative">
                      {previewUrl && (
                        <img 
                          src={previewUrl} 
                          alt={`Photo ${index + 1}`} 
                          className="img-fluid rounded"
                          style={{ maxHeight: '100px', width: '100%', objectFit: 'cover' }}
                        />
                      )}
                      <div className="d-flex justify-content-between mt-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemovePhoto(index)}
                        >
                          Remove
                        </button>
                        <div>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleReorderPhoto(index, 'up')}
                            disabled={index === 0}
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary ms-1"
                            onClick={() => handleReorderPhoto(index, 'down')}
                            disabled={index === formData.photos.length - 1}
                            title="Move down"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          <FormText>Add up to 12 photos for the gallery slider on detail page</FormText>
        </Col>
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

