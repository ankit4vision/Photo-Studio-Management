import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Badge, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faCartShopping, faUsers, faArrowTrendUp, faArrowTrendDown, faClock, faRefresh, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import MainChart from './MainChart'

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0
  })
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

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setIsRefreshing(true)
    try {
      // Simulate API call with date range
      await new Promise(resolve => setTimeout(resolve, 1000))
      setDashboardStats({
        totalRevenue: 45678,
        totalOrders: 892,
        totalCustomers: 1247
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData()
  }, [dateRange])

  // Handle refresh button click
  const handleRefresh = () => {
    fetchDashboardData()
  }

  // Handle date range change
  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Stats cards data
  const statsData = [
    {
      title: 'Total Revenue',
      value: `$${dashboardStats.totalRevenue.toLocaleString()}`,
      change: '+8.2%',
      changeType: 'positive',
      icon: faDollarSign,
      color: 'success',
      gradient: 'bg-gradient-success'
    },
    {
      title: 'Total Orders',
      value: dashboardStats.totalOrders.toLocaleString(),
      change: '+15.3%',
      changeType: 'positive',
      icon: faCartShopping,
      color: 'info',
      gradient: 'bg-gradient-info'
    },
    {
      title: 'Total Customers',
      value: dashboardStats.totalCustomers.toLocaleString(),
      change: '+12.1%',
      changeType: 'positive',
      icon: faUsers,
      color: 'primary',
      gradient: 'bg-gradient-primary'
    }
  ]

  // Recent activities data
  const recentActivities = [
    { id: 1, user: 'John Smith', action: 'Placed order #1234', time: '2 minutes ago', type: 'order' },
    { id: 2, user: 'Sarah Johnson', action: 'New customer registered', time: '5 minutes ago', type: 'user' },
    { id: 3, user: 'Mike Wilson', action: 'Completed order #1233', time: '8 minutes ago', type: 'order' },
    { id: 4, user: 'Emma Davis', action: 'Payment received for order #1231', time: '12 minutes ago', type: 'payment' },
    { id: 5, user: 'David Brown', action: 'Placed order #1232', time: '15 minutes ago', type: 'order' },
    { id: 6, user: 'Lisa Anderson', action: 'New customer registered', time: '18 minutes ago', type: 'user' }
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order': return faCartShopping
      case 'user': return faUsers
      case 'payment': return faDollarSign
      default: return faClock
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'order': return 'success'
      case 'user': return 'primary'
      case 'payment': return 'success'
      default: return 'secondary'
    }
  }

  return (
    <Container fluid>
      {/* Page Header */}
      <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
        <h2 className="mb-0 text-dark">Dashboard</h2>
        <div className="ms-auto d-flex align-items-center gap-3">
          {/* Date Range Picker */}
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-success" />
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
      <Row className="mb-5">
        {statsData.map((item, index) => (
          <Col md={4} key={`stat-card-${index}`}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-3 ${item.gradient} text-white`}>
                      <FontAwesomeIcon icon={item.icon} size="lg" />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-4">
                    <div className="text-muted small fw-semibold mb-1">{item.title}</div>
                    <div className="h3 mb-2 fw-bold text-dark">{item.value}</div>
                    <div className={`small fw-semibold ${item.changeType === 'positive' ? 'text-success' : 'text-danger'}`}>
                      <FontAwesomeIcon 
                        icon={item.changeType === 'positive' ? faArrowTrendUp : faArrowTrendDown} 
                        className="me-1" 
                      />
                      {item.change} from last month
                    </div>
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
          <div className="bg-white rounded-3 shadow-sm p-4">
            <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
              <FontAwesomeIcon icon={faDollarSign} className="me-3 text-success fs-4" />
              <h4 className="mb-0 text-success">Revenue Trends</h4>
            </div>
            <div className="mb-3">
                <div className="d-flex gap-2">
                <Button variant="outline-success" size="sm">7 Days</Button>
                <Button variant="success" size="sm">30 Days</Button>
                <Button variant="outline-success" size="sm">90 Days</Button>
              </div>
                    </div>
            <MainChart dateRange={dateRange} />
              </div>
        </Col>

        {/* Recent Activities */}
        <Col md={4}>
          <div className="bg-white rounded-3 shadow-sm p-4">
            <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
              <FontAwesomeIcon icon={faClock} className="me-3 text-success fs-4" />
              <h4 className="mb-0 text-success">Recent Activities</h4>
                </div>
            <div className="d-grid gap-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="d-flex align-items-center p-3 bg-light rounded-3">
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-circle bg-${getActivityColor(activity.type)} bg-opacity-10`}>
                      <FontAwesomeIcon 
                        icon={getActivityIcon(activity.type)} 
                        className={`text-${getActivityColor(activity.type)}`} 
                        size="sm" 
                      />
              </div>
                </div>
                  <div className="flex-grow-1 ms-3">
                    <div className="fw-semibold text-dark mb-1">{activity.user}</div>
                    <div className="small text-muted">{activity.action}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="small text-muted">{activity.time}</div>
                  </div>
                </div>
              ))}
              </div>
            <div className="mt-4 text-center">
              <Button variant="outline-success" size="sm">
                View All Activities
              </Button>
                </div>
              </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard
