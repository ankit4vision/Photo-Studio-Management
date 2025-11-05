import React, { useState, useRef } from 'react'
import { Container, Row, Col, Button, Card, Spinner } from 'react-bootstrap'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons'
import TransactionForm from '../../components/pages/transactions/TransactionForm'
import transactionService from '../../services/transactionService'
import { useToast } from '../../components/common/ToastProvider'

const TransactionFormView = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const { showToast } = useToast()
  const formRef = useRef()
  const [loading, setLoading] = useState(false)
  const [transactionData, setTransactionData] = useState(null)
  const [loadingData, setLoadingData] = useState(!!id)

  const mode = id ? 'edit' : 'create'
  const initialCustomerId = searchParams.get('customer_id') || null
  const initialOrderId = searchParams.get('order_id') || null

  // Load transaction data for edit mode
  React.useEffect(() => {
    if (mode === 'edit' && id) {
      const loadTransaction = async () => {
        try {
          setLoadingData(true)
          const response = await transactionService.getTransactionById(id)
          if (response.success) {
            setTransactionData(response.data)
          } else {
            showToast('Error loading transaction data', 'error')
            navigate('/transactions')
          }
        } catch (error) {
          console.error('Error loading transaction:', error)
          showToast('Error loading transaction data', 'error')
          navigate('/transactions')
        } finally {
          setLoadingData(false)
        }
      }
      loadTransaction()
    }
  }, [id, mode, navigate, showToast])

  const handleSubmit = async (formData) => {
    try {
      setLoading(true)
      
      if (mode === 'create') {
        const response = await transactionService.createTransaction(formData)
        if (response.success) {
          showToast('Transaction created successfully', 'success')
          if (initialCustomerId) {
            navigate(`/customers/${initialCustomerId}/wallet`)
          } else {
            navigate('/transactions')
          }
        } else {
          showToast(response.message || 'Error creating transaction', 'error')
        }
      } else {
        const response = await transactionService.updateTransaction(id, formData)
        if (response.success) {
          showToast('Transaction updated successfully', 'success')
          navigate('/transactions')
        } else {
          showToast(response.message || 'Error updating transaction', 'error')
        }
      }
    } catch (error) {
      console.error('Error saving transaction:', error)
      showToast('An error occurred while saving transaction', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (initialCustomerId) {
      navigate(`/customers/${initialCustomerId}/wallet`)
    } else {
      navigate('/transactions')
    }
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
              <FontAwesomeIcon icon={faWallet} className="me-3 text-dark fs-4" />
              <h2 className="mb-0 text-dark">
                {mode === 'create' ? 'Create Transaction' : 'Edit Transaction'}
              </h2>
            </div>
          </div>

          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <TransactionForm
                ref={formRef}
                mode={mode}
                transactionData={transactionData}
                initialCustomerId={initialCustomerId}
                initialOrderId={initialOrderId}
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
                      {mode === 'create' ? 'Create Transaction' : 'Update Transaction'}
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

export default TransactionFormView

