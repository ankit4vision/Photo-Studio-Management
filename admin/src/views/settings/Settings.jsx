import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Container, Row, Col, Button, Spinner, Form, FormControl, FormSelect, FormText, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faEnvelope, faGlobe, faSave, faCheckCircle, faFileInvoice, faCloud } from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../components'
import { settingsService } from '../../services/settingsService'
import { usePermissions } from '../../hooks'
import { PERMISSIONS } from '../../constants/permissions'

const Settings = () => {
  const { hasPermission } = usePermissions()
  const { success, error, warning } = useToast()

  const canViewSettings = hasPermission
    ? hasPermission(PERMISSIONS.SETTINGS_READ) || hasPermission(PERMISSIONS.SETTINGS_WRITE)
    : true
  const canEditSettings = hasPermission
    ? hasPermission(PERMISSIONS.SETTINGS_WRITE)
    : true
  const isReadOnly = !canEditSettings

  const [settingsData, setSettingsData] = useState({
    businessInfo: {
      company_name: 'Photo Studio Management',
      gstNumber: '',
      businessAddress: ''
    },
    invoiceSettings: {
      invoice_prefix: 'INV'
    },
    emailSettings: {
      supportEmail: 'support@photostudio.com',
      adminEmail: 'admin@photostudio.com',
      enableOrderNotifications: false
    },
    currencyRegional: {
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      timeZone: 'Asia/Kolkata'
    },
    s3Settings: {
      bucketName: '',
      region: 'ap-south-1',
      accessKey: '',
      secretKey: '',
      useSSL: true
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [autoSaving, setAutoSaving] = useState({}) // Track which fields are auto-saving
  const [autoSaved, setAutoSaved] = useState({}) // Track which fields were recently saved
  
  const isInitialLoadRef = useRef(true) // Track if we're still loading initial data
  
  // Mapping from form fields to API keys and sections
  const fieldMapping = {
    'businessInfo.company_name': { key: 'company_name', section: 'Business Information' },
    'businessInfo.gstNumber': { key: 'gstNumber', section: 'Business Information' },
    'businessInfo.businessAddress': { key: 'businessAddress', section: 'Business Information' },
    'invoiceSettings.invoice_prefix': { key: 'invoice_prefix', section: 'Invoice Settings' },
    'emailSettings.supportEmail': { key: 'supportEmail', section: 'Email Settings' },
    'emailSettings.adminEmail': { key: 'adminEmail', section: 'Email Settings' },
    'emailSettings.enableOrderNotifications': { key: 'enableOrderNotifications', section: 'Email Settings' },
    'currencyRegional.currency': { key: 'currency', section: 'Currency & Regional' },
    'currencyRegional.dateFormat': { key: 'dateFormat', section: 'Currency & Regional' },
    'currencyRegional.timeZone': { key: 'timeZone', section: 'Currency & Regional' },
    's3Settings.bucketName': { key: 's3_bucket_name', section: 'S3 Settings' },
    's3Settings.region': { key: 's3_region', section: 'S3 Settings' },
    's3Settings.accessKey': { key: 's3_access_key', section: 'S3 Settings' },
    's3Settings.secretKey': { key: 's3_secret_key', section: 'S3 Settings' },
    's3Settings.useSSL': { key: 's3_use_ssl', section: 'S3 Settings' }
  }

  useEffect(() => {
    if (!canViewSettings) {
      setLoading(false)
      warning && warning('You do not have permission to view settings.', { title: 'Access restricted' })
      return
    }

    const fetchSettings = async () => {
      setLoading(true)
      try {
        const response = await settingsService.getAllSections()
        if (response.success) {
          // Transform API response to form structure
          // transformSettingsToForm handles empty/null/undefined responses and returns defaults
          const transformedData = settingsService.transformSettingsToForm(response.data)
          setSettingsData(transformedData)
          // Mark initial load as complete
          isInitialLoadRef.current = false
        } else {
          // If API call fails, use default values
          error(response.message || 'Failed to load settings. Using default values.')
          // transformSettingsToForm will return defaults when passed null/undefined
          const defaultData = settingsService.transformSettingsToForm(null)
          setSettingsData(defaultData)
          isInitialLoadRef.current = false
        }
      } catch (err) {
        // If error occurs, use default values
        error('Failed to load settings. Using default values.')
        console.error('Error fetching settings:', err)
        const defaultData = settingsService.transformSettingsToForm(null)
        setSettingsData(defaultData)
        isInitialLoadRef.current = false
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewSettings, warning])

  // Auto-save function (triggered on blur)
  const autoSaveSetting = useCallback(async (fieldPath, key, section, value) => {
    if (!canEditSettings) {
      return
    }

    if (fieldPath === 's3Settings.secretKey' && !value) {
      return
    }
    
    const fieldId = fieldPath
    
    // Set auto-saving state
    setAutoSaving(prev => ({ ...prev, [fieldId]: true }))
    
    // Clear auto-saved indicator
    setAutoSaved(prev => {
      const newState = { ...prev }
      delete newState[fieldId]
      return newState
    })

    try {
      const response = await settingsService.saveSetting(key, section, value)
      if (response.success) {
        // Show success indicator
        setAutoSaved(prev => ({ ...prev, [fieldId]: true }))
        // Clear indicator after 2 seconds
        setTimeout(() => {
          setAutoSaved(prev => {
            const newState = { ...prev }
            delete newState[fieldId]
            return newState
          })
        }, 2000)
      } else {
        error(`Failed to save ${key}: ${response.message}`)
      }
    } catch (err) {
      error(`Failed to save ${key}. Please try again.`)
      console.error('Auto-save error:', err)
    } finally {
      setAutoSaving(prev => {
        const newState = { ...prev }
        delete newState[fieldId]
        return newState
      })
    }
  }, [error, canEditSettings])

  const handleChange = (section, field, value) => {
    if (!canEditSettings) {
      warning && warning('You do not have permission to modify settings.', { title: 'Read only' })
      return
    }
    const fieldPath = `${section}.${field}`
    
    // Update form data
    setSettingsData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    
    // Clear error if exists
    if (errors[fieldPath]) {
      setErrors(prev => ({
        ...prev,
        [fieldPath]: ''
      }))
    }
  }

  // Handle blur event (save when field loses focus)
  const handleBlur = (section, field, value) => {
    if (!canEditSettings) {
      return
    }
    const fieldPath = `${section}.${field}`
    
    // Auto-save if field mapping exists and not during initial load
    if (!isInitialLoadRef.current) {
      const mapping = fieldMapping[fieldPath]
      if (mapping) {
        autoSaveSetting(fieldPath, mapping.key, mapping.section, value)
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Validate Business Information
    if (!settingsData.businessInfo.company_name?.trim()) {
      newErrors['businessInfo.company_name'] = 'Company name is required'
    }

    // Validate Email addresses
    const emailRegex = /\S+@\S+\.\S+/
    if (settingsData.emailSettings.supportEmail && !emailRegex.test(settingsData.emailSettings.supportEmail)) {
      newErrors['emailSettings.supportEmail'] = 'Please enter a valid email address'
    }
    if (settingsData.emailSettings.adminEmail && !emailRegex.test(settingsData.emailSettings.adminEmail)) {
      newErrors['emailSettings.adminEmail'] = 'Please enter a valid email address'
    }
    
    // Validate S3 settings
    if (settingsData.s3Settings.bucketName && settingsData.s3Settings.bucketName.length < 3) {
      newErrors['s3Settings.bucketName'] = 'Bucket name must be at least 3 characters'
    }
    const hasS3Config =
      settingsData.s3Settings.bucketName ||
      settingsData.s3Settings.accessKey ||
      settingsData.s3Settings.secretKey

    if (hasS3Config && !settingsData.s3Settings.region?.trim()) {
      newErrors['s3Settings.region'] = 'Region is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveAll = async () => {
    if (!canEditSettings) {
      error('You do not have permission to update settings.')
      return
    }
    
    if (!validateForm()) {
      error('Please fix the validation errors before saving')
      return
    }
    
    setSaving(true)
    try {
      const response = await settingsService.updateAllSettings(settingsData)
      if (response.success) {
        success('All settings saved successfully!')
      } else {
        error(response.message || 'Failed to save settings')
      }
    } catch (err) {
      error('Failed to save settings. Please try again.')
    }
    setSaving(false)
  }


  const renderBusinessInfo = () => (
    <div className="mb-5">
      {/* Section Header */}
      <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
        <FontAwesomeIcon icon={faBuilding} className="me-3 text-success fs-4" />
        <h4 className="mb-0 text-success">Business Information</h4>
      </div>

      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Company Name
              {autoSaving['businessInfo.company_name'] && (
                <Spinner size="sm" className="ms-2" variant="primary" />
              )}
              {autoSaved['businessInfo.company_name'] && (
                <FontAwesomeIcon icon={faCheckCircle} className="ms-2 text-success" />
              )}
            </Form.Label>
            <FormControl
              value={settingsData.businessInfo.company_name}
              onChange={(e) => handleChange('businessInfo', 'company_name', e.target.value)}
              onBlur={(e) => handleBlur('businessInfo', 'company_name', e.target.value)}
              isInvalid={!!errors['businessInfo.company_name']}
              className="border-2"
            />
            {errors['businessInfo.company_name'] && (
              <FormText className="text-danger">{errors['businessInfo.company_name']}</FormText>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">GST Number</Form.Label>
            <FormControl
              placeholder="Enter GST registration number"
              value={settingsData.businessInfo.gstNumber}
              onChange={(e) => handleChange('businessInfo', 'gstNumber', e.target.value)}
              onBlur={(e) => handleBlur('businessInfo', 'gstNumber', e.target.value)}
              className="border-2"
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Business Address</Form.Label>
            <FormControl
              as="textarea"
              rows={3}
              value={settingsData.businessInfo.businessAddress}
              onChange={(e) => handleChange('businessInfo', 'businessAddress', e.target.value)}
              onBlur={(e) => handleBlur('businessInfo', 'businessAddress', e.target.value)}
              className="border-2"
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  )

  const renderInvoiceSettings = () => (
    <div className="mb-5">
      {/* Section Header */}
      <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
        <FontAwesomeIcon icon={faFileInvoice} className="me-3 text-success fs-4" />
        <h4 className="mb-0 text-success">Invoice Settings</h4>
      </div>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Invoice Prefix
              {autoSaving['invoiceSettings.invoice_prefix'] && (
                <Spinner size="sm" className="ms-2" variant="primary" />
              )}
              {autoSaved['invoiceSettings.invoice_prefix'] && (
                <FontAwesomeIcon icon={faCheckCircle} className="ms-2 text-success" />
              )}
            </Form.Label>
            <FormControl
              placeholder="INV"
              value={settingsData.invoiceSettings.invoice_prefix}
              onChange={(e) => handleChange('invoiceSettings', 'invoice_prefix', e.target.value)}
              onBlur={(e) => handleBlur('invoiceSettings', 'invoice_prefix', e.target.value)}
              className="border-2"
            />
            <FormText className="text-muted">Prefix for invoice numbers (e.g., INV-001, ORD-001)</FormText>
          </Form.Group>
        </Col>
      </Row>
    </div>
  )

  const renderEmailSettings = () => (
    <div className="mb-5">
      {/* Section Header */}
      <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
        <FontAwesomeIcon icon={faEnvelope} className="me-3 text-success fs-4" />
        <h4 className="mb-0 text-success">Email Settings</h4>
      </div>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Support Email
              {autoSaving['emailSettings.supportEmail'] && (
                <Spinner size="sm" className="ms-2" variant="primary" />
              )}
              {autoSaved['emailSettings.supportEmail'] && (
                <FontAwesomeIcon icon={faCheckCircle} className="ms-2 text-success" />
              )}
            </Form.Label>
            <FormControl
              type="email"
              value={settingsData.emailSettings.supportEmail}
              onChange={(e) => handleChange('emailSettings', 'supportEmail', e.target.value)}
              onBlur={(e) => handleBlur('emailSettings', 'supportEmail', e.target.value)}
              isInvalid={!!errors['emailSettings.supportEmail']}
              className="border-2"
            />
            {errors['emailSettings.supportEmail'] && (
              <FormText className="text-danger">{errors['emailSettings.supportEmail']}</FormText>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Admin Email
              {autoSaving['emailSettings.adminEmail'] && (
                <Spinner size="sm" className="ms-2" variant="primary" />
              )}
              {autoSaved['emailSettings.adminEmail'] && (
                <FontAwesomeIcon icon={faCheckCircle} className="ms-2 text-success" />
              )}
            </Form.Label>
            <FormControl
              type="email"
              value={settingsData.emailSettings.adminEmail}
              onChange={(e) => handleChange('emailSettings', 'adminEmail', e.target.value)}
              onBlur={(e) => handleBlur('emailSettings', 'adminEmail', e.target.value)}
              isInvalid={!!errors['emailSettings.adminEmail']}
              className="border-2"
            />
            {errors['emailSettings.adminEmail'] && (
              <FormText className="text-danger">{errors['emailSettings.adminEmail']}</FormText>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="email-enable-order-notifications"
              label={
                <span className="fw-semibold">
                  Enable email notifications for new orders
                  {autoSaving['emailSettings.enableOrderNotifications'] && (
                    <Spinner size="sm" className="ms-2" variant="primary" />
                  )}
                  {autoSaved['emailSettings.enableOrderNotifications'] && (
                    <FontAwesomeIcon icon={faCheckCircle} className="ms-2 text-success" />
                  )}
                </span>
              }
              checked={settingsData.emailSettings.enableOrderNotifications}
              onChange={(e) => handleChange('emailSettings', 'enableOrderNotifications', e.target.checked)}
              onBlur={(e) => handleBlur('emailSettings', 'enableOrderNotifications', e.target.checked)}
              className="fs-6"
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  )

  const renderCurrencyRegional = () => (
    <div className="mb-5">
      {/* Section Header */}
      <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
        <FontAwesomeIcon icon={faGlobe} className="me-3 text-success fs-4" />
        <h4 className="mb-0 text-success">Currency & Regional Settings</h4>
      </div>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Currency</Form.Label>
            <FormSelect
              value={settingsData.currencyRegional.currency}
              onChange={(e) => handleChange('currencyRegional', 'currency', e.target.value)}
              onBlur={(e) => handleBlur('currencyRegional', 'currency', e.target.value)}
              className="border-2"  
            >
              <option value="INR">Indian Rupee (INR)</option>
              <option value="NZD">New Zealand Dollar (NZD)</option>
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="GBP">British Pound (GBP)</option>
              <option value="AUD">Australian Dollar (AUD)</option>
            </FormSelect>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Date Format</Form.Label>
            <FormSelect
              value={settingsData.currencyRegional.dateFormat}
              onChange={(e) => handleChange('currencyRegional', 'dateFormat', e.target.value)}
              onBlur={(e) => handleBlur('currencyRegional', 'dateFormat', e.target.value)}
              className="border-2"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="DD-MM-YYYY">DD-MM-YYYY</option>
            </FormSelect>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Time Zone</Form.Label>
            <FormSelect
              value={settingsData.currencyRegional.timeZone}
              onChange={(e) => handleChange('currencyRegional', 'timeZone', e.target.value)}
              onBlur={(e) => handleBlur('currencyRegional', 'timeZone', e.target.value)}
              className="border-2"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="Pacific/Auckland">Pacific/Auckland (NZDT/NZST)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York (EST/EDT)</option>
              <option value="Europe/London">Europe/London (GMT/BST)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
            </FormSelect>
          </Form.Group>
        </Col>
      </Row>
    </div>
  )

  const renderS3Settings = () => (
    <div className="mb-5">
      {/* Section Header */}
      <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
        <FontAwesomeIcon icon={faCloud} className="me-3 text-success fs-4" />
        <h4 className="mb-0 text-success">S3 Bucket Settings</h4>
      </div>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Bucket Name
              {autoSaving['s3Settings.bucketName'] && (
                <Spinner size="sm" className="ms-2" variant="primary" />
              )}
              {autoSaved['s3Settings.bucketName'] && (
                <FontAwesomeIcon icon={faCheckCircle} className="ms-2 text-success" />
              )}
            </Form.Label>
            <FormControl
              placeholder="e.g., my-photo-bucket"
              value={settingsData.s3Settings.bucketName}
              onChange={(e) => handleChange('s3Settings', 'bucketName', e.target.value)}
              onBlur={(e) => handleBlur('s3Settings', 'bucketName', e.target.value)}
              isInvalid={!!errors['s3Settings.bucketName']}
              className="border-2"
            />
            {errors['s3Settings.bucketName'] && (
              <FormText className="text-danger">{errors['s3Settings.bucketName']}</FormText>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Region
              {autoSaving['s3Settings.region'] && (
                <Spinner size="sm" className="ms-2" variant="primary" />
              )}
              {autoSaved['s3Settings.region'] && (
                <FontAwesomeIcon icon={faCheckCircle} className="ms-2 text-success" />
              )}
            </Form.Label>
            <FormControl
              placeholder="e.g., ap-south-1"
              value={settingsData.s3Settings.region}
              onChange={(e) => handleChange('s3Settings', 'region', e.target.value)}
              onBlur={(e) => handleBlur('s3Settings', 'region', e.target.value)}
              isInvalid={!!errors['s3Settings.region']}
              className="border-2"
            />
            {errors['s3Settings.region'] && (
              <FormText className="text-danger">{errors['s3Settings.region']}</FormText>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Access Key ID
              {autoSaving['s3Settings.accessKey'] && (
                <Spinner size="sm" className="ms-2" variant="primary" />
              )}
              {autoSaved['s3Settings.accessKey'] && (
                <FontAwesomeIcon icon={faCheckCircle} className="ms-2 text-success" />
              )}
            </Form.Label>
            <FormControl
              placeholder="AWS access key ID"
              value={settingsData.s3Settings.accessKey}
              onChange={(e) => handleChange('s3Settings', 'accessKey', e.target.value)}
              onBlur={(e) => handleBlur('s3Settings', 'accessKey', e.target.value)}
              className="border-2"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Secret Access Key
              {autoSaving['s3Settings.secretKey'] && (
                <Spinner size="sm" className="ms-2" variant="primary" />
              )}
              {autoSaved['s3Settings.secretKey'] && (
                <FontAwesomeIcon icon={faCheckCircle} className="ms-2 text-success" />
              )}
            </Form.Label>
            <FormControl
              type="password"
              placeholder="AWS secret access key"
              value={settingsData.s3Settings.secretKey}
              onChange={(e) => handleChange('s3Settings', 'secretKey', e.target.value)}
              onBlur={(e) => handleBlur('s3Settings', 'secretKey', e.target.value)}
              className="border-2"
            />
            <FormText className="text-muted">We store this encrypted. Leave blank to keep the current secret.</FormText>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Use SSL when connecting to S3"
              checked={settingsData.s3Settings.useSSL}
              onChange={(e) => handleChange('s3Settings', 'useSSL', e.target.checked)}
              onBlur={(e) => handleBlur('s3Settings', 'useSSL', e.target.checked)}
              disabled={autoSaving['s3Settings.useSSL']}
              className="fs-6"
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  )

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner variant="primary" />
      </Container>
    )
  }

  if (!canViewSettings) {
    return (
      <Container fluid className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <FontAwesomeIcon icon={faCloud} className="text-muted mb-3" size="3x" />
            <h4 className="text-muted">Access Restricted</h4>
            <p className="text-muted">
              You do not have permission to view application settings. Please contact your administrator if you need additional access.
            </p>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          {/* Page Header */}
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <h2 className="mb-0 text-dark">Global Settings</h2>
            {canEditSettings && (
              <div className="ms-auto">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleSaveAll}
                  disabled={saving}
                  className="px-4"
                >
                  {saving ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} className="me-2" />
                      Save All Settings
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Settings Sections */}
          <div className="bg-white rounded-3 shadow-sm p-4">
            <fieldset disabled={isReadOnly} style={{ border: 'none', padding: 0, margin: 0 }}>
              {renderBusinessInfo()}
              {renderInvoiceSettings()}
              {renderEmailSettings()}
              {renderCurrencyRegional()}
              {renderS3Settings()}
            </fieldset>
            
            {/* Bottom Save Button */}
            {canEditSettings && (
              <div className="text-center mt-4 pt-4 border-top">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleSaveAll}
                  disabled={saving}
                  className="px-5"
                >
                  {saving ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} className="me-2" />
                      Save All Settings
                    </>
                  )}
                </Button>
              </div>
            )}
            {!canEditSettings && (
              <div className="text-center mt-4 pt-4 border-top">
                <Alert variant="info" className="mb-0">
                  You have read-only access to settings.
                </Alert>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Settings