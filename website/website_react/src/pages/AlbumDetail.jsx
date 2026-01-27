import { Link } from 'react-router-dom'
import { useEffect } from 'react'

const AlbumDetail = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const sliderImages = [1, 2, 3]
  const detailImages = [2, 3, 4, 5, 6, 7, 8, 9, 10]

  return (
    <>
      {/* Page Header */}
      <div className="wptb-page-heading">
        <div className="wptb-item--inner" style={{ backgroundImage: "url('/assets/img/background/bg-3.jpg')" }}>
          <div className="wptb-item-layer wptb-item-layer-one">
            <img src="/assets/img/more/circle.png" alt="circle" loading="lazy" />
          </div>
          <h2 className="wptb-item--title">Album Detail</h2>
        </div>
      </div>

      {/* Album Details Content */}
      <section className="blog-details">
        <div className="container">
          <div className="blog-details-inner">
            <div className="post-content">
              <div className="row">
                <div className="col-lg-9 col-md-8 pe-md-5">
                  {/* Album Images Slider */}
                  <div className="swiper-container swiper-gallery mb-4">
                    <div className="swiper-wrapper">
                      {sliderImages.map((num) => (
                        <div key={num} className="swiper-slide">
                          <figure className="block-gallery">
                            <img src={`/assets/img/projects/gallery/${num}.jpg`} alt={`Slide ${num}`} loading="lazy" />
                            <a className="wptb-image-popup" href={`/assets/img/projects/gallery/${num}.jpg`} data-fancybox="album-gallery">
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

                  <div className="post-header">
                    <h1 className="post-title">Wedding Album 2024</h1>
                    <div className="post-meta">
                      <span><i className="bi bi-calendar"></i> December 2024</span>
                      <span><i className="bi bi-images"></i> 25 Photos</span>
                    </div>
                  </div>
                  <div className="fulltext">
                    <p>LV_Clicks Photography captured this beautiful wedding celebration with attention to detail and artistic vision. Our portfolio showcases the most memorable moments from this special day.</p>

                    {/* Album Images Grid */}
                    <div className="row mt-5">
                      <div className="col-md-6">
                        <figure className="block-gallery mb-4">
                          <img src="/assets/img/projects/details/2.jpg" alt="detail" loading="lazy" />
                          <a className="wptb-image-popup" href="/assets/img/projects/details/2.jpg" data-fancybox="album-gallery">
                            <i className="bi bi-arrows-fullscreen"></i>
                          </a>
                        </figure>

                        <figure className="block-gallery mb-4">
                          <img src="/assets/img/projects/details/3.jpg" alt="detail" loading="lazy" />
                          <a className="wptb-image-popup" href="/assets/img/projects/details/3.jpg" data-fancybox="album-gallery">
                            <i className="bi bi-arrows-fullscreen"></i>
                          </a>
                        </figure>
                      </div>
                      <div className="col-md-6">
                        <figure className="block-gallery mb-4">
                          <img src="/assets/img/projects/details/4.jpg" alt="detail" loading="lazy" />
                          <a className="wptb-image-popup" href="/assets/img/projects/details/4.jpg" data-fancybox="album-gallery">
                            <i className="bi bi-arrows-fullscreen"></i>
                          </a>
                        </figure>

                        <figure className="block-gallery mb-4">
                          <img src="/assets/img/projects/details/5.jpg" alt="detail" loading="lazy" />
                          <a className="wptb-image-popup" href="/assets/img/projects/details/5.jpg" data-fancybox="album-gallery">
                            <i className="bi bi-arrows-fullscreen"></i>
                          </a>
                        </figure>
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-4">
                        <figure className="block-gallery mb-4">
                          <img src="/assets/img/projects/details/6.jpg" alt="detail" loading="lazy" />
                          <a className="wptb-image-popup" href="/assets/img/projects/details/6.jpg" data-fancybox="album-gallery">
                            <i className="bi bi-arrows-fullscreen"></i>
                          </a>
                        </figure>
                      </div>
                      <div className="col-md-4">
                        <figure className="block-gallery mb-4">
                          <img src="/assets/img/projects/details/7.jpg" alt="detail" loading="lazy" />
                          <a className="wptb-image-popup" href="/assets/img/projects/details/7.jpg" data-fancybox="album-gallery">
                            <i className="bi bi-arrows-fullscreen"></i>
                          </a>
                        </figure>
                      </div>
                      <div className="col-md-4">
                        <figure className="block-gallery mb-4">
                          <img src="/assets/img/projects/details/8.jpg" alt="detail" loading="lazy" />
                          <a className="wptb-image-popup" href="/assets/img/projects/details/8.jpg" data-fancybox="album-gallery">
                            <i className="bi bi-arrows-fullscreen"></i>
                          </a>
                        </figure>
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-6">
                        <figure className="block-gallery mb-4">
                          <img src="/assets/img/projects/details/9.jpg" alt="detail" loading="lazy" />
                          <a className="wptb-image-popup" href="/assets/img/projects/details/9.jpg" data-fancybox="album-gallery">
                            <i className="bi bi-arrows-fullscreen"></i>
                          </a>
                        </figure>
                      </div>
                      <div className="col-md-6">
                        <figure className="block-gallery mb-4">
                          <img src="/assets/img/projects/details/10.jpg" alt="detail" loading="lazy" />
                          <a className="wptb-image-popup" href="/assets/img/projects/details/10.jpg" data-fancybox="album-gallery">
                            <i className="bi bi-arrows-fullscreen"></i>
                          </a>
                        </figure>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Album Sidebar */}
                <div className="col-lg-3 col-md-4">
                  <div className="sidebar">
                    <div className="widget">
                      <h4 className="widget-title"><span>//</span>Album Info</h4>
                      <ul className="widget-list">
                        <li><strong>Date:</strong> December 2024</li>
                        <li><strong>Location:</strong> New York, USA</li>
                        <li><strong>Photographer:</strong> LV_Clicks Team</li>
                        <li><strong>Total Photos:</strong> 25</li>
                        <li><strong>Category:</strong> Wedding</li>
                      </ul>
                    </div>

                    <div className="widget mt-5">
                      <h4 className="widget-title"><span>//</span>Share Album</h4>
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
                            <span className="text-first">Back to Albums</span>
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

