import { useState } from 'react';

const ContactFormSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      // Handle form submission here
      // In production, you would send this to your backend API
      console.log('Form submitted:', formData);
      
      // Show success message
      alert('Thank you for your message! We will get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again.');
    }
  };

  return (
    <section className="wptb-contact-form style2">
      <div className="wptb-item-layer both-version">
        <img src="/images/more/texture-2.png" alt="texture" loading="lazy" />
        <img src="/images/more/texture-2-light.png" alt="texture light" loading="lazy" />
      </div>
      <div className="container">
        <div className="wptb-form--wrapper no-bg">
          <div className="row">
            {/* Heading Part */}
            <div className="col-lg-5">
              <div className="wptb-heading-two pe-lg-5">
                <div className="wptb-item--inner">
                  <h6 className="wptb-item--subtitle">Contact Us</h6>
                  <h1 className="wptb-item--title">
                    {' '}
                    Feel Free To Ask Us Anything <span>Contact Us</span>
                  </h1>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="col-lg-7">
              <form className="wptb-form" onSubmit={handleSubmit}>
                <div className="wptb-form--inner">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 mb-4">
                      <div className="form-group">
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          placeholder="Name*"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6 mb-4">
                      <div className="form-group">
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="E-mail*"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-12 col-md-12 mb-4">
                      <div className="form-group">
                        <input
                          type="text"
                          name="subject"
                          className="form-control"
                          placeholder="Subject"
                          value={formData.subject}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-12 col-lg-12 mb-4">
                      <div className="form-group">
                        <textarea
                          name="message"
                          className="form-control"
                          placeholder="Text"
                          value={formData.message}
                          onChange={handleChange}
                          rows="5"
                        ></textarea>
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
  );
};

export default ContactFormSection;

