import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Col, FormControl, FormLabel, FormText, Spinner } from 'react-bootstrap'
import { FormRow } from './FormFields'
import apiClient from '../../config/apiClient'

/**
 * ImagePathSelector
 *
 * Reusable field for selecting an image used by website CMS modules.
 * Internally it still works with an image path string (so backend logic stays the same),
 * but the user gets a nicer "select image" experience with thumbnail preview.
 */
const ImagePathSelector = ({
  label = 'Image',
  name = 'image_path',
  id = 'image_path',
  value,
  onChange,
  uploadFolder = null,
  required = false,
  invalid = false,
  feedback = '',
  helpText = '',
}) => {
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  // Convert path to URL for preview when value changes (for edit mode)
  useEffect(() => {
    if (value) {
      // If value is a full URL, use it directly
      if (value.startsWith('http://') || value.startsWith('https://')) {
        setPreviewUrl(value)
      } else if (value.startsWith('/assets/')) {
        // Frontend asset path - construct URL
        const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'
        setPreviewUrl(`${frontendUrl}${value}`)
      } else if (value && !value.includes('\\') && !value.match(/^[A-Z]:/)) {
        // Storage path - construct storage URL
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
        const baseUrl = apiUrl.replace('/api', '')
        setPreviewUrl(`${baseUrl}/storage/${value}`)
      } else {
        setPreviewUrl(null)
      }
    } else {
      setPreviewUrl(null)
    }
  }, [value])

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Basic client-side validation (similar to profile/settings)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, or WebP)')
      return
    }

    // 5MB max
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    // Local preview
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    // If no upload folder is provided, just use the file name (fallback)
    if (!uploadFolder) {
      onChange(file.name)
      return
    }

    // Upload to backend so image is stored like profile/settings
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', uploadFolder)

      const response = await apiClient.post('/admin/website/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response?.data?.success && response.data.data) {
        const { path } = response.data.data
        // Store the relative path (e.g., 'website/cms/slider/file.jpg')
        // Backend will convert this to URL in the resource
        onChange(path || file.name)
      } else {
        // Fallback to file name if API response is unexpected
        onChange(file.name)
      }
    } catch (err) {
      console.error('Error uploading CMS image:', err)
      alert('Failed to upload image. Please try again.')
      onChange(file.name)
    } finally {
      setUploading(false)
    }
  }

  const hasPreview = !!previewUrl || !!value

  return (
    <FormRow>
      <Col md={6}>
        <FormLabel htmlFor={id}>
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </FormLabel>
        {/* Native file chooser (as requested) */}
        <FormControl
          type="file"
          accept="image/*"
          className="mb-2"
          onChange={handleFileChange}
          disabled={uploading}
        />
        {uploading && (
          <div className="mb-2">
            <Spinner animation="border" size="sm" className="me-2" />
            <span className="small text-muted">Uploading image...</span>
          </div>
        )}
        {invalid && feedback && (
          <div className="invalid-feedback d-block">{feedback}</div>
        )}
        {helpText && (
          <FormText className="d-block">
            {helpText}
          </FormText>
        )}
      </Col>
      <Col md={6} className="mt-3 mt-md-0">
        <FormLabel>Preview</FormLabel>
        <div
          className="border rounded d-flex align-items-center justify-content-center bg-light"
          style={{ height: 120, overflow: 'hidden' }}
        >
          {hasPreview ? (
            <img
              src={previewUrl || value}
              alt="Preview"
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const parent = e.currentTarget.parentElement
                if (parent) {
                  parent.innerHTML = '<span className="text-muted small">Image not found</span>'
                }
              }}
            />
          ) : (
            <span className="text-muted small">No image selected</span>
          )}
        </div>
      </Col>
    </FormRow>
  )
}

ImagePathSelector.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  uploadFolder: PropTypes.string,
  required: PropTypes.bool,
  invalid: PropTypes.bool,
  feedback: PropTypes.string,
  helpText: PropTypes.string,
}

export default ImagePathSelector


