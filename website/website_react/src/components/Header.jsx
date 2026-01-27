import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const Header = () => {
  const location = useLocation()

  useEffect(() => {
    // Initialize theme.js functionality if needed
    // This will be handled by the theme.js script
  }, [])

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="container-fluid pe-0">
            <div className="d-flex align-items-center justify-content-between">
              {/* Left Part */}
              <div className="header_left_part d-flex align-items-center">
                <div className="logo">
                  <Link to="/" className="light_logo">
                    <span className="logo-text">LV_Clicks</span>
                  </Link>
                  <Link to="/" className="dark_logo">
                    <span className="logo-text">LV_Clicks</span>
                  </Link>
                </div>
              </div>

              {/* Center Part */}
              <div className="header_center_part d-none d-xl-block">
                <div className="mainnav">
                  <ul className="main-menu">
                    <li className={`menu-item ${isActive('/') ? 'active' : ''}`}>
                      <Link to="/" style={{ textDecoration: 'none' }}>Home</Link>
                    </li>
                    <li className={`menu-item ${isActive('/gallery') ? 'active' : ''}`}>
                      <Link to="/gallery" style={{ textDecoration: 'none' }}>Gallery</Link>
                    </li>
                    <li className={`menu-item ${isActive('/our-works') ? 'active' : ''}`}>
                      <Link to="/our-works" style={{ textDecoration: 'none' }}>Our Works</Link>
                    </li>
                    <li className={`menu-item ${isActive('/about') ? 'active' : ''}`}>
                      <Link to="/about" style={{ textDecoration: 'none' }}>About Us</Link>
                    </li>
                    <li className={`menu-item ${isActive('/contact') ? 'active' : ''}`}>
                      <Link to="/contact" style={{ textDecoration: 'none' }}>Contact</Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Part */}
              <div className="header_right_part d-flex align-items-center">
                <div className="aside_open wptb-element">
                  <div className="aside-open--inner">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>

                <button type="button" className="mr_menu_toggle wptb-element d-xl-none">
                  <i className="bi bi-list"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Responsive Menu */}
      <div className="mr_menu" data-lenis-prevent>
        <button type="button" className="mr_menu_close">
          <i className="bi bi-x-lg"></i>
        </button>
        <div className="logo"></div>
        
        <h6>Menu</h6>
        <div className="mr_navmenu"></div>

        <h6>Contact Us</h6>
        <div className="wptb-icon-box1 style2">
          <div className="wptb-item--inner flex-start">
            <div className="wptb-item--icon"><i className="bi bi-envelope"></i></div>
            <div className="wptb-item--holder">
              <p className="wptb-item--description">
                <a href="mailto:info@lvclicks.com">info@lvclicks.com</a>
              </p>
            </div>
          </div>
        </div>

        <div className="wptb-icon-box1 style2">
          <div className="wptb-item--inner flex-start">
            <div className="wptb-item--icon"><i className="bi bi-geo-alt"></i></div>
            <div className="wptb-item--holder">
              <p className="wptb-item--description">
                <a href="#contact">28 Street, New York, USA</a>
              </p>
            </div>
          </div>
        </div>

        <div className="wptb-icon-box1 style2">
          <div className="wptb-item--inner flex-start">
            <div className="wptb-item--icon"><i className="bi bi-envelope"></i></div>
            <div className="wptb-item--holder">
              <p className="wptb-item--description">
                <a href="tel:+98765432122811">(+987) 654 321 228 11</a>
              </p>
            </div>
          </div>
        </div>

        <h6>Find Our Page</h6>
        <div className="social-box">
          <ul>
            <li><a href="https://www.facebook.com/"><i className="bi bi-facebook"></i></a></li>
            <li><a href="https://www.instagram.com/lv_clicks_/" target="_blank" rel="noopener noreferrer"><i className="bi bi-instagram"></i></a></li>
            <li><a href="https://www.linkedin.com/"><i className="bi bi-linkedin"></i></a></li>
            <li><a href="https://www.behance.com/"><i className="bi bi-behance"></i></a></li>
            <li><a href="https://www.youtube.com/"><i className="bi bi-youtube"></i></a></li>
          </ul>
        </div>
      </div>

      {/* Aside Info Wrapper */}
      <div className="aside_info_wrapper" data-lenis-prevent>
        <button className="aside_close">Close <i className="bi bi-x-lg"></i></button>

        <div className="aside_logo logo">
          <Link to="/" className="light_logo"><span className="logo-text">LV_Clicks</span></Link>
          <Link to="/" className="dark_logo"><span className="logo-text">LV_Clicks</span></Link>
        </div>

        <div className="aside_info_inner">
          <h6>// Instagram</h6>
          <div className="insta-logo">
            <i className="bi bi-instagram"></i> lv_clicks
          </div>
          <div className="wptb-instagram--gallery">
            <div className="wptb-item--inner d-flex align-items-center justify-content-center flex-wrap">
              {[6, 7, 8, 9, 10, 11].map((num) => (
                <div key={num} className="wptb-item">
                  <div className="wptb-item--image">
                    <img src={`/assets/img/instagram/${num}.jpg`} alt="instagram" loading="lazy" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="wptb-icon-box1 style2">
            <div className="wptb-item--inner flex-start">
              <div className="wptb-item--icon"><i className="bi bi-envelope"></i></div>
              <div className="wptb-item--holder">
                <p className="wptb-item--description">
                  <a href="mailto:info@lvclicks.com">info@lvclicks.com</a>
                </p>
              </div>
            </div>
          </div>

          <div className="wptb-icon-box1 style2">
            <div className="wptb-item--inner flex-start">
              <div className="wptb-item--icon"><i className="bi bi-geo-alt"></i></div>
              <div className="wptb-item--holder">
                <p className="wptb-item--description">
                  <a href="#contact">28 Street, New York, USA</a>
                </p>
              </div>
            </div>
          </div>

          <div className="wptb-icon-box1 style2">
            <div className="wptb-item--inner flex-start">
              <div className="wptb-item--icon"><i className="bi bi-envelope"></i></div>
              <div className="wptb-item--holder">
                <p className="wptb-item--description">
                  <a href="tel:+98765432122811">(+987) 654 321 228 11</a>
                </p>
              </div>
            </div>
          </div>

          <h6>// Follow Us</h6>
          <div className="social-box style-square">
            <ul>
              <li><a href="https://www.facebook.com/"><i className="bi bi-facebook"></i></a></li>
              <li><a href="https://www.instagram.com/lv_clicks_/" target="_blank" rel="noopener noreferrer"><i className="bi bi-instagram"></i></a></li>
              <li><a href="https://www.linkedin.com/"><i className="bi bi-linkedin"></i></a></li>
              <li><a href="https://www.behance.com/"><i className="bi bi-behance"></i></a></li>
              <li><a href="https://www.youtube.com/"><i className="bi bi-youtube"></i></a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pointer */}
      <div className="pointer bnz-pointer" id="bnz-pointer"></div>
    </>
  )
}

export default Header

