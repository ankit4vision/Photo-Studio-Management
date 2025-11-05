import React, { useState } from 'react'
import { Container, Row, Col, Form, FormControl, Button as RBButton } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../components'
import { Button } from '../../components'
import { ThemeToggle } from '../../components'
import logoImg from '../../assets/logo/logo-transprant.png'
import '../../styles/auth.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [errors, setErrors] = useState({})

  const { success, error: showError } = useToast()

  const handleChange = (e) => {
    setEmail(e.target.value)
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({
        ...prev,
        email: ''
      }))
    }
  }

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  }

  const validateForm = () => {
    const newErrors = {}

    if (!email?.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // In a real app, this would send a reset email
      console.log('Password reset requested for:', email.trim())

      setEmailSent(true)
      success('Password reset instructions sent to your email!')
    } catch (err) {
      showError('Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="auth-page">
        {/* Theme Toggle - Top Right */}
        <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 1000 }}>
          <ThemeToggle />
        </div>
        
        <Container>
          <Row className="justify-content-center">
            <Col md={6} lg={5} xl={4}>
              {/* Logo/Brand Section */}
              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center mb-3 p-3" 
                     style={{ boxShadow: '0 4px 20px rgba(34, 197, 94, 0.15)' }}>
                  <img src={logoImg} alt="Photo Studio Management App Logo" style={{ width: '120px', height: 'auto' }} />
                </div>
              <h2 className="text-success fw-bold mb-1">Photo Studio Management App</h2>
              <p className="text-muted mb-0">Professional Photo Studio Management System</p>
              </div>

              <div className="auth-card text-center">
                <div className="mb-4">
                  <h3 className="mb-2">Check Your Email</h3>
                  <p className="text-muted">Password reset instructions sent</p>
                </div>
                <div className="mb-4">
                  <div className="d-inline-flex align-items-center justify-content-center bg-gradient-success rounded-circle mb-3" 
                       style={{ width: '80px', height: '80px' }}>
                    <FontAwesomeIcon icon={faEnvelope} size="2x" className="text-white" />
                  </div>
                </div>
                
                <p className="text-muted mb-4">
                  We've sent password reset instructions to <br />
                  <strong className="text-success">{email}</strong>
                </p>
                
                <div className="alert alert-info border-0 mb-4">
                  <small className="mb-0">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                    Didn't receive the email? Check your spam folder or try again.
                  </small>
                </div>

                <div className="d-grid gap-2">
                  <button
                    className="auth-button mb-3"
                    onClick={() => {
                      setEmailSent(false)
                      setEmail('')
                    }}
                  >
                    Try Different Email
                  </button>
                  
                  <Link to="/login" className="btn btn-outline-success fw-medium">
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    Back to Login
                  </Link>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-4">
                <p className="text-muted small mb-0">
                  © 2025 Photo Studio Management App. All rights reserved.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

  return (
    <div className="auth-page">
      {/* Theme Toggle - Top Right */}
      <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 1000 }}>
        <ThemeToggle />
      </div>
      
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            {/* Logo/Brand Section */}
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center mb-3 p-3" 
                   style={{ boxShadow: '0 4px 20px rgba(34, 197, 94, 0.15)' }}>
                <img src={logoImg} alt="Photo Studio Management App Logo" style={{ width: '120px', height: 'auto' }} />
              </div>
              <h2 className="text-success fw-bold mb-1">Photo Studio Management App</h2>
              <p className="text-muted mb-0">Fresh Farm to Table Management</p>
            </div>

            <div className="auth-card">
              <div className="text-center mb-4">
                <h3 className="mb-2">Forgot Password</h3>
                <p className="text-muted">Enter your email to reset your password</p>
              </div>
              <Form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <div className="position-relative">
                    <FontAwesomeIcon icon={faEnvelope} className="auth-input-icon" />
                    <FormControl
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      className={`auth-input ${errors.email ? 'is-invalid' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <div className="invalid-feedback d-block">{errors.email}</div>
                  )}
                </div>

                <div className="alert alert-info border-0 mb-4">
                  <small className="mb-0">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                    We'll send you a link to reset your password
                  </small>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="auth-button"
                >
                  {loading ? 'Sending...' : 'Send Reset Instructions'}
                </button>

                <div className="text-center">
                  <Link to="/login" className="text-decoration-none text-success fw-medium">
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    Back to Login
                  </Link>
                </div>
              </Form>
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-muted small mb-0">
                © 2025 Photo Studio Management App. All rights reserved.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ForgotPassword
