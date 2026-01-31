const ProjectsSection = () => {
  const projects = [
    { id: 1, image: '/images/projects/1/1.jpg', title: 'Bright Boho Sunshine', photographer: 'Jonathon Willson' },
    { id: 2, image: '/images/projects/1/2.jpg', title: 'California Fall Collection 2023', photographer: 'Jonathon Willson' },
    { id: 3, image: '/images/projects/1/3.jpg', title: 'Brown girl next door', photographer: 'Jonathon Willson' },
    { id: 4, image: '/images/projects/1/4.jpg', title: 'Fashion next stage', photographer: 'Jonathon Willson' },
    { id: 5, image: '/images/projects/1/5.jpg', title: 'Jenifer in green', photographer: 'Jonathon Willson' },
    { id: 6, image: '/images/projects/1/6.jpg', title: 'Sunflower Boho girl', photographer: 'Jonathon Willson' },
    { id: 7, image: '/images/projects/1/7.jpg', title: 'Iceland girl', photographer: 'Jonathon Willson' },
    { id: 8, image: '/images/projects/1/8.jpg', title: 'Summer sadness', photographer: 'Jonathon Willson' },
    { id: 9, image: '/images/projects/1/9.jpg', title: 'Festive mode one', photographer: 'Jonathon Willson' },
    { id: 10, image: '/images/projects/1/10.jpg', title: 'Bright Boho Sunshine0', photographer: 'Jonathon Willson' },
  ];

  return (
    <section className="wptb-project pt-0">
      <div className="container">
        {/* Heading */}
        <div className="wptb-heading-two">
          <div className="wptb-item--inner text-center">
            <h6 className="wptb-item--subtitle">LV_Clicks Projects</h6>
            <h1 className="wptb-item--title">
              {' '}
              Explore LV_Clicks <br /> Photography <span>Projects</span>{' '}
            </h1>
            <div className="wptb-item--description">
              LV_Clicks photography Agency runs wide and deep. Across many <br /> markets, geographies
              & typologies, our team members
            </div>
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="style-masonry effect-blur">
          <div className="grid grid-3 gutter-10 clearfix">
            <div className="grid-sizer"></div>
            {projects.map((project) => (
              <div key={project.id} className="grid-item">
                <div className="wptb-item--inner">
                  <div className="wptb-item--image">
                    <img src={project.image} alt={project.title} loading="lazy" />
                  </div>

                  <div className="wptb-item--holder">
                    <div className="wptb-item--meta">
                      <h4>
                        <a href="#">{project.title}</a>
                      </h4>
                      <p>By {project.photographer}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

