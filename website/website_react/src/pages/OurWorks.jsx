import PageHeader from '../components/common/PageHeader';
import Divider from '../components/common/Divider';
import AlbumsSection from '../components/sections/AlbumsSection';
import ContactFormSection from '../components/sections/ContactFormSection';

const OurWorks = () => {
  return (
    <>
      {/* Page Header */}
      <PageHeader title="Our Works" />

      {/* Albums Section */}
      <AlbumsSection />

      <Divider className="mr-bottom-40" />

      {/* Contact Form Section */}
      <ContactFormSection />
    </>
  );
};

export default OurWorks;

