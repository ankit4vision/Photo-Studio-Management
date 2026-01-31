import Isotope from 'isotope-layout';
import imagesLoaded from 'imagesloaded';

// Initialize Isotope for masonry grid
export const initIsotope = (containerSelector, itemSelector = '.grid-item') => {
  const container = document.querySelector(containerSelector);
  if (!container) return null;

  let isotopeInstance = null;

  // Wait for images to load
  const imgLoad = imagesLoaded(container);

  imgLoad.on('always', () => {
    isotopeInstance = new Isotope(container, {
      itemSelector: itemSelector,
      layoutMode: 'masonry',
      percentPosition: true,
      masonry: {
        columnWidth: '.grid-sizer',
        gutter: 10,
      },
    });
  });

  return isotopeInstance;
};

// Update Isotope layout
export const updateIsotope = (isotope) => {
  if (isotope) {
    isotope.layout();
  }
};

