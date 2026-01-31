import { useEffect } from 'react';

// Initialize WOW.js for scroll animations
export const useWOW = () => {
  useEffect(() => {
    // Dynamically import WOW.js
    import('wow.js').then((WOW) => {
      const wow = new WOW.default({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 0,
        mobile: true,
        live: true,
      });

      wow.init();
    });

    return () => {
      // Cleanup if needed
    };
  }, []);
};

// Initialize WOW.js globally
export const initWOW = () => {
  return import('wow.js').then((WOW) => {
    const wow = new WOW.default({
      boxClass: 'wow',
      animateClass: 'animated',
      offset: 0,
      mobile: true,
      live: true,
    });

    wow.init();
    return wow;
  });
};

