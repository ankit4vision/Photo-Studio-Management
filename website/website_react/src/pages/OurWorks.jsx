import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useIsotope from '../hooks/useIsotope'
import websiteApi from '../services/websiteApi'

const OurWorks = () => {
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)

  // Initialize Isotope for the projects grid - re-initialize when projects change
  useIsotope('.effect-gradient .grid', {}, [projects.length])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjectsLoading(true)
        const response = await websiteApi.getProjects(false) // Get all projects
        if (response.success && response.data && response.data.length > 0) {
          // Transform API data - use thumbnail_image_url from API directly
          const transformedProjects = response.data
            .filter(project => {
              // Filter out projects with placeholder URLs in the API response
              if (project.thumbnail_image_url && (project.thumbnail_image_url.includes('via.placeholder.com') || project.thumbnail_image_url.includes('placeholder'))) {
                return false
              }
              if (project.thumbnail_image && (project.thumbnail_image.includes('via.placeholder.com') || project.thumbnail_image.includes('placeholder'))) {
                return false
              }
              return true
            })
            .map((project, index) => {
              // Get image URL - prefer thumbnail_image_url from backend
              const getImageUrl = () => {
                if (project.thumbnail_image_url && !project.thumbnail_image_url.includes('via.placeholder.com') && !project.thumbnail_image_url.includes('placeholder')) {
                  return project.thumbnail_image_url
                }
                if (project.thumbnail_image) {
                  // If it's already a full URL, use it
                  if (project.thumbnail_image.startsWith('http://') || project.thumbnail_image.startsWith('https://')) {
                    return project.thumbnail_image
                  }
                  // If it's a frontend asset path, use it as is
                  if (project.thumbnail_image.startsWith('/assets/')) {
                    return project.thumbnail_image
                  }
                  // If it's a storage path, construct the storage URL
                  if (project.thumbnail_image && !project.thumbnail_image.includes('\\') && !project.thumbnail_image.match(/^[A-Z]:/)) {
                    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
                    const baseUrl = apiUrl.replace(/\/api\/?$/, '')
                    return `${baseUrl}/storage/${project.thumbnail_image}`
                  }
                }
                // Fallback to static image based on index
                return `/assets/img/projects/1/${(index % 8) + 1}.jpg`
              }
              
              // Determine column size based on featured or index (alternating pattern)
              const col = project.is_featured || index % 4 === 3 ? 8 : 4
              
              return {
                id: project.id,
                title: project.title,
                count: project.photo_count ? `${project.photo_count} Photos` : 'Photos',
                image_url: getImageUrl(),
                col: col
              }
            })
          setProjects(transformedProjects)
        } else {
          // Fallback to static data if API fails
          setProjects([
            { id: 1, title: 'Wedding Album 2024', count: '25 Photos', image_url: '/assets/img/projects/1/1.jpg', col: 4 },
            { id: 2, title: 'Portrait Session', count: '18 Photos', image_url: '/assets/img/projects/1/2.jpg', col: 4 },
            { id: 3, title: 'Fashion Collection', count: '32 Photos', image_url: '/assets/img/projects/1/3.jpg', col: 4 },
            { id: 4, title: 'Event Coverage 2024', count: '45 Photos', image_url: '/assets/img/projects/1/4.jpg', col: 8 },
            { id: 5, title: 'Nature Photography', count: '28 Photos', image_url: '/assets/img/projects/1/5.jpg', col: 8 },
            { id: 6, title: 'Studio Session', count: '20 Photos', image_url: '/assets/img/projects/1/6.jpg', col: 4 },
            { id: 7, title: 'Outdoor Adventure', count: '22 Photos', image_url: '/assets/img/projects/1/7.jpg', col: 4 },
            { id: 8, title: 'Family Portrait', count: '15 Photos', image_url: '/assets/img/projects/1/8.jpg', col: 4 }
          ])
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
        // Fallback to static data on error
        setProjects([
          { id: 1, title: 'Wedding Album 2024', count: '25 Photos', image_url: '/assets/img/projects/1/1.jpg', col: 4 },
          { id: 2, title: 'Portrait Session', count: '18 Photos', image_url: '/assets/img/projects/1/2.jpg', col: 4 },
          { id: 3, title: 'Fashion Collection', count: '32 Photos', image_url: '/assets/img/projects/1/3.jpg', col: 4 },
          { id: 4, title: 'Event Coverage 2024', count: '45 Photos', image_url: '/assets/img/projects/1/4.jpg', col: 8 },
          { id: 5, title: 'Nature Photography', count: '28 Photos', image_url: '/assets/img/projects/1/5.jpg', col: 8 },
          { id: 6, title: 'Studio Session', count: '20 Photos', image_url: '/assets/img/projects/1/6.jpg', col: 4 },
          { id: 7, title: 'Outdoor Adventure', count: '22 Photos', image_url: '/assets/img/projects/1/7.jpg', col: 4 },
          { id: 8, title: 'Family Portrait', count: '15 Photos', image_url: '/assets/img/projects/1/8.jpg', col: 4 }
        ])
      } finally {
        setProjectsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <>
      {/* Albums Section */}
      <section className="wptb-project pd-top-100 pd-bottom-80">
        <div className="container">
          <div className="wptb-project--inner">
            <div className="wptb-heading-two">
              <div className="wptb-item--inner text-center">
                <h6 className="wptb-item--subtitle">Our Projects</h6>
                <h1 className="wptb-item--title">
                  LV_Clicks captures <span>All of Your</span> <br />
                  beautiful memories
                </h1>
                <div className="wptb-item--description">
                  Browse through our photography projects. <br /> Click on any project to view all photos.
                </div>
              </div>
            </div>

            <div className="effect-gradient has-radius">
              <div className="grid gutter-10 clearfix">
                <div className="grid-sizer"></div>
                <div className="row">
                  {projectsLoading ? (
                    <div className="col-12 text-center" style={{ padding: '40px' }}>
                      <p>Loading projects...</p>
                    </div>
                  ) : projects.length > 0 ? (
                    projects
                      .filter((project) => {
                        // Filter out projects with placeholder URLs
                        const url = project.image_url || `/assets/img/projects/1/${project.id}.jpg`
                        return url && !url.includes('via.placeholder.com') && !url.includes('placeholder')
                      })
                      .map((project) => {
                        const imageUrl = project.image_url && !project.image_url.includes('via.placeholder.com') && !project.image_url.includes('placeholder')
                          ? project.image_url
                          : `/assets/img/projects/1/${project.id}.jpg`
                        return (
                          <div key={project.id} className={`grid-item col-md-${project.col}`}>
                            <div className="wptb-item--inner">
                              <div className="wptb-item--image" style={{ width: '100%', overflow: 'hidden', position: 'relative', aspectRatio: project.col === 8 ? '16/9' : '4/5' }}>
                                <img 
                                  src={imageUrl} 
                                  alt={project.title} 
                                  loading="lazy"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                    display: 'block'
                                  }}
                                  onError={(e) => {
                                    console.error('Project image load error:', imageUrl)
                                    e.currentTarget.src = `/assets/img/projects/1/${project.id}.jpg`
                                  }}
                                />
                                <Link to={`/album-detail?id=${project.id}`} className="wptb-item--link">
                                  <i className="bi bi-chevron-right"></i>
                                </Link>
                              </div>
                              <div className="wptb-item--holder">
                                <div className="wptb-item--meta">
                                  <h4><Link to={`/album-detail?id=${project.id}`}>{project.title}</Link></h4>
                                  <p>{project.count}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                  ) : (
                    <div className="col-12 text-center" style={{ padding: '40px' }}>
                      <p>No projects available</p>
                    </div>
                  )}
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
          <img src="/assets/img/more/texture-2.png" alt="" loading="lazy" />
          <img src="/assets/img/more/texture-2-light.png" alt="" loading="lazy" />
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

export default OurWorks

