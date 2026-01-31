const AlbumHeaderInfo = ({ title = 'Wedding Album 2024', date = 'December 2024', photoCount = '25 Photos' }) => {
  return (
    <div className="post-header">
      <h1 className="post-title">{title}</h1>
      <div className="post-meta">
        <span>
          <i className="bi bi-calendar"></i> {date}
        </span>
        <span>
          <i className="bi bi-images"></i> {photoCount}
        </span>
      </div>
    </div>
  );
};

export default AlbumHeaderInfo;

