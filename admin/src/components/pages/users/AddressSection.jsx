import React, { useState } from 'react'
import { Card, Button, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationPin, faPencil, faSave, faX } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import { TextField, FormRow } from '../../common/FormFields'

const AddressSection = ({ 
  addressData = {}, 
  onSave, 
  loading = false 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    ...addressData
  })
  const [errors, setErrors] = useState({})

  const handleEditClick = () => {
    setIsEditing(true)
    setErrors({})
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setFormData({
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      ...addressData
    })
    setErrors({})
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // ZIP code validation (optional but if provided, should be valid)
    if (formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (validateForm()) {
      try {
        await onSave(formData)
        setIsEditing(false)
        setErrors({})
      } catch (error) {
        console.error('Error saving address:', error)
      }
    }
  }

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center w-100">
          <Card.Title className="mb-0 d-flex align-items-center">
            <FontAwesomeIcon icon={faLocationPin} className="me-2" />
            Address Information
          </Card.Title>
          {!isEditing && (
            <Button
              color="primary"
              variant="outline"
              size="sm"
              onClick={handleEditClick}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faPencil} className="me-1" />
              Edit
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        {isEditing ? (
          <div>
            <FormRow>
              <TextField
                id="address"
                label="Street Address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Enter street address"
                col={12}
              />
            </FormRow>

            <FormRow>
              <TextField
                id="city"
                label="City"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Enter city"
                col={4}
              />
              <TextField
                id="state"
                label="State/Province"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="Enter state/province"
                col={4}
              />
              <TextField
                id="zipCode"
                label="ZIP/Postal Code"
                value={formData.zipCode}
                onChange={(e) => handleChange('zipCode', e.target.value)}
                placeholder="Enter ZIP/postal code"
                col={4}
                invalid={!!errors.zipCode}
                feedback={errors.zipCode}
              />
            </FormRow>

            <FormRow>
              <TextField
                id="country"
                label="Country"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                placeholder="Enter country"
                col={12}
              />
            </FormRow>

            <div className="d-flex gap-2 justify-content-end mt-3">
              <Button
                color="secondary"
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faX} className="me-1" />
                Cancel
              </Button>
              <Button
                color="primary"
                size="sm"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-1" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="me-1" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-12 mb-3">
              <strong>Street Address:</strong>
              <p className="text-muted mb-0">{addressData.address || 'Not provided'}</p>
            </div>
            <div className="col-md-4 mb-3">
              <strong>City:</strong>
              <p className="text-muted mb-0">{addressData.city || 'Not provided'}</p>
            </div>
            <div className="col-md-4 mb-3">
              <strong>State/Province:</strong>
              <p className="text-muted mb-0">{addressData.state || 'Not provided'}</p>
            </div>
            <div className="col-md-4 mb-3">
              <strong>ZIP/Postal Code:</strong>
              <p className="text-muted mb-0">{addressData.zipCode || 'Not provided'}</p>
            </div>
            <div className="col-12 mb-3">
              <strong>Country:</strong>
              <p className="text-muted mb-0">{addressData.country || 'Not provided'}</p>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

AddressSection.propTypes = {
  addressData: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  loading: PropTypes.bool
}

export default AddressSection
