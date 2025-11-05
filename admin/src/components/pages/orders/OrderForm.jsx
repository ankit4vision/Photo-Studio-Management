import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { FormRow, TextField, SelectField } from '../../common/FormFields'
import { Button, Table as BootstrapTable, Badge, Form, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import packageService from '../../../services/packageService'
import { customerService } from '../../../services/customerService'
import branchService from '../../../services/branchService'

const OrderForm = forwardRef(({ 
  mode = 'create', 
  orderData = null, 
  onSubmit, 
  onCancel,
  loading = false 
}, ref) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    branch_id: '',
    order_date: new Date().toISOString().split('T')[0],
    due_date: '',
    flat_discount: 0,
    items: []
  })
  const [packages, setPackages] = useState([])
  const [customers, setCustomers] = useState([])
  const [branches, setBranches] = useState([])
  const [errors, setErrors] = useState({})
  const [newItem, setNewItem] = useState({
    package_id: '',
    price: '',
    qty: 1
  })

  // Load data
  useEffect(() => {
    loadPackages()
    loadCustomers()
    loadBranches()
  }, [])

  // Load order data for edit mode
  useEffect(() => {
    if (mode === 'edit' && orderData) {
      setFormData({
        customer_id: orderData.customer_id?.toString() || '',
        branch_id: orderData.branch_id?.toString() || '',
        order_date: orderData.order_date ? orderData.order_date.split('T')[0] : new Date().toISOString().split('T')[0],
        due_date: orderData.due_date ? orderData.due_date.split('T')[0] : '',
        flat_discount: orderData.flat_discount || 0,
        items: orderData.items || []
      })
    }
  }, [mode, orderData])

  const loadPackages = async () => {
    try {
      const response = await packageService.getPackages({ status: 'active' })
      if (response.success) {
        setPackages(response.data || [])
      }
    } catch (error) {
      console.error('Error loading packages:', error)
    }
  }

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

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handlePackageSelect = (packageId) => {
    const selectedPackage = packages.find(p => p.id.toString() === packageId)
    if (selectedPackage) {
      setNewItem({
        package_id: packageId,
        price: selectedPackage.default_price || '',
        qty: 1
      })
    }
  }

  const handleAddItem = () => {
    if (!newItem.package_id) {
      setErrors({ ...errors, items: 'Please select a package' })
      return
    }

    const selectedPackage = packages.find(p => p.id.toString() === newItem.package_id)
    if (!selectedPackage) return

    const item = {
      package_id: parseInt(newItem.package_id),
      package_name: selectedPackage.package_name,
      price: parseFloat(newItem.price) || 0,
      qty: parseInt(newItem.qty) || 1,
      amount: (parseFloat(newItem.price) || 0) * (parseInt(newItem.qty) || 1)
    }

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, item]
    }))

    setNewItem({
      package_id: '',
      price: '',
      qty: 1
    })

    if (errors.items) {
      setErrors(prev => ({ ...prev, items: '' }))
    }
  }

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const handleItemChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updated = { ...item, [field]: value }
          if (field === 'price' || field === 'qty') {
            updated.amount = (parseFloat(updated.price) || 0) * (parseInt(updated.qty) || 1)
          }
          return updated
        }
        return item
      })
    }))
  }

  const calculateTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0)
    const discount = parseFloat(formData.flat_discount) || 0
    return subtotal - discount
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.customer_id) {
      newErrors.customer_id = 'Customer selection is required'
    }

    if (!formData.branch_id) {
      newErrors.branch_id = 'Branch selection is required'
    }

    if (!formData.order_date) {
      newErrors.order_date = 'Order date is required'
    }

    if (formData.items.length === 0) {
      newErrors.items = 'At least one package item is required'
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
      order_date: formData.order_date,
      due_date: formData.due_date || null,
      flat_discount: parseFloat(formData.flat_discount) || 0,
      total_amount: calculateTotal(),
      items: formData.items
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

  const packageOptions = packages.map(pkg => ({
    value: pkg.id.toString(),
    label: `${pkg.package_name} - ${pkg.package_type} (₹${pkg.default_price})`
  }))

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
        <TextField
          id="order_date"
          label="Order Date"
          type="date"
          value={formData.order_date}
          onChange={(e) => handleChange('order_date', e.target.value)}
          required
          col={6}
          invalid={!!errors.order_date}
          feedback={errors.order_date}
        />
        <TextField
          id="due_date"
          label="Due Date"
          type="date"
          value={formData.due_date}
          onChange={(e) => handleChange('due_date', e.target.value)}
          col={6}
        />
      </FormRow>

      {/* Order Items Section */}
      <div className="mt-4">
        <div className="d-flex align-items-center mb-3 pb-2 border-bottom border-success border-2">
          <h5 className="mb-0 text-success">Order Items</h5>
        </div>

        {/* Add Item Form */}
        <div className="bg-light p-3 rounded mb-3">
          <FormRow className="mb-0">
            <Col md={4}>
              <Form.Label className="fw-semibold">Package</Form.Label>
              <Form.Select
                value={newItem.package_id}
                onChange={(e) => handlePackageSelect(e.target.value)}
                className="border-2"
              >
                <option value="">Select Package</option>
                {packageOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Label className="fw-semibold">Price</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                className="border-2"
                placeholder="0.00"
              />
            </Col>
            <Col md={2}>
              <Form.Label className="fw-semibold">Qty</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={newItem.qty}
                onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
                className="border-2"
              />
            </Col>
            <Col md={2}>
              <Form.Label className="fw-semibold">&nbsp;</Form.Label>
              <div>
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleAddItem}
                  className="text-white w-100"
                >
                  <FontAwesomeIcon icon={faPlus} className="me-1" />
                  Add
                </Button>
              </div>
            </Col>
          </FormRow>
        </div>

        {errors.items && (
          <div className="text-danger small mb-2">{errors.items}</div>
        )}

        {/* Items Table */}
        {formData.items.length > 0 && (
          <div className="mb-3">
            <BootstrapTable striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.package_name}</td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        className="border-2"
                        style={{ width: '100px' }}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                        className="border-2"
                        style={{ width: '80px' }}
                      />
                    </td>
                    <td className="fw-semibold">{formatCurrency(item.amount)}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </BootstrapTable>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="mt-4 p-3 bg-light rounded">
        <FormRow className="mb-2">
          <Col md={6}>
            <div className="d-flex justify-content-between">
              <span className="fw-semibold">Subtotal:</span>
              <span>{formatCurrency(formData.items.reduce((sum, item) => sum + (item.amount || 0), 0))}</span>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex justify-content-between mb-2">
              <span className="fw-semibold">Flat Discount:</span>
              <div className="d-flex align-items-center gap-2">
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.flat_discount}
                  onChange={(e) => handleChange('flat_discount', e.target.value)}
                  className="border-2"
                  style={{ width: '120px' }}
                />
              </div>
            </div>
          </Col>
        </FormRow>
        <div className="border-top pt-2 mt-2">
          <div className="d-flex justify-content-between">
            <span className="fw-bold fs-5">Total Amount:</span>
            <span className="fw-bold fs-5 text-success">{formatCurrency(calculateTotal())}</span>
          </div>
        </div>
      </div>
    </div>
  )
})

OrderForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  orderData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool
}

export default OrderForm

