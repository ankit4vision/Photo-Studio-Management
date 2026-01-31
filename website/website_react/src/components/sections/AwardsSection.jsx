import { Link } from 'react-router-dom';

const AwardsSection = () => {
  const awards = [
    {
      id: 1,
      title: 'Photography Team of the Year 2023',
      image: '/images/more/4.jpg',
      active: false,
    },
    {
      id: 2,
      title: 'Best Wedding Photographer 2022',
      image: '/images/more/5.jpg',
      active: true,
    },
    {
      id: 3,
      title: 'Photography Team of the Year 2019',
      image: '/images/more/6.jpg',
      active: false,
    },
  ];

  return (
    <section className="bg-dark-200 pd-bottom-80">
      <div className="container">
        {/* Heading */}
        <div className="wptb-heading">
          <div className="wptb-item--inner">
            <div className="row">
              <div className="col-lg-6">
                <h6 className="wptb-item--subtitle">
                  <span>02 //</span> Our Awards
                </h6>
                <h1 className="wptb-item--title mb-0">
                  Our Photography
                  <br />
                  <span>Awards</span>
                </h1>
              </div>

              <div className="col-lg-6">
                <p className="wptb-item--description">
                  we're deeply passionate <span>catch your lovely memories in cameras</span> and Convey your love for
                  every moment of life as a whole.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Awards List */}
        <ol className="wptb-award-list">
          {awards.map((award) => (
            <li key={award.id} className={`wptb-item ${award.active ? 'active highlight' : ''}`}>
              <div className="wptb-item--inner">
                <div className="wptb-item--holder">
                  <Link to={`/album/${award.id || 1}`}>{award.title}</Link>
                </div>
                <div className="wptb-item--image">
                  <img src={award.image} alt={award.title} loading="lazy" />
                  <div className="wptb-item--button">
                    <Link to={`/album/${award.id || 1}`} className="btn">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default AwardsSection;

