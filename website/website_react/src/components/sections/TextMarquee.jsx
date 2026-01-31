const TextMarquee = ({ items }) => {
  const defaultItems = [
    { text: 'LV_Clicks', outline: false },
    { text: 'Photography', outline: true },
    { text: 'Studio', outline: false },
    { text: 'Wedding', outline: true },
    { text: 'Portrait', outline: false },
    { text: 'Cinematography', outline: true },
  ];

  const marqueeItems = items || defaultItems;

  return (
    <div className="wptb-marquee">
      <div className="wptb-text-marquee1 wptb-slide-to-left">
        <div className="wptb-item--container">
          {/* First Set */}
          <div className="wptb-item--inner">
            {marqueeItems.map((item, index) => (
              <h4 key={`first-${index}`} className={`wptb-item--text ${item.outline ? 'text-outline' : ''}`}>
                <span className="wptb-text-backdrop">{item.text}</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src="/images/more/star.png" alt="star" loading="lazy" />
                  <img src="/images/more/star-dark.png" alt="star dark" loading="lazy" />
                </span>
              </h4>
            ))}
            <h4 className="wptb-item--text">
              <span className="wptb-text-backdrop">LV_Clicks</span>
              <span className="wptb-item-layer both-version position-relative">
                <img src="/images/more/star.png" alt="star" loading="lazy" />
                <img src="/images/more/star-dark.png" alt="star dark" loading="lazy" />
              </span>
            </h4>
          </div>

          {/* Second Set (for infinite scroll) */}
          <div className="wptb-item--inner">
            {marqueeItems.map((item, index) => (
              <h4 key={`second-${index}`} className={`wptb-item--text ${item.outline ? 'text-outline' : ''}`}>
                <span className="wptb-text-backdrop">{item.text}</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src="/images/more/star.png" alt="star" loading="lazy" />
                  <img src="/images/more/star-dark.png" alt="star dark" loading="lazy" />
                </span>
              </h4>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextMarquee;

