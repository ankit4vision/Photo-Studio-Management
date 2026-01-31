import PageHeader from '../components/common/PageHeader';
import Divider from '../components/common/Divider';
import GalleryImagesSection from '../components/sections/GalleryImagesSection';
import GalleryVideosSection from '../components/sections/GalleryVideosSection';
import ContactFormSection from '../components/sections/ContactFormSection';

const Gallery = () => {
  return (
    <>
      {/* Page Header */}
      <PageHeader title="Gallery" />

      {/* Images Gallery Section */}
      <GalleryImagesSection />

      <Divider />

      {/* Videos Gallery Section */}
      <GalleryVideosSection />

      <Divider className="mr-bottom-40" />

      {/* Contact Form Section */}
      <ContactFormSection />
    </>
  );
};

export default Gallery;

