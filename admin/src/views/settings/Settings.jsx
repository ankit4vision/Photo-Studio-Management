import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Container, Row, Col, Button, Spinner, Form, FormControl, FormSelect, FormText, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPercentage, faBuilding, faEnvelope, faGlobe, faShieldAlt, faSave, faCheckCircle, faFileInvoice } from '@fortawesome/free-solid-svg-icons'
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
    taxPricing: {
      tax_percentage: 15,
      defaultProfitMargin: 25
    },
    businessInfo: {
      company_name: 'Photo Studio Management',
      logo: '',
      gstNumber: '',
      businessAddress: ''
    },
    invoiceSettings: {
      invoice_prefix: 'INV'
    },
    emailNotifications: {
      supportEmail: 'support@photostudio.com',
      adminEmail: 'admin@photostudio.com',
      enableOrderNotifications: false
    },
    currencyRegional: {
      currency: 'NZD',
      dateFormat: 'DD/MM/YYYY',
      timeZone: 'Pacific/Auckland'
    },
    security: {
      sessionTimeout: 30,
      passwordExpiry: 90,
      enableTwoFactor: false
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
    'taxPricing.tax_percentage': { key: 'tax_percentage', section: 'Tax & Pricing' },
    'taxPricing.defaultProfitMargin': { key: 'defaultProfitMargin', section: 'Tax & Pricing' },
    'businessInfo.company_name': { key: 'company_name', section: 'Business Information' },
    'businessInfo.logo': { key: 'logo', section: 'Business Information' },
    'businessInfo.gstNumber': { key: 'gstNumber', section: 'Business Information' },
    'businessInfo.businessAddress': { key: 'businessAddress', section: 'Business Information' },
    'invoiceSettings.invoice_prefix': { key: 'invoice_prefix', section: 'Invoice Settings' },
    'emailNotifications.supportEmail': { key: 'supportEmail', section: 'Email & Notification' },
    'emailNotifications.adminEmail': { key: 'adminEmail', section: 'Email & Notification' },
    'emailNotifications.enableOrderNotifications': { key: 'enableOrderNotifications', section: 'Email & Notification' },
    'currencyRegional.currency': { key: 'currency', section: 'Currency & Regional' },
    'currencyRegional.dateFormat': { key: 'dateFormat', section: 'Currency & Regional' },
    'currencyRegional.timeZone': { key: 'timeZone', section: 'Currency & Regional' },
    'security.sessionTimeout': { key: 'sessionTimeout', section: 'Security' },
    'security.passwordExpiry': { key: 'passwordExpiry', section: 'Security' },
    'security.enableTwoFactor': { key: 'enableTwoFactor', section: 'Security' }
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
    
    // Validate Tax Percentage
    if (settingsData.taxPricing.tax_percentage < 0 || settingsData.taxPricing.tax_percentage > 100) {
      newErrors['taxPricing.tax_percentage'] = 'Tax percentage must be between 0 and 100'
    }
    
    // Validate Profit Margin
    if (settingsData.taxPricing.defaultProfitMargin < 0 || settingsData.taxPricing.defaultProfitMargin > 100) {
      newErrors['taxPricing.defaultProfitMargin'] = 'Profit margin must be between 0 and 100'
    }
    
    // Validate Email addresses
    const emailRegex = /\S+@\S+\.\S+/
    if (settingsData.emailNotifications.supportEmail && !emailRegex.test(settingsData.emailNotifications.supportEmail)) {
      newErrors['emailNotifications.supportEmail'] = 'Please enter a valid email address'
    }
    if (settingsData.emailNotifications.adminEmail && !emailRegex.test(settingsData.emailNotifications.adminEmail)) {
      newErrors['emailNotifications.adminEmail'] = 'Please enter a valid email address'
    }
    
    // Validate Session Timeout
    if (settingsData.security.sessionTimeout < 5 || settingsData.security.sessionTimeout > 480) {
      newErrors['security.sessionTimeout'] = 'Session timeout must be between 5 and 480 minutes'
    }
    
    // Validate Password Expiry
    if (settingsData.security.passwordExpiry < 30 || settingsData.security.passwordExpiry > 365) {
      newErrors['security.passwordExpiry'] = 'Password expiry must be between 30 and 365 days'
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

  const renderTaxPricingSettings = () => (
    <div className="mb-5">
      {/* Section Header */}
      <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
        <FontAwesomeIcon icon={faPercentage} className="me-3 text-success fs-4" />
        <h4 className="mb-0 text-success">Tax & Pricing Settings</h4>
      </div>

      {/* Summary Stats */}
      <Row className="mb-4">
        <Col md={6}>
            <div className="p-4 rounded-3 bg-gradient-logo text-dark mb-3 shadow-sm">
            <div className="text-center">
              <h3 className="mb-1 text-dark">{settingsData.taxPricing.tax_percentage}%</h3>
              <p className="mb-0 fw-semibold text-dark">Tax Percentage</p>
              <small className="text-muted">Tax percentage applied to all orders unless specified individually.</small>
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="p-4 rounded-3 bg-gradient-logo-alt text-dark mb-3 shadow-sm">
            <div className="text-center">
              <h3 className="mb-1 text-dark">{settingsData.taxPricing.defaultProfitMargin}%</h3>
              <p className="mb-0 fw-semibold text-dark">Default Profit Margin</p>
              <small className="text-muted">Default profit margin applied to all packages unless specified individually.</small>
            </div>
          </div>
        </Col>
      </Row>

      {/* Input Fields */}
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Tax Percentage (%)
              {autoSaving['taxPricing.tax_percentage'] && (
                <Spinner size="sm" className="ms-2" variant="primary" />
              )}
              {autoSaved['taxPricing.tax_percentage'] && (
                <FontAwesomeIcon icon={faCheckCircle} className="ms-2 text-success" />
              )}
            </Form.Label>
            <FormControl
              type="number"
              min="0"
              max="100"
              value={settingsData.taxPricing.tax_percentage}
              onChange={(e) => handleChange('taxPricing', 'tax_percentage', parseInt(e.target.value) || 0)}
              onBlur={(e) => handleBlur('taxPricing', 'tax_percentage', parseInt(e.target.value) || 0)}
              isInvalid={!!errors['taxPricing.tax_percentage']}
              className="border-2"
            />
            <FormText className="text-muted">This will be used for orders that don't have a specific tax percentage set.</FormText>
            {errors['taxPricing.tax_percentage'] && (
              <FormText className="text-danger">{errors['taxPricing.tax_percentage']}</FormText>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Default Profit Margin (%)
              {autoSaving['taxPricing.defaultProfitMargin'] && (
                <Spinner size="sm" className="ms-2" variant="primary" />
              )}
              {autoSaved['taxPricing.defaultProfitMargin'] && (
                <FontAwesomeIcon icon={faCheckCircle} className="ms-2 text-success" />
              )}
            </Form.Label>
            <FormControl
              type="number"
              min="0"
              max="100"
              value={settingsData.taxPricing.defaultProfitMargin}
              onChange={(e) => handleChange('taxPricing', 'defaultProfitMargin', parseInt(e.target.value) || 0)}
              onBlur={(e) => handleBlur('taxPricing', 'defaultProfitMargin', parseInt(e.target.value) || 0)}
              isInvalid={!!errors['taxPricing.defaultProfitMargin']}
              className="border-2"
            />
            <FormText className="text-muted">This will be used for packages that don't have a specific margin set.</FormText>
            {errors['taxPricing.defaultProfitMargin'] && (
              <FormText className="text-danger">{errors['taxPricing.defaultProfitMargin']}</FormText>
            )}
          </Form.Group>
        </Col>
      </Row>
    </div>
  )

  const renderBusinessInfo = () => (
    <div className="mb-5">
      {/* Section Header */}
      <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
        <FontAwesomeIcon icon={faBuilding} className="me-3 text-success fs-4" />
        <h4 className="mb-0 text-success">Business Information</h4>
      </div>

      <Row>
        <Col md={6}>
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
              className="border-2"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Logo URL</Form.Label>
            <FormControl
              placeholder="Enter logo URL or upload image"
              value={settingsData.businessInfo.logo}
              onChange={(e) => handleChange('businessInfo', 'logo', e.target.value)}
              onBlur={(e) => handleBlur('businessInfo', 'logo', e.target.value)}
              className="border-2"
            />
            <FormText className="text-muted">URL or path to your company logo</FormText>
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

  const renderEmailNotifications = () => (
    <div className="mb-5">
      {/* Section Header */}
      <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
        <FontAwesomeIcon icon={faEnvelope} className="me-3 text-success fs-4" />
        <h4 className="mb-0 text-success">Email & Notification Settings</h4>
      </div>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Support Email</Form.Label>
            <FormControl
              type="email"
              value={settingsData.emailNotifications.supportEmail}
              onChange={(e) => handleChange('emailNotifications', 'supportEmail', e.target.value)}
              onBlur={(e) => handleBlur('emailNotifications', 'supportEmail', e.target.value)}
              isInvalid={!!errors['emailNotifications.supportEmail']}
              className="border-2"
            />
            {errors['emailNotifications.supportEmail'] && (
              <FormText className="text-danger">{errors['emailNotifications.supportEmail']}</FormText>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Admin Email</Form.Label>
            <FormControl
              type="email"
              value={settingsData.emailNotifications.adminEmail}
              onChange={(e) => handleChange('emailNotifications', 'adminEmail', e.target.value)}
              onBlur={(e) => handleBlur('emailNotifications', 'adminEmail', e.target.value)}
              isInvalid={!!errors['emailNotifications.adminEmail']}
              className="border-2"
            />
            {errors['emailNotifications.adminEmail'] && (
              <FormText className="text-danger">{errors['emailNotifications.adminEmail']}</FormText>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Enable email notifications for new orders"
              checked={settingsData.emailNotifications.enableOrderNotifications}
              onChange={(e) => handleChange('emailNotifications', 'enableOrderNotifications', e.target.checked)}
              onBlur={(e) => handleBlur('emailNotifications', 'enableOrderNotifications', e.target.checked)}
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

  const renderSecuritySettings = () => (
    <div className="mb-5">
      {/* Section Header */}
      <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
        <FontAwesomeIcon icon={faShieldAlt} className="me-3 text-success fs-4" />
        <h4 className="mb-0 text-success">Security Settings</h4>
      </div>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Session Timeout (minutes)</Form.Label>
            <FormControl
              type="number"
              min="5"
              max="480"
              value={settingsData.security.sessionTimeout}
              onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value) || 30)}
              onBlur={(e) => handleBlur('security', 'sessionTimeout', parseInt(e.target.value) || 30)}
              isInvalid={!!errors['security.sessionTimeout']}
              className="border-2"
            />
            <FormText className="text-muted">Automatically log out inactive users after this period.</FormText>
            {errors['security.sessionTimeout'] && (
              <FormText className="text-danger">{errors['security.sessionTimeout']}</FormText>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Password Expiry (days)</Form.Label>
            <FormControl
              type="number"
              min="30"
              max="365"
              value={settingsData.security.passwordExpiry}
              onChange={(e) => handleChange('security', 'passwordExpiry', parseInt(e.target.value) || 90)}
              onBlur={(e) => handleBlur('security', 'passwordExpiry', parseInt(e.target.value) || 90)}
              isInvalid={!!errors['security.passwordExpiry']}
              className="border-2"
            />
            <FormText className="text-muted">Force password change after this period.</FormText>
            {errors['security.passwordExpiry'] && (
              <FormText className="text-danger">{errors['security.passwordExpiry']}</FormText>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Enable Two-Factor Authentication for admin accounts"
              checked={settingsData.security.enableTwoFactor}
              onChange={(e) => handleChange('security', 'enableTwoFactor', e.target.checked)}
              onBlur={(e) => handleBlur('security', 'enableTwoFactor', e.target.checked)}
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
            <FontAwesomeIcon icon={faShieldAlt} className="text-muted mb-3" size="3x" />
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
              {renderTaxPricingSettings()}
              {renderBusinessInfo()}
              {renderInvoiceSettings()}
              {renderEmailNotifications()}
              {renderCurrencyRegional()}
              {renderSecuritySettings()}
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