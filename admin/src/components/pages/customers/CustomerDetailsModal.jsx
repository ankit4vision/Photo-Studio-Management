import React from 'react'
import { Modal, Row, Col, Badge, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faShoppingCart, 
  faWallet,
  faCalendarAlt,
  faBan,
  faCheckCircle,
  faBuilding,
  faBook,
  faGift
} from '@fortawesome/free-solid-svg-icons'

const CustomerDetailsModal = ({ 
  visible, 
  onClose, 
  customer, 
  onSuspend, 
  onActivate 
}) => {
  const navigate = useNavigate()
  
  if (!customer) return null

  // Get customer name
  const customerName = customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`.trim()

  // Generate initials for avatar
  const getInitials = (customer) => {
    if (customer.name) {
      const names = customer.name.split(' ')
      if (names.length >= 2) {
        return `${names[0]?.charAt(0) || ''}${names[names.length - 1]?.charAt(0) || ''}`.toUpperCase()
      }
      return customer.name.substring(0, 2).toUpperCase()
    }
    return `${customer.firstName?.charAt(0) || ''}${customer.lastName?.charAt(0) || ''}`.toUpperCase()
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0)
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'secondary'
      case 'suspended': return 'danger'
      case 'pending': return 'warning'
      default: return 'secondary'
    }
  }

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active'
      case 'inactive': return 'Inactive'
      case 'suspended': return 'Suspended'
      case 'pending': return 'Pending'
      default: return status
    }
  }

  const walletBalance = customer.wallet_balance || 0
  const totalOrders = customer.total_orders || customer.totalOrders || 0

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
            {getInitials(customer)}
          </div>
          <h4 className="mb-1">{customerName}</h4>
          <p className="text-muted mb-0">Customer ID: {customer.id || customer.customerId}</p>
        </div>

        {/* Wallet Balance Card */}
        <div className="mb-4 p-3 bg-light rounded border border-success border-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div className="text-muted small mb-1">Wallet Balance</div>
              <div className={`h4 mb-0 fw-bold ${walletBalance >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatCurrency(walletBalance)}
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => {
                  onClose()
                  navigate(`/customers/${customer.id}/wallet`)
                }}
              >
                <FontAwesomeIcon icon={faWallet} className="me-2" />
                View Wallet
              </Button>
              <Button
                variant="outline-info"
                size="sm"
                onClick={() => {
                  onClose()
                  navigate(`/customers/${customer.id}/ledger`)
                }}
              >
                <FontAwesomeIcon icon={faBook} className="me-2" />
                View Ledger
              </Button>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <Row className="g-4">
          <Col md={6}>
            <div className="d-flex align-items-center mb-3">
              <FontAwesomeIcon icon={faPhone} className="me-3 text-success" />
              <div>
                <div className="fw-semibold">Mobile</div>
                <div className="text-muted">{customer.mobile || customer.phone || 'N/A'}</div>
              </div>
            </div>
          </Col>
          
          <Col md={6}>
            <div className="d-flex align-items-center mb-3">
              <FontAwesomeIcon icon={faEnvelope} className="me-3 text-success" />
              <div>
                <div className="fw-semibold">Email</div>
                <div className="text-muted">{customer.email || 'N/A'}</div>
              </div>
            </div>
          </Col>

          {customer.address && (
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-3 text-success" />
                <div>
                  <div className="fw-semibold">Address</div>
                  <div className="text-muted">{customer.address}</div>
                </div>
              </div>
            </Col>
          )}

          {customer.branch_name && (
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <FontAwesomeIcon icon={faBuilding} className="me-3 text-success" />
                <div>
                  <div className="fw-semibold">Branch</div>
                  <div className="text-muted">{customer.branch_name} ({customer.branch_code || ''})</div>
                </div>
              </div>
            </Col>
          )}

          {customer.dob && (
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-3 text-success" />
                <div>
                  <div className="fw-semibold">Date of Birth</div>
                  <div className="text-muted">{formatDate(customer.dob)}</div>
                </div>
              </div>
            </Col>
          )}

          {customer.anniversary_date && (
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <FontAwesomeIcon icon={faGift} className="me-3 text-success" />
                <div>
                  <div className="fw-semibold">Anniversary Date</div>
                  <div className="text-muted">{formatDate(customer.anniversary_date)}</div>
                </div>
              </div>
            </Col>
          )}
          
          <Col md={6}>
            <div className="d-flex align-items-center mb-3">
              <FontAwesomeIcon icon={faShoppingCart} className="me-3 text-success" />
              <div>
                <div className="fw-semibold">Total Orders</div>
                <div className="text-muted">{totalOrders}</div>
              </div>
            </div>
          </Col>

          {customer.created_at && (
            <Col md={6}>
              <div className="d-flex align-items-center mb-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-3 text-success" />
                <div>
                  <div className="fw-semibold">Registered</div>
                  <div className="text-muted">{formatDate(customer.created_at || customer.joinedDate)}</div>
                </div>
              </div>
            </Col>
          )}
        </Row>

        {/* Status Badge */}
        <div className="text-center mb-4">
          <Badge bg={getStatusColor(customer.status)} className="px-3 py-2 fs-6">
            {getStatusText(customer.status)}
          </Badge>
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        {customer.status === 'active' && onSuspend ? (
          <Button variant="danger" onClick={() => onSuspend(customer)}>
            <FontAwesomeIcon icon={faBan} className="me-2" />
            Suspend Account
          </Button>
        ) : customer.status === 'suspended' && onActivate ? (
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
