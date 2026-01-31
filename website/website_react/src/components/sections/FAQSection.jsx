import { useState } from 'react';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqItems = [
    {
      id: 1,
      title: 'LV_Clicks Missions',
      content:
        'Our business consulting programs helps to break the performance of your business down into customers and product groups so you know exactly which customers or product groups are working.',
    },
    {
      id: 2,
      title: 'LV_Clicks Photography Features',
      content:
        'Our business consulting programs helps to break the performance of your business down into customers and product groups so you know exactly which customers or product groups are working.',
    },
    {
      id: 3,
      title: 'Why We are Best Photographers',
      content:
        'Our business consulting programs helps to break the performance of your business down into customers and product groups so you know exactly which customers or product groups are working.',
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="wptb-faq-one bg-image pb-0" style={{ backgroundImage: "url('/images/background/bg-8.jpg')" }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            {/* Heading */}
            <div className="wptb-heading">
              <div className="wptb-item--inner">
                <h1 className="wptb-item--title mb-lg-0">Why Choose Us</h1>
              </div>
            </div>

            {/* Accordion */}
            <div className="wptb-accordion wptb-accordion2 wow fadeInUp">
              {faqItems.map((item, index) => (
                <div key={item.id} className={`wptb--item ${activeIndex === index ? 'active' : ''}`}>
                  <h6 className="wptb-item-title" onClick={() => toggleAccordion(index)}>
                    <span>{item.title}</span>
                    <i className={`plus bi ${activeIndex === index ? 'bi-dash' : 'bi-plus'}`}></i>
                    <i className={`minus bi ${activeIndex === index ? 'bi-dash' : 'bi-plus'}`}></i>
                  </h6>
                  {activeIndex === index && (
                    <div className="wptb-item--content">{item.content}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Experience Badge */}
            <div className="wptb-agency-experience--item">
              <span>15+</span> Years Experience
            </div>
          </div>

          {/* FAQ Image */}
          <div className="col-lg-6">
            <div className="wptb-image-single wow fadeInUp">
              <div className="wptb-item--inner">
                <div className="wptb-item--image">
                  <img src="/images/more/3.png" alt="FAQ" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

