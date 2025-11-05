import React, { useState } from 'react'
import { Container, Row, Col, Form, FormControl, FormCheck, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faUser, faEnvelope, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../components'
import { useAuth } from '../../context/AuthContext'
import { ThemeToggle } from '../../components'
import logoImg from '../../assets/logo/logo-transprant.png'
import '../../styles/auth.css'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { success, error, warning } = useToast()
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Email validation - consistent with project standards
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation - consistent with project standards
    if (!formData.password?.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.trim().length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
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
      const result = await login({
        email: formData.email.trim(),
        password: formData.password.trim(),
        remember: formData.remember
      })
      
      if (result.success) {
        success('Login successful! Welcome back.', {
          title: 'Welcome!',
          duration: 3000
        })
        
        // Redirect to dashboard immediately
        navigate('/dashboard')
      }
    } catch (err) {
      // Handle different types of login errors with appropriate toast types
      if (err.message === 'Invalid email or password') {
        warning('Invalid email or password. Please check your credentials and try again.', {
          title: 'Login Failed',
          duration: 6000
        })
      } else if (err.message.includes('network') || err.message.includes('connection')) {
        error('Network error. Please check your internet connection and try again.', {
          title: 'Connection Error',
          duration: 8000
        })
      } else if (err.message.includes('server') || err.message.includes('500')) {
        error('Server error. Please try again later.', {
          title: 'Server Error',
          duration: 8000
        })
      } else {
        error(err.message || 'Login failed. Please try again.', {
          title: 'Login Error',
          duration: 6000
        })
      }
    } finally {
      setLoading(false)
    }
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
                <img src={logoImg} alt="Farm2Fridge Logo" style={{ width: '120px', height: 'auto' }} />
              </div>
              <h2 className="text-success fw-bold mb-1">Farm2Fridge Admin</h2>
              <p className="text-muted mb-0">Fresh Farm to Table Management</p>
            </div>

            <div className="auth-card">
              <div className="text-center mb-4">
                <h3 className="mb-2">Welcome Back</h3>
                <p className="text-muted">Sign in to your account</p>
              </div>
              <Form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <div className="position-relative">
                    <FontAwesomeIcon icon={faEnvelope} className="auth-input-icon" />
                    <FormControl
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      className={`auth-input ${errors.email ? 'is-invalid' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <div className="invalid-feedback d-block">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <div className="position-relative">
                    <FontAwesomeIcon icon={faLock} className="auth-input-icon" />
                    <FormControl
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      className={`auth-input ${errors.password ? 'is-invalid' : ''}`}
                    />
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback d-block">{errors.password}</div>
                  )}
                </div>

                <div className="mb-4 d-flex justify-content-between align-items-center">
                  <FormCheck
                    type="checkbox"
                    name="remember"
                    label="Remember me"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="fw-medium"
                  />
                  <Link to="/forgot-password" className="text-decoration-none text-success fw-medium">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="auth-button w-100"
                  variant="success"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </Form>
            </div>

            {/* Demo Credentials */}
            <div className="demo-credentials">
              <div className="d-flex align-items-center mb-3">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2 text-muted" />
                <h6 className="demo-credentials-title mb-0">Demo Credentials</h6>
              </div>
              <div className="demo-credential-item">
                <span className="demo-credential-label">Admin:</span>
                <code className="demo-credential-value">admin@example.com / admin123</code>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-muted small mb-0">
                © 2024 Farm2Fridge Admin. All rights reserved.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login