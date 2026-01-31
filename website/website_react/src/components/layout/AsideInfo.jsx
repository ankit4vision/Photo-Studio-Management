import { Link } from 'react-router-dom';

const AsideInfo = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const instagramImages = [6, 7, 8, 9, 10, 11];

  return (
    <div className={`aside_info_wrapper ${isOpen ? 'active' : ''}`} data-lenis-prevent>
      <button className="aside_close" onClick={onClose}>
        Close <i className="bi bi-x-lg"></i>
      </button>

      <div className="aside_logo logo">
        <Link to="/" className="light_logo">
          <span className="logo-text">LV_Clicks</span>
        </Link>
        <Link to="/" className="dark_logo">
          <span className="logo-text">LV_Clicks</span>
        </Link>
      </div>

      <div className="aside_info_inner">
        <h6>// Instagram</h6>
        <div className="insta-logo">
          <i className="bi bi-instagram"></i> lv_clicks
        </div>
        <div className="wptb-instagram--gallery">
          <div className="wptb-item--inner d-flex align-items-center justify-content-center flex-wrap">
            {instagramImages.map((num) => (
              <div key={num} className="wptb-item">
                <div className="wptb-item--image">
                  <img
                    src={`/images/instagram/${num}.jpg`}
                    alt="Instagram"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

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

        <h6>// Follow Us</h6>
        <div className="social-box style-square">
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
    </div>
  );
};

export default AsideInfo;

