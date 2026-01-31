import { useState } from 'react';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Search:', searchQuery);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal">
      <div className={`modal fade ${isOpen ? 'show' : ''}`} id="modalSearch" style={{ display: isOpen ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="search_overlay">
              <form className="credential-form" method="post" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="search"
                    className="keyword form-control"
                    placeholder="Search Here"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                <button type="submit" className="btn-search">
                  <span className="text-first">
                    <i className="bi bi-arrow-right"></i>
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="modal-backdrop fade show" onClick={onClose}></div>
      )}
    </div>
  );
};

export default SearchModal;

