import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { FormRow, TextField, SelectField } from '../../common/FormFields'
import { Card } from 'react-bootstrap'
import PropTypes from 'prop-types'
import paymentService from '../../../services/paymentService'
import orderService from '../../../services/orderService'

const PaymentForm = forwardRef(({ 
  mode = 'create', 
  paymentData = null,
  initialOrderId = null,
  onSubmit, 
  onCancel,
  loading = false 
}, ref) => {
  const [formData, setFormData] = useState({
    order_id: initialOrderId || '',
    amount: '',
    payment_method: 'cash',
    payment_date: new Date().toISOString().split('T')[0],
    remarks: ''
  })
  const [order, setOrder] = useState(null)
  const [loadingOrder, setLoadingOrder] = useState(false)
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    if (formData.order_id) {
      loadOrderDetails(formData.order_id)
    } else {
      setOrder(null)
    }
  }, [formData.order_id])

  const loadOrders = async () => {
    try {
      setLoadingOrders(true)
      const response = await orderService.getOrders({ status: 'all' })
      if (response.success) {
        setOrders(response.data?.orders || response.data || [])
      }
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoadingOrders(false)
    }
  }

  useEffect(() => {
    if (mode === 'edit' && paymentData) {
      setFormData({
        order_id: paymentData.order_id?.toString() || '',
        amount: paymentData.amount || '',
        payment_method: paymentData.payment_method || 'cash',
        payment_date: paymentData.payment_date ? paymentData.payment_date.split('T')[0] : new Date().toISOString().split('T')[0],
        remarks: paymentData.remarks || ''
      })
    }
  }, [mode, paymentData])

  const loadOrderDetails = async (orderId) => {
    try {
      setLoadingOrder(true)
      const response = await orderService.getOrderById(orderId)
      if (response.success) {
        setOrder(response.data)
        // Auto-fill amount with balance if available
        if (response.data.balance_amount && !formData.amount) {
          setFormData(prev => ({
            ...prev,
            amount: response.data.balance_amount.toString()
          }))
        }
      }
    } catch (error) {
      console.error('Error loading order:', error)
    } finally {
      setLoadingOrder(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.order_id) {
      newErrors.order_id = 'Order selection is required'
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount is required and must be greater than 0'
    } else if (order && parseFloat(formData.amount) > parseFloat(order.balance_amount || order.total_amount)) {
      newErrors.amount = `Amount cannot exceed order balance of ${formatCurrency(order.balance_amount || order.total_amount)}`
    }

    if (!formData.payment_method) {
      newErrors.payment_method = 'Payment method is required'
    }

    if (!formData.payment_date) {
      newErrors.payment_date = 'Payment date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    const submitData = {
      order_id: parseInt(formData.order_id),
      amount: parseFloat(formData.amount),
      payment_method: formData.payment_method,
      payment_date: formData.payment_date,
      remarks: formData.remarks.trim() || null
    }

    onSubmit(submitData)
  }

  useImperativeHandle(ref, () => ({
    handleSubmit: handleSubmit
  }), [formData, order])

  const paymentMethods = paymentService.getPaymentMethods()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0)
  }

  return (
    <div>
      <FormRow>
        <SelectField
          id="order_id"
          label="Order"
          value={formData.order_id}
          onChange={(e) => handleChange('order_id', e.target.value)}
          options={[
            { value: '', label: 'Select Order' },
            ...orders.map(order => ({
              value: order.id.toString(),
              label: `Order #${order.id} - ${order.customer_name || 'Customer'} - ${formatCurrency(order.total_amount)} (Balance: ${formatCurrency(order.balance_amount || order.total_amount)})`
            }))
          ]}
          required
          col={6}
          invalid={!!errors.order_id}
          feedback={errors.order_id}
          helpText={loadingOrders ? 'Loading orders...' : 'Select order to record payment'}
        />
        <TextField
          id="payment_date"
          label="Payment Date"
          type="date"
          value={formData.payment_date}
          onChange={(e) => handleChange('payment_date', e.target.value)}
          required
          col={6}
          invalid={!!errors.payment_date}
          feedback={errors.payment_date}
        />
      </FormRow>

      {/* Order Details Card */}
      {order && (
        <Card className="mb-3 border-info">
          <Card.Body>
            <h6 className="text-info mb-3">Order Details</h6>
            <div className="row">
              <div className="col-md-6">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Order ID:</span>
                  <span className="fw-semibold">#{order.id}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Total Amount:</span>
                  <span className="fw-semibold">{formatCurrency(order.total_amount)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Paid Amount:</span>
                  <span className="fw-semibold text-success">{formatCurrency(order.paid_amount || 0)}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Balance Amount:</span>
                  <span className="fw-semibold text-danger">{formatCurrency(order.balance_amount || order.total_amount)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Order Date:</span>
                  <span>{new Date(order.order_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      <FormRow>
        <TextField
          id="amount"
          label="Payment Amount"
          type="number"
          min="0.01"
          step="0.01"
          value={formData.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          placeholder="Enter payment amount"
          required
          col={6}
          invalid={!!errors.amount}
          feedback={errors.amount}
          helpText={order ? `Max: ${formatCurrency(order.balance_amount || order.total_amount)}` : 'Enter payment amount'}
        />
        <SelectField
          id="payment_method"
          label="Payment Method"
          value={formData.payment_method}
          onChange={(e) => handleChange('payment_method', e.target.value)}
          options={paymentMethods}
          required
          col={6}
          invalid={!!errors.payment_method}
          feedback={errors.payment_method}
        />
      </FormRow>

      <FormRow>
        <TextField
          id="remarks"
          label="Remarks"
          value={formData.remarks}
          onChange={(e) => handleChange('remarks', e.target.value)}
          placeholder="Enter remarks (optional)"
          col={12}
        />
      </FormRow>
    </div>
  )
})

PaymentForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  paymentData: PropTypes.object,
  initialOrderId: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool
}

export default PaymentForm

