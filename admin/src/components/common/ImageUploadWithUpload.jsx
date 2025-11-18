import React, { useState, useRef, useEffect } from 'react'
import { Button, Form, Image, Alert, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faTrash, faImage, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { uploadService } from '../../services/uploadService'
import PropTypes from 'prop-types'

/**
 * Enhanced ImageUpload component with automatic upload to backend
 * 
 * @param {string} value - Current image path/URL (for display)
 * @param {Function} onChange - Callback when upload completes: (path, url, uploadResult) => void
 * @param {string} label - Label text
 * @param {boolean} required - Is field required
 * @param {string} accept - Accepted file types
 * @param {number} maxSize - Max file size in bytes
 * @param {Object} previewSize - Preview dimensions {width, height}
 * @param {string} className - Additional CSS classes
 * @param {boolean} disabled - Is component disabled
 * @param {string} error - Error message to display
 * @param {string} module - Module name (e.g., 'users', 'settings')
 * @param {string} folder - Folder name (e.g., 'avatars', 'logos')
 * @param {string} existingPath - Existing file path to replace
 * @param {string} visibility - 'public' or 'private'
 * @param {boolean} autoUpload - Automatically upload on file select (default: true)
 * @param {Function} onUploadStart - Callback when upload starts
 * @param {Function} onUploadComplete - Callback when upload completes
 * @param {Function} onUploadError - Callback when upload fails
 * @param {Function} onRemove - Callback when image is removed
 */
const ImageUploadWithUpload = ({
  value = '',
  onChange,
  label = 'Image',
  required = false,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  previewSize = { width: 200, height: 150 },
  className = '',
  disabled = false,
  error = null,
  module = 'settings',
  folder = 'images',
  existingPath = null,
  visibility = 'public',
  autoUpload = true,
  onUploadStart = null,
  onUploadComplete = null,
  onUploadError = null,
  onRemove = null,
}) => {
  const [preview, setPreview] = useState(value)
  const [dragActive, setDragActive] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef(null)

  // Keep preview in sync if parent updates value
  useEffect(() => {
    setPreview(value || '')
  }, [value])

  // Clear upload success indicator after 2 seconds
  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => {
        setUploadSuccess(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [uploadSuccess])

  const handleFileSelect = async (file) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file')
      return
    }

    // Validate file size
    if (file.size > maxSize) {
      setUploadError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }

    setUploadError('')
    setUploadSuccess(false)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = async (e) => {
      const imageUrl = e.target.result
      setPreview(imageUrl)

      // If autoUpload is enabled, upload immediately
      if (autoUpload) {
        await uploadFile(file, imageUrl)
      } else {
        // Just set preview, don't upload yet
        onChange(imageUrl)
      }
    }
    reader.readAsDataURL(file)
  }

  const uploadFile = async (file, previewUrl = null) => {
    if (!module || !folder) {
      setUploadError('Module and folder are required')
      return
    }

    setUploading(true)
    setUploadError('')

    if (onUploadStart) {
      onUploadStart(file)
    }

    try {
      // Use existingPath if provided, otherwise use value
      const pathToReplace = existingPath || value || null

      const result = await uploadService.uploadFile(file, {
        module,
        folder,
        visibility,
        existingPath: pathToReplace
      })

      if (result.success && result.data) {
        const { path, url } = result.data
        
        // Update preview with uploaded URL if available
        if (url) {
          setPreview(url)
        } else if (previewUrl) {
          setPreview(previewUrl)
        }

        setUploadSuccess(true)
        
        // Call onChange with the stored path
        if (onChange) {
          onChange(path, url, result.data)
        }

        if (onUploadComplete) {
          onUploadComplete(result.data, file)
        }
      } else {
        const errorMsg = result.message || 'Upload failed'
        setUploadError(errorMsg)
        
        if (onUploadError) {
          onUploadError(errorMsg, file)
        }
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to upload image'
      setUploadError(errorMsg)
      console.error('Upload error:', err)
      
      if (onUploadError) {
        onUploadError(errorMsg, file)
      }
    } finally {
      setUploading(false)
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleRemoveImage = () => {
    setPreview('')
    setUploadError('')
    setUploadSuccess(false)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    if (onChange) {
      onChange('', '', null)
    }

    if (onRemove) {
      onRemove()
    }
  }

  const handleUploadClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className={`image-upload ${className}`}>
      <Form.Label className="fw-semibold">
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </Form.Label>

      {/* Upload Area */}
      <div
        className={`upload-area border-2 rounded-3 p-4 text-center position-relative ${
          dragActive ? 'border-primary bg-light' : 'border-secondary'
        } ${disabled ? 'opacity-50' : ''} ${uploading ? 'opacity-75' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{ minHeight: '120px', cursor: disabled ? 'not-allowed' : 'pointer' }}
        onClick={handleUploadClick}
      >
        {uploading && (
          <div className="position-absolute top-50 start-50 translate-middle">
            <Spinner animation="border" variant="primary" />
            <div className="mt-2 text-primary">Uploading...</div>
          </div>
        )}

        {preview && !uploading ? (
          <div className="position-relative d-inline-block">
            <Image
              src={preview}
              alt="Preview"
              rounded
              style={{
                width: previewSize.width,
                height: previewSize.height,
                objectFit: 'cover'
              }}
            />
            {uploadSuccess && (
              <div className="position-absolute top-0 start-0 m-1">
                <FontAwesomeIcon 
                  icon={faCheckCircle} 
                  className="text-success"
                  style={{ fontSize: '1.5rem' }}
                />
              </div>
            )}
            {!disabled && (
              <Button
                variant="danger"
                size="sm"
                className="position-absolute top-0 end-0 m-1"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveImage()
                }}
                title="Remove image"
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            )}
          </div>
        ) : !uploading ? (
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
            <FontAwesomeIcon
              icon={faImage}
              className="text-muted mb-2"
              style={{ fontSize: '2rem' }}
            />
            <div className="text-muted">
              <FontAwesomeIcon icon={faUpload} className="me-2" />
              {disabled ? 'No image selected' : 'Click to upload or drag and drop'}
            </div>
            <small className="text-muted mt-1">
              PNG, JPG, GIF up to {Math.round(maxSize / 1024 / 1024)}MB
            </small>
          </div>
        ) : null}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        disabled={disabled || uploading}
      />

      {/* Error messages */}
      {(uploadError || error) && (
        <Alert variant="danger" className="mt-2 mb-0">
          {uploadError || error}
        </Alert>
      )}

      {/* Success message */}
      {uploadSuccess && !uploadError && (
        <Alert variant="success" className="mt-2 mb-0">
          Image uploaded successfully!
        </Alert>
      )}

      {/* Helper text */}
      {!uploadError && !error && !uploadSuccess && (
        <Form.Text className="text-muted">
          Upload an image. It will be automatically saved to {module}/{folder}.
        </Form.Text>
      )}
    </div>
  )
}

ImageUploadWithUpload.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  accept: PropTypes.string,
  maxSize: PropTypes.number,
  previewSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  module: PropTypes.string.isRequired,
  folder: PropTypes.string.isRequired,
  existingPath: PropTypes.string,
  visibility: PropTypes.oneOf(['public', 'private']),
  autoUpload: PropTypes.bool,
  onUploadStart: PropTypes.func,
  onUploadComplete: PropTypes.func,
  onUploadError: PropTypes.func,
  onRemove: PropTypes.func,
}

export default ImageUploadWithUpload

