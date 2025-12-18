import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Button, FormControl, FormSelect, Badge, Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTrash, 
  faEdit, 
  faPlus,
  faSearch, 
  faRefresh,
  faFilter,
  faEye,
  faRupeeSign,
  faFilePdf,
  faDownload,
  faArrowUp,
  faArrowDown,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons'
import { Table, Modal, FormModal, useToast } from '../../components'
import FinancialTransactionForm from '../../components/pages/financial/FinancialTransactionForm'
import FinancialTransactionDetailsModal from '../../components/pages/financial/FinancialTransactionDetailsModal'
import financialService from '../../services/financialService'
import { usePermissions } from '../../hooks'
import { PERMISSIONS } from '../../constants/permissions'

const FinancialTransactionsList = () => {
  const { success, error: showError } = useToast()
  const { hasPermission } = usePermissions()
  
  // Permission checks
  const canCreateTransaction = hasPermission
    ? hasPermission(PERMISSIONS.FINANCIAL_TRANSACTION_WRITE) || hasPermission(PERMISSIONS.FINANCIAL_TRANSACTION_MANAGE)
    : false
  const canEditTransaction = hasPermission
    ? hasPermission(PERMISSIONS.FINANCIAL_TRANSACTION_EDIT) || hasPermission(PERMISSIONS.FINANCIAL_TRANSACTION_MANAGE)
    : false
  const canDeleteTransaction = hasPermission
    ? hasPermission(PERMISSIONS.FINANCIAL_TRANSACTION_DELETE) || hasPermission(PERMISSIONS.FINANCIAL_TRANSACTION_MANAGE)
    : false
  
  const [transactions, setTransactions] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [paginationMeta, setPaginationMeta] = useState({
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  
  // Add/Edit Modal States
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [transactionToEdit, setTransactionToEdit] = useState(null)
  const [addLoading, setAddLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  
  // Refs for form components
  const addFormRef = useRef()
  const editFormRef = useRef()

  // Load transactions when filters, search, or pagination changes
  useEffect(() => {
    loadTransactions()
    loadStats()
  }, [currentPage, pageSize, searchTerm, typeFilter, categoryFilter, startDate, endDate])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        transaction_type: typeFilter !== 'all' ? typeFilter : undefined,
        category_id: categoryFilter || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        sort_by: 'transaction_date',
        sort_direction: 'desc',
      }
      
      const response = await financialService.getTransactions(params)
      if (response && response.success) {
        setTransactions(response.data || [])
        if (response.meta) {
          setPaginationMeta({
            total: response.meta.total || 0,
            totalPages: response.meta.totalPages || 1,
            hasNext: response.meta.hasNext || false,
            hasPrev: response.meta.hasPrev || false,
          })
        }
      } else {
        showError(response.message || 'Failed to load transactions')
        setTransactions([])
      }
    } catch (err) {
      console.error('Error loading transactions:', err)
      showError('An error occurred while loading transactions')
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const params = {}
      if (startDate) params.start_date = startDate
      if (endDate) params.end_date = endDate
      
      const response = await financialService.getStats(params)
      if (response && response.success) {
        setStats(response.data || {})
      }
    } catch (err) {
      console.error('Error loading stats:', err)
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
      day: 'numeric'
    })
  }

  const getTypeBadge = (type) => {
    if (type === 'income') {
      return <Badge bg="success" className="px-2 py-1">Income</Badge>
    }
    return <Badge bg="danger" className="px-2 py-1">Expense</Badge>
  }

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction)
    setShowDetailsModal(true)
  }

  const handleEditTransaction = (transaction) => {
    setTransactionToEdit(transaction)
    setShowEditModal(true)
  }

  const handleDeleteTransaction = (transaction) => {
    setTransactionToDelete(transaction)
    setShowDeleteModal(true)
  }

  const confirmDeleteTransaction = async () => {
    try {
      const response = await financialService.deleteTransaction(transactionToDelete.id)
      if (response.success) {
        success('Transaction deleted successfully')
        setShowDeleteModal(false)
        setTransactionToDelete(null)
        loadTransactions()
        loadStats()
      } else {
        showError(response.message || 'Failed to delete transaction')
      }
    } catch (err) {
      console.error('Error deleting transaction:', err)
      showError('An error occurred while deleting transaction')
    }
  }

  // Add Transaction Handlers
  const handleAddTransaction = () => {
    setShowAddModal(true)
  }

  const handleAddTransactionSubmit = () => {
    if (addFormRef.current) {
      addFormRef.current.handleSubmit()
    }
  }

  const handleAddTransactionFormSubmit = async (formData) => {
    try {
      setAddLoading(true)
      const response = await financialService.createTransaction(formData)
      if (response.success) {
        success('Transaction created successfully')
        setShowAddModal(false)
        loadTransactions()
        loadStats()
      } else {
        showError(response.message || 'Failed to create transaction')
      }
    } catch (err) {
      console.error('Error creating transaction:', err)
      showError('An error occurred while creating transaction')
    } finally {
      setAddLoading(false)
    }
  }

  // Edit Transaction Handlers
  const handleEditTransactionSubmit = () => {
    if (editFormRef.current) {
      editFormRef.current.handleSubmit()
    }
  }

  const handleEditTransactionFormSubmit = async (formData) => {
    try {
      setEditLoading(true)
      const response = await financialService.updateTransaction(transactionToEdit.id, formData)
      if (response.success) {
        success('Transaction updated successfully')
        setShowEditModal(false)
        setTransactionToEdit(null)
        loadTransactions()
        loadStats()
      } else {
        showError(response.message || 'Failed to update transaction')
      }
    } catch (err) {
      console.error('Error updating transaction:', err)
      showError('An error occurred while updating transaction')
    } finally {
      setEditLoading(false)
    }
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setTypeFilter('all')
    setCategoryFilter('')
    setStartDate('')
    setEndDate('')
    setCurrentPage(1)
  }

  const columns = [
    {
      key: 'transaction_number',
      label: 'Transaction #',
      render: (value, transaction) => (
        <span className="fw-semibold">{transaction.transactionNumber || transaction.transaction_number || `#${transaction.id}`}</span>
      )
    },
    {
      key: 'transaction_type',
      label: 'Type',
      render: (value, transaction) => getTypeBadge(transaction.transactionType || transaction.transaction_type)
    },
    {
      key: 'transaction_date',
      label: 'Date',
      render: (value, transaction) => formatDate(transaction.transactionDate || transaction.transaction_date)
    },
    {
      key: 'category',
      label: 'Category',
      render: (value, transaction) => {
        const category = transaction.category || {}
        return <Badge bg="info" className="px-2 py-1">{category.name || 'N/A'}</Badge>
      }
    },
    {
      key: 'description',
      label: 'Description',
      render: (value, transaction) => (
        <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }} title={transaction.description || ''}>
          {transaction.description || '-'}
        </span>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value, transaction) => {
        const type = transaction.transactionType || transaction.transaction_type
        const amount = transaction.amount || 0
        const colorClass = type === 'income' ? 'text-success' : 'text-danger'
        return (
          <div className={`fw-bold ${colorClass}`}>
            {type === 'income' ? '+' : '-'} {formatCurrency(amount)}
          </div>
        )
      }
    },
    {
      key: 'created_by',
      label: 'Created By',
      render: (value, transaction) => {
        const createdBy = transaction.createdBy || transaction.created_by || {}
        const firstName = createdBy.firstName || createdBy.first_name || ''
        const lastName = createdBy.lastName || createdBy.last_name || ''
        return `${firstName} ${lastName}`.trim() || 'N/A'
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, transaction) => (
        <div className="d-flex gap-2">
          <Button
            variant="outline-info"
            size="sm"
            onClick={() => handleViewDetails(transaction)}
            title="View Details"
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
          {canEditTransaction && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleEditTransaction(transaction)}
              title="Edit"
            >
              <FontAwesomeIcon icon={faEdit} />
            </Button>
          )}
          {canDeleteTransaction && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDeleteTransaction(transaction)}
              title="Delete"
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          )}
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
              <FontAwesomeIcon icon={faChartLine} className="me-3 text-dark fs-4" />
              <h2 className="mb-0 text-dark">Financial Transactions</h2>
            </div>
            <div className="ms-auto">
              {canCreateTransaction && (
                <Button variant="primary" onClick={handleAddTransaction}>
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Add Transaction
                </Button>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-success bg-opacity-10 rounded-circle p-3">
                        <FontAwesomeIcon icon={faArrowUp} className="text-success fs-4" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="text-muted small">Total Income</div>
                      <div className="h4 mb-0 text-success fw-bold">
                        {formatCurrency(stats.totalIncome || stats.total_income || 0)}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-danger bg-opacity-10 rounded-circle p-3">
                        <FontAwesomeIcon icon={faArrowDown} className="text-danger fs-4" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="text-muted small">Total Expenses</div>
                      <div className="h4 mb-0 text-danger fw-bold">
                        {formatCurrency(stats.totalExpenses || stats.total_expenses || 0)}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                        <FontAwesomeIcon icon={faRupeeSign} className="text-primary fs-4" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="text-muted small">Net Profit/Loss</div>
                      <div className={`h4 mb-0 fw-bold ${(stats.netProfit || stats.net_profit || 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                        {formatCurrency(stats.netProfit || stats.net_profit || 0)}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
            <div className="mb-3">
              <div className="d-flex align-items-center mb-3 pb-2 border-bottom">
                <FontAwesomeIcon icon={faFilter} className="me-2 text-primary" />
                <h5 className="mb-0 text-primary">Filters</h5>
              </div>
              <Row className="g-3">
                <Col md={2}>
                  <FormSelect
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="border-2"
                  >
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </FormSelect>
                </Col>
                <Col md={2}>
                  <FormControl
                    type="date"
                    placeholder="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border-2"
                  />
                </Col>
                <Col md={2}>
                  <FormControl
                    type="date"
                    placeholder="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border-2"
                  />
                </Col>
                <Col md={3}>
                  <FormControl
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-2"
                  />
                </Col>
                <Col md={3}>
                  <div className="d-flex gap-2">
                    <Button variant="outline-secondary" onClick={handleResetFilters}>
                      <FontAwesomeIcon icon={faFilter} className="me-2" />
                      Reset
                    </Button>
                    <Button variant="outline-primary" onClick={loadTransactions}>
                      <FontAwesomeIcon icon={faRefresh} className="me-2" />
                      Refresh
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-3 shadow-sm p-4">
            <Table
              data={transactions}
              columns={columns}
              loading={loading}
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={paginationMeta.total}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pagination={true}
              serverSide={true}
            />
          </div>
        </Col>
      </Row>

      {/* Add Transaction Modal */}
      <FormModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Financial Transaction"
        onConfirm={handleAddTransactionSubmit}
        confirmText="Create"
        loading={addLoading}
        size="lg"
      >
        <FinancialTransactionForm
          ref={addFormRef}
          mode="create"
          onSubmit={handleAddTransactionFormSubmit}
          onCancel={() => setShowAddModal(false)}
          loading={addLoading}
        />
      </FormModal>

      {/* Edit Transaction Modal */}
      <FormModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setTransactionToEdit(null)
        }}
        title="Edit Financial Transaction"
        onConfirm={handleEditTransactionSubmit}
        confirmText="Update"
        loading={editLoading}
        size="lg"
      >
        {transactionToEdit && (
          <FinancialTransactionForm
            ref={editFormRef}
            mode="edit"
            transactionData={transactionToEdit}
            onSubmit={handleEditTransactionFormSubmit}
            onCancel={() => {
              setShowEditModal(false)
              setTransactionToEdit(null)
            }}
            loading={editLoading}
          />
        )}
      </FormModal>

      {/* Details Modal */}
      {selectedTransaction && (
        <FinancialTransactionDetailsModal
          show={showDetailsModal}
          onHide={() => {
            setShowDetailsModal(false)
            setSelectedTransaction(null)
          }}
          transaction={selectedTransaction}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setTransactionToDelete(null)
        }}
        title="Delete Transaction"
        onConfirm={confirmDeleteTransaction}
        confirmText="Delete"
        type="danger"
      >
        <p>Are you sure you want to delete this transaction?</p>
        {transactionToDelete && (
          <div className="alert alert-warning">
            <strong>Transaction:</strong> {transactionToDelete.transactionNumber || transactionToDelete.transaction_number || `#${transactionToDelete.id}`}<br />
            <strong>Type:</strong> {transactionToDelete.transactionType || transactionToDelete.transaction_type}<br />
            <strong>Amount:</strong> {formatCurrency(transactionToDelete.amount || 0)}
          </div>
        )}
      </Modal>
    </Container>
  )
}

export default FinancialTransactionsList
