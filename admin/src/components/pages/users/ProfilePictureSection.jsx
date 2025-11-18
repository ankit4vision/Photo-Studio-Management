import React, { useState, useEffect } from 'react'
import { Card, Image } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'

const ProfilePictureSection = ({ 
  avatar, 
  loading = false
}) => {
  const [avatarPreview, setAvatarPreview] = useState(avatar || '')

  // Update avatarPreview when avatar prop changes
  useEffect(() => {
    if (avatar) {
      setAvatarPreview(avatar)
    } else {
      setAvatarPreview('')
    }
  }, [avatar])

  return (
    <Card>
      <Card.Header>
        <Card.Title className="mb-0 d-flex align-items-center">
          <FontAwesomeIcon icon={faUser} className="me-2" />
          Profile Picture
        </Card.Title>
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
              />
            ) : (
              <div 
                className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                style={{ width: '100px', height: '100px' }}
              >
                <FontAwesomeIcon icon={faUser} size="xl" className="text-white" />
              </div>
            )}
          </div>
          <div className="flex-grow-1">
            <p className="text-muted mb-0">
              {avatarPreview ? 'Profile picture' : 'No profile picture set'}
            </p>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

ProfilePictureSection.propTypes = {
  avatar: PropTypes.string,
  loading: PropTypes.bool,
}

export default ProfilePictureSection
