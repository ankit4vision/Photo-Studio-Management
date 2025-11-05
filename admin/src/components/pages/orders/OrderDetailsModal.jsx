import React, { useState, useEffect } from 'react'
import { Modal, Row, Col, Card, Badge, Button, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTimes, 
  faCheck, 
  faComment, 
  faPrint,
  faEnvelope,
  faClock,
  faCheckCircle,
  faExclamationTriangle,
  faImage,
  faUser,
  faCreditCard,
  faTag
} from '@fortawesome/free-solid-svg-icons'
import orderService from '../../../services/orderService'
import paymentService from '../../../services/paymentService'
import { formatCurrency, formatDate } from '../../../utils'

const OrderDetailsModal = ({ show, onHide, orderId, onOrderUpdate }) => {
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (show && orderId) {
      fetchOrderDetails()
      fetchOrderPayments()
    }
  }, [show, orderId])

  const fetchOrderDetails = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await orderService.getOrderById(orderId)
      if (response.success) {
        setOrder(response.data)
      }
    } catch (err) {
      setError('Failed to load order details')
      console.error('Error fetching order details:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderPayments = async () => {
    try {
      const response = await paymentService.getPaymentsByOrder(orderId)
      if (response.success) {
        setPayments(response.data || [])
      }
    } catch (err) {
      console.error('Error fetching payments:', err)
    }
  }

  const getStatusColor = (status) => {
    const statusMap = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'primary',
      completed: 'success',
      cancelled: 'danger'
    }
    return statusMap[status] || 'secondary'
  }

  const getPaymentStatusColor = (status) => {
    const statusMap = {
      pending: 'warning',
      paid: 'success',
      partial: 'info',
      failed: 'danger',
      refunded: 'secondary'
    }
    return statusMap[status] || 'secondary'
  }

  if (!order && !loading) return null

  const totalAmount = order?.total_amount || order?.total || 0
  const paidAmount = order?.paid_amount || order?.paid || 0
  const balanceAmount = order?.balance_amount || (totalAmount - paidAmount)
  const flatDiscount = order?.flat_discount || 0
  const items = order?.items || []

  // Calculate subtotal from items
  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.amount || item.price * item.qty) || 0), 0)

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Order Details - #{order?.id || orderId}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        {loading ? (
          <div className="text-center p-4">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Row>
            {/* Left Column - Order Items & Summary */}
            <Col lg={8}>
              {/* Order Items */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Order Packages</h5>
                </Card.Header>
                <Card.Body>
                  {items.length === 0 ? (
                    <div className="text-center text-muted py-3">No packages in this order</div>
                  ) : (
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Package</th>
                          <th>Type</th>
                          <th>Price</th>
                          <th>Qty</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={item.id || index}>
                            <td>
                              <div className="d-flex align-items-center">
                                <FontAwesomeIcon icon={faTag} className="me-2 text-success" />
                                <div>
                                  <div className="fw-bold">{item.package_name || 'Package'}</div>
                                  {item.package_type && (
                                    <small className="text-muted">{item.package_type}</small>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>{item.package_type || '-'}</td>
                            <td>{formatCurrency(item.price || item.unitPrice || 0)}</td>
                            <td>{item.qty || item.quantity || 1}</td>
                            <td className="fw-semibold">{formatCurrency(item.amount || (item.price * item.qty) || 0)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>

              {/* Payment History */}
              {payments.length > 0 && (
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Payment History</h5>
                  </Card.Header>
                  <Card.Body>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Method</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment, index) => (
                          <tr key={payment.id || index}>
                            <td>{formatDate(payment.payment_date)}</td>
                            <td className="fw-semibold text-success">{formatCurrency(payment.amount)}</td>
                            <td>
                              <Badge bg="info">{payment.payment_method || 'Cash'}</Badge>
                            </td>
                            <td>
                              <Badge bg={getPaymentStatusColor(payment.status || 'paid')}>
                                {payment.status || 'Paid'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}
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
                    <div>
                      <h6 className="mb-0">
                        {order?.customer_name || 
                         (order?.customer ? (order.customer.name || `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim()) : 'Unknown')}
                      </h6>
                      <p className="text-muted mb-0 small">
                        {order?.customer?.mobile || order?.customer?.phone || order?.customer?.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                  {order?.branch_name && (
                    <div className="mb-2">
                      <strong>Branch:</strong> {order.branch_name} ({order.branch_code || ''})
                    </div>
                  )}
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
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {flatDiscount > 0 && (
                    <div className="d-flex justify-content-between mb-2 text-danger">
                      <span>Flat Discount:</span>
                      <span>-{formatCurrency(flatDiscount)}</span>
                    </div>
                  )}
                  <hr />
                  <div className="d-flex justify-content-between mb-2">
                    <strong>Total Amount:</strong>
                    <strong>{formatCurrency(totalAmount)}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-success">Paid Amount:</span>
                    <span className="text-success fw-bold">{formatCurrency(paidAmount)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className={balanceAmount > 0 ? 'text-danger' : 'text-success'}>Balance Amount:</span>
                    <span className={`fw-bold ${balanceAmount > 0 ? 'text-danger' : 'text-success'}`}>
                      {formatCurrency(balanceAmount)}
                    </span>
                  </div>
                </Card.Body>
              </Card>

              {/* Order Dates */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Order Dates</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-2">
                    <div className="text-muted small">Order Date</div>
                    <div className="fw-semibold">{formatDate(order?.order_date || order?.orderDate)}</div>
                  </div>
                  {order?.due_date && (
                    <div>
                      <div className="text-muted small">Due Date</div>
                      <div className={`fw-semibold ${new Date(order.due_date) < new Date() ? 'text-danger' : ''}`}>
                        {formatDate(order.due_date)}
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Quick Actions */}
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    {balanceAmount > 0 && (
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => {
                          onHide()
                          navigate(`/payments/create?order_id=${orderId}`)
                        }}
                      >
                        <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                        Record Payment
                      </Button>
                    )}
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => {
                        onHide()
                        navigate(`/orders/edit/${orderId}`)
                      }}
                    >
                      <FontAwesomeIcon icon={faCheck} className="me-2" />
                      Edit Order
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              {/* Status */}
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Order Status</h5>
                </Card.Header>
                <Card.Body>
                  <Badge bg={getStatusColor(order?.status)} className="px-3 py-2 fs-6">
                    {order?.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                  </Badge>
                  {balanceAmount === 0 && (
                    <Badge bg="success" className="ms-2 px-3 py-2 fs-6">
                      Fully Paid
                    </Badge>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <div>
            <Badge bg={getStatusColor(order?.status)} className="me-2">
              {order?.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
            </Badge>
            {balanceAmount === 0 ? (
              <Badge bg="success">Fully Paid</Badge>
            ) : (
              <Badge bg="warning">Balance: {formatCurrency(balanceAmount)}</Badge>
            )}
          </div>
          <div>
            <Button variant="outline-secondary" className="me-2">
              <FontAwesomeIcon icon={faPrint} className="me-2" />
              Print
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
