import React, { useState, useEffect } from 'react'
import { Modal, Row, Col, Card, Badge, Button, Spinner, Tab, Tabs } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faShoppingCart,
  faUser,
  faCreditCard,
  faTag,
  faCalendarAlt,
  faBuilding,
  faFileInvoiceDollar,
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
  faList,
  faHistory,
  faDownload,
  faEdit
} from '@fortawesome/free-solid-svg-icons'
import orderService from '../../../services/orderService'
import { formatCurrency, formatDate } from '../../../utils'
import { useToast } from '../../common/ToastProvider'

const OrderDetailsModal = ({ show, onHide, orderId, onOrderUpdate, onEdit, orderSnapshot }) => {
  const { success, error: showError } = useToast()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  const [exportingPdf, setExportingPdf] = useState(false)

  const getSanitizedOrderId = (value) => {
    if (!value) return null
    return value.toString().replace(/^#/, '').trim()
  }

  const sanitizedOrderId = getSanitizedOrderId(orderId)

  useEffect(() => {
    if (orderSnapshot) {
      setOrder(orderSnapshot)
    }
  }, [orderSnapshot])

  useEffect(() => {
    if (show && sanitizedOrderId) {
      fetchOrderDetails()
    }
  }, [show, sanitizedOrderId])

  const fetchOrderDetails = async () => {
    setLoading(true)
    try {
      const response = await orderService.getOrderById(sanitizedOrderId)
      if (response.success) {
        setOrder(response.data)
      } else {
        showError('Failed to load order details')
      }
    } catch (err) {
      showError('Failed to load order details')
      console.error('Error fetching order details:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      setExportingPdf(true)
      // TODO: Call API endpoint for PDF export
      // const response = await orderService.exportOrderPDF(orderId)
      // if (response.success) {
      //   // Handle PDF download
      //   success('PDF export initiated')
      // }
      showError('PDF export will be available via API soon')
    } catch (err) {
      console.error('Error exporting PDF:', err)
      showError('Failed to export PDF')
    } finally {
      setExportingPdf(false)
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
    return statusMap[status?.toLowerCase()] || 'secondary'
  }

  const getPaymentStatusColor = (status) => {
    const statusMap = {
      pending: 'warning',
      paid: 'success',
      partial: 'info',
      failed: 'danger',
      refunded: 'secondary'
    }
    return statusMap[status?.toLowerCase()] || 'secondary'
  }

  if (!order && !loading) return null

  const totalAmount = order?.totalAmount || 0
  const paidAmount = order?.paidAmount || 0
  const balanceAmount = order?.remainingAmount || 0
  const discount = order?.discount || 0
  const items = order?.items || []
  const payments = order?.payments || []
  const customerName = order?.customer 
    ? (order.customer.name || `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim() || 'Unknown')
    : 'Unknown'

  // Calculate subtotal from items
  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.totalPrice || 0) || 0), 0)


  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton className="border-bottom border-primary border-2">
        <Modal.Title className="text-primary">
          <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
          Order Details - #{order?.orderNumber || order?.id || orderId}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-0">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-3">Loading order details...</p>
          </div>
        ) : (
          <>
            {/* Order Header Summary */}
            <div className="bg-gradient-primary-subtle p-4 border-bottom">
              <Row className="g-4">
                <Col md={4}>
                  <div className="d-flex align-items-center">
                    <div 
                      className="d-flex align-items-center justify-content-center rounded-circle me-3"
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </div>
                    <div>
                      <h5 className="mb-1">{customerName}</h5>
                      <p className="text-muted mb-0 small">
                        {order?.customer?.mobile || order?.customer?.phone || order?.customer?.email || 'N/A'}
                      </p>
                      {order?.branch?.branchName && (
                        <small className="text-muted">
                          <FontAwesomeIcon icon={faBuilding} className="me-1" />
                          {order.branch.branchName} {order.branch.branchCode && `(${order.branch.branchCode})`}
                        </small>
                      )}
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <div className="text-muted small mb-1">Order Date</div>
                    <div className="fw-semibold">
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-primary" />
                      {formatDate(order?.orderDate)}
                    </div>
                    {order?.dueDate && (
                      <>
                        <div className="text-muted small mb-1 mt-2">Due Date</div>
                        <div className={`fw-semibold ${new Date(order.dueDate) < new Date() ? 'text-danger' : 'text-primary'}`}>
                          {formatDate(order.dueDate)}
                        </div>
                      </>
                    )}
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-end">
                    <div className="text-muted small mb-1">Total Amount</div>
                    <div className="h4 mb-0 fw-bold text-primary">{formatCurrency(totalAmount)}</div>
                    <div className="mt-2">
                      <Badge bg={getStatusColor(order?.status)} className="me-2 px-3 py-2">
                        {order?.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                      </Badge>
                      <Badge bg={getPaymentStatusColor(order?.paymentStatus)} className="px-3 py-2">
                        {order?.paymentStatus ? 
                          order.paymentStatus.charAt(0).toUpperCase() + 
                          order.paymentStatus.slice(1) : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Tabs */}
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="px-4 pt-3 border-bottom"
            >
              <Tab eventKey="details" title={
                <>
                  <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                  Order Details
                </>
              }>
                <div className="p-4">
                  <Row>
                    {/* Left Column - Order Items */}
                    <Col lg={8}>
                      <div className="mb-4">
                        <h5 className="mb-3 pb-2 border-bottom border-primary border-2">
                          <FontAwesomeIcon icon={faList} className="me-2 text-primary" />
                          Order Packages
                        </h5>
                        {items.length === 0 ? (
                          <div className="text-center py-5">
                            <FontAwesomeIcon icon={faTag} className="text-muted mb-3" size="3x" />
                            <p className="text-muted">No packages in this order</p>
                          </div>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-hover">
                              <thead className="table-light">
                                <tr>
                                  <th>Package</th>
                                  <th>Price</th>
                                  <th>Qty</th>
                                  <th className="text-end">Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {items.map((item, index) => (
                                  <tr key={item.id || index}>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <FontAwesomeIcon icon={faTag} className="me-2 text-primary" />
                                        <div>
                                          <div className="fw-semibold">{item.packageName || 'Package'}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td>{formatCurrency(item.unitPrice || 0)}</td>
                                    <td>{item.quantity || 1}</td>
                                    <td className="text-end fw-semibold text-primary">
                                      {formatCurrency(item.totalPrice || 0)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </Col>

                    {/* Right Column - Summary & Info */}
                    <Col lg={4}>
                      {/* Order Summary */}
                      <Card className="mb-4 border-primary border-2">
                        <Card.Header className="bg-gradient-primary-subtle">
                          <h5 className="mb-0 text-primary">
                            <FontAwesomeIcon icon={faFileInvoiceDollar} className="me-2" />
                            Order Summary
                          </h5>
                        </Card.Header>
                        <Card.Body>
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Subtotal:</span>
                            <span className="fw-semibold">{formatCurrency(subtotal)}</span>
                          </div>
                          {discount > 0 && (
                            <div className="d-flex justify-content-between mb-2 text-danger">
                              <span>Discount:</span>
                              <span className="fw-semibold">-{formatCurrency(discount)}</span>
                            </div>
                          )}
                          <hr />
                          <div className="d-flex justify-content-between mb-3">
                            <strong>Total Amount:</strong>
                            <strong className="text-primary fs-5">{formatCurrency(totalAmount)}</strong>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-success">Paid Amount:</span>
                            <span className="text-success fw-bold">{formatCurrency(paidAmount >= 0 ? paidAmount : 0)}</span>
                          </div>
                    <div className="d-flex justify-content-between">
                      <span className={balanceAmount > 0 ? 'text-danger' : 'text-success'}>Remaining Amount:</span>
                      <span className={`fw-bold fs-5 ${balanceAmount > 0 ? 'text-danger' : 'text-success'}`}>
                        {formatCurrency(balanceAmount >= 0 ? balanceAmount : 0)}
                      </span>
                    </div>
                        </Card.Body>
                      </Card>

                      {/* Customer Information */}
                      <Card className="mb-4">
                        <Card.Header>
                          <h5 className="mb-0">
                            <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
                            Customer Information
                          </h5>
                        </Card.Header>
                        <Card.Body>
                          <div className="mb-2">
                            <div className="text-muted small">Name</div>
                            <div className="fw-semibold">{customerName}</div>
                          </div>
                          <div className="mb-2">
                            <div className="text-muted small">Contact</div>
                            <div className="fw-semibold">
                              {order?.customer?.mobile || order?.customer?.phone || order?.customer?.email || 'N/A'}
                            </div>
                          </div>
                          {order?.customer?.email && (
                            <div>
                              <div className="text-muted small">Email</div>
                              <div className="fw-semibold">{order.customer.email}</div>
                            </div>
                          )}
                        </Card.Body>
                      </Card>

                      {/* Payment Status box removed */}
                    </Col>
                  </Row>
                </div>
              </Tab>

              <Tab eventKey="payments" title={
                <>
                  <FontAwesomeIcon icon={faHistory} className="me-2" />
                  Payment History ({payments.length})
                </>
              }>
                <div className="p-4">
                  {payments.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((payment, index) => (
                            <tr key={payment.id || index}>
                              <td>{formatDate(payment.paymentDate || payment.createdAt)}</td>
                              <td>
                                <Badge bg={payment.paymentType === 'debit' ? 'danger' : 'success'}>
                                  {(payment.paymentType || 'credit').toUpperCase()}
                                </Badge>
                              </td>
                              <td className={`fw-semibold ${payment.paymentType === 'debit' ? 'text-danger' : 'text-success'}`}>
                                {formatCurrency(payment.amount || 0)}
                              </td>
                              <td>
                                <Badge bg="info">
                                  {payment.paymentMethod || 'Cash'}
                                </Badge>
                              </td>
                              <td>
                                <small className="text-muted">{payment.remarks || '-'}</small>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <FontAwesomeIcon icon={faCreditCard} className="text-muted mb-3" size="3x" />
                      <p className="text-muted">No payment history found for this order</p>
                    </div>
                  )}
                </div>
              </Tab>
            </Tabs>
          </>
        )}
      </Modal.Body>
      
      <Modal.Footer className="border-top">
        <div className="d-flex justify-content-between w-100 align-items-center">
          <div>
            <Badge bg={getStatusColor(order?.status)} className="me-2 px-3 py-2">
              {order?.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
            </Badge>
            {balanceAmount === 0 ? (
              <Badge bg="success" className="px-3 py-2">Fully Paid</Badge>
            ) : (
              <Badge bg="warning" className="px-3 py-2">
                Remaining Amount: {formatCurrency(balanceAmount >= 0 ? balanceAmount : 0)}
              </Badge>
            )}
          </div>
          <div className="d-flex gap-2">
            {onEdit && (
              <Button 
                variant="outline-primary" 
                onClick={() => {
                  onHide()
                  onEdit(order)
                }}
              >
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Edit Order
              </Button>
            )}
            <Button 
              variant="outline-secondary" 
              onClick={handleExportPDF}
              disabled={exportingPdf}
            >
              {exportingPdf ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faDownload} className="me-2" />
                  Export PDF
                </>
              )}
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
