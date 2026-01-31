import { Link } from 'react-router-dom';

const MobileMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={`mr_menu ${isOpen ? 'active' : ''}`} data-lenis-prevent>
      <button type="button" className="mr_menu_close" onClick={onClose}>
        <i className="bi bi-x-lg"></i>
      </button>
      <div className="logo">
        <Link to="/" className="light_logo">
          <span className="logo-text">LV_Clicks</span>
        </Link>
      </div>

      <h6>Menu</h6>
      <div className="mr_navmenu">
        <ul className="main-menu">
          <li className="menu-item">
            <Link to="/" onClick={onClose}>Home</Link>
          </li>
          <li className="menu-item">
            <Link to="/gallery" onClick={onClose}>Gallery</Link>
          </li>
          <li className="menu-item">
            <Link to="/our-works" onClick={onClose}>Our Works</Link>
          </li>
          <li className="menu-item">
            <Link to="/about" onClick={onClose}>About Us</Link>
          </li>
        </ul>
      </div>

      <h6>Contact Us</h6>
      <div className="wptb-icon-box1 style2">
        <div className="wptb-item--inner flex-start">
          <div className="wptb-item--icon">
            <i className="bi bi-envelope"></i>
          </div>
          <div className="wptb-item--holder">
            <p className="wptb-item--description">
              <a href="mailto:info@lvclicks.com">info@lvclicks.com</a>
            </p>
          </div>
        </div>
      </div>

      <div className="wptb-icon-box1 style2">
        <div className="wptb-item--inner flex-start">
          <div className="wptb-item--icon">
            <i className="bi bi-geo-alt"></i>
          </div>
          <div className="wptb-item--holder">
            <p className="wptb-item--description">
              <a href="#">28 Street, New York, USA</a>
            </p>
          </div>
        </div>
      </div>

      <div className="wptb-icon-box1 style2">
        <div className="wptb-item--inner flex-start">
          <div className="wptb-item--icon">
            <i className="bi bi-envelope"></i>
          </div>
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
          <li>
            <a href="https://www.facebook.com/">
              <i className="bi bi-facebook"></i>
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/">
              <i className="bi bi-instagram"></i>
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/">
              <i className="bi bi-linkedin"></i>
            </a>
          </li>
          <li>
            <a href="https://www.behance.com/">
              <i className="bi bi-behance"></i>
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/">
              <i className="bi bi-youtube"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;

