import React, { useState, useRef, useEffect } from 'react'
import { Card, Button, Image, Spinner, FormControl, FormText, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faPencil, faTrash, faSave, faX } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'

const ProfilePictureSection = ({ 
  avatar, 
  onAvatarChange, 
  onAvatarDelete, 
  loading = false 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(avatar || '')
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef()

  // Update avatarPreview when avatar prop changes
  useEffect(() => {
    if (avatar) {
      setAvatarPreview(avatar)
    } else {
      setAvatarPreview('')
    }
  }, [avatar])

  const handleEditClick = () => {
    setIsEditing(true)
    setError('')
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setAvatarPreview(avatar || '')
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, WebP)')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setAvatarLoading(true)
    setError('')
    
    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)
      
      // Convert to base64 for form submission
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target.result
        setAvatarLoading(false)
        
        // Call parent callback
        if (onAvatarChange) {
          onAvatarChange(file, base64)
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error processing avatar:', error)
      setError('Error processing image')
      setAvatarLoading(false)
    }
  }

  const handleSave = () => {
    setIsEditing(false)
    setError('')
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your profile picture?')) {
      setAvatarPreview('')
      if (onAvatarDelete) {
        onAvatarDelete()
      }
    }
  }

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center w-100">
          <Card.Title className="mb-0 d-flex align-items-center">
            <FontAwesomeIcon icon={faUser} className="me-2" />
            Profile Picture
          </Card.Title>
          {!isEditing && (
            <div className="d-flex gap-2">
              <Button
                color="primary"
                variant="outline"
                size="sm"
                onClick={handleEditClick}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faPencil} className="me-1" />
                Edit Photo
              </Button>
              {avatarPreview && (
                <Button
                  color="danger"
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faTrash} className="me-1" />
                  Delete Photo
                </Button>
              )}
            </div>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        <div className="d-flex align-items-center gap-3">
          <div className="position-relative">
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Profile Avatar"
                className="rounded-circle"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                onError={(e) => {
                  console.error('[ProfilePictureSection] Image load error:', {
                    url: avatarPreview,
                    error: e,
                    target: e.target
                  })
                  // Don't clear avatarPreview on error, just log it
                  // The image might be loading or there might be a CORS issue
                  // Try to reload the image with cache busting
                  if (avatarPreview && !avatarPreview.includes('?')) {
                    const separator = avatarPreview.includes('?') ? '&' : '?'
                    const newUrl = `${avatarPreview}${separator}t=${Date.now()}`
                    setTimeout(() => {
                      setAvatarPreview(newUrl)
                    }, 1000)
                  }
                  setError('Failed to load image. Please check if the image URL is accessible.')
                }}
                onLoad={() => {
                  if (error) setError('')
                }}
              />
            ) : (
              <div 
                className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                style={{ width: '100px', height: '100px' }}
              >
                <FontAwesomeIcon icon={faUser} size="xl" className="text-white" />
              </div>
            )}
            {avatarLoading && (
              <div className="position-absolute top-50 start-50 translate-middle">
                <Spinner size="sm" />
              </div>
            )}
          </div>
          <div className="flex-grow-1">
            {isEditing ? (
              <div>
                <FormControl
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mb-2"
                />
                <FormText className="text-muted mb-3">
                  JPG, PNG, GIF or WebP. Max size 5MB.
                </FormText>
                {error && (
                  <Alert color="danger" className="mb-3">
                    {error}
                  </Alert>
                )}
                <div className="d-flex gap-2">
                  <Button
                    color="primary"
                    size="sm"
                    onClick={handleSave}
                    disabled={avatarLoading}
                  >
                    <FontAwesomeIcon icon={faSave} className="me-1" />
                    Save
                  </Button>
                  <Button
                    color="secondary"
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={avatarLoading}
                  >
                    <FontAwesomeIcon icon={faX} className="me-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-muted mb-0">
                  {avatarPreview ? 'Click "Edit Photo" to change your profile picture' : 'No profile picture set'}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

ProfilePictureSection.propTypes = {
  avatar: PropTypes.string,
  onAvatarChange: PropTypes.func,
  onAvatarDelete: PropTypes.func,
  loading: PropTypes.bool
}

export default ProfilePictureSection
