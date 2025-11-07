import React, { useState, useRef } from 'react'
import { Container, Row, Col, Button, Card, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons'
import OrderForm from '../../components/pages/orders/OrderForm'
import orderService from '../../services/orderService'
import { useToast } from '../../components/common/ToastProvider'

const OrderFormView = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { success, error } = useToast()
  const formRef = useRef()
  const [loading, setLoading] = useState(false)
  const [orderData, setOrderData] = useState(null)
  const [loadingData, setLoadingData] = useState(!!id)

  const mode = id ? 'edit' : 'create'

  const normalizeOrderData = (order) => {
    if (!order) return null

    const orderDate = order.order_date || order.orderDate || new Date().toISOString()
    const dueDate = order.due_date || order.dueDate || null
    const flatDiscount = order.flat_discount !== undefined ? order.flat_discount : (order.discount || 0)
    const customerId = order.customer_id || order.customerId || order.customer?.id || ''
    const branchId = order.branch_id || order.branchId || ''

    const normalizedItems = (order.items || []).map((item, index) => {
      const quantity = item.qty || item.quantity || 1
      const price = item.price !== undefined
        ? item.price
        : item.unitPrice !== undefined
          ? item.unitPrice
          : item.amount !== undefined && quantity
            ? item.amount / quantity
            : item.totalPrice !== undefined && quantity
              ? item.totalPrice / quantity
              : 0

      const amount = item.amount !== undefined
        ? item.amount
        : item.totalPrice !== undefined
          ? item.totalPrice
          : price * quantity

      return {
        id: item.id || index + 1,
        package_id: (item.package_id || item.packageId || item.productId || item.id || index + 1).toString(),
        package_name: item.package_name || item.packageName || item.productName || item.title || `Package ${index + 1}`,
        price,
        qty: quantity,
        amount
      }
    })

    return {
      ...order,
      customer_id: customerId,
      branch_id: branchId?.toString() || '',
      order_date: orderDate,
      due_date: dueDate,
      flat_discount: flatDiscount,
      items: normalizedItems
    }
  }

  // Load order data for edit mode
  React.useEffect(() => {
    if (mode === 'edit' && id) {
      const loadOrder = async () => {
        try {
          setLoadingData(true)
          const response = await orderService.getOrderById(id)
          if (response.success) {
            const normalized = normalizeOrderData(response.data)
            if (!normalized) {
              error('Order data is invalid')
              navigate('/orders')
              return
            }
            setOrderData(normalized)
          } else {
            error('Error loading order data')
            navigate('/orders')
          }
        } catch (err) {
          console.error('Error loading order:', err)
          error('Error loading order data')
          navigate('/orders')
        } finally {
          setLoadingData(false)
        }
      }
      loadOrder()
    }
  }, [id, mode, navigate, error])

  const handleSubmit = async (formData) => {
    try {
      setLoading(true)
      
      if (mode === 'create') {
        const response = await orderService.createOrder(formData)
        if (response.success) {
          success('Order created successfully')
          navigate('/orders')
        } else {
          error(response.message || 'Error creating order')
        }
      } else {
        const response = await orderService.updateOrder(id, formData)
        if (response.success) {
          success('Order updated successfully')
          navigate('/orders')
        } else {
          error(response.message || 'Error updating order')
        }
      }
    } catch (err) {
      console.error('Error saving order:', err)
      error('An error occurred while saving order')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/orders')
  }

  if (loadingData) {
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
              onClick={handleCancel}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back
            </Button>
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faShoppingCart} className="me-3 text-dark fs-4" />
              <h2 className="mb-0 text-dark">
                {mode === 'create' ? 'Create Order' : 'Edit Order'}
              </h2>
            </div>
          </div>

          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <OrderForm
                ref={formRef}
                mode={mode}
                orderData={orderData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={loading}
              />

              <div className="d-flex gap-2 justify-content-end mt-4">
                <Button variant="outline-secondary" onClick={handleCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  variant="success"
                  onClick={() => formRef.current?.handleSubmit()}
                  disabled={loading}
                  className="text-white"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} className="me-2" />
                      {mode === 'create' ? 'Create Order' : 'Update Order'}
                    </>
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default OrderFormView

