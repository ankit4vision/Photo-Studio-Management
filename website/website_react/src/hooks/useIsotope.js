import { useEffect, useRef } from 'react';
import { initIsotope, updateIsotope } from '../utils/isotope';

// Custom hook for Isotope initialization
export const useIsotope = (containerSelector, itemSelector = '.grid-item') => {
  const isotopeRef = useRef(null);

  useEffect(() => {
    // Initialize Isotope
    const isotope = initIsotope(containerSelector, itemSelector);
    isotopeRef.current = isotope;

    // Cleanup on unmount
    return () => {
      if (isotopeRef.current) {
        isotopeRef.current.destroy();
      }
    };
  }, [containerSelector, itemSelector]);

  // Function to update layout
  const updateLayout = () => {
    updateIsotope(isotopeRef.current);
  };

  return { updateLayout };
};

