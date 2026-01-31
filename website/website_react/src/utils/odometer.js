import Odometer from 'odometer';
import 'odometer/themes/odometer-theme-default.css';

// Initialize Odometer for counters
export const initOdometer = (element, value) => {
  if (!element) return null;

  const odometer = new Odometer({
    el: element,
    value: 0,
    format: '(,ddd)',
    theme: 'default',
    animation: 'count',
  });

  // Animate to target value
  odometer.update(value);

  return odometer;
};

// Update Odometer value
export const updateOdometer = (odometer, value) => {
  if (odometer) {
    odometer.update(value);
  }
};

