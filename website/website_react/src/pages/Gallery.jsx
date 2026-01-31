import { useEffect, useState } from 'react'
import useIsotope from '../hooks/useIsotope'
import websiteApi from '../services/websiteApi'

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([])
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [videos, setVideos] = useState([])
  const [videosLoading, setVideosLoading] = useState(true)

  // Initialize Isotope for the gallery grid - re-initialize when images change
  useIsotope('.grid.grid-3', {}, [galleryImages.length])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Fetch gallery images from API
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setGalleryLoading(true)
        const response = await websiteApi.getGallery(1, 20)
        console.log('Gallery API Response:', response) // Debug log
        let transformedGallery = []
        
        if (response.success && response.data && Array.isArray(response.data) && response.data.length > 0) {
          // Transform API data - use image_url from API directly
          // Don't filter too strictly - show items even without images (they'll get fallback)
          transformedGallery = response.data
            .filter(item => {
              // Only filter out items with placeholder URLs, keep everything else
              if (item.image_url && (item.image_url.includes('via.placeholder.com') || item.image_url.includes('placeholder'))) {
                return false
              }
              if (item.image_path && (item.image_path.includes('via.placeholder.com') || item.image_path.includes('placeholder'))) {
                return false
              }
              // Keep all other items (even without images - they'll get fallback)
              return true
            })
            .map((item, index) => {
              // Get image URL - prefer image_url from backend, otherwise construct from image_path
              const getImageUrl = () => {
                let imageUrl = null
                
                if (item.image_url && !item.image_url.includes('via.placeholder.com') && !item.image_url.includes('placeholder')) {
                  imageUrl = item.image_url
                } else if (item.image_path && !item.image_path.includes('via.placeholder.com') && !item.image_path.includes('placeholder')) {
                  imageUrl = item.image_path
                }
                
                // Clean the image URL - fix common path issues
                if (imageUrl) {
                  // Fix singular "project" to plural "projects"
                  imageUrl = imageUrl.replace(/\/assets\/img\/project\//, '/assets/img/projects/1/')
                  // Fix gallery paths - ensure they point to correct location
                  imageUrl = imageUrl.replace(/\/assets\/img\/gallery\//, '/assets/img/projects/gallery/')
                  // If it's already a full URL, use it
                  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
                    return imageUrl
                  }
                  // If it's a frontend asset path, use it as is (after cleaning)
                  if (imageUrl.startsWith('/assets/')) {
                    return imageUrl
                  }
                  // If it's a storage path, construct the storage URL
                  if (!imageUrl.includes('\\') && !imageUrl.match(/^[A-Z]:/)) {
                    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
                    const baseUrl = apiUrl.replace(/\/api\/?$/, '')
                    return `${baseUrl}/storage/${imageUrl}`
                  }
                }
                
                // Fallback to static image (cycling through available images)
                const fallbackIndex = ((item.id || index) % 5) + 1
                return `/assets/img/projects/gallery/${fallbackIndex}.jpg`
              }

              return {
                id: item.id || Math.random(),
                image_url: getImageUrl()
              }
            })
        }
        
        // Always ensure we have images to show - use fallback if needed
        if (transformedGallery.length > 0) {
          console.log('Setting gallery images:', transformedGallery.length)
          setGalleryImages(transformedGallery)
        } else {
          console.log('No valid gallery images from API, using fallback data')
          // Fallback to static data - always show something
          const fallbackImages = Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            image_url: `/assets/img/projects/gallery/${(i % 5) + 1}.jpg`
          }))
          console.log('Setting fallback gallery images:', fallbackImages.length, fallbackImages)
          setGalleryImages(fallbackImages)
        }
      } catch (error) {
        console.error('Error fetching gallery:', error)
        // Fallback to static data on error - ALWAYS show something
        const fallbackImages = Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          image_url: `/assets/img/projects/gallery/${(i % 5) + 1}.jpg`
        }))
        console.log('Setting fallback gallery images:', fallbackImages.length)
        setGalleryImages(fallbackImages)
      } finally {
        setGalleryLoading(false)
      }
    }

    fetchGallery()
  }, [])

  // Fetch gallery videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setVideosLoading(true)
        const response = await websiteApi.getGalleryVideos()
        if (response.success && response.data) {
          // Transform API data to match component structure
          const transformedVideos = response.data.map(video => ({
            title: video.title || 'Video',
            url: video.video_url
          }))
          setVideos(transformedVideos)
        } else {
          // Fallback to static data if API fails
          setVideos([
            { title: 'Photography Session', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
            { title: 'Wedding Highlights', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
            { title: 'Portrait Session', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
            { title: 'Event Coverage', url: 'https://vimeo.com/123456789' },
            { title: 'Fashion Shoot', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
            { title: 'Behind The Scenes', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
          ])
        }
      } catch (error) {
        console.error('Error fetching videos:', error)
        // Fallback to static data on error
        setVideos([
          { title: 'Photography Session', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Wedding Highlights', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Portrait Session', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Event Coverage', url: 'https://vimeo.com/123456789' },
          { title: 'Fashion Shoot', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { title: 'Behind The Scenes', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
        ])
      } finally {
        setVideosLoading(false)
      }
    }

    fetchVideos()
  }, [])

  return (
    <>
      {/* Images Gallery Section */}
      <section className="wptb-project pd-top-100 pd-bottom-80">
        <div className="container">
          <div className="wptb-heading-two">
            <div className="wptb-item--inner text-center">
              <h6 className="wptb-item--subtitle">Images</h6>
              <h1 className="wptb-item--title"> Our Photography <br /> <span>Gallery</span> </h1>
              <div className="wptb-item--description">
                Click on any image to view in full size. <br /> Browse through our collection of stunning photography work.
              </div>
            </div>
          </div>

          <div className="style-masonry effect-blur">
            <div className="grid grid-3 gutter-10 clearfix">
              <div className="grid-sizer"></div>
              {galleryLoading ? (
                <div className="grid-item col-12 text-center" style={{ padding: '40px' }}>
                  <p>Loading gallery images...</p>
                </div>
              ) : (
                <>
                  {galleryImages.length > 0 ? (
                    galleryImages.map((item, index) => {
                      // Clean and fix image URL
                      let imageUrl = item.image_url
                      if (imageUrl) {
                        // Fix common path issues
                        imageUrl = imageUrl.replace(/\/assets\/img\/project\//, '/assets/img/projects/1/')
                        imageUrl = imageUrl.replace(/\/assets\/img\/gallery\//, '/assets/img/projects/gallery/')
                      } else if (typeof item === 'number') {
                        imageUrl = `/assets/img/projects/gallery/${item}.jpg`
                      }
                      
                      // Get safe fallback
                      const fallbackIndex = ((item.id || index) % 5) + 1
                      const fallbackPath = `/assets/img/projects/gallery/${fallbackIndex}.jpg`
                      imageUrl = imageUrl || fallbackPath
                      
                      return (
                        <div key={item.id || item} className="grid-item">
                          <div className="wptb-item--inner">
                            <div className="wptb-item--image">
                              <img 
                                src={imageUrl} 
                                alt={`Gallery ${item.id || item}`} 
                                loading="lazy"
                                onError={(e) => {
                                  // Only set fallback if current src is different
                                  const currentSrc = e.currentTarget.src
                                  if (!currentSrc.includes(fallbackPath) && !currentSrc.endsWith(`/gallery/${fallbackIndex}.jpg`)) {
                                    e.currentTarget.src = fallbackPath
                                  } else {
                                    // If fallback also fails, hide the image
                                    e.currentTarget.style.display = 'none'
                                  }
                                }}
                              />
                              <a className="wptb-image-popup" href={imageUrl} data-fancybox="gallery-images">
                                <i className="bi bi-arrows-fullscreen"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="grid-item col-12 text-center" style={{ padding: '40px' }}>
                      <p>No gallery images available</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="divider-line-hr"></div>

      {/* Videos Gallery Section */}
      <section className="wptb-project pd-top-100 pd-bottom-80">
        <div className="container">
          <div className="wptb-heading-two">
            <div className="wptb-item--inner text-center">
              <h6 className="wptb-item--subtitle">Videos</h6>
              <h1 className="wptb-item--title"> Our Video <br /> <span>Collection</span> </h1>
              <div className="wptb-item--description">
                Click on any video to play. <br /> Watch our latest photography and videography work.
              </div>
            </div>
          </div>

          <div className="row">
            {[
              { title: 'Photography Session', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
              { title: 'Wedding Highlights', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
              { title: 'Portrait Session', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
              { title: 'Event Coverage', url: 'https://vimeo.com/123456789' },
              { title: 'Fashion Shoot', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
              { title: 'Behind The Scenes', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
            ].map((video, index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-4">
                <div className="wptb-video-player1 wow zoomIn" style={{ backgroundImage: "url('/assets/img/background/bg-3.jpg')" }}>
                  <div className="wptb-item--inner">
                    <div className="wptb-item--holder">
                      <div className="wptb-item--video-button">
                        <a className="btn" data-fancybox href={video.url}>
                          <span className="text-second"> <i className="bi bi-play-fill"></i> </span>
                          <span className="line-video-animation line-video-1"></span>
                          <span className="line-video-animation line-video-2"></span>
                          <span className="line-video-animation line-video-3"></span>
                        </a>
                      </div>
                      <h4 className="wptb-item--title">{video.title}</h4>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-line-hr mr-bottom-40"></div>

      {/* Contact Form Section */}
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

export default Gallery

