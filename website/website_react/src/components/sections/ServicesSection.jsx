const ServicesSection = () => {
  const services = [
    {
      id: 1,
      icon: 'bi-camera',
      title: 'Wedding Photography',
      description: 'The talent at LV_Clicks runs wide range of services. Across many markets, geographies',
      count: '01',
      active: false,
    },
    {
      id: 2,
      icon: 'bi-camera-video',
      title: 'Wedding Cinematography',
      description: 'The talent at LV_Clicks runs wide range of services. Across many markets, geographies',
      count: '02',
      active: true,
    },
    {
      id: 3,
      icon: 'bi-film',
      title: 'Wedding Cinematography',
      description: 'The talent at LV_Clicks runs wide range of services. Across many markets, geographies',
      count: '03',
      active: false,
    },
    {
      id: 4,
      icon: 'bi-person-badge',
      title: 'Personal Portfolio Shoot',
      description: 'The talent at LV_Clicks runs wide range of services. Across many markets, geographies',
      count: '04',
      active: false,
    },
    {
      id: 5,
      icon: 'bi-camera-reels',
      title: 'Wedding Cinematography',
      description: 'The talent at LV_Clicks runs wide range of services. Across many markets, geographies',
      count: '05',
      active: false,
    },
    {
      id: 6,
      icon: 'bi-images',
      title: 'Personal Portfolio Shoot',
      description: 'The talent at LV_Clicks runs wide range of services. Across many markets, geographies',
      count: '06',
      active: false,
    },
  ];

  return (
    <section
      className="wptb-services-one pd-bottom-80 bg-image-4"
      style={{
        backgroundImage: "url('/images/more/texture-3.png')",
        backgroundPosition: '50% -16%',
      }}
    >
      <div className="container position-relative">
        {/* Heading */}
        <div className="wptb-heading-two">
          <div className="wptb-item--inner text-center">
            <h6 className="wptb-item--subtitle">Photography</h6>
            <h1 className="wptb-item--title">
              {' '}
              Explore LV_Clicks <br /> Photography <span>Services</span>{' '}
            </h1>
            <div className="wptb-item--description">
              LV_Clicks photography Agency runs wide and deep. Across many <br /> markets, geographies
              & typologies, our team members
            </div>
          </div>
        </div>

        {/* Service Cards */}
        <div className="row">
          {services.map((service) => (
            <div key={service.id} className="col-md-4 pd-left-25 pd-right-25 wow fadeInLeft">
              <div className={`wptb-icon-box7 mb-0 ${service.active ? 'active highlight' : ''}`}>
                <div className="wptb-item--inner">
                  <div className="wptb-item--icon">
                    <i className={`bi ${service.icon}`} style={{ fontSize: '48px' }}></i>
                  </div>
                  <div className="wptb-item--holder">
                    <h4 className="wptb-item--title">
                      <a href="#">{service.title}</a>
                    </h4>
                    <p className="wptb-item--description">{service.description}</p>
                    <h6 className="wptb-item--count text-outline">{service.count}</h6>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grid Lines */}
        <div className="grid_lines">
          <div className="grid_line"></div>
          <div className="grid_line"></div>
          <div className="grid_line"></div>
          <div className="grid_line"></div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

