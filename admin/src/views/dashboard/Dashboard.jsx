import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faCartShopping, faUsers, faArrowTrendUp, faArrowTrendDown, faClock, faRefresh, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import MainChart from './MainChart'
import dashboardService from '../../services/dashboardService'
import { formatCurrency } from '../../utils'
import { useToast } from '../../components'

const Dashboard = () => {
  const { error: showError } = useToast()

  const [summary, setSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(true)

  const [trendRange, setTrendRange] = useState(30)
  const [trendData, setTrendData] = useState([])
  const [trendLoading, setTrendLoading] = useState(true)

  const [activities, setActivities] = useState([])
  const [activitiesLoading, setActivitiesLoading] = useState(true)

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })

  // Set default 3-month range
  useEffect(() => {
    const today = new Date()
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(today.getMonth() - 3)
    
    setDateRange({
      startDate: threeMonthsAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    })
  }, [])

  const fetchSummary = async () => {
    if (!dateRange.startDate || !dateRange.endDate) return
    setSummaryLoading(true)
    try {
      const response = await dashboardService.getSummary({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      })
      if (response.success) {
        setSummary(response.data)
      } else {
        showError(response.message || 'Failed to load dashboard summary')
      }
    } catch (error) {
      console.error('Error fetching dashboard summary:', error)
      showError('Failed to load dashboard summary')
    } finally {
      setSummaryLoading(false)
    }
  }

  const fetchTrend = async (options = {}) => {
    setTrendLoading(true)
    try {
      const response = await dashboardService.getRevenueTrend({
        range: options.range || trendRange,
        endDate: dateRange.endDate,
      })
      if (response.success) {
        setTrendData(response.data?.points || [])
      } else {
        showError(response.message || 'Failed to load revenue trend')
      }
    } catch (error) {
      console.error('Error fetching revenue trend:', error)
      showError('Failed to load revenue trend')
    } finally {
      setTrendLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      fetchSummary()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange])

  useEffect(() => {
    if (dateRange.endDate) {
      fetchTrend({ range: trendRange })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trendRange, dateRange.endDate])

  // Handle refresh button click
  const handleRefresh = () => {
    setIsRefreshing(true)
    Promise.all([fetchSummary(), fetchTrend({ range: trendRange })]).finally(() => setIsRefreshing(false))
  }

  // Handle date range change
  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const totals = summary?.overallTotals || summary?.totals || { revenue: 0, orders: 0, customers: 0 }
  const changes = summary?.changes || {
    revenue: { direction: 'up', value: 0 },
    orders: { direction: 'up', value: 0 },
    customers: { direction: 'up', value: 0 },
  }

  const statsData = [
    {
      title: 'Total Revenue',
      value: formatCurrency(totals.revenue || 0),
      change: `${changes.revenue.value}%`,
      changeType: changes.revenue.direction === 'up' ? 'positive' : 'negative',
      icon: faDollarSign,
      color: 'success',
      gradient: 'bg-gradient-success'
    },
    {
      title: 'Total Orders',
      value: (totals.orders || 0).toLocaleString(),
      change: `${changes.orders.value}%`,
      changeType: changes.orders.direction === 'up' ? 'positive' : 'negative',
      icon: faCartShopping,
      color: 'info',
      gradient: 'bg-gradient-info'
    },
    {
      title: 'Total Customers',
      value: (totals.customers || 0).toLocaleString(),
      change: `${changes.customers.value}%`,
      changeType: changes.customers.direction === 'up' ? 'positive' : 'negative',
      icon: faUsers,
      color: 'primary',
      gradient: 'bg-gradient-primary'
    }
  ]

  return (
    <div className="dashboard-page">
    <Container fluid>
      {/* Page Header */}
      <div className="dashboard-header d-flex align-items-center mb-4 pb-3 border-bottom">
        <div>
          <p className="mb-1 text-muted text-uppercase small fw-semibold">Overview</p>
          <h2 className="mb-0 text-dark fw-bold">Dashboard</h2>
        </div>
        <div className="ms-auto d-flex align-items-center gap-3">
          {/* Date Range Picker */}
          <div className="d-flex align-items-center gap-2 dashboard-date-picker">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-theme" />
            <Form.Control
              type="date"
              size="sm"
              value={dateRange.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              className="border-success"
              style={{ width: '140px' }}
            />
            <span className="text-muted">to</span>
            <Form.Control
              type="date"
              size="sm"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
              className="border-success"
              style={{ width: '140px' }}
            />
          </div>
          
          {/* Refresh Button */}
          <Button 
            variant="outline-success" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <FontAwesomeIcon 
              icon={faRefresh} 
              className={`me-2 ${isRefreshing ? 'fa-spin' : ''}`} 
            />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-5 g-4">
        {statsData.map((item, index) => (
          <Col md={4} key={`stat-card-${index}`}>
            <Card className="dashboard-stat-card h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <div className="text-muted small fw-semibold text-uppercase tracking-tight">{item.title}</div>
                      <div className="h3 mb-0 fw-bold text-dark">
                        {summaryLoading ? <Spinner animation="border" size="sm" /> : item.value}
                      </div>
                    </div>
                    <div className={`stat-icon ${item.gradient}`}>
                      <FontAwesomeIcon icon={item.icon} size="lg" />
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted small">Vs previous period</span>
                    <div className={`change-badge ${item.changeType}`}>
                      <FontAwesomeIcon 
                        icon={item.changeType === 'positive' ? faArrowTrendUp : faArrowTrendDown} 
                        className="me-1" 
                      />
                      {summaryLoading ? '--' : item.change}
                    </div>
                  </div>
                  <div className="stat-progress bg-light rounded-pill">
                    <div
                      className={`stat-progress-fill ${item.color}`}
                      style={{ width: summaryLoading ? '0%' : `${Math.min(100, Math.abs(parseFloat(item.change)))}%` }}
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        {/* Revenue Trends Chart */}
        <Col md={8}>
          <div className="dashboard-card bg-white rounded-3 shadow-sm p-4">
            <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
              <div>
                <p className="text-muted text-uppercase small mb-1 fw-semibold">Performance</p>
                <h4 className="mb-0 text-theme">Revenue Trends</h4>
              </div>
            </div>
            <div className="mb-3">
                <div className="d-flex gap-2 flex-wrap">
                {[7, 30, 90].map((range) => (
                  <Button
                    key={range}
                    variant={trendRange === range ? 'success' : 'outline-success'}
                    size="sm"
                    onClick={() => setTrendRange(range)}
                  >
                    {range === 7 ? '7 Days' : range === 30 ? '30 Days' : '90 Days'}
                  </Button>
                ))}
              </div>
                    </div>
            {trendLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="success" />
              </div>
            ) : (
              <MainChart points={trendData} />
            )}
              </div>
        </Col>

        {/* Placeholder column for future enhancements */}
        <Col md={4}>
          <div className="dashboard-card bg-white rounded-3 shadow-sm p-4 h-100 d-flex flex-column justify-content-center align-items-center text-center">
            <div className="mb-3">
              <FontAwesomeIcon icon={faClock} className="text-theme fs-1" />
            </div>
            <h4 className="text-dark fw-bold mb-2">Live Updates</h4>
            <p className="text-muted mb-0">
              Real-time widgets coming soon. This area will display dynamic insights pulled directly from backend events.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
    </div>
  )
}

export default Dashboard

