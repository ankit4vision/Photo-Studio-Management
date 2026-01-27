import { useEffect } from 'react'

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const faqItems = [
    { title: 'LV_Clicks Missions', content: 'Our business consulting programs helps to break the performance of your business down into customers and product groups so you know exactly which customers or product groups are working.', active: true },
    { title: 'LV_Clicks Photography Features', content: 'Our business consulting programs helps to break the performance of your business down into customers and product groups so you know exactly which customers or product groups are working.' },
    { title: 'Why We are Best Photographers', content: 'Our business consulting programs helps to break the performance of your business down into customers and product groups so you know exactly which customers or product groups are working.' }
  ]

  const teamMembers = [
    { name: 'Maxim Alexhander', position: 'CEO, LV_Clicks Agency', image: 1 },
    { name: 'Nelson Jameson', position: 'Photographer', image: 2 },
    { name: 'Ellie Duncan', position: 'Photographer', image: 3 },
    { name: 'Harold Earls', position: 'Photographer', image: 4 },
    { name: 'Nelson Jameson', position: 'Photographer', image: 5 },
    { name: 'Ellie Duncan', position: 'Photographer', image: 6 },
    { name: 'Harold Earls', position: 'Photographer', image: 4 }
  ]

  const testimonials = [
    { name: 'Rachel Jackson', location: 'New York', image: 1 },
    { name: 'Helen Jordan', location: 'Chicago', image: 2 },
    { name: 'Helen Jordan', location: 'New York', image: 3 }
  ]

  return (
    <>
      {/* About LV_Clicks */}
      <section className="wptb-about-one bg-image-2" style={{ backgroundImage: "url('/assets/img/more/texture.png')" }}>
        <div className="container">
          <div className="wptb-image-single mr-bottom-90 wow fadeInUp">
            <div className="wptb-item--inner">
              <div className="wptb-item--image">
                <img src="/assets/img/background/bg-6.jpg" alt="img" loading="lazy" />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-8">
              <div className="row">
                <div className="col-md-6">
                  <div className="wptb-image-single wow fadeInUp">
                    <div className="wptb-item--inner">
                      <div className="wptb-item--image">
                        <img src="/assets/img/more/1.jpg" alt="img" loading="lazy" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 ps-md-0 mt-5">
                  <div className="wptb-about--text">
                    <p className="wptb-about--text-one mb-4">
                      LV_Clicks photography Agency runs wide and deep. Across many markets, geographies & typologies, our team members
                    </p>
                    <p>
                      The talent at LV_Clicks runs wide range of services. Across many markets, geographies & typologies, our team members are some of the finest people of photographers in the industry wide and deep. From Across many markets, geographies & boundaries. Hire LV_Clicks in your event.
                    </p>
                  </div>
                </div>
              </div>

              <div className="row wptb-about-funfact">
                <div className="col-md-6 mb-4 mb-md-0">
                  <div className="wptb-counter1 style1 pd-right-60 wow skewIn">
                    <div className="wptb-item--inner">
                      <div className="wptb-item--holder d-flex align-items-center">
                        <div className="wptb-item--value">
                          {/* Start from 0 so Odometer can animate to data-count, and show a value even if JS is disabled */}
                          <span className="odometer" data-count="100">0</span>
                          <span className="suffix">%</span>
                        </div>
                        <div className="wptb-item--text">Customer Satisfaction</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="wptb-counter1 style1 pd-right-60 wow skewIn">
                    <div className="wptb-item--inner">
                      <div className="wptb-item--holder d-flex align-items-center">
                        <div className="wptb-item--value flex-shrink-0">
                          {/* Start from 0 so Odometer can animate to data-count, and show a value even if JS is disabled */}
                          <span className="odometer" data-count="350">0</span>
                          <span className="suffix">+</span>
                        </div>
                        <div className="wptb-item--text">Photography Session</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-4 ps-xl-5 mt-5 mt-xl-0 d-none d-xl-block">
              <div className="wptb-image-single wow fadeInUp">
                <div className="wptb-item--inner">
                  <div className="wptb-item--image">
                    <img src="/assets/img/more/2.jpg" alt="img" loading="lazy" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="wptb-item-layer wptb-item-layer-one">
            <img src="/assets/img/more/light-1.png" alt="img" loading="lazy" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="wptb-faq-one bg-image pb-0" style={{ backgroundImage: "url('/assets/img/background/bg-8.jpg')" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="wptb-heading">
                <div className="wptb-item--inner">
                  <h1 className="wptb-item--title mb-lg-0">Why Choose Us</h1>
                </div>
              </div>

              <div className="wptb-accordion wptb-accordion2 wow fadeInUp">
                {faqItems.map((item, index) => (
                  <div key={index} className={`wptb--item ${item.active ? 'active' : ''}`}>
                    <h6 className="wptb-item-title">
                      <span>{item.title}</span> <i className="plus bi bi-plus"></i> <i className="minus bi bi-dash"></i>
                    </h6>
                    <div className="wptb-item--content">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="wptb-agency-experience--item">
                <span>15+</span> Years Experience
              </div>
            </div>

            <div className="col-lg-6">
              <div className="wptb-image-single wow fadeInUp">
                <div className="wptb-item--inner">
                  <div className="wptb-item--image">
                    <img src="/assets/img/more/3.png" alt="img" loading="lazy" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Text Marquee */}
      <div className="wptb-marquee pd-top-80">
        <div className="wptb-text-marquee1 wptb-slide-to-left">
          <div className="wptb-item--container">
            <div className="wptb-item--inner">
              <h4 className="wptb-item--text">
                <span className="wptb-text-backdrop">LV_Clicks</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src="/assets/img/more/star.png" alt="img" loading="lazy" />
                  <img src="/assets/img/more/star-dark.png" alt="img" loading="lazy" />
                </span>
              </h4>
              <h4 className="wptb-item--text text-outline">
                <span className="wptb-text-backdrop">Photography</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src="/assets/img/more/star.png" alt="img" loading="lazy" />
                  <img src="/assets/img/more/star-dark.png" alt="img" loading="lazy" />
                </span>
              </h4>
              <h4 className="wptb-item--text">
                <span className="wptb-text-backdrop">Studio</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src="/assets/img/more/star.png" alt="img" loading="lazy" />
                  <img src="/assets/img/more/star-dark.png" alt="img" loading="lazy" />
                </span>
              </h4>
              <h4 className="wptb-item--text text-outline">
                <span className="wptb-text-backdrop">Agency</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src="/assets/img/more/star.png" alt="img" loading="lazy" />
                  <img src="/assets/img/more/star-dark.png" alt="img" loading="lazy" />
                </span>
              </h4>
              <h4 className="wptb-item--text">
                <span className="wptb-text-backdrop">LV_Clicks</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src="/assets/img/more/star.png" alt="img" loading="lazy" />
                  <img src="/assets/img/more/star-dark.png" alt="img" loading="lazy" />
                </span>
              </h4>
            </div>
            <div className="wptb-item--inner">
              <h4 className="wptb-item--text text-outline">
                <span className="wptb-text-backdrop">Photography</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src="/assets/img/more/star.png" alt="img" loading="lazy" />
                  <img src="/assets/img/more/star-dark.png" alt="img" loading="lazy" />
                </span>
              </h4>
              <h4 className="wptb-item--text">
                <span className="wptb-text-backdrop">Studio</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src="/assets/img/more/star.png" alt="img" loading="lazy" />
                  <img src="/assets/img/more/star-dark.png" alt="img" loading="lazy" />
                </span>
              </h4>
              <h4 className="wptb-item--text text-outline">
                <span className="wptb-text-backdrop">Agency</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src="/assets/img/more/star.png" alt="img" loading="lazy" />
                  <img src="/assets/img/more/star-dark.png" alt="img" loading="lazy" />
                </span>
              </h4>
              <h4 className="wptb-item--text">
                <span className="wptb-text-backdrop">LV_Clicks</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src="/assets/img/more/star.png" alt="img" loading="lazy" />
                  <img src="/assets/img/more/star-dark.png" alt="img" loading="lazy" />
                </span>
              </h4>
              <h4 className="wptb-item--text text-outline">
                <span className="wptb-text-backdrop">Photography</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src="/assets/img/more/star.png" alt="img" loading="lazy" />
                  <img src="/assets/img/more/star-dark.png" alt="img" loading="lazy" />
                </span>
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Video */}
      <div className="container">
        <div className="wptb-video-player1 wow zoomIn" style={{ backgroundImage: "url('/assets/img/background/bg-7.jpg')" }}>
          <div className="wptb-item--inner">
            <div className="wptb-item--holder">
              <div className="wptb-item--video-button">
                <a className="btn" data-fancybox href="https://www.youtube.com/watch?v=SF4aHwxHtZ0">
                  <span className="text-second"> <i className="bi bi-play-fill"></i> </span>
                  <span className="line-video-animation line-video-1"></span>
                  <span className="line-video-animation line-video-2"></span>
                  <span className="line-video-animation line-video-3"></span>
                </a>
              </div>
            </div>
          </div>
          <div className="wptb-item-layer wptb-item-layer-one">
            <img src="/assets/img/more/light-3.png" alt="img" loading="lazy" />
          </div>
        </div>
      </div>

      <div className="divider-line-hr mr-top-100"></div>

      {/* Team */}
      <section className="wptb-team-one pd-top-90">
        <div className="container">
          <div className="wptb-heading">
            <div className="wptb-item--inner">
              <div className="row">
                <div className="col-lg-6">
                  <h6 className="wptb-item--subtitle"><span>01 //</span> Our Team</h6>
                  <h1 className="wptb-item--title mb-lg-0">
                    Our Core Team of<br />
                    <span>Photographers</span>
                  </h1>
                </div>
                <div className="col-lg-6">
                  <p className="wptb-item--description">
                    we're deeply passionate <span>catch your lovely memories in cameras</span>
                    and Convey your love for every moment of life as a whole.
                  </p>
                  <div className="wptb-swiper-navigation style1">
                    <div className="wptb-swiper-arrow swiper-button-prev"></div>
                    <div className="wptb-swiper-arrow swiper-button-next"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="swiper-container swiper-team">
            <div className="swiper-wrapper">
              {teamMembers.map((member, index) => (
                <div key={index} className="swiper-slide">
                  <div className="wptb-team-grid1">
                    <div className="wptb-item--inner">
                      <div className="wptb-item--image">
                        <img src={`/assets/img/team/${member.image}.jpg`} alt="img" loading="lazy" />
                      </div>
                      <div className="wptb-item--holder">
                        <div className="wptb-item--meta">
                          <h5 className="wptb-item--title">{member.name}</h5>
                          <p className="wptb-item--position">{member.position}</p>
                        </div>
                        <div className="wptb-item--social">
                          <a href="#">FB</a>
                          <a href="#">IG</a>
                          <a href="#">YT</a>
                          <a href="#">DR</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="wptb-testimonial-one testimonial-colored bg-image" style={{ backgroundImage: "url('/assets/img/background/bg-2.jpg')" }}>
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
                                <img src={`/assets/img/testimonial/${testimonial.image}.jpg`} alt="img" loading="lazy" />
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

      {/* Awards */}
      <section className="bg-dark-200 pd-bottom-80">
        <div className="container">
          <div className="wptb-heading">
            <div className="wptb-item--inner">
              <div className="row">
                <div className="col-lg-6">
                  <h6 className="wptb-item--subtitle"><span>02 //</span> Our Awards</h6>
                  <h1 className="wptb-item--title mb-0">
                    Our Photography<br />
                    <span>Awards</span>
                  </h1>
                </div>
                <div className="col-lg-6">
                  <p className="wptb-item--description">
                    we're deeply passionate <span>catch your lovely memories in cameras</span>
                    and Convey your love for every moment of life as a whole.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ol className="wptb-award-list">
            <li className="wptb-item">
              <div className="wptb-item--inner">
                <div className="wptb-item--holder">
                  <a href="/album-detail">Photography Team of the Year 2023</a>
                </div>
                <div className="wptb-item--image">
                  <img src="/assets/img/more/4.jpg" alt="img" loading="lazy" />
                  <div className="wptb-item--button">
                    <a href="/album-detail" className="btn">View</a>
                  </div>
                </div>
              </div>
            </li>

            <li className="wptb-item active highlight">
              <div className="wptb-item--inner">
                <div className="wptb-item--holder">
                  <a href="/album-detail">Best Wedding Photographer 2022</a>
                </div>
                <div className="wptb-item--image">
                  <img src="/assets/img/more/5.jpg" alt="img" loading="lazy" />
                  <div className="wptb-item--button">
                    <a href="/album-detail" className="btn">View</a>
                  </div>
                </div>
              </div>
            </li>

            <li className="wptb-item">
              <div className="wptb-item--inner">
                <div className="wptb-item--holder">
                  <a href="/album-detail">Photography Team of the Year 2019</a>
                </div>
                <div className="wptb-item--image">
                  <img src="/assets/img/more/6.jpg" alt="img" loading="lazy" />
                  <div className="wptb-item--button">
                    <a href="/album-detail" className="btn">View</a>
                  </div>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </section>
    </>
  )
}

export default About

