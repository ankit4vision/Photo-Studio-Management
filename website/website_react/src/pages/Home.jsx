import {
  HeroSlider,
  TextMarquee,
  ServicesSection,
  ProjectsSection,
  ImageGallerySection,
  TestimonialsSection,
  OfficeAddressSection,
  AboutSection,
  ContactFormSection,
} from '../components/sections';
import Divider from '../components/common/Divider';

const Home = () => {
  return (
    <>
      {/* Hero Slider Section */}
      <HeroSlider />

      <Divider />

      {/* Text Marquee */}
      <TextMarquee />

      <Divider />

      {/* Services Section */}
      <ServicesSection />

      {/* Projects Section */}
      <ProjectsSection />

      {/* Image Gallery Section */}
      <ImageGallerySection />

      <Divider />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Office Address Section */}
      <OfficeAddressSection />

      <Divider className="mr-bottom-40" />

      {/* About LV_Clicks Section */}
      <AboutSection />

      <Divider className="mr-bottom-40" />

      {/* Contact Form Section */}
      <ContactFormSection />
    </>
  );
};

export default Home;
