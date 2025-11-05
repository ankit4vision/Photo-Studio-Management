import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, FormControl, FormSelect, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faWallet,
  faSearch, 
  faRefresh,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { Table } from '../../components'
import transactionService from '../../services/transactionService'

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const response = await transactionService.getTransactions()
      if (response.success) {
        setTransactions(response.data || [])
      }
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.remarks?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !typeFilter || transaction.type === typeFilter
    return matchesSearch && matchesType
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

  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (value, transaction) => formatDate(transaction.transaction_date)
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (value, transaction) => transaction.customer_name || `Customer #${transaction.customer_id}`
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

  const transactionTypes = transactionService.getTransactionTypes()

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
              <Button variant="primary" onClick={() => {}}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Transaction
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-3 shadow-sm p-4">
            <div className="mb-4">
              <Row className="g-3">
                <Col md={4}>
                  <FormControl
                    placeholder="Search by remarks"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-2"
                  />
                </Col>
                <Col md={2}>
                  <FormSelect
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="border-2"
                  >
                    <option value="">All Types</option>
                    {transactionTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </FormSelect>
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
              data={filteredTransactions}
              columns={columns}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              loading={loading}
              pagination={true}
            />
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default TransactionsList

