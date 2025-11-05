import React, { useState, useRef } from 'react'
import { Container, Row, Col, Button, Card, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCart, faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons'
import OrderForm from '../../components/pages/orders/OrderForm'
import orderService from '../../services/orderService'
import { useToast } from '../../components/common/ToastProvider'

const OrderFormView = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { showToast } = useToast()
  const formRef = useRef()
  const [loading, setLoading] = useState(false)
  const [orderData, setOrderData] = useState(null)
  const [loadingData, setLoadingData] = useState(!!id)

  const mode = id ? 'edit' : 'create'

  // Load order data for edit mode
  React.useEffect(() => {
    if (mode === 'edit' && id) {
      const loadOrder = async () => {
        try {
          setLoadingData(true)
          const response = await orderService.getOrderById(id)
          if (response.success) {
            setOrderData(response.data)
          } else {
            showToast('Error loading order data', 'error')
            navigate('/orders')
          }
        } catch (error) {
          console.error('Error loading order:', error)
          showToast('Error loading order data', 'error')
          navigate('/orders')
        } finally {
          setLoadingData(false)
        }
      }
      loadOrder()
    }
  }, [id, mode, navigate, showToast])

  const handleSubmit = async (formData) => {
    try {
      setLoading(true)
      
      if (mode === 'create') {
        const response = await orderService.createOrder(formData)
        if (response.success) {
          showToast('Order created successfully', 'success')
          navigate('/orders')
        } else {
          showToast(response.message || 'Error creating order', 'error')
        }
      } else {
        const response = await orderService.updateOrder(id, formData)
        if (response.success) {
          showToast('Order updated successfully', 'success')
          navigate('/orders')
        } else {
          showToast(response.message || 'Error updating order', 'error')
        }
      }
    } catch (error) {
      console.error('Error saving order:', error)
      showToast('An error occurred while saving order', 'error')
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
              <FontAwesomeIcon icon={faCart} className="me-3 text-dark fs-4" />
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

