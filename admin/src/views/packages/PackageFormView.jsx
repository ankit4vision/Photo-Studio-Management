import React, { useState, useRef } from 'react'
import { Container, Row, Col, Button, Card, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons'
import PackageForm from '../../components/pages/packages/PackageForm'
import packageService from '../../services/packageService'
import { useToast } from '../../components/common/ToastProvider'

const PackageFormView = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { showToast } = useToast()
  const formRef = useRef()
  const [loading, setLoading] = useState(false)
  const [packageData, setPackageData] = useState(null)
  const [loadingData, setLoadingData] = useState(!!id)

  const mode = id ? 'edit' : 'create'

  // Load package data for edit mode
  React.useEffect(() => {
    if (mode === 'edit' && id) {
      const loadPackage = async () => {
        try {
          setLoadingData(true)
          const response = await packageService.getPackageById(id)
          if (response.success) {
            setPackageData(response.data)
          } else {
            showToast('Error loading package data', 'error')
            navigate('/packages')
          }
        } catch (error) {
          console.error('Error loading package:', error)
          showToast('Error loading package data', 'error')
          navigate('/packages')
        } finally {
          setLoadingData(false)
        }
      }
      loadPackage()
    }
  }, [id, mode, navigate, showToast])

  const handleSubmit = async (formData) => {
    try {
      setLoading(true)
      
      if (mode === 'create') {
        const response = await packageService.createPackage(formData)
        if (response.success) {
          showToast('Package created successfully', 'success')
          navigate('/packages')
        } else {
          showToast(response.message || 'Error creating package', 'error')
        }
      } else {
        const response = await packageService.updatePackage(id, formData)
        if (response.success) {
          showToast('Package updated successfully', 'success')
          navigate('/packages')
        } else {
          showToast(response.message || 'Error updating package', 'error')
        }
      }
    } catch (error) {
      console.error('Error saving package:', error)
      showToast('An error occurred while saving package', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/packages')
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
              <FontAwesomeIcon icon={faTag} className="me-3 text-dark fs-4" />
              <h2 className="mb-0 text-dark">
                {mode === 'create' ? 'Create Package' : 'Edit Package'}
              </h2>
            </div>
          </div>

          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <PackageForm
                ref={formRef}
                mode={mode}
                packageData={packageData}
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
                      {mode === 'create' ? 'Create Package' : 'Update Package'}
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

export default PackageFormView

