const VideoPlayerSection = () => {
  return (
    <div className="container">
      <div className="wptb-video-player1 wow zoomIn" style={{ backgroundImage: "url('/images/background/bg-7.jpg')" }}>
        <div className="wptb-item--inner">
          <div className="wptb-item--holder">
            <div className="wptb-item--video-button">
              <a className="btn" data-fancybox href="https://www.youtube.com/watch?v=SF4aHwxHtZ0">
                <span className="text-second">
                  {' '}
                  <i className="bi bi-play-fill"></i>{' '}
                </span>
                <span className="line-video-animation line-video-1"></span>
                <span className="line-video-animation line-video-2"></span>
                <span className="line-video-animation line-video-3"></span>
              </a>
            </div>
          </div>
        </div>
        <div className="wptb-item-layer wptb-item-layer-one">
          <img src="/images/more/light-3.png" alt="decoration" loading="lazy" />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerSection;

