import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

// Initialize Fancybox for all elements with data-fancybox attribute
export const initFancybox = () => {
  // Unbind existing instances first
  Fancybox.unbind('[data-fancybox]');
  
  // Bind new instances with configuration
  Fancybox.bind('[data-fancybox]', {
    Toolbar: {
      display: {
        left: [],
        middle: [],
        right: ['close'],
      },
    },
    Thumbs: {
      showOnStart: false,
    },
  });
};

// Destroy Fancybox instance
export const destroyFancybox = () => {
  Fancybox.destroy();
};

// Unbind Fancybox from specific selector
export const unbindFancybox = (selector) => {
  Fancybox.unbind(selector);
};

