import React from 'react'
import { Modal, Row, Col, Badge, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faShoppingCart, 
  faDollarSign,
  faCalendarAlt,
  faBan,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'

const CustomerDetailsModal = ({ 
  visible, 
  onClose, 
  customer, 
  onSuspend, 
  onActivate 
}) => {
  if (!customer) return null

  // Generate initials for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-NZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD'
    }).format(amount)
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'suspended': return 'danger'
      case 'pending': return 'warning'
      default: return 'secondary'
    }
  }

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active'
      case 'suspended': return 'Suspended'
      case 'pending': return 'Pending'
      default: return status
    }
  }

  return (
    <Modal show={visible} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Customer Details</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        {/* Customer Profile Section */}
        <div className="text-center mb-4">
          <div 
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{ 
              width: '80px', 
              height: '80px', 
              backgroundColor: '#8b5cf6',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold'
            }}
          >
            {getInitials(customer.firstName, customer.lastName)}
          </div>
          <h4 className="mb-1">{customer.firstName} {customer.lastName}</h4>
          <p className="text-muted mb-0">Customer ID: {customer.customerId}</p>
        </div>

        {/* Customer Information */}
        <Row className="g-4">
          <Col md={6}>
            <div className="d-flex align-items-center mb-3">
              <FontAwesomeIcon icon={faEnvelope} className="me-3 text-success" />
              <div>
                <div className="fw-semibold">Email</div>
                <div className="text-muted">{customer.email}</div>
              </div>
            </div>
          </Col>
          
          <Col md={6}>
            <div className="d-flex align-items-center mb-3">
              <FontAwesomeIcon icon={faPhone} className="me-3 text-success" />
              <div>
                <div className="fw-semibold">Phone</div>
                <div className="text-muted">{customer.phone}</div>
              </div>
            </div>
          </Col>
          
          <Col md={6}>
            <div className="d-flex align-items-center mb-3">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="me-3 text-success" />
              <div>
                <div className="fw-semibold">Location</div>
                <div className="text-muted">
                  {customer.location?.city}, {customer.location?.country}
                </div>
              </div>
            </div>
          </Col>
          
          <Col md={6}>
            <div className="d-flex align-items-center mb-3">
              <FontAwesomeIcon icon={faShoppingCart} className="me-3 text-success" />
              <div>
                <div className="fw-semibold">Total Orders</div>
                <div className="text-muted">{customer.totalOrders}</div>
              </div>
            </div>
          </Col>
          
          <Col md={6}>
            <div className="d-flex align-items-center mb-3">
              <FontAwesomeIcon icon={faDollarSign} className="me-3 text-success" />
              <div>
                <div className="fw-semibold">Total Spent</div>
                <div className="text-muted">{formatCurrency(customer.totalSpent)}</div>
              </div>
            </div>
          </Col>
          
          <Col md={6}>
            <div className="d-flex align-items-center mb-3">
              <FontAwesomeIcon icon={faCalendarAlt} className="me-3 text-success" />
              <div>
                <div className="fw-semibold">Joined</div>
                <div className="text-muted">{formatDate(customer.joinedDate)}</div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Status Badge */}
        <div className="text-center mb-4">
          <Badge bg={getStatusColor(customer.status)} className="px-3 py-2 fs-6">
            {getStatusText(customer.status)}
          </Badge>
        </div>

        {/* Address Information */}
        {customer.address && (
          <div className="mb-4">
            <h6 className="fw-semibold mb-3">Address Information</h6>
            <div className="bg-light p-3 rounded">
              <div className="text-muted">
                {customer.address.street}<br />
                {customer.address.city}, {customer.address.state} {customer.address.postalCode}<br />
                {customer.address.country}
              </div>
            </div>
          </div>
        )}

        {/* Preferences */}
        {customer.preferences && Object.keys(customer.preferences).length > 0 && (
          <div className="mb-4">
            <h6 className="fw-semibold mb-3">Preferences</h6>
            <div className="bg-light p-3 rounded">
              <Row className="g-2">
                {customer.preferences.newsletter !== undefined && (
                  <Col md={6}>
                    <small className="text-muted">
                      Newsletter: {customer.preferences.newsletter ? 'Subscribed' : 'Not subscribed'}
                    </small>
                  </Col>
                )}
                {customer.preferences.smsNotifications !== undefined && (
                  <Col md={6}>
                    <small className="text-muted">
                      SMS Notifications: {customer.preferences.smsNotifications ? 'Enabled' : 'Disabled'}
                    </small>
                  </Col>
                )}
                {customer.preferences.preferredDeliveryTime && (
                  <Col md={6}>
                    <small className="text-muted">
                      Preferred Delivery: {customer.preferences.preferredDeliveryTime}
                    </small>
                  </Col>
                )}
                {customer.preferences.dietaryRestrictions && customer.preferences.dietaryRestrictions.length > 0 && (
                  <Col md={12}>
                    <small className="text-muted">
                      Dietary Restrictions: {customer.preferences.dietaryRestrictions.join(', ')}
                    </small>
                  </Col>
                )}
              </Row>
            </div>
          </div>
        )}

        {/* Notes */}
        {customer.notes && (
          <div className="mb-4">
            <h6 className="fw-semibold mb-3">Notes</h6>
            <div className="bg-light p-3 rounded">
              <div className="text-muted">{customer.notes}</div>
            </div>
          </div>
        )}

        {/* Last Order Date */}
        {customer.lastOrderDate && (
          <div className="mb-4">
            <h6 className="fw-semibold mb-3">Last Order</h6>
            <div className="bg-light p-3 rounded">
              <div className="text-muted">{formatDate(customer.lastOrderDate)}</div>
            </div>
          </div>
        )}

        {/* Suspension Details */}
        {customer.suspensionDetails && (
          <div className="mb-4">
            <h6 className="fw-semibold mb-3 text-danger">Suspension Details</h6>
            <div className="bg-danger bg-opacity-10 p-3 rounded border border-danger">
              <Row className="g-2">
                <Col md={6}>
                  <small className="text-muted">Reason:</small>
                  <div className="fw-semibold">{customer.suspensionDetails.reason}</div>
                </Col>
                <Col md={6}>
                  <small className="text-muted">Suspended On:</small>
                  <div className="fw-semibold">{formatDate(customer.suspensionDetails.suspendedAt)}</div>
                </Col>
                {customer.suspensionDetails.durationType === 'temporary' && customer.suspensionDetails.suspendedUntil && (
                  <Col md={6}>
                    <small className="text-muted">Suspended Until:</small>
                    <div className="fw-semibold">{formatDate(customer.suspensionDetails.suspendedUntil)}</div>
                  </Col>
                )}
                {customer.suspensionDetails.notes && (
                  <Col md={12}>
                    <small className="text-muted">Notes:</small>
                    <div className="fw-semibold">{customer.suspensionDetails.notes}</div>
                  </Col>
                )}
              </Row>
            </div>
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        {customer.status === 'active' ? (
          <Button variant="danger" onClick={() => onSuspend(customer)}>
            <FontAwesomeIcon icon={faBan} className="me-2" />
            Suspend Account
          </Button>
        ) : customer.status === 'suspended' ? (
          <Button variant="success" onClick={() => onActivate(customer)}>
            <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
            Activate Account
          </Button>
        ) : null}
      </Modal.Footer>
    </Modal>
  )
}

export default CustomerDetailsModal
