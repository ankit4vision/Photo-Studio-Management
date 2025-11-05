import React, { useState, useRef } from 'react'
import { Container, Row, Col, Button, Card, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons'
import { FormModal } from '../../components'
import BranchForm from '../../components/pages/branches/BranchForm'
import branchService from '../../services/branchService'
import { useToast } from '../../components/common/ToastProvider'

const BranchFormView = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { showToast } = useToast()
  const formRef = useRef()
  const [loading, setLoading] = useState(false)
  const [branchData, setBranchData] = useState(null)
  const [loadingData, setLoadingData] = useState(!!id)

  const mode = id ? 'edit' : 'create'

  // Load branch data for edit mode
  React.useEffect(() => {
    if (mode === 'edit' && id) {
      const loadBranch = async () => {
        try {
          setLoadingData(true)
          const response = await branchService.getBranchById(id)
          if (response.success) {
            setBranchData(response.data)
          } else {
            showToast('Error loading branch data', 'error')
            navigate('/branches')
          }
        } catch (error) {
          console.error('Error loading branch:', error)
          showToast('Error loading branch data', 'error')
          navigate('/branches')
        } finally {
          setLoadingData(false)
        }
      }
      loadBranch()
    }
  }, [id, mode, navigate, showToast])

  const handleSubmit = async (formData) => {
    try {
      setLoading(true)
      
      if (mode === 'create') {
        const response = await branchService.createBranch(formData)
        if (response.success) {
          showToast('Branch created successfully', 'success')
          navigate('/branches')
        } else {
          showToast(response.message || 'Error creating branch', 'error')
        }
      } else {
        const response = await branchService.updateBranch(id, formData)
        if (response.success) {
          showToast('Branch updated successfully', 'success')
          navigate('/branches')
        } else {
          showToast(response.message || 'Error updating branch', 'error')
        }
      }
    } catch (error) {
      console.error('Error saving branch:', error)
      showToast('An error occurred while saving branch', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/branches')
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
              <FontAwesomeIcon icon={faBuilding} className="me-3 text-dark fs-4" />
              <h2 className="mb-0 text-dark">
                {mode === 'create' ? 'Create Branch' : 'Edit Branch'}
              </h2>
            </div>
          </div>

          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <BranchForm
                ref={formRef}
                mode={mode}
                branchData={branchData}
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
                      {mode === 'create' ? 'Create Branch' : 'Update Branch'}
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

export default BranchFormView

