import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const TestimonialsColoredSection = () => {
  const testimonials = [
    {
      id: 1,
      text: '"I have an amazing photography session with team LV_Clicks photography agency, highly recommended. They have amazing atmosphere in their studio. Iw\'d love to visit again"',
      name: 'Rachel Jackson',
      location: 'New York',
      image: '/images/testimonial/1.jpg',
    },
    {
      id: 2,
      text: '"I have an amazing photography session with team LV_Clicks photography agency, highly recommended. They have amazing atmosphere in their studio. Iw\'d love to visit again"',
      name: 'Helen Jordan',
      location: 'Chicago',
      image: '/images/testimonial/2.jpg',
    },
    {
      id: 3,
      text: '"I have an amazing photography session with team LV_Clicks photography agency, highly recommended. They have amazing atmosphere in their studio. Iw\'d love to visit again"',
      name: 'Helen Jordan',
      location: 'New York',
      image: '/images/testimonial/3.jpg',
    },
  ];

  return (
    <section
      className="wptb-testimonial-one testimonial-colored bg-image"
      style={{ backgroundImage: "url('/images/background/bg-2.jpg')" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            <div className="swiper-container swiper-testimonial">
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                navigation={{
                  nextEl: '.swiper-testimonial .swiper-button-next',
                  prevEl: '.swiper-testimonial .swiper-button-prev',
                }}
                className="swiper-testimonial"
              >
                {testimonials.map((testimonial) => (
                  <SwiperSlide key={testimonial.id}>
                    <div className="wptb-testimonial1">
                      <div className="wptb-item--inner">
                        <div className="wptb-item--holder">
                          <div className="d-flex align-items-center justify-content-between mr-bottom-25">
                            <div className="wptb-item--meta-rating">
                              {[...Array(5)].map((_, i) => (
                                <i key={i} className="bi bi-star-fill"></i>
                              ))}
                            </div>

                            <div className="wptb-item--icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="57" height="45" viewBox="0 0 57 45" fill="none">
                                <path
                                  d="M51.5137 38.5537C56.8209 32.7938 56.2866 25.3969 56.2697 25.3125V2.8125C56.2697 2.06658 55.9734 1.35121 55.4459 0.823763C54.9185 0.296317 54.2031 0 53.4572 0H36.5822C33.48 0 30.9572 2.52281 30.9572 5.625V25.3125C30.9572 26.0584 31.2535 26.7738 31.781 27.3012C32.3084 27.8287 33.0238 28.125 33.7697 28.125H42.4266C42.3671 29.5155 41.9517 30.8674 41.22 32.0513C39.7913 34.3041 37.0997 35.8425 33.2156 36.6188L30.9572 37.0688V45H33.7697C41.5969 45 47.5678 42.8316 51.5137 38.5537ZM20.5566 38.5537C25.8666 32.7938 25.3294 25.3969 25.3125 25.3125V2.8125C25.3125 2.06658 25.0162 1.35121 24.4887 0.823763C23.9613 0.296317 23.2459 0 22.5 0H5.625C2.52281 0 0 2.52281 0 5.625V25.3125C0 26.0584 0.296316 26.7738 0.823762 27.3012C1.35121 27.8287 2.06658 28.125 2.8125 28.125H11.4694C11.41 29.5155 10.9945 30.8674 10.2628 32.0513C8.83406 34.3041 6.1425 35.8425 2.25844 36.6188L0 37.0688V45H2.8125C10.6397 45 16.6106 42.8316 20.5566 38.5537Z"
                                  fill="#D70006"
                                />
                              </svg>
                            </div>
                          </div>

                          <p className="wptb-item--description">{testimonial.text}</p>
                          <div className="wptb-item--meta">
                            <div className="wptb-item--image">
                              <img src={testimonial.image} alt={testimonial.name} loading="lazy" />
                            </div>
                            <div className="wptb-item--meta-left">
                              <h4 className="wptb-item--title">{testimonial.name}</h4>
                              <h6 className="wptb-item--designation">{testimonial.location}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Swiper Navigation */}
              <div className="wptb-swiper-navigation style1">
                <div className="wptb-swiper-arrow swiper-button-prev"></div>
                <div className="wptb-swiper-arrow swiper-button-next"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsColoredSection;

