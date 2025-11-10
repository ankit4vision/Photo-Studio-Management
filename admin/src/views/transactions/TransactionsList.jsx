import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Button, FormControl, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faWallet,
  faRefresh,
  faPlus,
  faEye,
  faEdit,
  faSave
} from '@fortawesome/free-solid-svg-icons'
import { Table, FormModal, useToast } from '../../components'
import paymentService from '../../services/paymentService'
import orderService from '../../services/orderService'
import { useNavigate } from 'react-router-dom'
import PaymentDetailsModal from '../../components/pages/payments/PaymentDetailsModal'
import PaymentForm from '../../components/pages/payments/PaymentForm'

const TransactionsList = () => {
  const navigate = useNavigate()
  const { success, error: showError } = useToast()
  const editFormRef = useRef()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    loadTransactions()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const getOrderIdentifier = (order) => {
    if (!order) return ''
    const candidates = [
      order.id,
      order.order_id,
      order.orderId,
      order.order_number,
      order.orderNumber
    ]
    const rawId = candidates.find(Boolean)
    return rawId ? rawId.toString().replace(/^#/, '').trim() : ''
  }

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const [paymentsResponse, ordersResponse] = await Promise.all([
        paymentService.getPayments(),
        orderService.getOrders({ limit: 1000 })
      ])

      const rawPaymentsSource = paymentsResponse?.success ? paymentsResponse.data : paymentsResponse
      const rawPayments = Array.isArray(rawPaymentsSource)
        ? rawPaymentsSource
        : rawPaymentsSource?.payments || rawPaymentsSource?.data || rawPaymentsSource || []

      const ordersList = ordersResponse?.data?.orders || ordersResponse?.data || []
      const orderMap = {}
      ordersList.forEach(order => {
        const key = getOrderIdentifier(order)
        if (key) {
          orderMap[key] = order
        }
      })

      const normalizedPayments = rawPayments.map(payment => {
        const paymentType = payment.payment_type || payment.paymentType || 'credit'
        const sanitizedOrderId = payment.order_id
          ? payment.order_id.toString().replace(/^#/, '').trim()
          : ''
        const order = orderMap[sanitizedOrderId]
        const orderNumber = order
          ? (order.order_number || order.orderNumber || order.id)
          : (payment.order_number || payment.orderNumber || payment.order_id || sanitizedOrderId || '-')

        const totalAmount = order ? Number(order.total_amount ?? order.total ?? 0) : null
        const paidAmount = order ? Number(order.paid_amount ?? order.paid ?? 0) : null
        const remainingAmount = order
          ? Math.max(0, Number(order.balance_amount ?? (totalAmount - paidAmount)))
          : null

        const customerId = payment.customer_id || order?.customer_id || order?.customer?.id || null

        const customerName = order
          ? (order.customer_name ||
              (order.customer
                ? (order.customer.name ||
                  `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim())
                : ''))
          : (payment.customer_name || '')

        return {
          ...payment,
          orderId: sanitizedOrderId,
          orderNumber,
          customerName,
          customer_id: customerId,
          totalAmount,
          paidAmount,
          remainingAmount,
          paymentAmount: Number(payment.amount || 0),
          paymentDate: payment.payment_date || payment.paymentDate,
          paymentMethod: payment.payment_method || payment.paymentMethod || 'cash',
          payment_type: paymentType,
          paymentType
        }
      })

      setPayments(normalizedPayments)
    } catch (error) {
      console.error('Error loading payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPayments = payments.filter(payment => {
    const term = searchTerm.toLowerCase()
    const matchesSearch = !term ||
      payment.remarks?.toLowerCase().includes(term) ||
      payment.customerName?.toLowerCase().includes(term) ||
      payment.orderNumber?.toString().toLowerCase().includes(term) ||
      payment.paymentMethod?.toLowerCase().includes(term) ||
      payment.paymentType?.toLowerCase().includes(term)
    return matchesSearch
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleViewTransaction = (payment) => {
    setSelectedPayment(payment)
    setShowViewModal(true)
  }

  const handleEditSubmit = async (formData) => {
    if (!selectedPayment) return
    try {
      setLoading(true)
      const response = await paymentService.updatePayment(selectedPayment.id, formData)
      if (response.success) {
        await loadTransactions()
        setShowEditModal(false)
        setSelectedPayment(null)
        success('Payment updated successfully')
      } else {
        showError(response.message || 'Failed to update payment')
      }
    } catch (error) {
      console.error('Error updating payment:', error)
      showError('An error occurred while updating payment')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      key: 'paymentDate',
      label: 'Payment Date',
      render: (value, payment) => formatDate(payment.paymentDate)
    },
    {
      key: 'orderNumber',
      label: 'Order',
      render: (value, payment) => (
        <div>
          <div className="fw-semibold">#{payment.orderNumber || payment.orderId || '-'}</div>
          {payment.customerName && (
            <small className="text-muted">{payment.customerName}</small>
          )}
        </div>
      )
    },
    {
      key: 'paymentType',
      label: 'Type',
      render: (value, payment) => (
        <Badge bg={payment.paymentType === 'debit' ? 'warning' : 'success'}>
          {payment.paymentType === 'debit' ? 'Debit' : 'Credit'}
        </Badge>
      )
    },
    {
      key: 'paymentAmount',
      label: 'Payment Amount',
      render: (value, payment) => {
        const formattedAmount = formatCurrency(payment.paymentAmount || payment.amount)
        return (
          <div className={`fw-semibold ${payment.paymentType === 'debit' ? 'text-danger' : 'text-success'}`}>
            {payment.paymentType === 'debit' ? `-${formattedAmount}` : formattedAmount}
          </div>
        )
      }
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      render: (value, payment) => payment.paymentMethod
        ? payment.paymentMethod.toString().replace(/_/g, ' ').toUpperCase()
        : 'N/A'
    },
    {
      key: 'remainingAmount',
      label: 'Remaining Amount',
      render: (value, payment) => (
        <div className={`fw-semibold ${payment.remainingAmount > 0 ? 'text-warning' : 'text-success'}`}>
          {payment.remainingAmount !== null && payment.remainingAmount !== undefined
            ? formatCurrency(payment.remainingAmount)
            : '-'}
        </div>
      )
    },
    {
      key: 'remarks',
      label: 'Remarks',
      render: (value, payment) => payment.remarks || '-'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, payment) => (
        <div className="d-flex gap-1" style={{ flexWrap: 'nowrap' }}>
          <Button
            variant="outline-info"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleViewTransaction(payment)
            }}
            title="View Payment"
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
          <Button
            variant="outline-success"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedPayment(payment)
              setShowEditModal(true)
            }}
            title="Edit Payment"
          >
            <FontAwesomeIcon icon={faEdit} />
          </Button>
        </div>
      )
    }
  ]

  const sortableColumns = ['paymentDate', 'orderNumber', 'paymentAmount']

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faWallet} className="me-3 text-dark fs-4" />
              <h2 className="mb-0 text-dark">Transactions</h2>
            </div>
            <div className="ms-auto">
              <Button variant="primary" onClick={() => navigate('/transactions/create')}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Payment
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-3 shadow-sm p-4">
            <div className="mb-4">
              <Row className="g-3">
                <Col md={6}>
                  <FormControl
                    placeholder="Search by customer name or remarks"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-2"
                  />
                </Col>
                <Col md={2}>
                  <Button variant="outline-secondary" onClick={loadTransactions}>
                    <FontAwesomeIcon icon={faRefresh} className="me-2" />
                    Refresh
                  </Button>
                </Col>
              </Row>
            </div>

            <Table
              data={filteredPayments}
              columns={columns}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              sortableColumns={sortableColumns}
              loading={loading}
              pagination={true}
            />
          </div>
        </Col>
      </Row>

      {/* Payment Details Modal */}
      <PaymentDetailsModal
        visible={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setSelectedPayment(null)
        }}
        payment={selectedPayment}
      />

      <FormModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedPayment(null)
        }}
        title="Edit Payment"
        onSubmit={() => editFormRef.current?.handleSubmit()}
        submitText="Update Payment"
        submitIcon={faSave}
        loading={loading}
        loadingText="Updating..."
        size="lg"
      >
        <PaymentForm
          ref={editFormRef}
          mode="edit"
          paymentData={selectedPayment}
          initialOrderId={selectedPayment?.orderId}
          initialAmount={selectedPayment?.paymentAmount || selectedPayment?.amount}
          onSubmit={handleEditSubmit}
        />
      </FormModal>
    </Container>
  )
}

export default TransactionsList

