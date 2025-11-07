import React, { useState, useRef } from 'react'
import { Container, Row, Col, Button, Card, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons'
import CustomerForm from '../../components/pages/customers/CustomerForm'
import { customerService } from '../../services/customerService'
import branchService from '../../services/branchService'
import { useToast } from '../../components/common/ToastProvider'

const CustomerFormView = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { success, error } = useToast()
  const formRef = useRef()
  const [loading, setLoading] = useState(false)
  const [customerData, setCustomerData] = useState(null)
  const [branches, setBranches] = useState([])
  const [loadingData, setLoadingData] = useState(!!id)

  const mode = id ? 'edit' : 'create'

  // Load branches and customer data
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true)
        
        // Load branches
        const branchesResponse = await branchService.getBranches()
        if (branchesResponse.success) {
          setBranches(branchesResponse.data || [])
        }

        // Load customer data for edit mode
        if (mode === 'edit' && id) {
          const customerResponse = await customerService.getCustomerById(id)
          if (customerResponse.success) {
            setCustomerData(customerResponse.data)
          } else {
            error('Error loading customer data')
            navigate('/customers')
          }
        }
      } catch (err) {
        console.error('Error loading data:', err)
        error('Error loading data')
        if (mode === 'edit') {
          navigate('/customers')
        }
      } finally {
        setLoadingData(false)
      }
    }
    loadData()
  }, [id, mode, navigate, error])

  const handleSubmit = async (formData) => {
    try {
      setLoading(true)
      
      if (mode === 'create') {
        const response = await customerService.createCustomer(formData)
        if (response.success) {
          success('Customer created successfully')
          navigate('/customers')
        } else {
          error(response.message || 'Error creating customer')
        }
      } else {
        const response = await customerService.updateCustomer(id, formData)
        if (response.success) {
          success('Customer updated successfully')
          navigate('/customers')
        } else {
          error(response.message || 'Error updating customer')
        }
      }
    } catch (err) {
      console.error('Error saving customer:', err)
      error('An error occurred while saving customer')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/customers')
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
              <FontAwesomeIcon icon={faUsers} className="me-3 text-dark fs-4" />
              <h2 className="mb-0 text-dark">
                {mode === 'create' ? 'Create Customer' : 'Edit Customer'}
              </h2>
            </div>
          </div>

          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <CustomerForm
                ref={formRef}
                mode={mode}
                customerData={customerData}
                branches={branches}
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
                      {mode === 'create' ? 'Create Customer' : 'Update Customer'}
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

export default CustomerFormView

