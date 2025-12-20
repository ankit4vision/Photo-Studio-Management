import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Card, FormControl, FormSelect, Badge, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUsers,
  faDownload,
  faRefresh,
  faCheckCircle,
  faClock,
  faExclamationTriangle,
  faSearch,
  faInfoCircle,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons'
import reportService from '../../services/reportService'
import branchService from '../../services/branchService'
import { useToast } from '../../components'

const CustomerPaymentStatusReport = () => {
  const { success, error } = useToast()
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [branchId, setBranchId] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [branches, setBranches] = useState([])
  const [reportData, setReportData] = useState(null)

  useEffect(() => {
    loadBranches()
    // Set default date range to current year (Jan 1 to Dec 31)
    const today = new Date()
    const currentYear = today.getFullYear()
    // January 1st of current year
    const firstDayOfYear = `${currentYear}-01-01`
    // December 31st of current year
    const lastDayOfYear = `${currentYear}-12-31`
    setStartDate(firstDayOfYear)
    setEndDate(lastDayOfYear)
  }, [])

  const loadBranches = async () => {
    try {
      const response = await branchService.getBranches({ limit: 100 })
      if (response.success) {
        setBranches(response.data || [])
      }
    } catch (err) {
      console.error('Error loading branches:', err)
    }
  }

  const handleGenerateReport = async () => {
    setLoading(true)
    try {
      const params = {}
      if (startDate) params.start_date = startDate
      if (endDate) params.end_date = endDate
      if (branchId) params.branch_id = branchId
      if (paymentStatus && paymentStatus !== 'all') params.payment_status = paymentStatus
      if (search) params.search = search

      const response = await reportService.getCustomerPaymentStatusReport(params)
      if (response.success) {
        setReportData(response.data)
        success('Report generated successfully')
      } else {
        error(response.message || 'Failed to generate report')
      }
    } catch (err) {
      console.error('Error generating report:', err)
      error('An error occurred while generating the report')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0)
  }

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'fully_paid':
        return <Badge bg="success">Fully Paid</Badge>
      case 'partially_paid':
        return <Badge bg="warning">Partially Paid</Badge>
      case 'unpaid':
        return <Badge bg="danger">Unpaid</Badge>
      default:
        return <Badge bg="secondary">{status}</Badge>
    }
  }

  return (
    <Container fluid className="px-0 px-xl-3">
      <Row className="g-4">
        <Col xs={12}>
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faUsers} className="me-3 text-primary fs-4" />
              <h2 className="mb-0 text-dark">Customer Payment Status Report</h2>
            </div>
          </div>

          {/* Report Information */}
          <Card className="shadow-sm mb-4" style={{ 
            background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)',
            border: '2px solid #dc3545',
            borderRadius: '12px'
          }}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-start">
                <div className="me-4" style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #dc3545 0%, #f56565 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FontAwesomeIcon icon={faInfoCircle} className="text-white fs-5" />
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-3">
                    <h5 className="mb-0 text-danger fw-bold">About This Report</h5>
                    <Badge bg="danger" className="ms-3 px-3 py-1" style={{ fontSize: '12px' }}>
                      Payment Tracking
                    </Badge>
                  </div>
                  <p className="mb-3 text-dark" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                    The <strong className="text-danger">Customer Payment Status Report</strong> provides detailed insights into customer payment behavior and outstanding balances. This report helps you manage accounts receivable and improve cash flow.
                  </p>
                  
                  <Row className="g-3 mb-3">
                    <Col md={6}>
                      <div className="p-3 bg-white rounded border-start border-success border-3 shadow-sm h-100">
                        <div className="d-flex align-items-center mb-2">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
                          <strong className="text-dark">Track Payment Status</strong>
                        </div>
                        <p className="mb-0 text-muted small" style={{ fontSize: '13px' }}>
                          Identify customers who have fully paid, partially paid, or have unpaid balances
                        </p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="p-3 bg-white rounded border-start border-warning border-3 shadow-sm h-100">
                        <div className="d-flex align-items-center mb-2">
                          <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning me-2" />
                          <strong className="text-dark">Monitor Outstanding</strong>
                        </div>
                        <p className="mb-0 text-muted small" style={{ fontSize: '13px' }}>
                          View total outstanding amounts and identify customers with pending payments
                        </p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="p-3 bg-white rounded border-start border-info border-3 shadow-sm h-100">
                        <div className="d-flex align-items-center mb-2">
                          <FontAwesomeIcon icon={faUsers} className="text-info me-2" />
                          <strong className="text-dark">Collection Management</strong>
                        </div>
                        <p className="mb-0 text-muted small" style={{ fontSize: '13px' }}>
                          See collection percentage and average outstanding per customer to prioritize follow-ups
                        </p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="p-3 bg-white rounded border-start border-primary border-3 shadow-sm h-100">
                        <div className="d-flex align-items-center mb-2">
                          <FontAwesomeIcon icon={faChartLine} className="text-primary me-2" />
                          <strong className="text-dark">Top Outstanding</strong>
                        </div>
                        <p className="mb-0 text-muted small" style={{ fontSize: '13px' }}>
                          Quickly identify customers with highest outstanding amounts for focused collection efforts
                        </p>
                      </div>
                    </Col>
                  </Row>

                  <div className="p-3 bg-danger bg-opacity-10 rounded border border-danger border-2">
                    <div className="d-flex align-items-start">
                      <FontAwesomeIcon icon={faRefresh} className="text-danger me-2 mt-1" />
                      <div>
                        <strong className="text-danger d-block mb-1">How to Use:</strong>
                        <p className="mb-0 text-dark small" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                          Select a date range (defaults to current year: Jan 1 - Dec 31), filter by branch, payment status, or search for specific customers. Click <strong>"Generate Report"</strong> to view detailed customer payment information. Use this report to manage accounts receivable and improve cash flow.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Filters */}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Row className="g-3 align-items-end">
                <Col md={3}>
                  <label className="form-label fw-semibold">Start Date</label>
                  <FormControl
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border-2"
                  />
                </Col>
                <Col md={3}>
                  <label className="form-label fw-semibold">End Date</label>
                  <FormControl
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border-2"
                  />
                </Col>
                <Col md={2}>
                  <label className="form-label fw-semibold">Branch</label>
                  <FormSelect
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className="border-2"
                  >
                    <option value="">All Branches</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.branch_name}
                      </option>
                    ))}
                  </FormSelect>
                </Col>
                <Col md={2}>
                  <label className="form-label fw-semibold">Payment Status</label>
                  <FormSelect
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="border-2"
                  >
                    <option value="all">All Status</option>
                    <option value="fully_paid">Fully Paid</option>
                    <option value="partially_paid">Partially Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </FormSelect>
                </Col>
                <Col md={2}>
                  <label className="form-label fw-semibold">Search</label>
                  <FormControl
                    type="text"
                    placeholder="Customer name, code..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-2"
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <Button
                    variant="primary"
                    onClick={handleGenerateReport}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faRefresh} className="me-2" />
                    {loading ? 'Generating...' : 'Generate Report'}
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Report Data */}
          {reportData && (
            <>
              {/* Summary Cards */}
              <Row className="mb-4 g-3">
                <Col md={3} sm={6}>
                  <Card className="bg-gradient-primary text-white border-0 shadow-sm h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h4 className="mb-0">{formatNumber(reportData.summary?.totalCustomers)}</h4>
                          <p className="mb-0 opacity-75 small">Total Customers</p>
                        </div>
                        <FontAwesomeIcon icon={faUsers} className="fs-1 opacity-50" />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} sm={6}>
                  <Card className="bg-gradient-success text-white border-0 shadow-sm h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h4 className="mb-0">{formatNumber(reportData.summary?.fullyPaidCount)}</h4>
                          <p className="mb-0 opacity-75 small">Fully Paid</p>
                        </div>
                        <FontAwesomeIcon icon={faCheckCircle} className="fs-1 opacity-50" />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} sm={6}>
                  <Card className="bg-gradient-warning text-white border-0 shadow-sm h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h4 className="mb-0">{formatNumber(reportData.summary?.partiallyPaidCount)}</h4>
                          <p className="mb-0 opacity-75 small">Partially Paid</p>
                        </div>
                        <FontAwesomeIcon icon={faClock} className="fs-1 opacity-50" />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} sm={6}>
                  <Card className="bg-gradient-danger text-white border-0 shadow-sm h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h4 className="mb-0">{formatNumber(reportData.summary?.unpaidCount)}</h4>
                          <p className="mb-0 opacity-75 small">Unpaid</p>
                        </div>
                        <FontAwesomeIcon icon={faExclamationTriangle} className="fs-1 opacity-50" />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Financial Summary */}
              <Row className="mb-4 g-3">
                <Col md={4} sm={6}>
                  <Card className="shadow-sm h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h5 className="mb-1 text-danger">{formatCurrency(reportData.summary?.totalOutstanding)}</h5>
                          <p className="mb-0 text-muted small">Total Outstanding</p>
                        </div>
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-danger fs-4" />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} sm={6}>
                  <Card className="shadow-sm h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h5 className="mb-1 text-success">{formatCurrency(reportData.summary?.totalCollected)}</h5>
                          <p className="mb-0 text-muted small">Total Collected</p>
                        </div>
                        <FontAwesomeIcon icon={faCheckCircle} className="text-success fs-4" />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} sm={6}>
                  <Card className="shadow-sm h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h5 className="mb-1 text-info">{reportData.summary?.collectionPercentage?.toFixed(1)}%</h5>
                          <p className="mb-0 text-muted small">Collection Percentage</p>
                        </div>
                        <FontAwesomeIcon icon={faUsers} className="text-info fs-4" />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Customer List Table */}
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Customer Payment Details</h5>
                    <div className="text-muted small">
                      Showing {reportData.customers?.length || 0} customers
                    </div>
                  </div>
                  <div className="table-responsive">
                    <Table hover striped>
                      <thead>
                        <tr>
                          <th>Customer Code</th>
                          <th>Name</th>
                          <th>Contact</th>
                          <th>Branch</th>
                          <th className="text-end">Total Orders</th>
                          <th className="text-end">Total Amount</th>
                          <th className="text-end">Paid Amount</th>
                          <th className="text-end">Remaining</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.customers && reportData.customers.length > 0 ? (
                          reportData.customers.map((customer) => (
                            <tr key={customer.id}>
                              <td>
                                <span className="fw-semibold">{customer.customerCode || 'N/A'}</span>
                              </td>
                              <td>{customer.name || 'N/A'}</td>
                              <td>
                                <div className="small">
                                  {customer.email && <div>{customer.email}</div>}
                                  {customer.phone && <div className="text-muted">{customer.phone}</div>}
                                </div>
                              </td>
                              <td>{customer.branchName || 'N/A'}</td>
                              <td className="text-end">{formatNumber(customer.totalOrders)}</td>
                              <td className="text-end fw-semibold">{formatCurrency(customer.totalAmount)}</td>
                              <td className="text-end text-success fw-semibold">
                                {formatCurrency(customer.paidAmount)}
                              </td>
                              <td className="text-end">
                                <span
                                  className={`fw-bold ${
                                    customer.remainingAmount > 0 ? 'text-danger' : 'text-success'
                                  }`}
                                >
                                  {formatCurrency(customer.remainingAmount)}
                                </span>
                              </td>
                              <td>{getPaymentStatusBadge(customer.paymentStatus)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9" className="text-center text-muted py-4">
                              No customers found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>

              {/* Top Outstanding Customers */}
              {reportData.topOutstanding && reportData.topOutstanding.length > 0 && (
                <Card className="shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3">Top 10 Customers by Outstanding Amount</h5>
                    <div className="table-responsive">
                      <Table hover striped>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Customer Code</th>
                            <th>Name</th>
                            <th>Total Amount</th>
                            <th className="text-end">Paid</th>
                            <th className="text-end">Outstanding</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.topOutstanding.map((customer, index) => (
                            <tr key={customer.id}>
                              <td>{index + 1}</td>
                              <td>
                                <span className="fw-semibold">{customer.customerCode || 'N/A'}</span>
                              </td>
                              <td>{customer.name || 'N/A'}</td>
                              <td>{formatCurrency(customer.totalAmount)}</td>
                              <td className="text-end text-success">
                                {formatCurrency(customer.paidAmount)}
                              </td>
                              <td className="text-end text-danger fw-bold">
                                {formatCurrency(customer.remainingAmount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </>
          )}

          {!reportData && !loading && (
            <Card className="shadow-sm">
              <Card.Body>
                <div className="text-center text-muted py-5">
                  <FontAwesomeIcon icon={faUsers} className="fs-1 mb-3 opacity-50" />
                  <p>Click "Generate Report" to view customer payment status data</p>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Additional Information Section */}
          <Card className="shadow-sm mt-4" style={{ 
            background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)',
            border: '2px solid #0ea5e9',
            borderRadius: '12px'
          }}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-start">
                <div className="me-4" style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FontAwesomeIcon icon={faInfoCircle} className="text-white fs-5" />
                </div>
                <div className="flex-grow-1">
                  <h5 className="mb-3 text-primary fw-bold">Tips & Best Practices</h5>
                  
                  <Row className="g-3">
                    <Col md={6}>
                      <div className="d-flex align-items-start mb-3">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-success me-3 mt-1" />
                        <div>
                          <strong className="text-dark d-block mb-1">Regular Monitoring</strong>
                          <p className="mb-0 text-muted small" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                            Run this report weekly to track payment trends and identify customers who need follow-up calls or reminders.
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex align-items-start mb-3">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning me-3 mt-1" />
                        <div>
                          <strong className="text-dark d-block mb-1">Prioritize Collections</strong>
                          <p className="mb-0 text-muted small" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                            Focus on "Top Outstanding Customers" first. These customers have the highest outstanding amounts and should be contacted immediately.
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex align-items-start mb-3">
                        <FontAwesomeIcon icon={faSearch} className="text-info me-3 mt-1" />
                        <div>
                          <strong className="text-dark d-block mb-1">Use Filters Effectively</strong>
                          <p className="mb-0 text-muted small" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                            Filter by payment status to focus on specific groups. Use the search function to quickly find specific customers by name, email, or phone.
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex align-items-start mb-3">
                        <FontAwesomeIcon icon={faChartLine} className="text-primary me-3 mt-1" />
                        <div>
                          <strong className="text-dark d-block mb-1">Track Performance</strong>
                          <p className="mb-0 text-muted small" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                            Monitor the "Collection Percentage" metric. A higher percentage indicates better cash flow management and customer payment compliance.
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <div className="mt-3 p-3 bg-info bg-opacity-10 rounded border border-info border-2">
                    <div className="d-flex align-items-start">
                      <FontAwesomeIcon icon={faRefresh} className="text-info me-2 mt-1" />
                      <div>
                        <strong className="text-info d-block mb-1">Export Functionality</strong>
                        <p className="mb-0 text-dark small" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                          Use the "Export" button to download the report data in CSV or PDF format. This is useful for sharing with your team, creating backup records, or performing further analysis in spreadsheet applications.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default CustomerPaymentStatusReport
