import { useEffect } from 'react';
import { initFancybox, destroyFancybox } from '../utils/fancybox';

// Custom hook for Fancybox initialization
export const useFancybox = (dependencies = []) => {
  useEffect(() => {
    // Initialize Fancybox
    initFancybox();

    // Cleanup on unmount
    return () => {
      destroyFancybox();
    };
  }, dependencies);
};

