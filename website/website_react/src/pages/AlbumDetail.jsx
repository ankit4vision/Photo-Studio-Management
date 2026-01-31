import { useParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import Divider from '../components/common/Divider';
import AlbumImagesSwiper from '../components/sections/AlbumImagesSwiper';
import AlbumHeaderInfo from '../components/sections/AlbumHeaderInfo';
import AlbumDescription from '../components/sections/AlbumDescription';
import AlbumImagesGrid from '../components/sections/AlbumImagesGrid';
import AlbumSidebar from '../components/sections/AlbumSidebar';
import ContactFormSection from '../components/sections/ContactFormSection';

const AlbumDetail = () => {
  const { id } = useParams();

  // In future, fetch album data based on id
  // For now, using default data
  const albumData = {
    title: 'Wedding Album 2024',
    date: 'December 2024',
    photoCount: '25 Photos',
    description:
      'LV_Clicks Photography captured this beautiful wedding celebration with attention to detail and artistic vision. Our portfolio showcases the most memorable moments from this special day.',
    albumInfo: {
      date: 'December 2024',
      location: 'New York, USA',
      photographer: 'LV_Clicks Team',
      totalPhotos: '25',
      category: 'Wedding',
    },
  };

  return (
    <>
      {/* Page Header */}
      <PageHeader title="Album Detail" />

      {/* Album Details Content */}
      <section className="blog-details">
        <div className="container">
          <div className="blog-details-inner">
            <div className="post-content">
              <div className="row">
                {/* Main Content */}
                <div className="col-lg-9 col-md-8 pe-md-5">
                  {/* Album Images Slider */}
                  <AlbumImagesSwiper />

                  {/* Album Header Info */}
                  <AlbumHeaderInfo
                    title={albumData.title}
                    date={albumData.date}
                    photoCount={albumData.photoCount}
                  />

                  {/* Album Description with Images Grid */}
                  <AlbumDescription description={albumData.description}>
                    <AlbumImagesGrid />
                  </AlbumDescription>
                </div>

                {/* Album Sidebar */}
                <div className="col-lg-3 col-md-4">
                  <AlbumSidebar albumInfo={albumData.albumInfo} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider className="mr-bottom-40" />

      {/* Contact Form Section */}
      <ContactFormSection />
    </>
  );
};

export default AlbumDetail;

