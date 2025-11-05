import React, { useState, useEffect } from 'react'
import { Modal, Row, Col, Card, Badge, Button, Form, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTimes, 
  faCheck, 
  faTruck, 
  faComment, 
  faPrint,
  faEnvelope,
  faClock,
  faCheckCircle,
  faExclamationTriangle,
  faImage,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import orderService from '../../../services/orderService'
import { formatCurrency, formatDate } from '../../../utils'

const OrderDetailsModal = ({ show, onHide, orderId, onOrderUpdate }) => {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (show && orderId) {
      fetchOrderDetails()
    }
  }, [show, orderId])

  const fetchOrderDetails = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await orderService.getOrderById(orderId)
      setOrder(response.data)
      setSelectedStatus(response.data.status)
    } catch (err) {
      setError('Failed to load order details')
      console.error('Error fetching order details:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === order.status) return

    setUpdating(true)
    setError('')
    setSuccess('')

    try {
      await orderService.updateOrderStatus(orderId, selectedStatus, notes)
      setSuccess('Order status updated successfully')
      setOrder(prev => ({ ...prev, status: selectedStatus }))
      onOrderUpdate && onOrderUpdate()
      
      // Clear notes after successful update
      setNotes('')
    } catch (err) {
      setError('Failed to update order status')
      console.error('Error updating order status:', err)
    } finally {
      setUpdating(false)
    }
  }

  const handleQuickAction = async (action) => {
    setUpdating(true)
    setError('')
    setSuccess('')

    try {
      switch (action) {
        case 'process':
          await orderService.updateOrderStatus(orderId, 'processing')
          setOrder(prev => ({ ...prev, status: 'processing' }))
          setSuccess('Order is now being processed')
          break
        case 'ship':
          await orderService.updateShippingInfo(orderId, { 
            shippedDate: new Date().toISOString() 
          })
          await orderService.updateOrderStatus(orderId, 'shipped')
          setOrder(prev => ({ ...prev, status: 'shipped' }))
          setSuccess('Order has been shipped')
          break
        case 'contact':
          // This would typically open an email client or messaging system
          setSuccess('Customer contact initiated')
          break
        default:
          break
      }
      onOrderUpdate && onOrderUpdate()
    } catch (err) {
      setError(`Failed to ${action} order`)
      console.error(`Error ${action}ing order:`, err)
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status) => {
    const statusMap = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'primary',
      shipped: 'info',
      delivered: 'success',
      cancelled: 'danger',
      refunded: 'secondary'
    }
    return statusMap[status] || 'secondary'
  }

  const getPaymentStatusColor = (status) => {
    const statusMap = {
      pending: 'warning',
      paid: 'success',
      failed: 'danger',
      refunded: 'secondary',
      partial: 'info'
    }
    return statusMap[status] || 'secondary'
  }

  const getTimelineIcon = (status, isCompleted) => {
    if (isCompleted) {
      return <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
    }
    
    const iconMap = {
      pending: faClock,
      confirmed: faCheck,
      processing: faExclamationTriangle,
      shipped: faTruck,
      delivered: faCheckCircle
    }
    
    return <FontAwesomeIcon icon={iconMap[status] || faClock} className="text-muted" />
  }

  if (!order) return null

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Order Details - {order.orderNumber}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
        
        <Row>
          {/* Left Column - Order Items & Timeline */}
          <Col lg={8}>
            {/* Order Items */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Order Items</h5>
              </Card.Header>
              <Card.Body>
                {order.items.map((item) => (
                  <div key={item.id} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                    {item.productImage ? (
                      <img 
                        src={item.productImage} 
                        alt={item.productName}
                        className="rounded me-3"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div 
                        className="d-flex align-items-center justify-content-center border rounded me-3"
                        style={{ 
                          width: '60px', 
                          height: '60px', 
                          backgroundColor: '#f8f9fa'
                        }}
                      >
                        <FontAwesomeIcon icon={faImage} className="text-muted" />
                      </div>
                    )}
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{item.productName}</h6>
                      <p className="text-muted mb-1">{item.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">Qty: {item.quantity}</span>
                        <div className="text-end">
                          <div className="text-muted small">{formatCurrency(item.unitPrice)} each</div>
                          <div className="fw-bold">{formatCurrency(item.totalPrice)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>

            {/* Order Timeline */}
            <Card>
              <Card.Header>
                <h5 className="mb-0">Order Timeline</h5>
              </Card.Header>
              <Card.Body>
                {order.timeline.map((step, index) => (
                  <div key={step.id} className="d-flex align-items-start mb-3">
                    <div className="me-3 mt-1">
                      {getTimelineIcon(step.status, step.isCompleted)}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{step.title}</h6>
                          <p className="text-muted mb-1">{step.description}</p>
                        </div>
                        <div className="text-end">
                          {step.date ? (
                            <div className="text-muted small">
                              {formatDate(step.date, 'MMM dd, yyyy')}
                              <br />
                              {formatDate(step.date, 'h:mm a')}
                            </div>
                          ) : step.expectedDate ? (
                            <div className="text-muted small">
                              Expected: {step.expectedDate}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column - Customer Info, Summary & Actions */}
          <Col lg={4}>
            {/* Customer Information */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Customer Information</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  {order.customer.avatar ? (
                    <img 
                      src={order.customer.avatar} 
                      alt={order.customer.firstName}
                      className="rounded-circle me-3"
                      style={{ width: '50px', height: '50px' }}
                    />
                  ) : (
                    <div 
                      className="d-flex align-items-center justify-content-center border rounded-circle me-3"
                      style={{ 
                        width: '50px', 
                        height: '50px', 
                        backgroundColor: '#f8f9fa'
                      }}
                    >
                      <FontAwesomeIcon icon={faUser} className="text-muted" />
                    </div>
                  )}
                  <div>
                    <h6 className="mb-0">{order.customer.firstName} {order.customer.lastName}</h6>
                    <p className="text-muted mb-0">{order.customer.email}</p>
                  </div>
                </div>
                <div className="mb-2">
                  <strong>Phone:</strong> {order.customer.phone}
                </div>
                <div>
                  <strong>Shipping Address:</strong>
                  <div className="text-muted">
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country}
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Order Summary */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>{formatCurrency(order.shipping)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>GST:</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <strong>Total:</strong>
                  <strong>{formatCurrency(order.total)}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-success">Your Commission (10%):</span>
                  <span className="text-success fw-bold">{formatCurrency(order.commission)}</span>
                </div>
              </Card.Body>
            </Card>

            {/* Quick Actions */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={() => handleQuickAction('process')}
                    disabled={updating || order.status === 'processing'}
                  >
                    <FontAwesomeIcon icon={faCheck} className="me-2" />
                    Process Order
                  </Button>
                  <Button 
                    variant="info" 
                    size="sm"
                    onClick={() => handleQuickAction('ship')}
                    disabled={updating || order.status === 'shipped'}
                  >
                    <FontAwesomeIcon icon={faTruck} className="me-2" />
                    Update Shipping
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleQuickAction('contact')}
                    disabled={updating}
                  >
                    <FontAwesomeIcon icon={faComment} className="me-2" />
                    Contact Customer
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Status Update */}
            <Card>
              <Card.Header>
                <h5 className="mb-0">Update Status</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Order Status</Form.Label>
                  <Form.Select 
                    value={selectedStatus} 
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    disabled={updating}
                  >
                    {orderService.getOrderStatusOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Notes (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this status change..."
                    disabled={updating}
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button 
                    variant="success"
                    onClick={handleStatusUpdate}
                    disabled={updating || selectedStatus === order.status}
                  >
                    {updating ? 'Updating...' : 'Update Status'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
      
      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <div>
            <Badge bg={getStatusColor(order.status)} className="me-2">
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
            <Badge bg={getPaymentStatusColor(order.paymentStatus)}>
              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            </Badge>
          </div>
          <div>
            <Button variant="outline-secondary" className="me-2">
              <FontAwesomeIcon icon={faPrint} className="me-2" />
              Print
            </Button>
            <Button variant="outline-primary" className="me-2">
              <FontAwesomeIcon icon={faEnvelope} className="me-2" />
              Email
            </Button>
            <Button variant="secondary" onClick={onHide}>
              Close
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default OrderDetailsModal
