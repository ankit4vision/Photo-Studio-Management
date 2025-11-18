import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Container, Row, Col, Button, Spinner, Form, FormControl, FormSelect, FormText, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faEnvelope, faGlobe, faSave, faCheckCircle, faFileInvoice, faCloud, faPaperPlane, faCog, faImage, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../components'
import { settingsService } from '../../services/settingsService'
import { usePermissions } from '../../hooks'
import { PERMISSIONS } from '../../constants/permissions'
import ImageUploadWithUpload from '../../components/common/ImageUploadWithUpload'

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
      business_email: '',
      business_phone: '',
      business_website: '',
      gstNumber: '',
      businessAddress: '',
      business_logo: ''
    },
    invoiceSettings: {
      invoice_prefix: 'INV'
    },
    emailSettings: {
      mailer: 'smtp',
      host: '',
      port: '',
      username: '',
      password: '',
      encryption: 'tls',
      from_address: '',
      from_name: ''
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
    },
    appSettings: {
      web_url: ''
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [autoSaving, setAutoSaving] = useState({}) // Track which fields are auto-saving
  const [autoSaved, setAutoSaved] = useState({}) // Track which fields were recently saved
  const [testEmailAddress, setTestEmailAddress] = useState('')
  const [sendingTestEmail, setSendingTestEmail] = useState(false)
  const [testingS3, setTestingS3] = useState(false)
  const [logoPreview, setLogoPreview] = useState(null)
  
  const isInitialLoadRef = useRef(true) // Track if we're still loading initial data
  
  // Mapping from form fields to API keys and sections
  const fieldMapping = {
    'businessInfo.company_name': { key: 'company_name', section: 'Business Information' },
    'businessInfo.business_email': { key: 'business_email', section: 'Business Information' },
    'businessInfo.business_phone': { key: 'business_phone', section: 'Business Information' },
    'businessInfo.business_website': { key: 'business_website', section: 'Business Information' },
    'businessInfo.gstNumber': { key: 'gstNumber', section: 'Business Information' },
    'businessInfo.businessAddress': { key: 'businessAddress', section: 'Business Information' },
    'businessInfo.business_logo': { key: 'business_logo', section: 'Business Information' },
    'invoiceSettings.invoice_prefix': { key: 'invoice_prefix', section: 'Invoice Settings' },
    'emailSettings.mailer': { key: 'mailer', section: 'Email Settings' },
    'emailSettings.host': { key: 'host', section: 'Email Settings' },
    'emailSettings.port': { key: 'port', section: 'Email Settings' },
    'emailSettings.username': { key: 'username', section: 'Email Settings' },
    'emailSettings.password': { key: 'password', section: 'Email Settings' },
    'emailSettings.encryption': { key: 'encryption', section: 'Email Settings' },
    'emailSettings.from_address': { key: 'from_address', section: 'Email Settings' },
    'emailSettings.from_name': { key: 'from_name', section: 'Email Settings' },
    'currencyRegional.currency': { key: 'currency', section: 'Currency & Regional' },
    'currencyRegional.dateFormat': { key: 'dateFormat', section: 'Currency & Regional' },
    'currencyRegional.timeZone': { key: 'timeZone', section: 'Currency & Regional' },
    's3Settings.enabled': { key: 'enabled', section: 's3' },
    's3Settings.bucketName': { key: 'bucket', section: 's3' },
    's3Settings.region': { key: 'region', section: 's3' },
    's3Settings.accessKey': { key: 'key', section: 's3' },
    's3Settings.secretKey': { key: 'secret', section: 's3' },
    's3Settings.useSSL': { key: 'use_path_style', section: 's3' },
    'appSettings.web_url': { key: 'web_url', section: 'App Settings' }
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
          // Set logo preview if logo exists
          if (transformedData.businessInfo?.business_logo) {
            setLogoPreview(transformedData.businessInfo.business_logo)
          }
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
    
    // Don't auto-save email settings on blur - they should be saved together via "Save Email Settings" button
    if (section === 'emailSettings') {
      return
    }
    
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

    const emailRegex = /\S+@\S+\.\S+/
    if (settingsData.businessInfo.business_email && !emailRegex.test(settingsData.businessInfo.business_email)) {
      newErrors['businessInfo.business_email'] = 'Please enter a valid business email address'
    }

    const phoneRegex = /^[0-9+()\-\s]{6,20}$/
    if (settingsData.businessInfo.business_phone && !phoneRegex.test(settingsData.businessInfo.business_phone)) {
      newErrors['businessInfo.business_phone'] = 'Please enter a valid phone number'
    }

    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/
    if (settingsData.businessInfo.business_website && !urlRegex.test(settingsData.businessInfo.business_website.trim())) {
      newErrors['businessInfo.business_website'] = 'Please enter a valid website URL'
    }

    // Validate Email Settings
    if (settingsData.emailSettings.from_address && !emailRegex.test(settingsData.emailSettings.from_address)) {
      newErrors['emailSettings.from_address'] = 'Please enter a valid email address'
    }
    if (settingsData.emailSettings.host && !settingsData.emailSettings.host.trim()) {
      newErrors['emailSettings.host'] = 'SMTP Host is required'
    }
    if (settingsData.emailSettings.port && (!/^\d+$/.test(settingsData.emailSettings.port) || parseInt(settingsData.emailSettings.port) < 1 || parseInt(settingsData.emailSettings.port) > 65535)) {
      newErrors['emailSettings.port'] = 'Please enter a valid port number (1-65535)'
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
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Business Email
              {autoSaving['businessInfo.business_email'] && (
                <Spinner size="sm" className="ms-2" variant="primary" />
              )}
              {autoSaved['businessInfo.business_email'] && (
                <FontAwesomeIcon icon={faCheckCircle} className="ms-2 text-success" />
              )}
            </Form.Label>
            <FormControl
              type="email"
              placeholder="contact@yourcompany.com"
              value={settingsData.businessInfo.business_email}
              onChange={(e) => handleChange('businessInfo', 'business_email', e.target.value)}
              onBlur={(e) => handleBlur('businessInfo', 'business_email', e.target.value)}
              className="border-2"
              isInvalid={!!errors['businessInfo.business_email']}
            />
            {errors['businessInfo.business_email'] && (
              <FormText className="text-danger">{errors['businessInfo.business_email']}</FormText>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Business Phone
              {autoSaving['businessInfo.business_phone'] && (
                <Spinner size="sm" className="ms-2" variant="primary" />
              )}
              {autoSaved['businessInfo.business_phone'] && (
                <FontAwesomeIcon icon={faCheckCircle} className="ms-2 text-success" />
              )}
            </Form.Label>
            <FormControl
              placeholder="+91 98765 43210"
              value={settingsData.businessInfo.business_phone}
              onChange={(e) => handleChange('businessInfo', 'business_phone', e.target.value)}
              onBlur={(e) => handleBlur('businessInfo', 'business_phone', e.target.value)}
              className="border-2"
              isInvalid={!!errors['businessInfo.business_phone']}
            />
            {errors['businessInfo.business_phone'] && (
              <FormText className="text-danger">{errors['businessInfo.business_phone']}</FormText>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Business Website
              {autoSaving['businessInfo.business_website'] && (
                <Spinner size="sm" className="ms-2" variant="primary" />
              )}
              {autoSaved['businessInfo.business_website'] && (
                <FontAwesomeIcon icon={faCheckCircle} className="ms-2 text-success" />
              )}
            </Form.Label>
            <FormControl
              placeholder="https://www.yourcompany.com"
              value={settingsData.businessInfo.business_website}
              onChange={(e) => handleChange('businessInfo', 'business_website', e.target.value)}
              onBlur={(e) => handleBlur('businessInfo', 'business_website', e.target.value)}
              className="border-2"
              isInvalid={!!errors['businessInfo.business_website']}
            />
            {errors['businessInfo.business_website'] && (
              <FormText className="text-danger">{errors['businessInfo.business_website']}</FormText>
            )}
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
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <ImageUploadWithUpload
              value={logoPreview || settingsData.businessInfo.business_logo || ''}
              onChange={handleLogoChange}
              label="Business Logo"
              module="settings"
              folder="logos"
              existingPath={settingsData.businessInfo.business_logo || null}
              visibility="public"
              maxSize={2 * 1024 * 1024} // 2MB
              previewSize={{ width: 200, height: 150 }}
              disabled={isReadOnly}
              onUploadComplete={handleLogoUploadComplete}
              onUploadError={(errorMsg) => error(errorMsg)}
              onRemove={handleRemoveLogo}
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

  const handleSaveEmailSettings = async () => {
    if (!canEditSettings) {
      error('You do not have permission to update settings.')
      return
    }

    // Validate email settings
    const emailRegex = /\S+@\S+\.\S+/
    const newErrors = {}
    
    if (!settingsData.emailSettings.host?.trim()) {
      newErrors['emailSettings.host'] = 'SMTP Host is required'
    }
    if (!settingsData.emailSettings.port?.trim()) {
      newErrors['emailSettings.port'] = 'SMTP Port is required'
    }
    if (!/^\d+$/.test(settingsData.emailSettings.port) || parseInt(settingsData.emailSettings.port) < 1 || parseInt(settingsData.emailSettings.port) > 65535) {
      newErrors['emailSettings.port'] = 'Please enter a valid port number (1-65535)'
    }
    if (!settingsData.emailSettings.username?.trim()) {
      newErrors['emailSettings.username'] = 'SMTP User is required'
    }
    if (!settingsData.emailSettings.password?.trim()) {
      newErrors['emailSettings.password'] = 'SMTP Password is required'
    }
    if (!settingsData.emailSettings.from_address?.trim()) {
      newErrors['emailSettings.from_address'] = 'From Email is required'
    } else if (!emailRegex.test(settingsData.emailSettings.from_address)) {
      newErrors['emailSettings.from_address'] = 'Please enter a valid email address'
    }
    if (!settingsData.emailSettings.from_name?.trim()) {
      newErrors['emailSettings.from_name'] = 'From Name is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      error('Please fix the validation errors before saving')
      return
    }

    setSaving(true)
    try {
      // Save all email settings
      const emailSettingsToSave = {
        mailer: settingsData.emailSettings.mailer,
        host: settingsData.emailSettings.host,
        port: settingsData.emailSettings.port,
        username: settingsData.emailSettings.username,
        password: settingsData.emailSettings.password,
        encryption: settingsData.emailSettings.encryption,
        from_address: settingsData.emailSettings.from_address,
        from_name: settingsData.emailSettings.from_name,
      }

      // Save each setting (suppress 404 errors as they're expected for new settings)
      const savePromises = Object.entries(emailSettingsToSave).map(async ([key, value]) => {
        try {
          return await settingsService.saveSetting(key, 'Email Settings', value)
        } catch (err) {
          // Ignore 404 errors as they're expected when creating new settings
          if (err.response?.status === 404) {
            return { success: true, message: `${key} saved` }
          }
          throw err
        }
      })

      const results = await Promise.all(savePromises)
      const allSuccess = results.every(r => r && r.success)

      if (allSuccess) {
        success('Email settings saved successfully!')
      } else {
        const failedSettings = results
          .map((r, index) => (!r || !r.success) ? Object.keys(emailSettingsToSave)[index] : null)
          .filter(Boolean)
        error(`Failed to save: ${failedSettings.join(', ')}. Please try again.`)
      }
    } catch (err) {
      error('Failed to save email settings. Please try again.')
      console.error('Save email settings error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleLogoChange = (path, url, uploadResult) => {
    // Update settings data with the stored path
    setSettingsData(prev => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        business_logo: path || ''
      }
    }))
    
    // Update preview with URL if available
    if (url) {
      setLogoPreview(url)
    } else if (path) {
      setLogoPreview(path)
    } else {
      setLogoPreview(null)
    }

    // Auto-save the logo path to settings
    if (path && !isInitialLoadRef.current) {
      autoSaveSetting('businessInfo.business_logo', 'business_logo', 'Business Information', path)
    }
  }

  const handleLogoUploadComplete = (uploadResult, file) => {
    success('Business logo uploaded successfully!')
  }

  const handleRemoveLogo = async () => {
    if (!canEditSettings) {
      warning && warning('You do not have permission to modify settings.', { title: 'Read only' })
      return
    }

    try {
      const response = await settingsService.saveSetting('business_logo', 'Business Information', '')
      if (response.success) {
        setSettingsData(prev => ({
          ...prev,
          businessInfo: {
            ...prev.businessInfo,
            business_logo: ''
          }
        }))
        setLogoPreview(null)
        success('Business logo removed successfully!')
      } else {
        error(response.message || 'Failed to remove logo')
      }
    } catch (err) {
      error('Failed to remove logo. Please try again.')
      console.error('Remove logo error:', err)
    }
  }

  const handleSendTestEmail = async () => {
    if (!testEmailAddress?.trim()) {
      error('Please enter a test email address')
      return
    }

    const emailRegex = /\S+@\S+\.\S+/
    if (!emailRegex.test(testEmailAddress.trim())) {
      error('Please enter a valid email address')
      return
    }

    setSendingTestEmail(true)
    try {
      const response = await settingsService.sendTestEmail(testEmailAddress.trim())
      if (response.success) {
        success(response.message || 'Test email sent successfully! Please check your inbox.')
        setTestEmailAddress('')
      } else {
        // Show validation errors if available
        if (response.errors && typeof response.errors === 'object') {
          const errorMessages = Object.values(response.errors).flat()
          error(errorMessages.join(', ') || response.message || 'Failed to send test email. Please check your email configuration.')
        } else {
          error(response.message || 'Failed to send test email. Please check your email configuration.')
        }
      }
    } catch (err) {
      error('Failed to send test email. Please try again.')
      console.error('Send test email error:', err)
    } finally {
      setSendingTestEmail(false)
    }
  }

  const handleTestS3 = async () => {
    setTestingS3(true)
    try {
      const response = await settingsService.testS3()
      if (response.success) {
        success(response.message || 'S3 connection test successful!')
      } else {
        error(response.message || 'S3 connection test failed. Please check your S3 configuration.')
      }
    } catch (err) {
      error('Failed to test S3 connection. Please try again.')
      console.error('Test S3 error:', err)
    } finally {
      setTestingS3(false)
    }
  }

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
            <Form.Label className="fw-semibold">SMTP Host</Form.Label>
            <FormControl
              placeholder="e.g., smtp.gmail.com"
              value={settingsData.emailSettings.host}
              onChange={(e) => handleChange('emailSettings', 'host', e.target.value)}
              onBlur={(e) => handleBlur('emailSettings', 'host', e.target.value)}
              isInvalid={!!errors['emailSettings.host']}
              className="border-2"
            />
            {errors['emailSettings.host'] && (
              <FormText className="text-danger">{errors['emailSettings.host']}</FormText>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">SMTP Port</Form.Label>
            <FormControl
              placeholder="e.g., 587"
              value={settingsData.emailSettings.port}
              onChange={(e) => handleChange('emailSettings', 'port', e.target.value)}
              onBlur={(e) => handleBlur('emailSettings', 'port', e.target.value)}
              isInvalid={!!errors['emailSettings.port']}
              className="border-2"
            />
            {errors['emailSettings.port'] && (
              <FormText className="text-danger">{errors['emailSettings.port']}</FormText>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">SMTP User</Form.Label>
            <FormControl
              type="email"
              placeholder="e.g., your-email@gmail.com"
              value={settingsData.emailSettings.username}
              onChange={(e) => handleChange('emailSettings', 'username', e.target.value)}
              onBlur={(e) => handleBlur('emailSettings', 'username', e.target.value)}
              isInvalid={!!errors['emailSettings.username']}
              className="border-2"
            />
            {errors['emailSettings.username'] && (
              <FormText className="text-danger">{errors['emailSettings.username']}</FormText>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">SMTP Password</Form.Label>
            <FormControl
              type="password"
              placeholder="Enter SMTP password"
              value={settingsData.emailSettings.password}
              onChange={(e) => handleChange('emailSettings', 'password', e.target.value)}
              onBlur={(e) => handleBlur('emailSettings', 'password', e.target.value)}
              isInvalid={!!errors['emailSettings.password']}
              className="border-2"
            />
            {errors['emailSettings.password'] && (
              <FormText className="text-danger">{errors['emailSettings.password']}</FormText>
            )}
            <FormText className="text-muted">We store this encrypted. Leave blank to keep the current password.</FormText>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">From Email</Form.Label>
            <FormControl
              type="email"
              placeholder="e.g., noreply@photostudio.com"
              value={settingsData.emailSettings.from_address}
              onChange={(e) => handleChange('emailSettings', 'from_address', e.target.value)}
              onBlur={(e) => handleBlur('emailSettings', 'from_address', e.target.value)}
              isInvalid={!!errors['emailSettings.from_address']}
              className="border-2"
            />
            {errors['emailSettings.from_address'] && (
              <FormText className="text-danger">{errors['emailSettings.from_address']}</FormText>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">From Name</Form.Label>
            <FormControl
              placeholder="e.g., Photo Studio Management"
              value={settingsData.emailSettings.from_name}
              onChange={(e) => handleChange('emailSettings', 'from_name', e.target.value)}
              onBlur={(e) => handleBlur('emailSettings', 'from_name', e.target.value)}
              isInvalid={!!errors['emailSettings.from_name']}
              className="border-2"
            />
            {errors['emailSettings.from_name'] && (
              <FormText className="text-danger">{errors['emailSettings.from_name']}</FormText>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <div className="d-flex justify-content-end mb-4">
            <Button
              variant="primary"
              onClick={handleSaveEmailSettings}
              disabled={saving || isReadOnly}
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
                  Save Email Settings
                </>
              )}
            </Button>
          </div>
        </Col>
      </Row>

      {/* Test Email Configuration Section */}
      <div className="mt-5 pt-4 border-top">
        <h5 className="mb-3">Test Email Configuration</h5>
        <p className="text-muted mb-4">Test your email settings by sending a test email.</p>
        
        <Row>
          <Col md={8}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Test Email Address</Form.Label>
              <FormControl
                type="email"
                placeholder="Enter email address to test"
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                className="border-2"
              />
            </Form.Group>
          </Col>
          <Col md={4} className="d-flex align-items-end">
            <Button
              variant="primary"
              onClick={handleSendTestEmail}
              disabled={sendingTestEmail || isReadOnly}
              className="w-100"
            >
              {sendingTestEmail ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Sending...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                  Send Test Email
                </>
              )}
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  )

  const renderAppSettings = () => (
    <div className="mb-5">
      {/* Section Header */}
      <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-primary border-2">
        <FontAwesomeIcon icon={faCog} className="me-3 text-primary fs-4" />
        <h4 className="mb-0 text-primary">App Settings</h4>
      </div>

      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Web URL
              {autoSaving['appSettings.web_url'] && (
                <Spinner size="sm" className="ms-2" variant="primary" />
              )}
              {autoSaved['appSettings.web_url'] && (
                <FontAwesomeIcon icon={faCheckCircle} className="ms-2 text-success" />
              )}
            </Form.Label>
            <FormControl
              type="url"
              placeholder="e.g., https://www.example.com"
              value={settingsData.appSettings.web_url}
              onChange={(e) => handleChange('appSettings', 'web_url', e.target.value)}
              onBlur={(e) => handleBlur('appSettings', 'web_url', e.target.value)}
              isInvalid={!!errors['appSettings.web_url']}
              className="border-2"
            />
            {errors['appSettings.web_url'] && (
              <FormText className="text-danger">{errors['appSettings.web_url']}</FormText>
            )}
            <FormText className="text-muted">Enter the web URL for your application</FormText>
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

      <Row className="mb-3">
        <Col md={12}>
          <Form.Group>
            <Form.Label className="fw-semibold me-3">
              Enable S3 Uploads
              {autoSaving['s3Settings.enabled'] && (
                <Spinner size="sm" className="ms-2" variant="primary" />
              )}
              {autoSaved['s3Settings.enabled'] && (
                <FontAwesomeIcon icon={faCheckCircle} className="ms-2 text-success" />
              )}
            </Form.Label>
            <Form.Check
              type="switch"
              id="s3-enabled-toggle"
              label={settingsData.s3Settings.enabled ? 'Enabled' : 'Disabled'}
              checked={settingsData.s3Settings.enabled}
              onChange={(e) => handleChange('s3Settings', 'enabled', e.target.checked)}
              onBlur={(e) => handleBlur('s3Settings', 'enabled', e.target.checked)}
              disabled={autoSaving['s3Settings.enabled']}
              className="fs-6"
            />
            <FormText className="text-muted">
              Toggle on to store uploads in your S3 bucket. When off, files stay on this server.
            </FormText>
          </Form.Group>
        </Col>
      </Row>

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

      {/* Test S3 Connection Section */}
      <Row>
        <Col md={12}>
          <div className="border-top pt-4 mt-4">
            <h5 className="mb-3">Test S3 Connection</h5>
            <p className="text-muted mb-4">Test your S3 configuration to verify connectivity and credentials.</p>
            <Button
              variant="outline-primary"
              onClick={handleTestS3}
              disabled={testingS3 || isReadOnly}
              className="d-flex align-items-center"
            >
              {testingS3 ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Testing...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCloud} className="me-2" />
                  Test S3 Connection
                </>
              )}
            </Button>
          </div>
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
              {renderAppSettings()}
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