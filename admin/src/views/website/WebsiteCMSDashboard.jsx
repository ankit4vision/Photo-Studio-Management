import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
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
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons'
import { usePermissions } from '../../hooks'
import { PERMISSIONS } from '../../constants/permissions'

const WebsiteCMSDashboard = () => {
  const navigate = useNavigate()
  const { hasPermission } = usePermissions()

  const modules = [
    {
      id: 'slider',
      title: 'Hero Slider',
      description: 'Manage homepage slider images and banners',
      icon: faImages,
      route: '/website/slider',
      permission: PERMISSIONS.WEBSITE_SLIDER_READ,
      color: 'primary',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: 'services',
      title: 'Services',
      description: 'Manage services section on homepage',
      icon: faCog,
      route: '/website/services',
      permission: PERMISSIONS.WEBSITE_SERVICE_READ,
      color: 'success',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      id: 'projects',
      title: 'Projects Gallery',
      description: 'Manage featured projects and portfolios',
      icon: faFolderOpen,
      route: '/website/projects',
      permission: PERMISSIONS.WEBSITE_PROJECT_READ,
      color: 'info',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      id: 'home-gallery',
      title: 'Home Gallery',
      description: 'Manage gallery images on homepage',
      icon: faHome,
      route: '/website/home-gallery',
      permission: PERMISSIONS.WEBSITE_HOME_GALLERY_READ,
      color: 'warning',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
      id: 'testimonials',
      title: 'Testimonials',
      description: 'Manage customer testimonials and reviews',
      icon: faStar,
      route: '/website/testimonials',
      permission: PERMISSIONS.WEBSITE_TESTIMONIAL_READ,
      color: 'danger',
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    },
    {
      id: 'gallery',
      title: 'Gallery Images',
      description: 'Manage gallery page images',
      icon: faPhotoVideo,
      route: '/website/gallery',
      permission: PERMISSIONS.WEBSITE_GALLERY_READ,
      color: 'primary',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    },
    {
      id: 'gallery-videos',
      title: 'Gallery Videos',
      description: 'Manage video gallery content',
      icon: faVideo,
      route: '/website/gallery-videos',
      permission: PERMISSIONS.WEBSITE_GALLERY_VIDEO_READ,
      color: 'dark',
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    },
    {
      id: 'albums',
      title: 'Albums',
      description: 'Manage photo albums and collections',
      icon: faBook,
      route: '/website/albums',
      permission: PERMISSIONS.WEBSITE_ALBUM_READ,
      color: 'secondary',
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

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="mb-2 text-dark fw-bold">Website CMS Dashboard</h2>
        <p className="text-muted mb-0">
          Manage all your website content from one place. Click on any module to get started.
        </p>
      </div>

      {/* Modules Grid */}
      <Row className="g-4">
        {filteredModules.map((module) => {
          const canAccess = !hasPermission || hasPermission(module.permission)
          
          return (
            <Col key={module.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                className="h-100 shadow-sm border-0 module-card"
                style={{
                  cursor: canAccess ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  opacity: canAccess ? 1 : 0.6,
                }}
                onClick={() => canAccess && handleModuleClick(module)}
                onMouseEnter={(e) => {
                  if (canAccess) {
                    e.currentTarget.style.transform = 'translateY(-5px)'
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)'
                }}
              >
                {/* Icon Header with Gradient */}
                <div
                  style={{
                    background: module.gradient,
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px 8px 0 0',
                  }}
                >
                  <FontAwesomeIcon
                    icon={module.icon}
                    size="3x"
                    className="text-white"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                  />
                </div>

                {/* Card Body */}
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="mb-2 fw-bold text-dark">{module.title}</Card.Title>
                  <Card.Text className="text-muted small flex-grow-1">{module.description}</Card.Text>
                  
                  {canAccess && (
                    <div className="mt-auto pt-2">
                      <span className="text-primary small fw-semibold">
                        Manage <FontAwesomeIcon icon={faArrowRight} className="ms-1" size="sm" />
                      </span>
                    </div>
                  )}
                  
                  {!canAccess && (
                    <div className="mt-auto pt-2">
                      <span className="text-muted small">No access</span>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>

      {/* Empty State */}
      {filteredModules.length === 0 && (
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faImages} size="4x" className="text-muted mb-3" />
          <h5 className="text-muted">No modules available</h5>
          <p className="text-muted">You don't have permission to access any Website CMS modules.</p>
        </div>
      )}

      <style>{`
        .module-card {
          border-radius: 12px;
          overflow: hidden;
        }
        
        .module-card:hover {
          border-color: rgba(0, 123, 255, 0.3) !important;
        }
        
        .module-card .card-body {
          padding: 1.25rem;
        }
        
        @media (max-width: 768px) {
          .module-card {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </Container>
  )
}

export default WebsiteCMSDashboard

