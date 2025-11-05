import React, { useState } from 'react'
import { Modal, Row, Col, Form, FormControl, FormSelect, FormCheck, Alert, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faExclamationTriangle, 
  faBan, 
  faPlay,
  faEnvelope,
  faBell,
  faTicketAlt,
  faShoppingCart,
  faUser,
  faHeadset,
  faBullhorn
} from '@fortawesome/free-solid-svg-icons'

const SuspendCustomerModal = ({ 
  visible, 
  onClose, 
  customer, 
  onSuspend,
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    reason: '',
    durationType: 'temporary',
    durationValue: '1',
    durationUnit: 'day',
    notes: '',
    sendEmailNotification: true,
    notifySupportTeam: true,
    createSupportTicket: false
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (visible) {
      setFormData({
        reason: '',
        durationType: 'temporary',
        durationValue: '1',
        durationUnit: 'day',
        notes: '',
        sendEmailNotification: true,
        notifySupportTeam: true,
        createSupportTicket: false
      })
      setErrors({})
    }
  }, [visible])

  // Generate initials for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.reason) {
      newErrors.reason = 'Reason for suspension is required'
    }

    if (formData.durationType === 'temporary') {
      if (!formData.durationValue) {
        newErrors.durationValue = 'Duration value is required'
      }
      if (!formData.durationUnit) {
        newErrors.durationUnit = 'Duration unit is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSuspend(customer.id, formData)
    } catch (error) {
      console.error('Error suspending customer:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle preview action
  const handlePreview = () => {
    if (!validateForm()) {
      return
    }
    // TODO: Implement preview functionality
    console.log('Preview suspend action:', formData)
  }

  // Suspension reasons
  const suspensionReasons = [
    'Payment Issues',
    'Terms of Service Violation',
    'Fraudulent Activity',
    'Inappropriate Behavior',
    'Account Security Concerns',
    'Requested by Customer',
    'Other'
  ]

  // Duration units
  const durationUnits = [
    { value: 'day', label: 'Day(s)' },
    { value: 'week', label: 'Week(s)' },
    { value: 'month', label: 'Month(s)' }
  ]

  if (!customer) return null

  return (
    <Modal show={visible} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton className="bg-warning text-dark">
        <Modal.Title>
          <FontAwesomeIcon icon={faBan} className="me-2" />
          Suspend Customer Account
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-0">
        {/* Warning Banner */}
        <Alert variant="warning" className="m-0 rounded-0">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
            <strong>Warning:</strong> Suspending a customer account will prevent them from placing new orders and accessing their account.
          </div>
        </Alert>

        <div className="p-4">
          {/* Customer Information */}
          <div className="text-center mb-4">
            <div 
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: '#8b5cf6',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold'
              }}
            >
              {getInitials(customer.firstName, customer.lastName)}
            </div>
            <h5 className="mb-1">{customer.firstName} {customer.lastName}</h5>
            <p className="text-muted mb-0">
              Customer ID: {customer.customerId} | Email: {customer.email}
            </p>
          </div>

          <Form onSubmit={handleSubmit}>
            {/* Reason for Suspension */}
            <Row className="mb-4">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Reason for Suspension *</Form.Label>
                  <FormSelect
                    value={formData.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    isInvalid={!!errors.reason}
                    className="border-2"
                  >
                    <option value="">Select a reason...</option>
                    {suspensionReasons.map(reason => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </FormSelect>
                  <Form.Control.Feedback type="invalid">
                    {errors.reason}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Suspension Duration */}
            <Row className="mb-4">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Suspension Duration *</Form.Label>
                  <FormSelect
                    value={formData.durationType}
                    onChange={(e) => handleInputChange('durationType', e.target.value)}
                    className="border-2"
                  >
                    <option value="temporary">Temporary</option>
                    <option value="permanent">Permanent</option>
                  </FormSelect>
                </Form.Group>
              </Col>
              
              {formData.durationType === 'temporary' && (
                <>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">&nbsp;</Form.Label>
                      <FormControl
                        type="number"
                        min="1"
                        value={formData.durationValue}
                        onChange={(e) => handleInputChange('durationValue', e.target.value)}
                        isInvalid={!!errors.durationValue}
                        className="border-2"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.durationValue}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">&nbsp;</Form.Label>
                      <FormSelect
                        value={formData.durationUnit}
                        onChange={(e) => handleInputChange('durationUnit', e.target.value)}
                        isInvalid={!!errors.durationUnit}
                        className="border-2"
                      >
                        {durationUnits.map(unit => (
                          <option key={unit.value} value={unit.value}>{unit.label}</option>
                        ))}
                      </FormSelect>
                      <Form.Control.Feedback type="invalid">
                        {errors.durationUnit}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </>
              )}
            </Row>

            {/* Additional Notes */}
            <Row className="mb-4">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Additional Notes</Form.Label>
                  <FormControl
                    as="textarea"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Provide additional details about the suspension..."
                    className="border-2"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Notification Options */}
            <div className="mb-4">
              <h6 className="fw-semibold mb-3">Notification Options</h6>
              <Row>
                <Col md={12}>
                  <Form.Check
                    type="checkbox"
                    id="sendEmailNotification"
                    label="Send suspension notification email to customer"
                    checked={formData.sendEmailNotification}
                    onChange={(e) => handleInputChange('sendEmailNotification', e.target.checked)}
                    className="mb-2"
                  />
                  <Form.Check
                    type="checkbox"
                    id="notifySupportTeam"
                    label="Notify customer support team"
                    checked={formData.notifySupportTeam}
                    onChange={(e) => handleInputChange('notifySupportTeam', e.target.checked)}
                    className="mb-2"
                  />
                  <Form.Check
                    type="checkbox"
                    id="createSupportTicket"
                    label="Create support ticket for follow-up"
                    checked={formData.createSupportTicket}
                    onChange={(e) => handleInputChange('createSupportTicket', e.target.checked)}
                    className="mb-2"
                  />
                </Col>
              </Row>
            </div>

            {/* Account Impact Section */}
            <div className="mb-4">
              <div className="bg-info bg-opacity-10 p-3 rounded border">
                <h6 className="fw-semibold mb-3 text-info">Suspension will affect:</h6>
                <ul className="mb-0">
                  <li className="mb-2">
                    <FontAwesomeIcon icon={faShoppingCart} className="me-2 text-info" />
                    Customer's ability to place new orders
                  </li>
                  <li className="mb-2">
                    <FontAwesomeIcon icon={faUser} className="me-2 text-info" />
                    Access to account dashboard and order history
                  </li>
                  <li className="mb-2">
                    <FontAwesomeIcon icon={faHeadset} className="me-2 text-info" />
                    Customer support interactions
                  </li>
                  <li className="mb-0">
                    <FontAwesomeIcon icon={faBullhorn} className="me-2 text-info" />
                    Marketing communications (if selected)
                  </li>
                </ul>
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <Row className="mb-4">
              <Col md={12}>
                <Form.Check
                  type="checkbox"
                  id="confirmSuspension"
                  label="I confirm that I have reviewed all details and want to suspend this customer account"
                  required
                  className="fw-semibold"
                />
              </Col>
            </Row>
          </Form>
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          variant="warning" 
          onClick={handlePreview}
          disabled={isSubmitting}
        >
          <FontAwesomeIcon icon={faPlay} className="me-2" />
          Preview Action
        </Button>
        <Button 
          variant="danger" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          <FontAwesomeIcon icon={faBan} className="me-2" />
          {isSubmitting ? 'Suspending...' : 'Suspend Customer'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SuspendCustomerModal
