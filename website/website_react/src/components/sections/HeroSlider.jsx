import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

const HeroSlider = () => {
  const swiperRef = useRef(null);

  // Slider images - 8 slides (37-41, then repeat 38-40)
  const sliderImages = [
    '/images/slider/37.jpg',
    '/images/slider/38.jpg',
    '/images/slider/39.jpg',
    '/images/slider/40.jpg',
    '/images/slider/41.jpg',
    '/images/slider/38.jpg',
    '/images/slider/39.jpg',
    '/images/slider/40.jpg',
  ];

  useEffect(() => {
    // Initialize Swiper if needed
    if (swiperRef.current) {
      // Swiper is already initialized by the component
    }
  }, []);

  return (
    <section className="wptb-slider style4">
      {/* Heading Part */}
      <div className="wptb-heading-two">
        <div className="wptb-item--inner text-center">
          <h6 className="wptb-item--subtitle">Photography Agency</h6>
          <h1 className="wptb-item--title">
            {' '}
            We Capture Your Best <br /> <span>Memories</span> Here
          </h1>
          <div className="wptb-item--description">
            LV_Clicks photography Agency runs wide and deep. Across many <br /> markets, geographies
            & typologies, our team members
          </div>
        </div>
      </div>

      {/* Swiper Slider */}
      <div className="swiper-container wptb-swiper-slider-four">
        <Swiper
          ref={swiperRef}
          modules={[Autoplay, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          effect="fade"
          fadeEffect={{
            crossFade: true,
          }}
          className="wptb-swiper-slider-four"
        >
          {sliderImages.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="wptb-slider--item">
                <div className="wptb-slider--image">
                  <img
                    src={image}
                    alt={`Slider ${index + 1}`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Layer Images */}
      <div className="wptb-item-layer wptb-item-layer-one both-version">
        <img src="/images/slider/texture-1.png" alt="texture" loading="lazy" />
        <img src="/images/slider/texture-1-light.png" alt="texture light" loading="lazy" />
      </div>

      <div className="wptb-item-layer wptb-item-layer-two both-version">
        <img src="/images/slider/round.png" alt="round" loading="lazy" />
        <img src="/images/slider/round-light.png" alt="round light" loading="lazy" />
      </div>

      <div className="wptb-item-layer wptb-item-layer-three both-version">
        <img src="/images/slider/overlay.png" alt="overlay" loading="lazy" />
        <img src="/images/slider/overlay-light.png" alt="overlay light" loading="lazy" />
      </div>
    </section>
  );
};

export default HeroSlider;

