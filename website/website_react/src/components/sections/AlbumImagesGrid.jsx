const AlbumImagesGrid = ({ images = [] }) => {
  // Default images structure: 2 cols (4 images), 3 cols (3 images), 2 cols (2 images)
  const defaultImages = {
    grid1: [
      '/images/projects/details/2.jpg',
      '/images/projects/details/3.jpg',
      '/images/projects/details/4.jpg',
      '/images/projects/details/5.jpg',
    ],
    grid2: ['/images/projects/details/6.jpg', '/images/projects/details/7.jpg', '/images/projects/details/8.jpg'],
    grid3: ['/images/projects/details/9.jpg', '/images/projects/details/10.jpg'],
  };

  const albumImages = images.length > 0 ? images : defaultImages;


  return (
    <>
      {/* First Grid - 2 Columns (4 images) */}
      <div className="row mt-5">
        {albumImages.grid1?.map((image, index) => (
          <div key={index} className="col-md-6">
            <figure className="block-gallery mb-4">
              <img src={image} alt={`Album detail ${index + 1}`} loading="lazy" />
              <a className="wptb-image-popup" href={image} data-fancybox="album-gallery">
                <i className="bi bi-arrows-fullscreen"></i>
              </a>
            </figure>
          </div>
        ))}
      </div>

      {/* Second Grid - 3 Columns (3 images) */}
      <div className="row mt-3">
        {albumImages.grid2?.map((image, index) => (
          <div key={index} className="col-md-4">
            <figure className="block-gallery mb-4">
              <img src={image} alt={`Album detail ${index + 1}`} loading="lazy" />
              <a className="wptb-image-popup" href={image} data-fancybox="album-gallery">
                <i className="bi bi-arrows-fullscreen"></i>
              </a>
            </figure>
          </div>
        ))}
      </div>

      {/* Third Grid - 2 Columns (2 images) */}
      <div className="row mt-3">
        {albumImages.grid3?.map((image, index) => (
          <div key={index} className="col-md-6">
            <figure className="block-gallery mb-4">
              <img src={image} alt={`Album detail ${index + 1}`} loading="lazy" />
              <a className="wptb-image-popup" href={image} data-fancybox="album-gallery">
                <i className="bi bi-arrows-fullscreen"></i>
              </a>
            </figure>
          </div>
        ))}
      </div>
    </>
  );
};

export default AlbumImagesGrid;

