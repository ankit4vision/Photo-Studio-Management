import { useEffect, useState } from 'react';

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add preloader-active class on mount
    document.body.classList.add('preloader-active');
    
    // Hide preloader when page is loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.classList.remove('preloader-active');
      document.body.classList.add('preloader-complete');
    }, 1000);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove('preloader-active', 'preloader-complete');
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div id="preloader">
      <div className="preloader-inner">
        <div className="spinner">
          <div className="spinner-text">LV_Clicks</div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;

