import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faImages,
  faCog,
  faFolderOpen,
  faHome,
  faStar,
  faPhotoVideo,
  faVideo,
  faBook,
  faChevronUp,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons'
import { usePermissions } from '../../../hooks'
import { PERMISSIONS } from '../../../constants/permissions'

const WebsiteCMSNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { hasPermission } = usePermissions()
  const [isExpanded, setIsExpanded] = useState(true)

  const modules = [
    {
      id: 'slider',
      title: 'Hero Slider',
      icon: faImages,
      route: '/website/slider',
      permission: PERMISSIONS.WEBSITE_SLIDER_READ,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: 'services',
      title: 'Services',
      icon: faCog,
      route: '/website/services',
      permission: PERMISSIONS.WEBSITE_SERVICE_READ,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      id: 'projects',
      title: 'Projects',
      icon: faFolderOpen,
      route: '/website/projects',
      permission: PERMISSIONS.WEBSITE_PROJECT_READ,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      id: 'home-gallery',
      title: 'Home Gallery',
      icon: faHome,
      route: '/website/home-gallery',
      permission: PERMISSIONS.WEBSITE_HOME_GALLERY_READ,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
      id: 'testimonials',
      title: 'Testimonials',
      icon: faStar,
      route: '/website/testimonials',
      permission: PERMISSIONS.WEBSITE_TESTIMONIAL_READ,
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    },
    {
      id: 'gallery',
      title: 'Gallery',
      icon: faPhotoVideo,
      route: '/website/gallery',
      permission: PERMISSIONS.WEBSITE_GALLERY_READ,
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    },
    {
      id: 'gallery-videos',
      title: 'Videos',
      icon: faVideo,
      route: '/website/gallery-videos',
      permission: PERMISSIONS.WEBSITE_GALLERY_VIDEO_READ,
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    },
    {
      id: 'albums',
      title: 'Albums',
      icon: faBook,
      route: '/website/albums',
      permission: PERMISSIONS.WEBSITE_ALBUM_READ,
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    },
  ]

  const handleModuleClick = (module) => {
    if (hasPermission && hasPermission(module.permission)) {
      navigate(module.route)
    }
  }

  const filteredModules = modules.filter((module) => {
    if (!hasPermission) return true
    return hasPermission(module.permission)
  })

  const isActive = (route) => {
    return location.pathname === route || location.pathname.startsWith(route + '/')
  }

  return (
    <div className="bg-white border-bottom mb-4 sticky-top" style={{ zIndex: 1000, top: '56px' }}>
      <Container fluid className="py-2">
        <div className="d-flex align-items-center mb-2">
          <h6 className="mb-0 text-dark fw-bold">Website CMS Modules</h6>
          <div className="ms-auto d-flex gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="d-flex align-items-center"
            >
              <FontAwesomeIcon 
                icon={isExpanded ? faChevronUp : faChevronDown} 
                className="me-1" 
                size="sm"
              />
              {isExpanded ? 'Hide' : 'Show'} Modules
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => navigate('/website')}
              className="d-flex align-items-center"
            >
              <FontAwesomeIcon icon={faHome} className="me-1" size="sm" />
              Dashboard
            </Button>
          </div>
        </div>
        {isExpanded && (
          <Row className="g-2">
          {filteredModules.map((module) => {
            const canAccess = !hasPermission || hasPermission(module.permission)
            const active = isActive(module.route)

            return (
              <Col key={module.id} xs={6} sm={4} md={3} lg={2} xl={1.5}>
                <div
                  className={`module-nav-card p-2 rounded cursor-pointer ${
                    active ? 'active-module' : ''
                  }`}
                  style={{
                    cursor: canAccess ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    opacity: canAccess ? 1 : 0.5,
                    border: active ? '2px solid #0d6efd' : '1px solid #dee2e6',
                    backgroundColor: active ? '#f0f7ff' : '#fff',
                  }}
                  onClick={() => canAccess && handleModuleClick(module)}
                  onMouseEnter={(e) => {
                    if (canAccess && !active) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'
                      e.currentTarget.style.borderColor = '#0d6efd'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.borderColor = '#dee2e6'
                    }
                  }}
                >
                  <div className="d-flex flex-column align-items-center text-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mb-2"
                      style={{
                        width: '40px',
                        height: '40px',
                        background: module.gradient,
                        boxShadow: active ? '0 2px 8px rgba(13, 110, 253, 0.3)' : 'none',
                      }}
                    >
                      <FontAwesomeIcon icon={module.icon} className="text-white" size="sm" />
                    </div>
                    <span
                      className="small fw-semibold"
                      style={{
                        color: active ? '#0d6efd' : '#495057',
                        fontSize: '0.75rem',
                      }}
                    >
                      {module.title}
                    </span>
                  </div>
                </div>
              </Col>
            )
          })}
          </Row>
        )}
      </Container>
      <style>{`
        .module-nav-card {
          min-height: 80px;
        }
        .active-module {
          font-weight: 600;
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

export default WebsiteCMSNav

