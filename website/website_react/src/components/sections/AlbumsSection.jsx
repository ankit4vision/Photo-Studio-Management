import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Isotope from 'isotope-layout';

const AlbumsSection = () => {
  const containerRef = useRef(null);
  const isotopeRef = useRef(null);

  // Initialize Isotope for masonry grid
  useEffect(() => {
    if (containerRef.current && !isotopeRef.current) {
      const container = containerRef.current;
      
      // Dynamically import imagesloaded
      import('imagesloaded').then((imagesLoadedModule) => {
        const imagesLoaded = imagesLoadedModule.default || imagesLoadedModule;
        const imgLoad = imagesLoaded(container);

        imgLoad.on('always', () => {
          isotopeRef.current = new Isotope(container, {
            itemSelector: '.grid-item',
            layoutMode: 'masonry',
            percentPosition: true,
            masonry: {
              columnWidth: '.grid-sizer',
              gutter: 10,
            },
          });
        });
      }).catch((error) => {
        console.error('Error loading imagesloaded:', error);
        // Fallback: Initialize Isotope without waiting for images
        isotopeRef.current = new Isotope(container, {
          itemSelector: '.grid-item',
          layoutMode: 'masonry',
          percentPosition: true,
          masonry: {
            columnWidth: '.grid-sizer',
            gutter: 10,
          },
        });
      });
    }

    return () => {
      if (isotopeRef.current) {
        isotopeRef.current.destroy();
        isotopeRef.current = null;
      }
    };
  }, []);
  const albums = [
    {
      id: 1,
      image: '/images/projects/1/1.jpg',
      title: 'Wedding Album 2024',
      photoCount: '25 Photos',
      colSize: 'col-md-4',
    },
    {
      id: 2,
      image: '/images/projects/1/2.jpg',
      title: 'Portrait Session',
      photoCount: '18 Photos',
      colSize: 'col-md-4',
    },
    {
      id: 3,
      image: '/images/projects/1/3.jpg',
      title: 'Fashion Collection',
      photoCount: '32 Photos',
      colSize: 'col-md-4',
    },
    {
      id: 4,
      image: '/images/projects/1/4.jpg',
      title: 'Event Coverage 2024',
      photoCount: '45 Photos',
      colSize: 'col-md-8',
    },
    {
      id: 5,
      image: '/images/projects/1/5.jpg',
      title: 'Nature Photography',
      photoCount: '28 Photos',
      colSize: 'col-md-8',
    },
    {
      id: 6,
      image: '/images/projects/1/6.jpg',
      title: 'Studio Session',
      photoCount: '20 Photos',
      colSize: 'col-md-4',
    },
    {
      id: 7,
      image: '/images/projects/1/7.jpg',
      title: 'Outdoor Adventure',
      photoCount: '22 Photos',
      colSize: 'col-md-4',
    },
    {
      id: 8,
      image: '/images/projects/1/8.jpg',
      title: 'Family Portrait',
      photoCount: '15 Photos',
      colSize: 'col-md-4',
    },
  ];

  return (
    <section className="wptb-project pd-top-100 pd-bottom-80">
      <div className="container">
        <div className="wptb-project--inner">
          {/* Heading */}
          <div className="wptb-heading-two">
            <div className="wptb-item--inner text-center">
              <h6 className="wptb-item--subtitle">Our Albums</h6>
              <h1 className="wptb-item--title">
                {' '}
                LV_Clicks captures <span>All of Your</span> <br />
                beautiful memories
              </h1>
              <div className="wptb-item--description">
                Browse through our photography albums. <br /> Click on any album to view all photos.
              </div>
            </div>
          </div>

          {/* Albums Grid */}
          <div className="effect-gradient has-radius">
            <div className="grid gutter-10 clearfix" ref={containerRef}>
              <div className="grid-sizer"></div>
              <div className="row">
                {albums.map((album) => (
                  <div key={album.id} className={`grid-item ${album.colSize}`}>
                    <div className="wptb-item--inner">
                      <div className="wptb-item--image">
                        <img src={album.image} alt={album.title} loading="lazy" />
                        <Link to={`/album/${album.id}`} className="wptb-item--link">
                          <i className="bi bi-chevron-right"></i>
                        </Link>
                      </div>

                      <div className="wptb-item--holder">
                        <div className="wptb-item--meta">
                          <h4>
                            <Link to={`/album/${album.id}`}>{album.title}</Link>
                          </h4>
                          <p>{album.photoCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlbumsSection;

