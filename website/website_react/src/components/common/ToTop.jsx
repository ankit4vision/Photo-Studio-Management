import { useEffect, useState } from 'react';

const ToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`totop ${isVisible ? 'active' : ''}`}>
      <a href="#" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>
        <i className="bi bi-chevron-up"></i>
      </a>
    </div>
  );
};

export default ToTop;

