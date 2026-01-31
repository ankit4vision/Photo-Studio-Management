const OfficeAddressSection = () => {
  const addresses = [
    {
      icon: 'bi-globe',
      title: 'Our Website',
      description: 'www.lvclicks.com',
      link: '#',
      linkText: 'Visit Now',
    },
    {
      icon: 'bi-phone',
      title: 'Book Us',
      description: '+123 455 987 994',
      link: 'tel:+98765432122811',
      linkText: 'Call Now',
    },
    {
      icon: 'bi-geo-alt',
      title: 'Studio Address',
      description: '13 Madison Street, NY, USA',
      link: '#',
      linkText: 'View Map',
    },
  ];

  return (
    <section className="wptb-office-address pd-bottom-100 mr-top-35">
      <div className="container">
        <div className="row">
          {addresses.map((address, index) => (
            <div key={index} className={`col-lg-4 col-md-6 ${index === 1 ? 'px-md-5' : ''}`}>
              <div className="wptb-icon-box1 wow fadeInLeft">
                <div className="wptb-item--inner flex-start">
                  <div className="wptb-item--icon">
                    <i className={`bi ${address.icon}`}></i>
                  </div>
                  <div className="wptb-item--holder">
                    <h3 className="wptb-item--title">{address.title}</h3>
                    <p className="wptb-item--description">{address.description}</p>
                    <a href={address.link} className="wptb-item--link">
                      {address.linkText}
                    </a>
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

export default OfficeAddressSection;

