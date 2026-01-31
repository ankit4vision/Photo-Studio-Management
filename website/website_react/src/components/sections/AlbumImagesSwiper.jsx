import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const AlbumImagesSwiper = ({ images = [] }) => {
  const defaultImages = [
    '/images/projects/gallery/1.jpg',
    '/images/projects/gallery/2.jpg',
    '/images/projects/gallery/3.jpg',
  ];

  const albumImages = images.length > 0 ? images : defaultImages;

  return (
    <div className="swiper-container swiper-gallery mb-4">
      <Swiper
        modules={[Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        navigation={{
          nextEl: '.swiper-gallery .swiper-button-next',
          prevEl: '.swiper-gallery .swiper-button-prev',
        }}
        className="swiper-gallery"
      >
        {albumImages.map((image, index) => (
          <SwiperSlide key={index}>
            <figure className="block-gallery">
              <img src={image} alt={`Album image ${index + 1}`} loading="lazy" />
              <a className="wptb-image-popup" href={image} data-fancybox="album-gallery">
                <i className="bi bi-arrows-fullscreen"></i>
              </a>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Swiper Navigation */}
      <div className="wptb-swiper-navigation style2">
        <div className="wptb-swiper-arrow swiper-button-prev"></div>
        <div className="wptb-swiper-arrow swiper-button-next"></div>
      </div>
    </div>
  );
};

export default AlbumImagesSwiper;

