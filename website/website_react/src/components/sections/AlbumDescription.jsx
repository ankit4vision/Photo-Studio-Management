const AlbumDescription = ({ description, children }) => {
  const defaultDescription =
    'LV_Clicks Photography captured this beautiful wedding celebration with attention to detail and artistic vision. Our portfolio showcases the most memorable moments from this special day.';

  return (
    <div className="fulltext">
      <p>{description || defaultDescription}</p>
      {children}
    </div>
  );
};

export default AlbumDescription;

