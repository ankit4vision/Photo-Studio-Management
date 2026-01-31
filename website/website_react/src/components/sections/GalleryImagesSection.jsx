const GalleryImagesSection = () => {
  const galleryImages = [
    '/images/projects/1/1.jpg',
    '/images/projects/1/2.jpg',
    '/images/projects/1/3.jpg',
    '/images/projects/1/4.jpg',
    '/images/projects/1/5.jpg',
    '/images/projects/1/6.jpg',
    '/images/projects/1/7.jpg',
    '/images/projects/1/8.jpg',
    '/images/projects/1/9.jpg',
    '/images/projects/1/10.jpg',
  ];

  return (
    <section className="wptb-project pd-top-100 pd-bottom-80">
      <div className="container">
        {/* Heading */}
        <div className="wptb-heading-two">
          <div className="wptb-item--inner text-center">
            <h6 className="wptb-item--subtitle">Images</h6>
            <h1 className="wptb-item--title">
              {' '}
              Our Photography <br /> <span>Gallery</span>{' '}
            </h1>
            <div className="wptb-item--description">
              Click on any image to view in full size. <br /> Browse through our collection of
              stunning photography work.
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
                    <a className="wptb-image-popup" href={image} data-fancybox="gallery-images">
                      <i className="bi bi-arrows-fullscreen"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryImagesSection;

