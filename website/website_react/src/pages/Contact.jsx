import { useEffect } from 'react'

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      {/* Contact Form Section */}
      <section className="wptb-contact-form style1 bg-image-2" style={{ backgroundImage: "url('/assets/img/background/bg-9.jpg')" }}>
        <div className="wptb-item-layer both-version">
          <img src="/assets/img/more/texture-2.png" alt="" loading="lazy" />
          <img src="/assets/img/more/texture-2-light.png" alt="" loading="lazy" />
        </div>
        <div className="container">
          <div className="wptb-form--wrapper">
            <div className="wptb-heading">
              <div className="wptb-item--inner text-center">
                <h1 className="wptb-item--title">Get In Touch</h1>
                <div className="wptb-item--description">
                  Contact us for a great photography session & beautiful captured moments
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-8 offset-lg-2">
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
                          <textarea name="message" className="form-control" placeholder="Text" rows="5"></textarea>
                        </div>
                      </div>

                      <div className="col-md-12 col-lg-12">
                        <div className="wptb-item--button text-center">
                          <button className="btn white-opacity creative" type="submit">
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

          {/* Office Address Section */}
          <div className="wptb-office-address mr-top-100">
            <div className="row">
              <div className="col-lg-4 col-md-6">
                <div className="wptb-icon-box1 wow fadeInLeft">
                  <div className="wptb-item--inner flex-start">
                    <div className="wptb-item--icon">
                      <i className="bi bi-globe"></i>
                    </div>
                    <div className="wptb-item--holder">
                      <h3 className="wptb-item--title">Our Website</h3>
                      <p className="wptb-item--description">www.lvclicks.com</p>
                      <a href="https://www.lvclicks.com" className="wptb-item--link" target="_blank" rel="noopener noreferrer">
                        Visit Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 px-md-5">
                <div className="wptb-icon-box1 wow fadeInLeft">
                  <div className="wptb-item--inner flex-start">
                    <div className="wptb-item--icon">
                      <i className="bi bi-phone"></i>
                    </div>
                    <div className="wptb-item--holder">
                      <h3 className="wptb-item--title">Book Us</h3>
                      <p className="wptb-item--description">+123 455 987 994</p>
                      <a href="tel:+123455987994" className="wptb-item--link">
                        Call Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="wptb-icon-box1 wow fadeInLeft">
                  <div className="wptb-item--inner flex-start">
                    <div className="wptb-item--icon">
                      <i className="bi bi-geo-alt"></i>
                    </div>
                    <div className="wptb-item--holder">
                      <h3 className="wptb-item--title">Studio Address</h3>
                      <p className="wptb-item--description">Voharwad, Lunawada, Gujarat 389230</p>
                      <a href="https://www.google.com/maps/place/Voharwad,+Lunawada,+Gujarat+389230/@23.13003,73.6005703,15z/data=!3m1!4b1!4m6!3m5!1s0x3960afab35e3d779:0x2ec65b1e01a44790!8m2!3d23.130011!4d73.61087!16zL20vMDl2eWhr?entry=ttu" className="wptb-item--link" target="_blank" rel="noopener noreferrer">
                        View Map
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map - Using iframe embed (no API key required) */}
      <div className="gmapbox wow fadeInUp">
        <div className="map" style={{ width: '100%', height: '100%', minHeight: '500px', position: 'relative' }}>
          <iframe
            src="https://www.google.com/maps?q=23.130011,73.61087&hl=en&z=15&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '500px', display: 'block' }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="LV_Clicks Studio Location - Voharwad, Lunawada, Gujarat"
          ></iframe>
        </div>
      </div>
    </>
  )
}

export default Contact

