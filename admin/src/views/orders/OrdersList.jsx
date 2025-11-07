import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, Alert, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faShoppingCart, 
  faBell, 
  faDownload, 
  faSearch, 
  faSync,
  faEye,
  faCheck,
  faEdit,
  faFilePdf,
  faImage,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import orderService from '../../services/orderService'
import Table from '../../components/common/Table'
import OrderDetailsModal from '../../components/pages/orders/OrderDetailsModal'
import { formatCurrency, formatDate } from '../../utils'
import { useNavigate } from 'react-router-dom'
import { exportOrderToPDF } from '../../utils/pdfExport'

const OrdersList = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    customer: '',
    status: 'all',
    dateRange: 'all',
    paymentStatus: 'all'
  })

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0
  })

  useEffect(() => {
    fetchOrders()
    fetchStats()
  }, [pagination.currentPage, filters])

  const fetchOrders = async () => {
    setLoading(true)
    setError('')
    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.pageSize,
        ...filters
      }
      
      const response = await orderService.getOrders(params)
      setOrders(response.data.orders || [])
      setPagination(prev => ({
        ...prev,
        totalItems: response.data.total || 0
      }))
    } catch (err) {
      setError('Failed to load orders')
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await orderService.getOrderStats()
      setStats(response.data || {})
    } catch (err) {
      console.error('Error fetching order stats:', err)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }))
  }

  const handleSearch = () => {
    fetchOrders()
  }

  const handleReset = () => {
    setFilters({
      search: '',
      customer: '',
      status: 'all',
      dateRange: 'all',
      paymentStatus: 'all'
    })
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }))
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }))
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
  }

  const handleOrderUpdate = () => {
    fetchOrders()
    fetchStats()
  }

  const handleQuickAction = async (orderId, action) => {
    try {
      switch (action) {
        case 'process':
          await orderService.updateOrderStatus(orderId, 'processing')
          break
        case 'complete':
          await orderService.updateOrderStatus(orderId, 'completed')
          break
        case 'export-pdf':
          // Handle PDF export
          const order = orders.find(o => (o.id === orderId || o.id?.toString() === orderId?.toString()))
          if (order) {
            exportOrderToPDF(order)
          }
          return // Don't refresh orders list for PDF export
        default:
          break
      }
      handleOrderUpdate()
    } catch (err) {
      console.error('Error performing quick action:', err)
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
      failed: 'danger',
      refunded: 'secondary',
      partial: 'info'
    }
    return statusMap[status] || 'secondary'
  }

  const tableColumns = [
    {
      key: 'orderNumber',
      header: 'Order ID',
      render: (value, order) => {
        if (!order) return <div>No order data</div>
        const orderId = order.id || order.orderNumber || 'N/A'
        return (
          <div>
            <div className="fw-bold">#{orderId}</div>
            <small className="text-muted">{formatDate(order.order_date || order.orderDate)}</small>
          </div>
        )
      }
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (value, order) => {
        if (!order) return <div>No customer data</div>
        const customerName = order.customer_name || 
          (order.customer ? (order.customer.name || `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim()) : 'Unknown')
        return (
          <div>
            <div className="fw-bold">{customerName}</div>
            <small className="text-muted">{order.customer?.mobile || order.customer?.phone || order.customer?.email || 'N/A'}</small>
          </div>
        )
      }
    },
    {
      key: 'packages',
      header: 'Packages',
      render: (value, order) => {
        if (!order) return <div>No items data</div>
        const items = order.items || []
        if (items.length === 0) return <Badge bg="secondary">No items</Badge>
        
        return (
          <div>
            <div className="fw-bold">{items.length} Package{items.length > 1 ? 's' : ''}</div>
            <small className="text-muted">
              {items.slice(0, 2).map(item => item.package_name || 'Package').join(', ')}
              {items.length > 2 && ` +${items.length - 2} more`}
            </small>
          </div>
        )
      }
    },
    {
      key: 'dates',
      header: 'Dates',
      render: (value, order) => {
        if (!order) return <div>N/A</div>
        return (
          <div>
            <div className="fw-semibold text-dark">Order: {formatDate(order.order_date || order.orderDate)}</div>
            {order.due_date && (
              <small className={`${new Date(order.due_date) < new Date() ? 'text-danger' : 'text-muted'}`}>
                Due: {formatDate(order.due_date)}
              </small>
            )}
          </div>
        )
      }
    },
    {
      key: 'amounts',
      header: 'Amounts',
      render: (value, order) => {
        if (!order) return <div>No amount data</div>
        const totalAmount = order.total_amount || order.total || 0
        const paidAmount = order.paid_amount || order.paid || 0
        const balanceAmount = order.balance_amount || (totalAmount - paidAmount)
        
        return (
          <div>
            <div className="fw-bold">Total: {formatCurrency(totalAmount)}</div>
            <div className="text-success small">Paid: {formatCurrency(paidAmount)}</div>
            <div className={`small ${balanceAmount > 0 ? 'text-danger' : 'text-success'}`}>
              Balance: {formatCurrency(balanceAmount)}
            </div>
          </div>
        )
      }
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      render: (value, order) => {
        if (!order) return <div>No payment data</div>
        return (
          <Badge bg={getPaymentStatusColor(order.paymentStatus || 'pending')}>
            {(order.paymentStatus || 'pending').charAt(0).toUpperCase() + (order.paymentStatus || 'pending').slice(1)}
          </Badge>
        )
      }
    },
    {
      key: 'status',
      header: 'Status',
      render: (value, order) => {
        if (!order) return <div>No status data</div>
        return (
          <Badge bg={getStatusColor(order.status || 'pending')}>
            {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
          </Badge>
        )
      }
    },
    {
      key: 'orderDate',
      header: 'Order Date',
      render: (value, order) => {
        if (!order) return <div>No date data</div>
        return (
          <div>
            <div>{formatDate(order.orderDate || new Date(), 'MMM dd, yyyy')}</div>
            <small className="text-muted">{formatDate(order.orderDate || new Date(), 'h:mm a')}</small>
          </div>
        )
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value, order) => {
        if (!order) return <div>No actions available</div>
        
        return (
          <div className="d-flex gap-1">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleViewDetails(order)}
              title="View Details"
            >
              <FontAwesomeIcon icon={faEye} />
            </Button>
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => navigate(`/orders/edit/${order.id}`)}
              title="Edit Order"
            >
              <FontAwesomeIcon icon={faEdit} />
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleQuickAction(order.id, 'export-pdf')}
              title="Export PDF"
              className="text-danger"
            >
              <FontAwesomeIcon icon={faFilePdf} />
            </Button>
          </div>
        )
      }
    }
  ]

  const sortableColumns = ['orderNumber', 'orderDate', 'total', 'status']

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          {/* Page Header */}
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <FontAwesomeIcon icon={faShoppingCart} className="me-3 text-success fs-4" />
            <h2 className="mb-0 text-dark">Order Management</h2>
            <div className="ms-auto d-flex align-items-center gap-2">
              <Button variant="success" onClick={() => navigate('/orders/create')}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Create Order
              </Button>
              <div className="position-relative me-3">
                <FontAwesomeIcon icon={faBell} className="text-muted fs-5" />
                <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle rounded-pill" style={{ fontSize: '0.6rem' }}>
                  3
                </Badge>
              </div>
              <Button variant="primary">
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                Export Orders
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="bg-gradient-success text-white">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">{stats.totalOrders || 234}</h4>
                      <p className="mb-0">Total Orders</p>
                    </div>
                    <FontAwesomeIcon icon={faShoppingCart} className="fs-1 opacity-75" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-gradient-warning text-white">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">{stats.pendingOrders || 12}</h4>
                      <p className="mb-0">Pending Orders</p>
                    </div>
                    <FontAwesomeIcon icon={faBell} className="fs-1 opacity-75" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-gradient-info text-white">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">{stats.processingOrders || 8}</h4>
                      <p className="mb-0">Processing</p>
                    </div>
                    <FontAwesomeIcon icon={faCheck} className="fs-1 opacity-75" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-gradient-primary text-white">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">{formatCurrency(stats.totalRevenue || 12456)}</h4>
                      <p className="mb-0">Total Revenue</p>
                    </div>
                    <FontAwesomeIcon icon={faDownload} className="fs-1 opacity-75" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Main Content Container */}
          <div className="bg-white rounded-3 shadow-sm p-4">
            {/* Search and Filter Section */}
            <div className="mb-4">
              <Row className="g-3">
                <Col md={2}>
                  <div className="mb-3">
                    <Form.Label className="fw-semibold">Order ID</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Search by ID"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="border-2"
                    />
                  </div>
                </Col>
                <Col md={2}>
                  <div className="mb-3">
                    <Form.Label className="fw-semibold">Customer</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Customer name"
                      value={filters.customer}
                      onChange={(e) => handleFilterChange('customer', e.target.value)}
                      className="border-2"
                    />
                  </div>
                </Col>
                <Col md={2}>
                  <div className="mb-3">
                    <Form.Label className="fw-semibold">Status</Form.Label>
                    <Form.Select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="border-2"
                    >
                      <option value="all">All Status</option>
                      {orderService.getOrderStatusOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>
                <Col md={2}>
                  <div className="mb-3">
                    <Form.Label className="fw-semibold">Date Range</Form.Label>
                    <Form.Select
                      value={filters.dateRange}
                      onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                      className="border-2"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                    </Form.Select>
                  </div>
                </Col>
                <Col md={2}>
                  <div className="mb-3">
                    <Form.Label className="fw-semibold">Payment Status</Form.Label>
                    <Form.Select
                      value={filters.paymentStatus}
                      onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                      className="border-2"
                    >
                      <option value="all">All Payments</option>
                      {orderService.getPaymentStatusOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>
                <Col md={2}>
                  <div className="mb-3">
                    <Form.Label className="fw-semibold">&nbsp;</Form.Label>
                    <div className="d-flex gap-2">
                      <Button variant="success" onClick={handleSearch} className="text-white">
                        <FontAwesomeIcon icon={faSearch} className="me-2" />
                        Search
                      </Button>
                      <Button variant="outline-secondary" onClick={handleReset}>
                        <FontAwesomeIcon icon={faSync} className="me-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Orders Table */}
            <div className="mb-4">
              {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
              
              <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-success border-2">
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faShoppingCart} className="me-3 text-success fs-4" />
                  <h4 className="mb-0 text-success">Orders List</h4>
                </div>
                <div className="text-muted">
                  Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1}-{Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems} orders
                </div>
              </div>

              <Table
                columns={tableColumns}
                data={orders || []}
                loading={loading}
                sortableColumns={sortableColumns}
                currentPage={pagination.currentPage}
                pageSize={pagination.pageSize}
                totalItems={pagination.totalItems}
                onPageChange={handlePageChange}
                emptyMessage="No orders found"
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* Order Details Modal */}
      <OrderDetailsModal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        orderId={selectedOrder?.id}
        onOrderUpdate={handleOrderUpdate}
      />
    </Container>
  )
}

export default OrdersList
