import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <>
      <footer className="footer style1 bg-image-2" style={{ backgroundImage: "url('/assets/img/background/bg-5_2.png')" }}>
        <div className="footer-top">
          <div className="container">
            <div className="footer--inner">
              <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-6 mb-5 mb-md-0">
                  <div className="footer-widget">
                    <div className="footer-nav">
                      <ul>
                        <li className="menu-item"><Link to="/about">About Us</Link></li>
                        <li className="menu-item"><a href="#team">Our Team</a></li>
                        <li className="menu-item"><a href="#packages">Packages</a></li>
                        <li className="menu-item"><Link to="/gallery">Gallery</Link></li>
                        <li className="menu-item"><a href="#services">Services</a></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 col-md-4 mb-5 mb-md-0 order-1 order-md-0">
                  <div className="footer-widget text-center">
                    <div className="logo mr-bottom-55">
                      <Link to="/"><span className="logo-text">LV_Clicks</span></Link>
                    </div>

                    <div className="wptb-newsletter-box">
                      <div className="wptb-newsletter-box--inner">
                        <h6 className="widget-title">Sign up for all the latest <br /> news and offers </h6>
                        <form className="newsletter-form" method="post">
                          <div className="form-group">
                            <input type="email" name="email" className="form-control" placeholder="Enter your email" required />
                          </div>
                          <button type="submit" className="btn btn-two">
                            <span className="btn-wrap">
                              <span className="text-first">Subscribe</span>
                              <span className="text-second">
                                <i className="bi bi-arrow-up-right"></i> <i className="bi bi-arrow-up-right"></i>
                              </span>
                            </span>
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-3 col-md-4 col-sm-6 mb-5 mb-md-0">
                  <div className="footer-widget text-md-end">
                    <div className="footer-nav">
                      <ul>
                        <li className="menu-item"><a href="#booking">Booking</a></li>
                        <li className="menu-item"><a href="#shop">Products</a></li>
                        <li className="menu-item"><a href="#blog">Recent Posts</a></li>
                        <li className="menu-item"><a href="#blog">Latest News</a></li>
                        <li className="menu-item"><a href="#contact">Contact Us</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Part */}
        <div className="footer-bottom">
          <div className="container">
            <div className="footer-bottom-inner">
              <div className="copyright">
                <p>LV_Clicks Photography, All Rights Reserved &copy; 2025</p>
              </div>
              <div className="social-box style-oval">
                <ul>
                  <li><a href="https://www.facebook.com/" className="bi bi-facebook"></a></li>
                  <li><a href="https://www.instagram.com/" className="bi bi-instagram"></a></li>
                  <li><a href="https://www.linkedin.com/" className="bi bi-linkedin"></a></li>
                  <li><a href="https://www.behance.com/" className="bi bi-behance"></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="totop">
        <a href="#"><i className="bi bi-chevron-up"></i></a>
      </div>
    </>
  )
}

export default Footer

