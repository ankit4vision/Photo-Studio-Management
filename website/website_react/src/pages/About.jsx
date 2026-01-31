import PageHeader from '../components/common/PageHeader';
import Divider from '../components/common/Divider';
import AboutPageSection from '../components/sections/AboutPageSection';
import FAQSection from '../components/sections/FAQSection';
import TextMarquee from '../components/sections/TextMarquee';
import VideoPlayerSection from '../components/sections/VideoPlayerSection';
import TeamSection from '../components/sections/TeamSection';
import TestimonialsColoredSection from '../components/sections/TestimonialsColoredSection';
import AwardsSection from '../components/sections/AwardsSection';
import ContactFormSection from '../components/sections/ContactFormSection';

const About = () => {
  return (
    <>
      {/* Page Header */}
      <PageHeader title="About Us" />

      {/* About Section */}
      <AboutPageSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Text Marquee */}
      <div className="pd-top-80">
        <TextMarquee
          items={[
            { text: 'LV_Clicks', outline: false },
            { text: 'Photography', outline: true },
            { text: 'Studio', outline: false },
            { text: 'Agency', outline: true },
          ]}
        />
      </div>

      {/* Video Player Section */}
      <VideoPlayerSection />

      <Divider className="mr-top-100" />

      {/* Team Section */}
      <TeamSection />

      {/* Testimonials Section */}
      <TestimonialsColoredSection />

      {/* Awards Section */}
      <AwardsSection />

      {/* Contact Form Section */}
      <ContactFormSection />
    </>
  );
};

export default About;

