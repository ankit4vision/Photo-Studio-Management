import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Card, Button, Form, Alert, Badge, FormControl, FormSelect } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faShoppingCart, 
  faBell, 
  faDownload, 
  faSearch, 
  faRefresh,
  faEye,
  faCheck,
  faEdit,
  faPlus,
  faSave,
  faFilter,
  faRupeeSign
} from '@fortawesome/free-solid-svg-icons'
import orderService from '../../services/orderService'
import { Table, FormModal, useToast } from '../../components'
import OrderForm from '../../components/pages/orders/OrderForm'
import OrderDetailsModal from '../../components/pages/orders/OrderDetailsModal'
import { formatCurrency, formatDate } from '../../utils'

const OrdersList = () => {
  const { success, error: showError } = useToast()
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  
  // Add/Edit Modal States
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [orderToEdit, setOrderToEdit] = useState(null)
  const [addLoading, setAddLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  
  // Refs for form components
  const addFormRef = useRef()
  const editFormRef = useRef()
  
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
          success('Order status updated to processing')
          break
        case 'complete':
          await orderService.updateOrderStatus(orderId, 'completed')
          success('Order status updated to completed')
          break
        default:
          break
      }
      handleOrderUpdate()
    } catch (err) {
      console.error('Error performing quick action:', err)
      showError('Failed to update order status')
    }
  }

  // Add Order Handlers
  const handleAddOrder = () => {
    setShowAddModal(true)
  }

  const handleAddOrderSubmit = () => {
    if (addFormRef.current) {
      addFormRef.current.handleSubmit()
    }
  }

  const handleAddOrderFormSubmit = async (formData) => {
    try {
      setAddLoading(true)
      const response = await orderService.createOrder(formData)
      if (response.success) {
        success('Order created successfully')
        setShowAddModal(false)
        fetchOrders()
        fetchStats()
      } else {
        showError(response.message || 'Failed to create order')
      }
    } catch (err) {
      console.error('Error creating order:', err)
      showError('An error occurred while creating order')
    } finally {
      setAddLoading(false)
    }
  }

  // Normalize order data for form
  const normalizeOrderData = (order) => {
    if (!order) return null

    const orderDate = order.order_date || order.orderDate || new Date().toISOString()
    const dueDate = order.due_date || order.dueDate || null
    const flatDiscount = order.flat_discount !== undefined ? order.flat_discount : (order.discount || 0)
    const customerId = order.customer_id || order.customerId || order.customer?.id || ''
    const branchId = order.branch_id || order.branchId || ''

    const normalizedItems = (order.items || []).map((item, index) => {
      const quantity = item.qty || item.quantity || 1
      const price = item.price !== undefined
        ? item.price
        : item.unitPrice !== undefined
          ? item.unitPrice
          : item.amount !== undefined && quantity
            ? item.amount / quantity
            : item.totalPrice !== undefined && quantity
              ? item.totalPrice / quantity
              : 0

      const amount = item.amount !== undefined
        ? item.amount
        : item.totalPrice !== undefined
          ? item.totalPrice
          : price * quantity

      return {
        id: item.id || index + 1,
        package_id: (item.package_id || item.packageId || item.productId || item.id || index + 1).toString(),
        package_name: item.package_name || item.packageName || item.productName || item.title || `Package ${index + 1}`,
        package_type: item.package_type || item.packageType || '',
        price,
        qty: quantity,
        amount
      }
    })

    return {
      ...order,
      customer_id: customerId,
      branch_id: branchId?.toString() || '',
      order_date: orderDate,
      due_date: dueDate,
      flat_discount: flatDiscount,
      items: normalizedItems
    }
  }

  // Edit Order Handlers
  const handleEditOrder = (order) => {
    const normalized = normalizeOrderData(order)
    setOrderToEdit(normalized)
    setShowEditModal(true)
  }

  const handleEditOrderSubmit = () => {
    if (editFormRef.current) {
      editFormRef.current.handleSubmit()
    }
  }

  const handleEditOrderFormSubmit = async (formData) => {
    try {
      setEditLoading(true)
      const response = await orderService.updateOrder(orderToEdit.id, formData)
      if (response.success) {
        success('Order updated successfully')
        setShowEditModal(false)
        setOrderToEdit(null)
        fetchOrders()
        fetchStats()
      } else {
        showError(response.message || 'Failed to update order')
      }
    } catch (err) {
      console.error('Error updating order:', err)
      showError('An error occurred while updating order')
    } finally {
      setEditLoading(false)
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
      label: 'Order ID',
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
      label: 'Customer',
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
      label: 'Packages',
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
      label: 'Dates',
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
      label: 'Amounts',
      render: (value, order) => {
        if (!order) return <div>No amount data</div>
        const totalAmount = order.total_amount || order.total || 0
        const paidAmount = order.paid_amount || order.paid || 0
        const balanceAmount = order.balance_amount || (totalAmount - paidAmount)
        
        return (
          <div>
            <div className="fw-bold">Total: {formatCurrency(totalAmount)}</div>
            <div className="text-primary small">Paid: {formatCurrency(paidAmount)}</div>
            <div className={`small ${balanceAmount > 0 ? 'text-danger' : 'text-success'}`}>
              Balance: {formatCurrency(balanceAmount)}
            </div>
          </div>
        )
      }
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
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
      label: 'Status',
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
      label: 'Order Date',
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
      label: 'Actions',
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
              variant="outline-primary"
              size="sm"
              onClick={() => handleEditOrder(order)}
              title="Edit Order"
            >
              <FontAwesomeIcon icon={faEdit} />
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
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faShoppingCart} className="me-3 text-primary fs-4" />
            <h2 className="mb-0 text-dark">Order Management</h2>
            </div>
            <div className="ms-auto d-flex align-items-center gap-3">
              <Button variant="primary" onClick={handleAddOrder} className="text-white">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Create Order
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="bg-gradient-primary text-white border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">{stats.totalOrders || orders.length || 0}</h4>
                      <p className="mb-0 opacity-75">Total Orders</p>
                    </div>
                    <FontAwesomeIcon icon={faShoppingCart} className="fs-1 opacity-50" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-gradient-warning text-white border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">{stats.pendingOrders || 0}</h4>
                      <p className="mb-0 opacity-75">Pending Orders</p>
                    </div>
                    <FontAwesomeIcon icon={faBell} className="fs-1 opacity-50" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-gradient-info text-white border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">{stats.processingOrders || 0}</h4>
                      <p className="mb-0 opacity-75">Processing</p>
                    </div>
                    <FontAwesomeIcon icon={faCheck} className="fs-1 opacity-50" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="bg-gradient-success text-white border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">
                        <FontAwesomeIcon icon={faRupeeSign} className="me-1" style={{ fontSize: '0.8em' }} />
                        {stats.totalRevenue ? (stats.totalRevenue / 1000).toFixed(1) + 'K' : '0'}
                      </h4>
                      <p className="mb-0 opacity-75">Total Revenue</p>
                    </div>
                    <FontAwesomeIcon icon={faRupeeSign} className="fs-1 opacity-50" />
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
                <Col md={3}>
                  <div className="position-relative">
                    <FontAwesomeIcon 
                      icon={faSearch} 
                      className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                      style={{ zIndex: 10 }}
                    />
                    <FormControl
                      placeholder="Search by Order ID..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="border-2 ps-5"
                    />
                  </div>
                </Col>
                <Col md={2}>
                  <div className="position-relative">
                    <FontAwesomeIcon 
                      icon={faFilter} 
                      className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                      style={{ zIndex: 10 }}
                    />
                    <FormSelect
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="border-2 ps-5"
                    >
                      <option value="all">All Status</option>
                      {orderService.getOrderStatusOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </FormSelect>
                  </div>
                </Col>
                <Col md={2}>
                  <div className="position-relative">
                    <FontAwesomeIcon 
                      icon={faFilter} 
                      className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                      style={{ zIndex: 10 }}
                    />
                    <FormSelect
                      value={filters.paymentStatus}
                      onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                      className="border-2 ps-5"
                    >
                      <option value="all">All Payments</option>
                      {orderService.getPaymentStatusOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </FormSelect>
                  </div>
                </Col>
                <Col md={2}>
                  <div className="position-relative">
                    <FontAwesomeIcon 
                      icon={faFilter} 
                      className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                      style={{ zIndex: 10 }}
                    />
                    <FormSelect
                      value={filters.dateRange}
                      onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                      className="border-2 ps-5"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                    </FormSelect>
                  </div>
                </Col>
                <Col md={3}>
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleReset}
                    className="w-100"
                  >
                    <FontAwesomeIcon icon={faRefresh} className="me-2" />
                    Reset
                  </Button>
                </Col>
              </Row>
            </div>

            {/* Orders Table */}
            <div className="mb-4">
              {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
              
            {/* Section Header */}
            <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-primary border-2">
                <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faShoppingCart} className="me-3 text-primary fs-4" />
                <h4 className="mb-0 text-primary">Orders List</h4>
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
        onHide={() => {
          setShowDetailsModal(false)
          setSelectedOrder(null)
        }}
        orderId={selectedOrder?.id}
        onOrderUpdate={handleOrderUpdate}
        onEdit={handleEditOrder}
      />

      {/* Add Order Modal */}
      <FormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create New Order"
        onSubmit={handleAddOrderSubmit}
        submitText="Create Order"
        submitIcon={faPlus}
        loading={addLoading}
        loadingText="Creating..."
        size="xl"
      >
        <OrderForm
          ref={addFormRef}
          mode="create"
          onSubmit={handleAddOrderFormSubmit}
          onCancel={() => setShowAddModal(false)}
        />
      </FormModal>

      {/* Edit Order Modal */}
      <FormModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setOrderToEdit(null)
        }}
        title="Edit Order"
        onSubmit={handleEditOrderSubmit}
        submitText="Update Order"
        submitIcon={faSave}
        loading={editLoading}
        loadingText="Updating..."
        size="xl"
      >
        <OrderForm
          ref={editFormRef}
          mode="edit"
          orderData={orderToEdit}
          onSubmit={handleEditOrderFormSubmit}
          onCancel={() => {
            setShowEditModal(false)
            setOrderToEdit(null)
          }}
        />
      </FormModal>
    </Container>
  )
}

export default OrdersList
