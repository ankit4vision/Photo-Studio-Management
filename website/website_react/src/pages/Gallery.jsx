import { useEffect } from 'react'
import useIsotope from '../hooks/useIsotope'

const Gallery = () => {
  // Initialize Isotope for the gallery grid
  useIsotope('.style-masonry .grid')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const galleryImages = Array.from({ length: 10 }, (_, i) => i + 1)

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
              {galleryImages.map((num) => (
                <div key={num} className="grid-item">
                  <div className="wptb-item--inner">
                    <div className="wptb-item--image">
                      <img src={`/assets/img/projects/1/${num}.jpg`} alt="img" loading="lazy" />
                      <a className="wptb-image-popup" href={`/assets/img/projects/1/${num}.jpg`} data-fancybox="gallery-images">
                        <i className="bi bi-arrows-fullscreen"></i>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
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

