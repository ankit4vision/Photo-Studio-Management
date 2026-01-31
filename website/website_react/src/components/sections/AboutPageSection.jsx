import { useEffect, useRef } from 'react';

const AboutPageSection = () => {
  const counter1Ref = useRef(null);
  const counter2Ref = useRef(null);

  // Initialize Odometer counters when in view
  useEffect(() => {
    const initCounters = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.target.classList.contains('odometer')) {
              const target = entry.target;
              const count = parseInt(target.getAttribute('data-count'));
              
              if (!target.classList.contains('initialized')) {
                target.classList.add('initialized');
                
                // Animate counter
                let current = 0;
                const increment = count / 100;
                const timer = setInterval(() => {
                  current += increment;
                  if (current >= count) {
                    current = count;
                    clearInterval(timer);
                  }
                  target.textContent = Math.floor(current);
                }, 20);
              }
            }
          });
        },
        { threshold: 0.5 }
      );

      const counters = document.querySelectorAll('.odometer[data-count]');
      counters.forEach((counter) => observer.observe(counter));

      return () => {
        counters.forEach((counter) => observer.unobserve(counter));
      };
    };

    initCounters();
  }, []);

  return (
    <section className="wptb-about-one bg-image-2" style={{ backgroundImage: "url('/images/more/texture.png')" }}>
      <div className="container">
        {/* Large Image at Top */}
        <div className="wptb-image-single mr-bottom-90 wow fadeInUp">
          <div className="wptb-item--inner">
            <div className="wptb-item--image">
              <img src="/images/background/bg-6.jpg" alt="About LV_Clicks" loading="lazy" />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-8">
            <div className="row">
              {/* Left Image */}
              <div className="col-md-6">
                <div className="wptb-image-single wow fadeInUp">
                  <div className="wptb-item--inner">
                    <div className="wptb-item--image">
                      <img src="/images/more/1.jpg" alt="About" loading="lazy" />
                    </div>
                  </div>
                </div>
              </div>

              {/* About Text */}
              <div className="col-md-6 ps-md-0 mt-5">
                <div className="wptb-about--text">
                  <p className="wptb-about--text-one mb-4">
                    LV_Clicks photography Agency runs wide and deep. Across many markets, geographies & typologies, our
                    team members
                  </p>
                  <p>
                    The talent at LV_Clicks runs wide range of services. Across many markets, geographies & typologies,
                    our team members are some of the finest people of photographers in the industry wide and deep. From
                    Across many markets, geographies & boundaries. Hire LV_Clicks in your event.
                  </p>
                </div>
              </div>
            </div>

            {/* Counter Section */}
            <div className="row wptb-about-funfact">
              <div className="col-md-6 mb-4 mb-md-0">
                <div className="wptb-counter1 style1 pd-right-60 wow skewIn">
                  <div className="wptb-item--inner">
                    <div className="wptb-item--holder d-flex align-items-center">
                      <div className="wptb-item--value">
                        <span className="odometer" data-count="100" ref={counter1Ref}>
                          0
                        </span>
                        <span className="suffix">%</span>
                      </div>
                      <div className="wptb-item--text">Customer Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="wptb-counter1 style1 pd-right-60 wow skewIn">
                  <div className="wptb-item--inner">
                    <div className="wptb-item--holder d-flex align-items-center">
                      <div className="wptb-item--value flex-shrink-0">
                        <span className="odometer" data-count="350" ref={counter2Ref}>
                          0
                        </span>
                        <span className="suffix">+</span>
                      </div>
                      <div className="wptb-item--text">Photography Session</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="col-xl-4 ps-xl-5 mt-5 mt-xl-0 d-none d-xl-block">
            <div className="wptb-image-single wow fadeInUp">
              <div className="wptb-item--inner">
                <div className="wptb-item--image">
                  <img src="/images/more/2.jpg" alt="About" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layer Image */}
        <div className="wptb-item-layer wptb-item-layer-one">
          <img src="/images/more/light-1.png" alt="decoration" loading="lazy" />
        </div>
      </div>
    </section>
  );
};

export default AboutPageSection;

