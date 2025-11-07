import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, FormControl } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faWallet,
  faRefresh,
  faPlus,
  faEdit,
  faEye,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons'
import { Table } from '../../components'
import transactionService from '../../services/transactionService'
import { useNavigate } from 'react-router-dom'
import TransactionDetailsModal from '../../components/pages/transactions/TransactionDetailsModal'
import { exportTransactionToPDF } from '../../utils/pdfExport'

const TransactionsList = () => {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)

  useEffect(() => {
    loadTransactions()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const response = await transactionService.getTransactions()
      if (response.success) {
        const rawData = Array.isArray(response.data)
          ? response.data
          : response.data?.transactions || response.data?.data || []
        setTransactions(rawData)
      }
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const term = searchTerm.toLowerCase()
    const matchesSearch = !term ||
      transaction.remarks?.toLowerCase().includes(term) ||
      transaction.customer_name?.toLowerCase().includes(term)
    // Remove type filter since we're removing type column
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

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction)
    setShowViewModal(true)
  }

  const handleEditTransaction = (transaction) => {
    navigate(`/transactions/edit/${transaction.id}`)
  }

  const handleExportPDF = (transaction) => {
    exportTransactionToPDF(transaction)
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
      key: 'received_amount',
      label: 'Received Amount',
      render: (value, transaction) => {
        const receivedAmount = transaction.received_amount !== undefined 
          ? transaction.received_amount 
          : (transaction.type === 'credit' ? transaction.amount : 0)
        return receivedAmount > 0 ? (
          <div className="fw-semibold text-success">
            {formatCurrency(receivedAmount)}
          </div>
        ) : (
          <span className="text-muted">-</span>
        )
      }
    },
    {
      key: 'remaining_amount',
      label: 'Remaining Amount',
      render: (value, transaction) => {
        const remainingAmount = transaction.remaining_amount !== undefined 
          ? transaction.remaining_amount 
          : 0
        return (
          <div className={`fw-semibold ${remainingAmount > 0 ? 'text-warning' : 'text-success'}`}>
            {formatCurrency(remainingAmount)}
          </div>
        )
      }
    },
    {
      key: 'remarks',
      label: 'Remarks',
      render: (value, transaction) => transaction.remarks || '-'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, transaction) => (
        <div className="d-flex gap-1" style={{ flexWrap: 'nowrap' }}>
          <Button
            variant="outline-info"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleViewTransaction(transaction)
            }}
            title="View Transaction"
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
          <Button
            variant="outline-success"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleEditTransaction(transaction)
            }}
            title="Edit Transaction"
          >
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleExportPDF(transaction)
            }}
            title="Export PDF"
          >
            <FontAwesomeIcon icon={faFilePdf} />
          </Button>
        </div>
      )
    }
  ]

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
                Add Transaction
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

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        visible={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setSelectedTransaction(null)
        }}
        transaction={selectedTransaction}
      />
    </Container>
  )
}

export default TransactionsList

