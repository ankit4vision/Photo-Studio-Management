const PageHeader = ({ title, backgroundImage = '/images/background/bg-3.jpg' }) => {
  return (
    <div className="wptb-page-heading">
      <div
        className="wptb-item--inner"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div className="wptb-item-layer wptb-item-layer-one">
          <img src="/images/more/circle.png" alt="decoration" loading="lazy" />
        </div>
        <h2 className="wptb-item--title">{title}</h2>
      </div>
    </div>
  );
};

export default PageHeader;

