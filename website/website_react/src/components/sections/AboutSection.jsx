import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <section className="wptb-about-three pd-top-80 pd-bottom-80">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 offset-lg-2 text-center">
            <div className="wptb-heading-two">
              <div className="wptb-item--inner">
                <h6 className="wptb-item--subtitle">About LV_Clicks Photography</h6>
                <h1 className="wptb-item--title">
                  We are the LV_Clicks <br /> Photography Studio
                </h1>
                <div className="wptb-item--description">
                  LV_Clicks photography Agency runs wide and deep. Across many markets, geographies &
                  typologies, our team members are some of the finest photographers in the industry.
                  We specialize in wedding photography, cinematography, and film making with a
                  commitment to excellence and customer satisfaction.
                </div>
              </div>
            </div>

            <div className="wptb-item--button mt-5">
              <Link to="/about" className="btn">
                <span className="btn-wrap">
                  <span className="text-first">Learn More About Us</span>
                  <span className="text-second">
                    <i className="bi bi-arrow-up-right"></i> <i className="bi bi-arrow-up-right"></i>
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

