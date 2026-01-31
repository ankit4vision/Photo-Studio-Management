import { Link, useLocation } from 'react-router-dom';

const Header = ({ onMobileMenuToggle, onAsideToggle, onSearchToggle }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="container-fluid pe-0">
            <div className="d-flex align-items-center justify-content-between">
              {/* Left Part - Logo */}
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

              {/* Center Part - Navigation */}
              <div className="header_center_part d-none d-xl-block">
                <div className="mainnav">
                  <ul className="main-menu">
                    <li className={`menu-item ${isActive('/')}`}>
                      <Link to="/">Home</Link>
                    </li>
                    <li className={`menu-item ${isActive('/gallery')}`}>
                      <Link to="/gallery">Gallery</Link>
                    </li>
                    <li className={`menu-item ${isActive('/our-works')}`}>
                      <Link to="/our-works">Our Works</Link>
                    </li>
                    <li className={`menu-item ${isActive('/about')}`}>
                      <Link to="/about">About Us</Link>
                    </li>
                    <li className="menu-item menu-item-has-children">
                      <a href="#">Pages</a>
                      <ul className="sub-menu" data-lenis-prevent>
                        <li className="menu-item menu-item-has-children">
                          <a href="#">Services</a>
                          <ul className="sub-menu" data-lenis-prevent>
                            <li className="menu-item">
                              <a href="#">Services Grid</a>
                            </li>
                            <li className="menu-item">
                              <a href="#">Service Details</a>
                            </li>
                            <li className="menu-item">
                              <a href="#">Service Details Two</a>
                            </li>
                          </ul>
                        </li>
                        <li className="menu-item menu-item-has-children">
                          <a href="#">Our Team</a>
                          <ul className="sub-menu" data-lenis-prevent>
                            <li className="menu-item">
                              <a href="#">Team Grid</a>
                            </li>
                            <li className="menu-item">
                              <a href="#">Team Details</a>
                            </li>
                          </ul>
                        </li>
                        <li className="menu-item">
                          <a href="#">Booking Form</a>
                        </li>
                        <li className="menu-item menu-item-has-children">
                          <a href="#">Prices</a>
                          <ul className="sub-menu" data-lenis-prevent>
                            <li className="menu-item">
                              <a href="#">Package List</a>
                            </li>
                            <li className="menu-item">
                              <a href="#">Price Table</a>
                            </li>
                          </ul>
                        </li>
                        <li className="menu-item menu-item-has-children">
                          <a href="#">Shop</a>
                          <ul className="sub-menu" data-lenis-prevent>
                            <li className="menu-item">
                              <a href="#">Shop - With Sidebar</a>
                            </li>
                            <li className="menu-item">
                              <a href="#">Shop - No Sidebar</a>
                            </li>
                            <li className="menu-item">
                              <a href="#">Product Details</a>
                            </li>
                            <li className="menu-item">
                              <a href="#">Cart</a>
                            </li>
                            <li className="menu-item">
                              <a href="#">Checkout</a>
                            </li>
                          </ul>
                        </li>
                        <li className="menu-item">
                          <a href="#">Coming Soon</a>
                        </li>
                        <li className="menu-item">
                          <a href="#">404 Error</a>
                        </li>
                        <li className="menu-item">
                          <a href="#">Login</a>
                        </li>
                      </ul>
                    </li>
                    <li className="menu-item menu-item-has-children">
                      <a href="#">Contact</a>
                      <ul className="sub-menu" data-lenis-prevent>
                        <li className="menu-item">
                          <a href="#">Contact One</a>
                        </li>
                        <li className="menu-item">
                          <a href="#">Contact Two</a>
                        </li>
                      </ul>
                    </li>
                    <li className="menu-item menu-item-has-children">
                      <a href="#">Blog</a>
                      <ul className="sub-menu" data-lenis-prevent>
                        <li className="menu-item">
                          <a href="#">Blog Grid</a>
                        </li>
                        <li className="menu-item">
                          <a href="#">Blog Details</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Part */}
              <div className="header_right_part d-flex align-items-center">
                <div className="aside_open wptb-element" onClick={onAsideToggle}>
                  <div className="aside-open--inner">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>

                <div className="header_search wptb-element">
                  <a
                    href="#"
                    className="modal_search_icon"
                    onClick={(e) => {
                      e.preventDefault();
                      onSearchToggle();
                    }}
                  >
                    <i className="bi bi-search"></i>
                  </a>
                </div>

                <button
                  type="button"
                  className="mr_menu_toggle wptb-element d-xl-none"
                  onClick={onMobileMenuToggle}
                >
                  <i className="bi bi-list"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

