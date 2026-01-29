import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import websiteApi from '../services/websiteApi'

const AlbumDetail = () => {
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const [project, setProject] = useState(null)
  const [projectLoading, setProjectLoading] = useState(true)
  const [projectImages, setProjectImages] = useState([])
  const swiperRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Fetch project details from API
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setProjectLoading(false)
        return
      }

      try {
        setProjectLoading(true)
        const response = await websiteApi.getProjectDetail(projectId)
        console.log('Project API Response:', response) // Debug log
        
        if (response.success && response.data) {
          console.log('Project Data:', response.data) // Debug log
          setProject(response.data)
          
          // Extract images from project - use photos array if available
          if (response.data.photos && Array.isArray(response.data.photos) && response.data.photos.length > 0) {
            const images = response.data.photos.map(photo => ({
              id: photo.id,
              image_url: photo.image_url || (photo.image_path ? (() => {
                if (photo.image_path.startsWith('http://') || photo.image_path.startsWith('https://')) {
                  return photo.image_path
                }
                if (photo.image_path.startsWith('/assets/')) {
                  return photo.image_path
                }
                const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
                const baseUrl = apiUrl.replace(/\/api\/?$/, '')
                return `${baseUrl}/storage/${photo.image_path}`
              })() : null)
            }))
            console.log('Project Images:', images) // Debug log
            setProjectImages(images)
          } else {
            console.log('No photos found, using fallback') // Debug log
            // Fallback to static images if no photos
            setProjectImages([
              { id: 1, image_url: '/assets/img/projects/gallery/1.jpg' },
              { id: 2, image_url: '/assets/img/projects/gallery/2.jpg' },
              { id: 3, image_url: '/assets/img/projects/gallery/3.jpg' }
            ])
          }
        } else {
          console.warn('API response not successful or no data:', response) // Debug log
          // Fallback to static data
          setProject({
            id: projectId,
            title: 'Wedding Project 2024',
            description: 'LV_Clicks Photography captured this beautiful wedding celebration with attention to detail and artistic vision.',
            event_date: '2024-12-01',
            location: 'New York, USA',
            photographer: 'LV_Clicks Team',
            photo_count: 25,
            category: 'Wedding'
          })
          setProjectImages([
            { id: 1, image_url: '/assets/img/projects/gallery/1.jpg' },
            { id: 2, image_url: '/assets/img/projects/gallery/2.jpg' },
            { id: 3, image_url: '/assets/img/projects/gallery/3.jpg' }
          ])
        }
      } catch (error) {
        console.error('Error fetching project:', error)
        // Fallback to static data on error
        setProject({
          id: projectId,
          title: 'Wedding Project 2024',
          description: 'LV_Clicks Photography captured this beautiful wedding celebration with attention to detail and artistic vision.',
          event_date: '2024-12-01',
          location: 'New York, USA',
          photographer: 'LV_Clicks Team',
          photo_count: 25,
          category: 'Wedding'
        })
        setProjectImages([
          { id: 1, image_url: '/assets/img/projects/gallery/1.jpg' },
          { id: 2, image_url: '/assets/img/projects/gallery/2.jpg' },
          { id: 3, image_url: '/assets/img/projects/gallery/3.jpg' }
        ])
      } finally {
        setProjectLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  // Initialize Swiper for gallery slider
  useEffect(() => {
    if (projectImages.length > 0 && typeof window.Swiper !== 'undefined') {
      const initSwiper = () => {
        if (swiperRef.current) {
          const swiperEl = document.querySelector('.swiper-gallery')
          if (swiperEl && !swiperEl.swiper) {
            new window.Swiper('.swiper-gallery', {
              loop: projectImages.length > 3,
              autoplay: {
                delay: 3000,
                disableOnInteraction: false,
              },
              navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              },
              slidesPerView: 1,
              spaceBetween: 10,
            })
          }
        }
      }

      const timer = setTimeout(initSwiper, 100)
      return () => clearTimeout(timer)
    }
  }, [projectImages])

  return (
    <>
      {/* Page Header */}
      <div className="wptb-page-heading">
        <div className="wptb-item--inner" style={{ 
          backgroundImage: project?.hero_image_url 
            ? `url(${project.hero_image_url})` 
            : project?.thumbnail_image_url 
            ? `url(${project.thumbnail_image_url})` 
            : "url('/assets/img/background/bg-3.jpg')" 
        }}>
          <div className="wptb-item-layer wptb-item-layer-one">
            <img src="/assets/img/more/circle.png" alt="circle" loading="lazy" />
          </div>
          <h2 className="wptb-item--title">{project?.title || 'Project Detail'}</h2>
        </div>
      </div>

      {/* Album Details Content */}
      <section className="blog-details">
        <div className="container">
          <div className="blog-details-inner">
            <div className="post-content">
              <div className="row">
                <div className="col-lg-9 col-md-8 pe-md-5">
                  {projectLoading ? (
                    <div className="text-center" style={{ padding: '40px' }}>
                      <p>Loading project...</p>
                    </div>
                  ) : project ? (
                    <>
                      {/* Project Images Slider */}
                      {projectImages.length > 0 && (
                        <div className="swiper-container swiper-gallery mb-4" ref={swiperRef} style={{ height: '500px' }}>
                          <div className="swiper-wrapper">
                            {projectImages.slice(0, 3).map((image) => (
                              <div key={image.id} className="swiper-slide" style={{ height: '500px' }}>
                                <figure className="block-gallery" style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', margin: 0 }}>
                                  <img 
                                    src={image.image_url || '/assets/img/projects/gallery/1.jpg'} 
                                    alt={`Project ${image.id}`} 
                                    loading="lazy"
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      objectPosition: 'center',
                                      display: 'block'
                                    }}
                                    onError={(e) => {
                                      console.error('Project slider image load error:', image.image_url)
                                      e.currentTarget.src = '/assets/img/projects/gallery/1.jpg'
                                    }}
                                  />
                                  <a className="wptb-image-popup" href={image.image_url || '/assets/img/projects/gallery/1.jpg'} data-fancybox="project-gallery">
                                    <i className="bi bi-arrows-fullscreen"></i>
                                  </a>
                                </figure>
                              </div>
                            ))}
                          </div>

                          {/* Swiper Navigation */}
                          <div className="wptb-swiper-navigation style2">
                            <div className="wptb-swiper-arrow swiper-button-prev"></div>
                            <div className="wptb-swiper-arrow swiper-button-next"></div>
                          </div>
                        </div>
                      )}

                      <div className="post-header">
                        <h1 className="post-title">{project.title || 'Project'}</h1>
                        <div className="post-meta">
                          {project.event_date && (
                            <span>
                              <i className="bi bi-calendar"></i> {new Date(project.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                          )}
                          {(project.photo_count !== undefined && project.photo_count !== null) && (
                            <span>
                              <i className="bi bi-images"></i> {project.photo_count} Photos
                            </span>
                          )}
                          {project.category && (
                            <span>
                              <i className="bi bi-tag"></i> {project.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="fulltext">
                        {project.description ? (
                          <div dangerouslySetInnerHTML={{ __html: project.description }} />
                        ) : (
                          <p>LV_Clicks Photography captured this beautiful celebration with attention to detail and artistic vision.</p>
                        )}

                        {/* Project Images Grid */}
                        {projectImages.length > 3 && (
                          <div className="row mt-5">
                            {projectImages.slice(3).map((image, index) => {
                              const colClass = index % 3 === 0 ? 'col-md-6' : 'col-md-4'
                              const gridHeight = index % 3 === 0 ? '500px' : '400px'
                              return (
                                <div key={image.id} className={colClass}>
                                  <figure className="block-gallery mb-4" style={{ width: '100%', height: gridHeight, overflow: 'hidden', position: 'relative', margin: 0 }}>
                                    <img 
                                      src={image.image_url || `/assets/img/projects/details/${(index % 9) + 2}.jpg`} 
                                      alt={`Project photo ${image.id}`} 
                                      loading="lazy"
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                        display: 'block'
                                      }}
                                      onError={(e) => {
                                        console.error('Project image load error:', image.image_url)
                                        e.currentTarget.src = `/assets/img/projects/details/${(index % 9) + 2}.jpg`
                                      }}
                                    />
                                    <a className="wptb-image-popup" href={image.image_url || `/assets/img/projects/details/${(index % 9) + 2}.jpg`} data-fancybox="project-gallery">
                                      <i className="bi bi-arrows-fullscreen"></i>
                                    </a>
                                  </figure>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center" style={{ padding: '40px' }}>
                      <p>Project not found. Please select a project from <Link to="/our-works">Our Works</Link>.</p>
                    </div>
                  )}
                </div>

                {/* Project Sidebar */}
                <div className="col-lg-3 col-md-4">
                  <div className="sidebar">
                    <div className="widget">
                      <h4 className="widget-title"><span>//</span>Project Info</h4>
                      <ul className="widget-list">
                        {project?.event_date && <li><strong>Date:</strong> {new Date(project.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</li>}
                        {project?.location && <li><strong>Location:</strong> {project.location}</li>}
                        {project?.photographer && <li><strong>Photographer:</strong> {project.photographer}</li>}
                        {project?.author && !project?.photographer && <li><strong>Author:</strong> {project.author}</li>}
                        {project?.photo_count && <li><strong>Total Photos:</strong> {project.photo_count}</li>}
                        {project?.category && <li><strong>Category:</strong> {project.category}</li>}
                      </ul>
                    </div>

                    <div className="widget mt-5">
                      <h4 className="widget-title"><span>//</span>Share Project</h4>
                      <div className="social-box">
                        <ul>
                          <li><a href="#"><i className="bi bi-facebook"></i></a></li>
                          <li><a href="https://www.instagram.com/lv_clicks_/" target="_blank" rel="noopener noreferrer"><i className="bi bi-instagram"></i></a></li>
                          <li><a href="#"><i className="bi bi-twitter"></i></a></li>
                          <li><a href="#"><i className="bi bi-pinterest"></i></a></li>
                        </ul>
                      </div>
                    </div>

                    <div className="widget mt-5">
                      <div className="wptb-item--button">
                        <Link to="/our-works" className="btn">
                          <span className="btn-wrap">
                            <span className="text-first">Back to Projects</span>
                            <span className="text-second">
                              <i className="bi bi-arrow-up-right"></i> <i className="bi bi-arrow-up-right"></i>
                            </span>
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider-line-hr mr-bottom-40"></div>

      {/* Contact */}
      <section className="wptb-contact-form style2">
        <div className="wptb-item-layer both-version">
          <img src="/assets/img/more/texture-2.png" alt="texture" loading="lazy" />
          <img src="/assets/img/more/texture-2-light.png" alt="texture" loading="lazy" />
        </div>
        <div className="container">
          <div className="wptb-form--wrapper no-bg">
            <div className="row">
              <div className="col-lg-5">
                <div className="wptb-heading-two pe-lg-5">
                  <div className="wptb-item--inner">
                    <h6 className="wptb-item--subtitle"> Contact Us</h6>
                    <h1 className="wptb-item--title"> Feel Free To Ask Us Anything <span>Contact Us</span></h1>
                  </div>
                </div>
              </div>

              <div className="col-lg-7">
                <form className="wptb-form" action="#" method="post">
                  <div className="wptb-form--inner">
                    <div className="row">
                      <div className="col-lg-6 col-md-6 mb-4">
                        <div className="form-group">
                          <input type="text" name="name" className="form-control" placeholder="Name*" required />
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6 mb-4">
                        <div className="form-group">
                          <input type="email" name="email" className="form-control" placeholder="E-mail*" required />
                        </div>
                      </div>

                      <div className="col-lg-12 col-md-12 mb-4">
                        <div className="form-group">
                          <input type="text" name="subject" className="form-control" placeholder="Subject" />
                        </div>
                      </div>

                      <div className="col-md-12 col-lg-12 mb-4">
                        <div className="form-group">
                          <textarea name="message" className="form-control" placeholder="Text"></textarea>
                        </div>
                      </div>

                      <div className="col-md-12 col-lg-12">
                        <div className="wptb-item--button">
                          <button className="btn" type="submit">
                            <span className="btn-wrap">
                              <span className="text-first">Send Mail</span>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default AlbumDetail

