const GalleryVideosSection = () => {
  const videos = [
    {
      id: 1,
      title: 'Photography Session',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      type: 'youtube',
    },
    {
      id: 2,
      title: 'Wedding Highlights',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      type: 'youtube',
    },
    {
      id: 3,
      title: 'Portrait Session',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      type: 'youtube',
    },
    {
      id: 4,
      title: 'Event Coverage',
      url: 'https://vimeo.com/123456789',
      type: 'vimeo',
    },
    {
      id: 5,
      title: 'Fashion Shoot',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      type: 'youtube',
    },
    {
      id: 6,
      title: 'Behind The Scenes',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      type: 'youtube',
    },
  ];

  return (
    <section className="wptb-project pd-top-100 pd-bottom-80">
      <div className="container">
        {/* Heading */}
        <div className="wptb-heading-two">
          <div className="wptb-item--inner text-center">
            <h6 className="wptb-item--subtitle">Videos</h6>
            <h1 className="wptb-item--title">
              {' '}
              Our Video <br /> <span>Collection</span>{' '}
            </h1>
            <div className="wptb-item--description">
              Click on any video to play. <br /> Watch our latest photography and videography work.
            </div>
          </div>
        </div>

        {/* Video Players */}
        <div className="row">
          {videos.map((video) => (
            <div key={video.id} className="col-lg-4 col-md-6 mb-4">
              <div
                className="wptb-video-player1 wow zoomIn"
                style={{ backgroundImage: "url('/images/background/bg-3.jpg')" }}
              >
                <div className="wptb-item--inner">
                  <div className="wptb-item--holder">
                    <div className="wptb-item--video-button">
                      <a
                        className="btn"
                        data-fancybox
                        href={video.url}
                      >
                        <span className="text-second">
                          {' '}
                          <i className="bi bi-play-fill"></i>{' '}
                        </span>
                        <span className="line-video-animation line-video-1"></span>
                        <span className="line-video-animation line-video-2"></span>
                        <span className="line-video-animation line-video-3"></span>
                      </a>
                    </div>
                    <h4 className="wptb-item--title">{video.title}</h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryVideosSection;

