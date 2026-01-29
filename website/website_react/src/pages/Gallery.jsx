import { useEffect, useState } from 'react'
import useIsotope from '../hooks/useIsotope'
import websiteApi from '../services/websiteApi'

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([])
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [videos, setVideos] = useState([])
  const [videosLoading, setVideosLoading] = useState(true)

  // Initialize Isotope for the gallery grid - re-initialize when images change
  useIsotope('.style-masonry .grid', {}, [galleryImages.length])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Fetch gallery images from API
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setGalleryLoading(true)
        const response = await websiteApi.getGallery(1, 20)
        if (response.success && response.data && response.data.length > 0) {
          // Transform API data - use image_url from API directly
          const transformedGallery = response.data
            .filter(item => {
              // Filter out items with placeholder URLs in the API response
              if (item.image_url && (item.image_url.includes('via.placeholder.com') || item.image_url.includes('placeholder'))) {
                return false
              }
              if (item.image_path && (item.image_path.includes('via.placeholder.com') || item.image_path.includes('placeholder'))) {
                return false
              }
              return true
            })
            .map(item => {
              // Get image URL - prefer image_url from backend, otherwise construct from image_path
              const getImageUrl = () => {
                if (item.image_url && !item.image_url.includes('via.placeholder.com') && !item.image_url.includes('placeholder')) {
                  return item.image_url
                }
                if (item.image_path) {
                  // If it's already a full URL, use it
                  if (item.image_path.startsWith('http://') || item.image_path.startsWith('https://')) {
                    return item.image_path
                  }
                  // If it's a frontend asset path, use it as is
                  if (item.image_path.startsWith('/assets/')) {
                    return item.image_path
                  }
                  // If it's a storage path, construct the storage URL
                  if (item.image_path && !item.image_path.includes('\\') && !item.image_path.match(/^[A-Z]:/)) {
                    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
                    const baseUrl = apiUrl.replace(/\/api\/?$/, '')
                    return `${baseUrl}/storage/${item.image_path}`
                  }
                }
                // Fallback to static image
                return '/assets/img/projects/1/1.jpg'
              }

              return {
                id: item.id || Math.random(),
                image_url: getImageUrl()
              }
            })
          setGalleryImages(transformedGallery)
        } else {
          // Fallback to static data if API fails
          setGalleryImages(Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            image_url: `/assets/img/projects/1/${i + 1}.jpg`
          })))
        }
      } catch (error) {
        console.error('Error fetching gallery:', error)
        // Fallback to static data on error
        setGalleryImages(Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          image_url: `/assets/img/projects/1/${i + 1}.jpg`
        })))
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
              ) : galleryImages.length > 0 ? (
                galleryImages
                  .filter((item) => {
                    // Filter out items with placeholder URLs
                    const url = item.image_url || (typeof item === 'number' ? `/assets/img/projects/1/${item}.jpg` : item)
                    return url && !url.includes('via.placeholder.com') && !url.includes('placeholder')
                  })
                  .map((item) => {
                    const imageUrl = item.image_url || (typeof item === 'number' ? `/assets/img/projects/1/${item}.jpg` : item)
                    return (
                      <div key={item.id || item} className="grid-item">
                        <div className="wptb-item--inner">
                          <div className="wptb-item--image">
                            <img 
                              src={imageUrl} 
                              alt={`Gallery ${item.id || item}`} 
                              loading="lazy"
                              onError={(e) => {
                                console.error('Gallery image load error:', imageUrl)
                                e.currentTarget.src = `/assets/img/projects/1/1.jpg`
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

