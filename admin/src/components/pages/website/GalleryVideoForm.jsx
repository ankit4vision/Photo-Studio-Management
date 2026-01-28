import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { FormRow, TextField } from '../../common/FormFields'
import { FormLabel, FormControl, FormText, Col, FormSelect } from 'react-bootstrap'
import PropTypes from 'prop-types'

const GalleryVideoForm = forwardRef(({ 
  mode = 'create', 
  videoData = null, 
  onSubmit, 
  onCancel,
  loading = false 
}, ref) => {
  const [formData, setFormData] = useState({
    video_url: '',
    platform: 'youtube',
    title: '',
    description: '',
    thumbnail_path: '',
    order: 0,
    is_active: true
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (mode === 'edit' && videoData) {
      setFormData({
        video_url: videoData.video_url || '',
        platform: videoData.platform || 'youtube',
        title: videoData.title || '',
        description: videoData.description || '',
        thumbnail_path: videoData.thumbnail_path || '',
        order: videoData.order || 0,
        is_active: videoData.is_active !== undefined ? videoData.is_active : true
      })
    }
  }, [mode, videoData])

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

    if (!formData.video_url.trim()) {
      newErrors.video_url = 'Video URL is required'
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
      video_url: formData.video_url.trim(),
      platform: formData.platform,
      title: formData.title.trim() || null,
      description: formData.description.trim() || null,
      thumbnail_path: formData.thumbnail_path.trim() || null,
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
          label="Video URL"
          name="video_url"
          id="video_url"
          value={formData.video_url}
          onChange={(e) => handleChange('video_url', e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          required
          invalid={!!errors.video_url}
          feedback={errors.video_url}
          helpText="Enter YouTube or Vimeo video URL"
        />
      </FormRow>

      <FormRow>
        <Col md={12}>
          <FormLabel htmlFor="platform">Platform</FormLabel>
          <FormSelect
            id="platform"
            value={formData.platform}
            onChange={(e) => handleChange('platform', e.target.value)}
          >
            <option value="youtube">YouTube</option>
            <option value="vimeo">Vimeo</option>
          </FormSelect>
          <FormText>Select the video platform</FormText>
        </Col>
      </FormRow>

      <FormRow>
        <TextField
          label="Title"
          name="title"
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Video Title"
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
            placeholder="Video description..."
          />
        </Col>
      </FormRow>

      <FormRow>
        <TextField
          label="Thumbnail Path"
          name="thumbnail_path"
          id="thumbnail_path"
          value={formData.thumbnail_path}
          onChange={(e) => handleChange('thumbnail_path', e.target.value)}
          placeholder="/assets/img/background/bg-3.jpg"
          invalid={!!errors.thumbnail_path}
          feedback={errors.thumbnail_path}
          helpText="Optional: Custom thumbnail image path"
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
            Enable or disable this video
          </small>
        </div>
      </FormRow>
    </div>
  )
})

GalleryVideoForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  videoData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool
}

GalleryVideoForm.displayName = 'GalleryVideoForm'

export default GalleryVideoForm

