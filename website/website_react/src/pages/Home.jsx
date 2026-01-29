import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import useIsotope from '../hooks/useIsotope'
import websiteApi from '../services/websiteApi'

const Home = () => {
  const sliderRef = useRef(null)
  const swiperInstanceRef = useRef(null)
  const [sliderImages, setSliderImages] = useState([])
  const [sliderLoading, setSliderLoading] = useState(true)
  const [services, setServices] = useState([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [galleryImages, setGalleryImages] = useState([])
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [testimonials, setTestimonials] = useState([])
  const [testimonialsLoading, setTestimonialsLoading] = useState(true)

  // Initialize Isotope for gallery grids
  useIsotope('.style-masonry .grid')

  // Fetch slider images from API
  useEffect(() => {
    const fetchSlider = async () => {
      try {
        setSliderLoading(true)
        const response = await websiteApi.getSlider()
        if (response.success && response.data) {
          setSliderImages(response.data)
        } else {
          // Fallback to static data if API fails
          setSliderImages([37, 38, 39, 40, 41, 38, 39, 40].map(num => ({
            id: num,
            image_path: `/assets/img/slider/${num}.jpg`,
            alt_text: `Slider ${num}`
          })))
        }
      } catch (error) {
        console.error('Error fetching slider:', error)
        // Fallback to static data on error
        setSliderImages([37, 38, 39, 40, 41, 38, 39, 40].map(num => ({
          id: num,
          image_path: `/assets/img/slider/${num}.jpg`,
          alt_text: `Slider ${num}`
        })))
      } finally {
        setSliderLoading(false)
      }
    }

    fetchSlider()
  }, [])

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setServicesLoading(true)
        const response = await websiteApi.getServices()
        if (response.success && response.data) {
          // Transform API data to match component structure
          const transformedServices = response.data
            .map(service => ({
              icon: service.icon_class || 'bi-cog',
              title: service.title,
              desc: service.description || '',
              num: service.service_number || String(service.order || '').padStart(2, '0'),
              active: service.is_active,
              order: service.order || 0
            }))
            .sort((a, b) => (a.order || 0) - (b.order || 0)) // Sort by order field
          setServices(transformedServices)
        } else {
          // Fallback to static data if API fails
          setServices([
            {
              icon: 'bi-camera',
              title: 'Wedding Photography',
              desc: 'Complete wedding day coverage with candid and traditional photography for every important ritual.',
              num: '01'
            },
            {
              icon: 'bi-camera-video',
              title: 'Wedding Cinematography',
              desc: 'Cinematic wedding films with storytelling, speeches, and music edits that capture real emotions.',
              num: '02',
              active: true
            },
            {
              icon: 'bi-heart',
              title: 'Pre‑Wedding Shoots',
              desc: 'Concept-based pre‑wedding sessions at outdoor locations, customized themes, and couple portraits.',
              num: '03'
            },
            {
              icon: 'bi-people',
              title: 'Portrait & Portfolio',
              desc: 'Professional studio and outdoor portrait sessions for personal, modelling, and social media portfolios.',
              num: '04'
            },
            {
              icon: 'bi-camera-reels',
              title: 'Event Photography',
              desc: 'Birthday, engagement, baby shower, corporate events, and family functions with full photo coverage.',
              num: '05'
            },
            {
              icon: 'bi-image',
              title: 'Baby & Maternity',
              desc: 'Newborn, kids, and maternity sessions with creative setups, props, and safe studio lighting.',
              num: '06'
            }
          ])
        }
      } catch (error) {
        console.error('Error fetching services:', error)
        // Fallback to static data on error
        setServices([
          {
            icon: 'bi-camera',
            title: 'Wedding Photography',
            desc: 'Complete wedding day coverage with candid and traditional photography for every important ritual.',
            num: '01'
          },
          {
            icon: 'bi-camera-video',
            title: 'Wedding Cinematography',
            desc: 'Cinematic wedding films with storytelling, speeches, and music edits that capture real emotions.',
            num: '02',
            active: true
          },
          {
            icon: 'bi-heart',
            title: 'Pre‑Wedding Shoots',
            desc: 'Concept-based pre‑wedding sessions at outdoor locations, customized themes, and couple portraits.',
            num: '03'
          },
          {
            icon: 'bi-people',
            title: 'Portrait & Portfolio',
            desc: 'Professional studio and outdoor portrait sessions for personal, modelling, and social media portfolios.',
            num: '04'
          },
          {
            icon: 'bi-camera-reels',
            title: 'Event Photography',
            desc: 'Birthday, engagement, baby shower, corporate events, and family functions with full photo coverage.',
            num: '05'
          },
          {
            icon: 'bi-image',
            title: 'Baby & Maternity',
            desc: 'Newborn, kids, and maternity sessions with creative setups, props, and safe studio lighting.',
            num: '06'
          }
        ])
      } finally {
        setServicesLoading(false)
      }
    }

    fetchServices()
  }, [])

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjectsLoading(true)
        const response = await websiteApi.getProjects(true) // Get featured projects for homepage
        if (response.success && response.data) {
          // Transform API data to match component structure
          const transformedProjects = response.data.map(project => ({
            id: project.id,
            title: project.title,
            author: project.author || 'Jonathon Willson'
          }))
          setProjects(transformedProjects)
        } else {
          // Fallback to static data if API fails
          setProjects([
            { id: 1, title: 'Bright Boho Sunshine', author: 'Jonathon Willson' },
            { id: 2, title: 'California Fall Collection 2023', author: 'Jonathon Willson' },
            { id: 3, title: 'Brown girl next door', author: 'Jonathon Willson' },
            { id: 4, title: 'Fashion next stage', author: 'Jonathon Willson' },
            { id: 5, title: 'Jenifer in green', author: 'Jonathon Willson' },
            { id: 6, title: 'Sunflower Boho girl', author: 'Jonathon Willson' },
            { id: 7, title: 'Iceland girl', author: 'Jonathon Willson' },
            { id: 8, title: 'Summer sadness', author: 'Jonathon Willson' },
            { id: 9, title: 'Festive mode one', author: 'Jonathon Willson' },
            { id: 10, title: 'Bright Boho Sunshine0', author: 'Jonathon Willson' }
          ])
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
        // Fallback to static data on error
        setProjects([
          { id: 1, title: 'Bright Boho Sunshine', author: 'Jonathon Willson' },
          { id: 2, title: 'California Fall Collection 2023', author: 'Jonathon Willson' },
          { id: 3, title: 'Brown girl next door', author: 'Jonathon Willson' },
          { id: 4, title: 'Fashion next stage', author: 'Jonathon Willson' },
          { id: 5, title: 'Jenifer in green', author: 'Jonathon Willson' },
          { id: 6, title: 'Sunflower Boho girl', author: 'Jonathon Willson' },
          { id: 7, title: 'Iceland girl', author: 'Jonathon Willson' },
          { id: 8, title: 'Summer sadness', author: 'Jonathon Willson' },
          { id: 9, title: 'Festive mode one', author: 'Jonathon Willson' },
          { id: 10, title: 'Bright Boho Sunshine0', author: 'Jonathon Willson' }
        ])
      } finally {
        setProjectsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Fetch home gallery images from API
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setGalleryLoading(true)
        const response = await websiteApi.getHomeGallery()
        if (response.success && response.data) {
          // Transform API data to match component structure (array of numbers for image paths)
          const transformedGallery = response.data.map(item => {
            // Extract number from path like /assets/img/gallery/1.jpg -> 1
            const match = item.image_path.match(/(\d+)\.jpg$/)
            return match ? parseInt(match[1]) : 1
          })
          setGalleryImages(transformedGallery)
        } else {
          // Fallback to static data if API fails
          setGalleryImages([1, 2, 3, 4, 5, 6])
        }
      } catch (error) {
        console.error('Error fetching gallery:', error)
        // Fallback to static data on error
        setGalleryImages([1, 2, 3, 4, 5, 6])
      } finally {
        setGalleryLoading(false)
      }
    }

    fetchGallery()
  }, [])

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setTestimonialsLoading(true)
        const response = await websiteApi.getTestimonials(true) // Get featured testimonials for homepage
        if (response.success && response.data) {
          // Transform API data to match component structure
          const transformedTestimonials = response.data.map(testimonial => ({
            name: testimonial.customer_name,
            location: testimonial.location || '',
            image: testimonial.photo_path ? parseInt(testimonial.photo_path.match(/(\d+)\.jpg$/)?.[1] || '1') : 1
          }))
          setTestimonials(transformedTestimonials)
        } else {
          // Fallback to static data if API fails
          setTestimonials([
            { name: 'Rachel Jackson', location: 'New York', image: 1 },
            { name: 'Helen Jordan', location: 'Chicago', image: 2 },
            { name: 'Helen Jordan', location: 'New York', image: 3 }
          ])
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error)
        // Fallback to static data on error
        setTestimonials([
          { name: 'Rachel Jackson', location: 'New York', image: 1 },
          { name: 'Helen Jordan', location: 'Chicago', image: 2 },
          { name: 'Helen Jordan', location: 'New York', image: 3 }
        ])
      } finally {
        setTestimonialsLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)

    // Initialize Swiper slider after component mounts and scripts are loaded
    const initSwiper = () => {
      if (typeof window.Swiper !== 'undefined' && sliderRef.current && !swiperInstanceRef.current && sliderImages.length > 0) {
        // Destroy any existing Swiper instance created by theme.js
        const existingSwiper = sliderRef.current.swiper
        if (existingSwiper) {
          try {
            existingSwiper.destroy(true, true)
          } catch (e) {
            // Ignore errors if already destroyed
          }
        }

        // Calculate minimum slides needed for loop mode
        // Loop requires at least slidesPerView * 2 slides (or more for better experience)
        const minSlidesForLoop = 4 // Minimum for loop with max slidesPerView of 4
        const enableLoop = sliderImages.length >= minSlidesForLoop

        swiperInstanceRef.current = new window.Swiper('.wptb-swiper-slider-four', {
          loop: enableLoop, // Only enable loop if we have enough slides
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
          },
          autoHeight: true,
          speed: 2500,
          slidesPerView: 1,
          spaceBetween: 0,
          centeredSlides: true,
          grabCursor: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            clickable: true,
          },
          breakpoints: {
            600: {
              slidesPerView: 2,
            },
            991: {
              slidesPerView: 3,
            },
            1400: {
              slidesPerView: 4,
            },
          }
        })
      }
    }

    // Try to initialize immediately
    initSwiper()

    // If Swiper is not loaded yet, wait for it
    if (typeof window.Swiper === 'undefined') {
      const checkSwiper = setInterval(() => {
        if (typeof window.Swiper !== 'undefined') {
          clearInterval(checkSwiper)
          initSwiper()
        }
      }, 100)

      // Cleanup interval after 10 seconds
      setTimeout(() => clearInterval(checkSwiper), 10000)
    }

    // Cleanup on unmount
    return () => {
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.destroy(true, true)
        swiperInstanceRef.current = null
      }
    }
  }, [sliderImages]) // Re-initialize Swiper when slider images change

  // Projects are now fetched from API (see useEffect above)

  // Services are now fetched from API (see useEffect above)
  // Gallery images are now fetched from API (see useEffect above)

  // Testimonials are now fetched from API (see useEffect above)

  const marqueeItems = [
    { text: 'LV_Clicks', outline: false },
    { text: 'Photography', outline: true },
    { text: 'Studio', outline: false },
    { text: 'Wedding', outline: true },
    { text: 'Portrait', outline: false },
    { text: 'Cinematography', outline: true }
  ]

  return (
    <>
      {/* Slider Section */}
      <section className="wptb-slider style4">
        <div className="wptb-heading-two">
          <div className="wptb-item--inner text-center">
            <h6 className="wptb-item--subtitle">Photography Agency</h6>
            <h1 className="wptb-item--title"> We Capture Your Best <br /> <span>Memories</span> Here</h1>
            <div className="wptb-item--description">
              LV_Clicks photography Agency runs wide and deep. Across many <br /> markets, geographies & typologies, our team members
            </div>
          </div>
        </div>

        <div className="swiper-container wptb-swiper-slider-four" ref={sliderRef}>
          <div className="swiper-wrapper">
            {sliderLoading ? (
              <div className="swiper-slide">
                <div className="wptb-slider--item">
                  <div className="wptb-slider--image" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="text-white">Loading slider...</div>
                  </div>
                </div>
              </div>
            ) : sliderImages.length > 0 ? (
              sliderImages.map((slider, index) => {
                // Get image URL - prefer image_url from backend, otherwise use image_path
                const getImageUrl = () => {
                  if (slider.image_url) {
                    return slider.image_url
                  }
                  if (slider.image_path) {
                    // If it's already a full URL, use it
                    if (slider.image_path.startsWith('http://') || slider.image_path.startsWith('https://')) {
                      return slider.image_path
                    }
                    // If it's a frontend asset path, use it as is (relative to website root)
                    if (slider.image_path.startsWith('/assets/')) {
                      return slider.image_path
                    }
                    // If it's a storage path, construct the storage URL
                    if (slider.image_path && !slider.image_path.includes('\\') && !slider.image_path.match(/^[A-Z]:/)) {
                      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
                      const baseUrl = apiUrl.replace(/\/api\/?$/, '')
                      return `${baseUrl}/storage/${slider.image_path}`
                    }
                  }
                  return null
                }

                const imageUrl = getImageUrl()

                return (
                  <div key={slider.id || index} className="swiper-slide">
                    <div className="wptb-slider--item">
                      <div className="wptb-slider--image">
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={slider.alt_text || slider.title || `Slider ${index + 1}`} 
                            loading="lazy"
                            onError={(e) => {
                              console.error('Slider image load error:', {
                                url: imageUrl,
                                image_path: slider.image_path,
                                image_url: slider.image_url,
                                slider: slider
                              })
                              // Show placeholder or hide image
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        ) : (
                          <div style={{ 
                            minHeight: '400px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            backgroundColor: '#f0f0f0',
                            color: '#999'
                          }}>
                            No Image
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="swiper-slide">
                <div className="wptb-slider--item">
                  <div className="wptb-slider--image" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="text-white">No slider images available</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Layer Images */}
        <div className="wptb-item-layer wptb-item-layer-one both-version">
          <img src="/assets/img/slider/texture-1.png" alt="texture" loading="lazy" />
          <img src="/assets/img/slider/texture-1-light.png" alt="texture" loading="lazy" />
        </div>
        <div className="wptb-item-layer wptb-item-layer-two both-version">
          <img src="/assets/img/slider/round.png" alt="round" loading="lazy" />
          <img src="/assets/img/slider/round-light.png" alt="round" loading="lazy" />
        </div>
        <div className="wptb-item-layer wptb-item-layer-three both-version">
          <img src="/assets/img/slider/overlay.png" alt="overlay" loading="lazy" />
          <img src="/assets/img/slider/overlay-light.png" alt="overlay" loading="lazy" />
        </div>
      </section>

      <div className="divider-line-hr"></div>

      {/* Text Marquee */}
      <div className="wptb-marquee">
        <div className="wptb-text-marquee1 wptb-slide-to-left">
          <div className="wptb-item--container">
            {[1, 2].map((set) => (
              <div key={set} className="wptb-item--inner">
                {marqueeItems.map((item, idx) => (
                  <h4 key={idx} className={`wptb-item--text ${item.outline ? 'text-outline' : ''}`}>
                    <span className="wptb-text-backdrop">{item.text}</span>
                    <span className="wptb-item-layer both-version position-relative">
                      <img src="/assets/img/more/star.png" alt="star" loading="lazy" />
                      <img src="/assets/img/more/star-dark.png" alt="star" loading="lazy" />
                    </span>
                  </h4>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="divider-line-hr"></div>

      {/* Services */}
      <section className="wptb-services-one pd-bottom-80 bg-image-4" style={{ backgroundImage: "url('/assets/img/more/texture-3.png')", backgroundPosition: '50% -16%' }}>
        <div className="container position-relative">
          <div className="wptb-heading-two">
            <div className="wptb-item--inner text-center">
              <h6 className="wptb-item--subtitle">Photography</h6>
              <h1 className="wptb-item--title"> Explore LV_Clicks <br /> Photography <span>Services</span> </h1>
              <div className="wptb-item--description">
                LV_Clicks photography Agency runs wide and deep. Across many <br /> markets, geographies & typologies, our team members
              </div>
            </div>
          </div>

          <div className="row">
            {services.map((service, index) => (
              <div key={service.id || index} className="col-md-4 pd-left-25 pd-right-25 wow fadeInLeft">
                <div className={`wptb-icon-box7 mb-0 ${service.active ? 'active highlight' : ''}`}>
                  <div className="wptb-item--inner">
                    <div className="wptb-item--icon">
                      <i className={`bi ${service.icon}`} style={{ fontSize: '48px' }}></i>
                    </div>
                    <div className="wptb-item--holder">
                      <h4 className="wptb-item--title">
                        <Link to="/our-works">{service.title}</Link>
                      </h4>
                      <p className="wptb-item--description">{service.desc}</p>
                      <h6 className="wptb-item--count text-outline">{service.num}</h6>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid_lines">
            <div className="grid_line"></div>
            <div className="grid_line"></div>
            <div className="grid_line"></div>
            <div className="grid_line"></div>
          </div>
        </div>
      </section>

      {/* Our Projects */}
      <section className="wptb-project pt-0">
        <div className="container">
          <div className="wptb-heading-two">
            <div className="wptb-item--inner text-center">
              <h6 className="wptb-item--subtitle">LV_Clicks Projects</h6>
              <h1 className="wptb-item--title"> Explore LV_Clicks <br /> Photography <span>Projects</span> </h1>
              <div className="wptb-item--description">
                LV_Clicks photography Agency runs wide and deep. Across many <br /> markets, geographies & typologies, our team members
              </div>
            </div>
          </div>

          <div className="style-masonry effect-blur">
            <div className="grid grid-3 gutter-10 clearfix">
              <div className="grid-sizer"></div>
              {projects.map((project) => (
                <div key={project.id} className="grid-item">
                  <div className="wptb-item--inner">
                    <div className="wptb-item--image">
                      <img src={`/assets/img/projects/1/${project.id}.jpg`} alt={project.title} loading="lazy" />
                    </div>
                    <div className="wptb-item--holder">
                      <div className="wptb-item--meta">
                        <h4>
                          <Link to="/album-detail">{project.title}</Link>
                        </h4>
                        <p>By {project.author}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="wptb-project pd-top-100 pd-bottom-80">
        <div className="container">
          <div className="wptb-heading-two">
            <div className="wptb-item--inner text-center">
              <h6 className="wptb-item--subtitle">Our Gallery</h6>
              <h1 className="wptb-item--title"> Explore Our <br /> Photography <span>Gallery</span> </h1>
              <div className="wptb-item--description">
                LV_Clicks photography gallery showcases our best work. <br /> Click on any image to view in full size.
              </div>
            </div>
          </div>

          <div className="style-masonry effect-blur">
            <div className="grid grid-3 gutter-10 clearfix">
              <div className="grid-sizer"></div>
              {galleryImages.map((num) => (
                <div key={num} className="grid-item">
                  <div className="wptb-item--inner">
                    <div className="wptb-item--image">
                      <img src={`/assets/img/projects/1/${num}.jpg`} alt={`Gallery ${num}`} loading="lazy" />
                      <a className="wptb-image-popup" href={`/assets/img/projects/1/${num}.jpg`} data-fancybox="home-gallery">
                        <i className="bi bi-arrows-fullscreen"></i>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-5">
            <div className="wptb-item--button">
              <Link to="/gallery" className="btn">
                <span className="btn-wrap">
                  <span className="text-first">View Full Gallery</span>
                  <span className="text-second">
                    <i className="bi bi-arrow-up-right"></i> <i className="bi bi-arrow-up-right"></i>
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="divider-line-hr"></div>

      {/* Testimonial */}
      <section className="wptb-testimonial-one bg-image" style={{ backgroundImage: "url('/assets/img/background/bg-3.jpg')" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="swiper-container swiper-testimonial">
                <div className="swiper-wrapper">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="swiper-slide">
                      <div className="wptb-testimonial1">
                        <div className="wptb-item--inner">
                          <div className="wptb-item--holder">
                            <div className="d-flex align-items-center justify-content-between mr-bottom-25">
                              <div className="wptb-item--meta-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <i key={star} className="bi bi-star-fill"></i>
                                ))}
                              </div>
                              <div className="wptb-item--icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="57" height="45" viewBox="0 0 57 45" fill="none">
                                  <path d="M51.5137 38.5537C56.8209 32.7938 56.2866 25.3969 56.2697 25.3125V2.8125C56.2697 2.06658 55.9734 1.35121 55.4459 0.823763C54.9185 0.296317 54.2031 0 53.4572 0H36.5822C33.48 0 30.9572 2.52281 30.9572 5.625V25.3125C30.9572 26.0584 31.2535 26.7738 31.781 27.3012C32.3084 27.8287 33.0238 28.125 33.7697 28.125H42.4266C42.3671 29.5155 41.9517 30.8674 41.22 32.0513C39.7913 34.3041 37.0997 35.8425 33.2156 36.6188L30.9572 37.0688V45H33.7697C41.5969 45 47.5678 42.8316 51.5137 38.5537ZM20.5566 38.5537C25.8666 32.7938 25.3294 25.3969 25.3125 25.3125V2.8125C25.3125 2.06658 25.0162 1.35121 24.4887 0.823763C23.9613 0.296317 23.2459 0 22.5 0H5.625C2.52281 0 0 2.52281 0 5.625V25.3125C0 26.0584 0.296316 26.7738 0.823762 27.3012C1.35121 27.8287 2.06658 28.125 2.8125 28.125H11.4694C11.41 29.5155 10.9945 30.8674 10.2628 32.0513C8.83406 34.3041 6.1425 35.8425 2.25844 36.6188L0 37.0688V45H2.8125C10.6397 45 16.6106 42.8316 20.5566 38.5537Z" fill="#D70006"/>
                                </svg>
                              </div>
                            </div>
                            <p className="wptb-item--description">
                              "I have an amazing photography session with team LV_Clicks photography agency, highly recommended.
                              They have amazing atmosphere in their studio. Iw'd love to visit again"
                            </p>
                            <div className="wptb-item--meta">
                              <div className="wptb-item--image">
                                <img src={`/assets/img/testimonial/${testimonial.image}.jpg`} alt={testimonial.name} loading="lazy" />
                              </div>
                              <div className="wptb-item--meta-left">
                                <h4 className="wptb-item--title">{testimonial.name}</h4>
                                <h6 className="wptb-item--designation">{testimonial.location}</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Swiper Navigation */}
                <div className="wptb-swiper-navigation style1">
                  <div className="wptb-swiper-arrow swiper-button-prev"></div>
                  <div className="wptb-swiper-arrow swiper-button-next"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Address */}
      <section className="wptb-office-address pd-bottom-100 mr-top-35">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="wptb-icon-box1 wow fadeInLeft">
                <div className="wptb-item--inner flex-start">
                  <div className="wptb-item--icon"><i className="bi bi-globe"></i></div>
                  <div className="wptb-item--holder">
                    <h3 className="wptb-item--title">Our Website</h3>
                    <p className="wptb-item--description">www.lvclicks.com</p>
                    <a href="#" className="wptb-item--link">Visit Now</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 px-md-5">
              <div className="wptb-icon-box1 wow fadeInLeft">
                <div className="wptb-item--inner flex-start">
                  <div className="wptb-item--icon"><i className="bi bi-phone"></i></div>
                  <div className="wptb-item--holder">
                    <h3 className="wptb-item--title">Book Us</h3>
                    <p className="wptb-item--description">+123 455 987 994</p>
                    <a href="tel:+98765432122811" className="wptb-item--link">Call Now</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="wptb-icon-box1 wow fadeInLeft">
                <div className="wptb-item--inner flex-start">
                  <div className="wptb-item--icon"><i className="bi bi-geo-alt"></i></div>
                  <div className="wptb-item--holder">
                    <h3 className="wptb-item--title">Studio Address</h3>
                    <p className="wptb-item--description">13 Madison Street, NY, USA</p>
                    <a href="#" className="wptb-item--link">View Map</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider-line-hr mr-bottom-40"></div>

      {/* About LV_Clicks */}
      <section className="wptb-about-three pd-top-80 pd-bottom-80">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 text-center">
              <div className="wptb-heading-two">
                <div className="wptb-item--inner">
                  <h6 className="wptb-item--subtitle">About LV_Clicks Photography</h6>
                  <h1 className="wptb-item--title">We are the LV_Clicks <br /> Photography Studio</h1>
                  <div className="wptb-item--description">
                    LV_Clicks photography Agency runs wide and deep. Across many markets, geographies & typologies, our team members are some of the finest photographers in the industry. We specialize in wedding photography, cinematography, and film making with a commitment to excellence and customer satisfaction.
                  </div>
                </div>
              </div>

              <div className="wptb-item--button mt-5">
                <Link to="/about" className="btn">
                  <span className="btn-wrap">
                    <span className="text-first">Learn More About Us</span>
                    <span className="text-second">
                      <i className="bi bi-arrow-up-right"></i> <i className="bi bi-arrow-up-right"></i>
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider-line-hr mr-bottom-40"></div>

      {/* Contact Form */}
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

export default Home

