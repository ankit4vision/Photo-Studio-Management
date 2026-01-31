import { Link } from 'react-router-dom';

const AlbumSidebar = ({
  albumInfo = {
    date: 'December 2024',
    location: 'New York, USA',
    photographer: 'LV_Clicks Team',
    totalPhotos: '25',
    category: 'Wedding',
  },
}) => {
  return (
    <div className="sidebar">
      {/* Album Info Widget */}
      <div className="widget">
        <h4 className="widget-title">
          <span>//</span>Album Info
        </h4>
        <ul className="widget-list">
          <li>
            <strong>Date:</strong> {albumInfo.date}
          </li>
          <li>
            <strong>Location:</strong> {albumInfo.location}
          </li>
          <li>
            <strong>Photographer:</strong> {albumInfo.photographer}
          </li>
          <li>
            <strong>Total Photos:</strong> {albumInfo.totalPhotos}
          </li>
          <li>
            <strong>Category:</strong> {albumInfo.category}
          </li>
        </ul>
      </div>

      {/* Share Widget */}
      <div className="widget mt-5">
        <h4 className="widget-title">
          <span>//</span>Share Album
        </h4>
        <div className="social-box">
          <ul>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()}>
                <i className="bi bi-facebook"></i>
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()}>
                <i className="bi bi-instagram"></i>
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()}>
                <i className="bi bi-twitter"></i>
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => e.preventDefault()}>
                <i className="bi bi-pinterest"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Back Button */}
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
  );
};

export default AlbumSidebar;

