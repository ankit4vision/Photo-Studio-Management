import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { FormRow, TextField } from '../../common/FormFields'
import { FormLabel, FormControl, FormText, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import ImagePathSelector from '../../common/ImagePathSelector'

const TestimonialForm = forwardRef(({ 
  mode = 'create', 
  testimonialData = null, 
  onSubmit, 
  onCancel,
  loading = false 
}, ref) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    location: '',
    testimonial_text: '',
    rating: 5,
    photo_path: '',
    is_featured: false,
    is_active: true,
    order: 0
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (mode === 'edit' && testimonialData) {
      setFormData({
        customer_name: testimonialData.customer_name || '',
        location: testimonialData.location || '',
        testimonial_text: testimonialData.testimonial_text || '',
        rating: testimonialData.rating || 5,
        photo_path: testimonialData.photo_path || '',
        is_featured: testimonialData.is_featured || false,
        is_active: testimonialData.is_active !== undefined ? testimonialData.is_active : true,
        order: testimonialData.order || 0
      })
    }
  }, [mode, testimonialData])

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

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Customer name is required'
    }

    if (!formData.testimonial_text.trim()) {
      newErrors.testimonial_text = 'Testimonial text is required'
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5'
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
      customer_name: formData.customer_name.trim(),
      location: formData.location.trim() || null,
      testimonial_text: formData.testimonial_text.trim(),
      rating: parseInt(formData.rating) || 5,
      photo_path: formData.photo_path.trim() || null,
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
          label="Customer Name"
          name="customer_name"
          id="customer_name"
          value={formData.customer_name}
          onChange={(e) => handleChange('customer_name', e.target.value)}
          placeholder="Rachel Jackson"
          required
          invalid={!!errors.customer_name}
          feedback={errors.customer_name}
        />
      </FormRow>

      <FormRow>
        <TextField
          label="Location"
          name="location"
          id="location"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="New York"
          invalid={!!errors.location}
          feedback={errors.location}
        />
      </FormRow>

      <FormRow>
        <Col md={12}>
          <FormLabel htmlFor="testimonial_text">Testimonial Text</FormLabel>
          <FormControl
            as="textarea"
            rows={4}
            id="testimonial_text"
            value={formData.testimonial_text}
            onChange={(e) => handleChange('testimonial_text', e.target.value)}
            placeholder="Enter testimonial text..."
            isInvalid={!!errors.testimonial_text}
          />
          {errors.testimonial_text && (
            <div className="invalid-feedback d-block">{errors.testimonial_text}</div>
          )}
          <FormText>Enter the customer's testimonial or review</FormText>
        </Col>
      </FormRow>

      <FormRow>
        <TextField
          label="Rating"
          name="rating"
          id="rating"
          type="number"
          min="1"
          max="5"
          value={formData.rating.toString()}
          onChange={(e) => handleChange('rating', parseInt(e.target.value) || 5)}
          placeholder="5"
          required
          invalid={!!errors.rating}
          feedback={errors.rating}
          helpText="Rating from 1 to 5 stars"
        />
      </FormRow>

      <ImagePathSelector
        label="Customer Photo"
        name="photo_path"
        id="photo_path"
        value={formData.photo_path}
        onChange={(path) => handleChange('photo_path', path)}
        uploadFolder="testimonials"
        invalid={!!errors.photo_path}
        feedback={errors.photo_path}
        helpText="Upload a customer photo (JPEG, PNG, WebP)."
      />

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
            Show this testimonial prominently
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
            Enable or disable this testimonial
          </small>
        </div>
      </FormRow>
    </div>
  )
})

TestimonialForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  testimonialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool
}

TestimonialForm.displayName = 'TestimonialForm'

export default TestimonialForm

