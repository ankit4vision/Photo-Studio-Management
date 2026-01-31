import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const ImageGallerySection = () => {
  const galleryImages = [
    '/images/projects/1/1.jpg',
    '/images/projects/1/2.jpg',
    '/images/projects/1/3.jpg',
    '/images/projects/1/4.jpg',
    '/images/projects/1/5.jpg',
    '/images/projects/1/6.jpg',
  ];

  useEffect(() => {
    // Fancybox is initialized globally in Layout component
  }, []);

  return (
    <section className="wptb-project pd-top-100 pd-bottom-80">
      <div className="container">
        {/* Heading */}
        <div className="wptb-heading-two">
          <div className="wptb-item--inner text-center">
            <h6 className="wptb-item--subtitle">Our Gallery</h6>
            <h1 className="wptb-item--title">
              {' '}
              Explore Our <br /> Photography <span>Gallery</span>{' '}
            </h1>
            <div className="wptb-item--description">
              LV_Clicks photography gallery showcases our best work. <br /> Click on any image to view
              in full size.
            </div>
          </div>
        </div>

        {/* Images Grid */}
        <div className="style-masonry effect-blur">
          <div className="grid grid-3 gutter-10 clearfix">
            <div className="grid-sizer"></div>
            {galleryImages.map((image, index) => (
              <div key={index} className="grid-item">
                <div className="wptb-item--inner">
                  <div className="wptb-item--image">
                    <img src={image} alt={`Gallery ${index + 1}`} loading="lazy" />
                    <a className="wptb-image-popup" href={image} data-fancybox="home-gallery">
                      <i className="bi bi-arrows-fullscreen"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View Full Gallery Button */}
        <div className="text-center mt-5">
          <div className="wptb-item--button">
            <Link to="/gallery" className="btn">
              <span className="btn-wrap">
                <span className="text-first">View Full Gallery</span>
                <span className="text-second">
                  <i className="bi bi-arrow-up-right"></i> <i className="bi bi-arrow-up-right"></i>
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGallerySection;

