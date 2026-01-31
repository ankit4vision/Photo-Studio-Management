import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const TeamSection = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Maxim Alexhander',
      position: 'CEO, LV_Clicks Agency',
      image: '/images/team/1.jpg',
      social: { fb: '#', ig: '#', yt: '#', dr: '#' },
    },
    {
      id: 2,
      name: 'Nelson Jameson',
      position: 'Photographer',
      image: '/images/team/2.jpg',
      social: { fb: '#', ig: '#', yt: '#', dr: '#' },
    },
    {
      id: 3,
      name: 'Ellie Duncan',
      position: 'Photographer',
      image: '/images/team/3.jpg',
      social: { fb: '#', ig: '#', yt: '#', dr: '#' },
    },
    {
      id: 4,
      name: 'Harold Earls',
      position: 'Photographer',
      image: '/images/team/4.jpg',
      social: { fb: '#', ig: '#', yt: '#', dr: '#' },
    },
    {
      id: 5,
      name: 'Nelson Jameson',
      position: 'Photographer',
      image: '/images/team/5.jpg',
      social: { fb: '#', ig: '#', yt: '#', dr: '#' },
    },
    {
      id: 6,
      name: 'Ellie Duncan',
      position: 'Photographer',
      image: '/images/team/6.jpg',
      social: { fb: '#', ig: '#', yt: '#', dr: '#' },
    },
    {
      id: 7,
      name: 'Harold Earls',
      position: 'Photographer',
      image: '/images/team/4.jpg',
      social: { fb: '#', ig: '#', yt: '#', dr: '#' },
    },
  ];

  return (
    <section className="wptb-team-one pd-top-90">
      <div className="container">
        {/* Heading */}
        <div className="wptb-heading">
          <div className="wptb-item--inner">
            <div className="row">
              <div className="col-lg-6">
                <h6 className="wptb-item--subtitle">
                  <span>01 //</span> Our Team
                </h6>
                <h1 className="wptb-item--title mb-lg-0">
                  Our Core Team of
                  <br />
                  <span>Photographers</span>
                </h1>
              </div>

              <div className="col-lg-6">
                <p className="wptb-item--description">
                  we're deeply passionate <span>catch your lovely memories in cameras</span> and Convey your love for
                  every moment of life as a whole.
                </p>

                {/* Swiper Navigation */}
                <div className="wptb-swiper-navigation style1">
                  <div className="wptb-swiper-arrow swiper-button-prev"></div>
                  <div className="wptb-swiper-arrow swiper-button-next"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Swiper */}
        <div className="swiper-container swiper-team">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: '.swiper-team .swiper-button-next',
              prevEl: '.swiper-team .swiper-button-prev',
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
            className="swiper-team"
          >
            {teamMembers.map((member) => (
              <SwiperSlide key={member.id}>
                <div className="wptb-team-grid1">
                  <div className="wptb-item--inner">
                    <div className="wptb-item--image">
                      <img src={member.image} alt={member.name} loading="lazy" />
                    </div>

                    <div className="wptb-item--holder">
                      <div className="wptb-item--meta">
                        <h5 className="wptb-item--title">{member.name}</h5>
                        <p className="wptb-item--position">{member.position}</p>
                      </div>
                      <div className="wptb-item--social">
                        <a href={member.social.fb}>FB</a>
                        <a href={member.social.ig}>IG</a>
                        <a href={member.social.yt}>YT</a>
                        <a href={member.social.dr}>DR</a>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;

