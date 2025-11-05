import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Card, Badge, Spinner } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faArrowLeft, faDownload } from '@fortawesome/free-solid-svg-icons'
import { Table } from '../../components'
import { customerService } from '../../services/customerService'
import orderService from '../../services/orderService'
import transactionService from '../../services/transactionService'
import { useToast } from '../../components/common/ToastProvider'

const CustomerLedgerView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [customer, setCustomer] = useState(null)
  const [ledgerEntries, setLedgerEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCustomerData()
    loadLedgerData()
  }, [id])

  const loadCustomerData = async () => {
    try {
      const response = await customerService.getCustomerById(id)
      if (response.success) {
        setCustomer(response.data)
      }
    } catch (error) {
      console.error('Error loading customer:', error)
      showToast('Error loading customer data', 'error')
    }
  }

  const loadLedgerData = async () => {
    try {
      setLoading(true)
      
      // Load orders and transactions
      const [ordersResponse, transactionsResponse] = await Promise.all([
        orderService.getOrdersByCustomer(id),
        transactionService.getTransactionsByCustomer(id)
      ])

      const orders = ordersResponse.success ? (ordersResponse.data?.orders || ordersResponse.data || []) : []
      const transactions = transactionsResponse.success ? (transactionsResponse.data || []) : []

      // Combine and sort by date
      const entries = [
        ...orders.map(order => ({
          id: `order-${order.id}`,
          type: 'order',
          date: order.order_date,
          description: `Order #${order.id}`,
          amount: order.total_amount,
          balance: null,
          order: order
        })),
        ...transactions.map(transaction => ({
          id: `transaction-${transaction.id}`,
          type: 'transaction',
          date: transaction.transaction_date,
          description: transaction.remarks || 'Transaction',
          amount: transaction.amount,
          transaction_type: transaction.type,
          balance: null,
          transaction: transaction
        }))
      ].sort((a, b) => new Date(a.date) - new Date(b.date))

      // Calculate running balance
      let runningBalance = 0
      entries.forEach(entry => {
        if (entry.type === 'order') {
          runningBalance -= parseFloat(entry.amount) || 0
        } else if (entry.transaction_type === 'credit') {
          runningBalance += parseFloat(entry.amount) || 0
        } else if (entry.transaction_type === 'debit') {
          runningBalance -= parseFloat(entry.amount) || 0
        }
        entry.balance = runningBalance
      })

      setLedgerEntries(entries)
    } catch (error) {
      console.error('Error loading ledger data:', error)
      showToast('Error loading ledger data', 'error')
    } finally {
      setLoading(false)
    }
  }

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (value, entry) => formatDate(entry.date)
    },
    {
      key: 'type',
      label: 'Type',
      render: (value, entry) => (
        <Badge bg={entry.type === 'order' ? 'info' : entry.transaction_type === 'credit' ? 'success' : 'danger'} className="px-2 py-1">
          {entry.type === 'order' ? 'Order' : entry.transaction_type === 'credit' ? 'Credit' : 'Debit'}
        </Badge>
      )
    },
    {
      key: 'description',
      label: 'Description',
      render: (value, entry) => (
        <div>
          <div className="fw-semibold text-dark">{entry.description}</div>
          {entry.order && (
            <small className="text-muted">Total: {formatCurrency(entry.order.total_amount)}</small>
          )}
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value, entry) => {
        if (entry.type === 'order') {
          return <div className="fw-semibold text-danger">-{formatCurrency(entry.amount)}</div>
        }
        return (
          <div className={`fw-semibold ${entry.transaction_type === 'credit' ? 'text-success' : 'text-danger'}`}>
            {entry.transaction_type === 'credit' ? '+' : '-'}{formatCurrency(entry.amount)}
          </div>
        )
      }
    },
    {
      key: 'balance',
      label: 'Balance',
      render: (value, entry) => (
        <div className={`fw-semibold ${entry.balance >= 0 ? 'text-success' : 'text-danger'}`}>
          {formatCurrency(entry.balance)}
        </div>
      )
    }
  ]

  if (loading && !customer) {
    return (
      <Container fluid>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <Spinner animation="border" variant="success" />
        </div>
      </Container>
    )
  }

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <Button
              variant="outline-secondary"
              className="me-3"
              onClick={() => navigate(`/customers`)}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back
            </Button>
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faBook} className="me-3 text-dark fs-4" />
              <h2 className="mb-0 text-dark">
                Ledger - {customer?.name || 'Customer'}
              </h2>
            </div>
            <div className="ms-auto">
              <Button variant="outline-primary" onClick={() => {}}>
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                Export
              </Button>
            </div>
          </div>

          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
                <FontAwesomeIcon icon={faBook} className="me-3 text-success fs-4" />
                <h4 className="mb-0 text-success">Customer Ledger</h4>
              </div>

              <Table
                data={ledgerEntries}
                columns={columns}
                loading={loading}
                pagination={true}
                currentPage={1}
                pageSize={20}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default CustomerLedgerView

