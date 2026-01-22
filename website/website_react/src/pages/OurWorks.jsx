import { Link } from 'react-router-dom'
import { useEffect } from 'react'

const OurWorks = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const albums = [
    { id: 1, title: 'Wedding Album 2024', count: '25 Photos', image: 1, col: 4 },
    { id: 2, title: 'Portrait Session', count: '18 Photos', image: 2, col: 4 },
    { id: 3, title: 'Fashion Collection', count: '32 Photos', image: 3, col: 4 },
    { id: 4, title: 'Event Coverage 2024', count: '45 Photos', image: 4, col: 8 },
    { id: 5, title: 'Nature Photography', count: '28 Photos', image: 5, col: 8 },
    { id: 6, title: 'Studio Session', count: '20 Photos', image: 6, col: 4 },
    { id: 7, title: 'Outdoor Adventure', count: '22 Photos', image: 7, col: 4 },
    { id: 8, title: 'Family Portrait', count: '15 Photos', image: 8, col: 4 }
  ]

  return (
    <>
      {/* Page Header */}
      <div className="wptb-page-heading">
        <div className="wptb-item--inner" style={{ backgroundImage: "url('/assets/img/background/bg-3.jpg')" }}>
          <div className="wptb-item-layer wptb-item-layer-one">
            <img src="/assets/img/more/circle.png" alt="img" />
          </div>
          <h2 className="wptb-item--title">Our Works</h2>
        </div>
      </div>

      {/* Albums Section */}
      <section className="wptb-project pd-top-100 pd-bottom-80">
        <div className="container">
          <div className="wptb-project--inner">
            <div className="wptb-heading-two">
              <div className="wptb-item--inner text-center">
                <h6 className="wptb-item--subtitle">Our Albums</h6>
                <h1 className="wptb-item--title">
                  LV_Clicks captures <span>All of Your</span> <br />
                  beautiful memories
                </h1>
                <div className="wptb-item--description">
                  Browse through our photography albums. <br /> Click on any album to view all photos.
                </div>
              </div>
            </div>

            <div className="effect-gradient has-radius">
              <div className="grid gutter-10 clearfix">
                <div className="grid-sizer"></div>
                <div className="row">
                  {albums.map((album) => (
                    <div key={album.id} className={`grid-item col-md-${album.col}`}>
                      <div className="wptb-item--inner">
                        <div className="wptb-item--image">
                          <img src={`/assets/img/projects/1/${album.image}.jpg`} alt="img" />
                          <Link to="/album-detail" className="wptb-item--link">
                            <i className="bi bi-chevron-right"></i>
                          </Link>
                        </div>
                        <div className="wptb-item--holder">
                          <div className="wptb-item--meta">
                            <h4><Link to="/album-detail">{album.title}</Link></h4>
                            <p>{album.count}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider-line-hr mr-bottom-40"></div>

      {/* Contact */}
      <section className="wptb-contact-form style2">
        <div className="wptb-item-layer both-version">
          <img src="/assets/img/more/texture-2.png" alt="" />
          <img src="/assets/img/more/texture-2-light.png" alt="" />
        </div>
        <div className="container">
          <div className="wptb-form--wrapper no-bg">
            <div className="row">
              <div className="col-lg-5">
                <div className="wptb-heading-two pe-lg-5">
                  <div className="wptb-item--inner">
                    <h6 className="wptb-item--subtitle"> Contact Us</h6>
                    <h1 className="wptb-item--title"> Feel Free To Ask Us Anything <span>Contact Us</span></h1>
                  </div>
                </div>
              </div>

              <div className="col-lg-7">
                <form className="wptb-form" action="#" method="post">
                  <div className="wptb-form--inner">
                    <div className="row">
                      <div className="col-lg-6 col-md-6 mb-4">
                        <div className="form-group">
                          <input type="text" name="name" className="form-control" placeholder="Name*" required />
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6 mb-4">
                        <div className="form-group">
                          <input type="email" name="email" className="form-control" placeholder="E-mail*" required />
                        </div>
                      </div>

                      <div className="col-lg-12 col-md-12 mb-4">
                        <div className="form-group">
                          <input type="text" name="subject" className="form-control" placeholder="Subject" />
                        </div>
                      </div>

                      <div className="col-md-12 col-lg-12 mb-4">
                        <div className="form-group">
                          <textarea name="message" className="form-control" placeholder="Text"></textarea>
                        </div>
                      </div>

                      <div className="col-md-12 col-lg-12">
                        <div className="wptb-item--button">
                          <button className="btn" type="submit">
                            <span className="btn-wrap">
                              <span className="text-first">Send Mail</span>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default OurWorks

