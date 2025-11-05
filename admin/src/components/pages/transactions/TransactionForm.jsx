import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { FormRow, TextField, SelectField } from '../../common/FormFields'
import PropTypes from 'prop-types'
import { customerService } from '../../../services/customerService'
import branchService from '../../../services/branchService'
import orderService from '../../../services/orderService'
import transactionService from '../../../services/transactionService'

const TransactionForm = forwardRef(({ 
  mode = 'create', 
  transactionData = null,
  initialCustomerId = null,
  initialOrderId = null,
  onSubmit, 
  onCancel,
  loading = false 
}, ref) => {
  const [formData, setFormData] = useState({
    customer_id: initialCustomerId || '',
    order_id: initialOrderId || '',
    branch_id: '',
    transaction_date: new Date().toISOString().split('T')[0],
    type: 'credit',
    amount: '',
    remarks: ''
  })
  const [customers, setCustomers] = useState([])
  const [branches, setBranches] = useState([])
  const [orders, setOrders] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadCustomers()
    loadBranches()
  }, [])

  useEffect(() => {
    if (formData.customer_id) {
      loadOrdersByCustomer(formData.customer_id)
    } else {
      setOrders([])
    }
  }, [formData.customer_id])

  useEffect(() => {
    if (mode === 'edit' && transactionData) {
      setFormData({
        customer_id: transactionData.customer_id?.toString() || '',
        order_id: transactionData.order_id?.toString() || '',
        branch_id: transactionData.branch_id?.toString() || '',
        transaction_date: transactionData.transaction_date ? transactionData.transaction_date.split('T')[0] : new Date().toISOString().split('T')[0],
        type: transactionData.type || 'credit',
        amount: transactionData.amount || '',
        remarks: transactionData.remarks || ''
      })
    }
  }, [mode, transactionData])

  const loadCustomers = async () => {
    try {
      const response = await customerService.getCustomers()
      if (response.success) {
        setCustomers(response.data || [])
      }
    } catch (error) {
      console.error('Error loading customers:', error)
    }
  }

  const loadBranches = async () => {
    try {
      const response = await branchService.getBranches({ status: 'active' })
      if (response.success) {
        setBranches(response.data || [])
      }
    } catch (error) {
      console.error('Error loading branches:', error)
    }
  }

  const loadOrdersByCustomer = async (customerId) => {
    try {
      const response = await orderService.getOrdersByCustomer(customerId)
      if (response.success) {
        setOrders(response.data?.orders || response.data || [])
      }
    } catch (error) {
      console.error('Error loading orders:', error)
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

    if (!formData.customer_id) {
      newErrors.customer_id = 'Customer selection is required'
    }

    if (!formData.branch_id) {
      newErrors.branch_id = 'Branch selection is required'
    }

    if (!formData.transaction_date) {
      newErrors.transaction_date = 'Transaction date is required'
    }

    if (!formData.type) {
      newErrors.type = 'Transaction type is required'
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount is required and must be greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    const submitData = {
      customer_id: parseInt(formData.customer_id),
      branch_id: parseInt(formData.branch_id),
      transaction_date: formData.transaction_date,
      type: formData.type,
      amount: parseFloat(formData.amount),
      remarks: formData.remarks.trim() || null,
      order_id: formData.order_id ? parseInt(formData.order_id) : null
    }

    onSubmit(submitData)
  }

  useImperativeHandle(ref, () => ({
    handleSubmit: handleSubmit
  }), [formData])

  const customerOptions = [
    { value: '', label: 'Select Customer' },
    ...customers.map(customer => ({
      value: customer.id.toString(),
      label: `${customer.name || customer.firstName} ${customer.lastName || ''} - ${customer.mobile || customer.phone || ''}`
    }))
  ]

  const branchOptions = [
    { value: '', label: 'Select Branch' },
    ...branches.map(branch => ({
      value: branch.id.toString(),
      label: `${branch.branch_name} (${branch.branch_code})`
    }))
  ]

  const orderOptions = [
    { value: '', label: 'No Order (Manual Transaction)' },
    ...orders.map(order => ({
      value: order.id.toString(),
      label: `Order #${order.id} - ${new Date(order.order_date).toLocaleDateString()}`
    }))
  ]

  const transactionTypes = transactionService.getTransactionTypes()

  return (
    <div>
      <FormRow>
        <SelectField
          id="customer_id"
          label="Customer"
          value={formData.customer_id}
          onChange={(e) => handleChange('customer_id', e.target.value)}
          options={customerOptions}
          required
          col={6}
          invalid={!!errors.customer_id}
          feedback={errors.customer_id}
        />
        <SelectField
          id="branch_id"
          label="Branch"
          value={formData.branch_id}
          onChange={(e) => handleChange('branch_id', e.target.value)}
          options={branchOptions}
          required
          col={6}
          invalid={!!errors.branch_id}
          feedback={errors.branch_id}
        />
      </FormRow>

      <FormRow>
        <SelectField
          id="type"
          label="Transaction Type"
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          options={transactionTypes}
          required
          col={6}
          invalid={!!errors.type}
          feedback={errors.type}
        />
        <TextField
          id="transaction_date"
          label="Transaction Date"
          type="date"
          value={formData.transaction_date}
          onChange={(e) => handleChange('transaction_date', e.target.value)}
          required
          col={6}
          invalid={!!errors.transaction_date}
          feedback={errors.transaction_date}
        />
      </FormRow>

      <FormRow>
        <TextField
          id="amount"
          label="Amount"
          type="number"
          min="0.01"
          step="0.01"
          value={formData.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          placeholder="Enter amount"
          required
          col={6}
          invalid={!!errors.amount}
          feedback={errors.amount}
          helpText={formData.type === 'credit' ? 'Credit = Money In (advance, payment received)' : 'Debit = Money Out (order, refund, due)'}
        />
        <SelectField
          id="order_id"
          label="Related Order (Optional)"
          value={formData.order_id}
          onChange={(e) => handleChange('order_id', e.target.value)}
          options={orderOptions}
          col={6}
          helpText="Link this transaction to an order (optional)"
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

TransactionForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  transactionData: PropTypes.object,
  initialCustomerId: PropTypes.string,
  initialOrderId: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool
}

export default TransactionForm

