import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Card, Badge, Spinner } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faArrowLeft, faPlus, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { Table } from '../../components'
import { customerService } from '../../services/customerService'
import transactionService from '../../services/transactionService'
import { useToast } from '../../components/common/ToastProvider'

const CustomerWalletView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [customer, setCustomer] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [walletSummary, setWalletSummary] = useState({
    totalCredit: 0,
    totalDebit: 0,
    balance: 0
  })

  useEffect(() => {
    loadCustomerData()
    loadTransactions()
  }, [id])

  const loadCustomerData = async () => {
    try {
      const response = await customerService.getCustomerById(id)
      if (response.success) {
        setCustomer(response.data)
        if (response.data.wallet_balance !== undefined) {
          setWalletSummary(prev => ({
            ...prev,
            balance: response.data.wallet_balance || 0
          }))
        }
      }
    } catch (error) {
      console.error('Error loading customer:', error)
      showToast('Error loading customer data', 'error')
    }
  }

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const response = await transactionService.getTransactionsByCustomer(id)
      if (response.success) {
        setTransactions(response.data || [])
        
        // Calculate summary
        const credit = response.data
          .filter(t => t.type === 'credit')
          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
        const debit = response.data
          .filter(t => t.type === 'debit')
          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
        
        setWalletSummary({
          totalCredit: credit,
          totalDebit: debit,
          balance: credit - debit
        })
      }
    } catch (error) {
      console.error('Error loading transactions:', error)
      showToast('Error loading transactions', 'error')
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
      render: (value, transaction) => formatDate(transaction.transaction_date)
    },
    {
      key: 'type',
      label: 'Type',
      render: (value, transaction) => (
        <Badge bg={transaction.type === 'credit' ? 'success' : 'danger'} className="px-2 py-1">
          {transaction.type === 'credit' ? 'Credit' : 'Debit'}
        </Badge>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value, transaction) => (
        <div className={`fw-semibold ${transaction.type === 'credit' ? 'text-success' : 'text-danger'}`}>
          {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
        </div>
      )
    },
    {
      key: 'remarks',
      label: 'Remarks',
      render: (value, transaction) => transaction.remarks || '-'
    },
    {
      key: 'order',
      label: 'Order',
      render: (value, transaction) => transaction.order_id ? `Order #${transaction.order_id}` : '-'
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
              <FontAwesomeIcon icon={faWallet} className="me-3 text-dark fs-4" />
              <h2 className="mb-0 text-dark">
                Wallet - {customer?.name || 'Customer'}
              </h2>
            </div>
            <div className="ms-auto">
              <Button variant="primary" onClick={() => navigate(`/transactions/create?customer_id=${id}`)}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Transaction
              </Button>
            </div>
          </div>

          {/* Wallet Summary Cards */}
          <Row className="mb-4">
            <Col md={4}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-3 bg-gradient-success text-white">
                        <FontAwesomeIcon icon={faArrowUp} size="lg" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-4">
                      <div className="text-muted small fw-semibold mb-1">Total Credit</div>
                      <div className="h3 mb-2 fw-bold text-success">
                        {formatCurrency(walletSummary.totalCredit)}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-3 bg-gradient-danger text-white">
                        <FontAwesomeIcon icon={faArrowDown} size="lg" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-4">
                      <div className="text-muted small fw-semibold mb-1">Total Debit</div>
                      <div className="h3 mb-2 fw-bold text-danger">
                        {formatCurrency(walletSummary.totalDebit)}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-3 bg-gradient-primary text-white">
                        <FontAwesomeIcon icon={faWallet} size="lg" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-4">
                      <div className="text-muted small fw-semibold mb-1">Wallet Balance</div>
                      <div className={`h3 mb-2 fw-bold ${walletSummary.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                        {formatCurrency(walletSummary.balance)}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Transactions Table */}
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
                <FontAwesomeIcon icon={faWallet} className="me-3 text-success fs-4" />
                <h4 className="mb-0 text-success">Transaction History</h4>
              </div>

              <Table
                data={transactions}
                columns={columns}
                loading={loading}
                pagination={true}
                currentPage={1}
                pageSize={10}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default CustomerWalletView

