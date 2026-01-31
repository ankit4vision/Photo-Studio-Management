import { useEffect, useRef } from 'react';
import { initOdometer, updateOdometer } from '../utils/odometer';

// Custom hook for Odometer initialization
export const useOdometer = (value, selector) => {
  const odometerRef = useRef(null);

  useEffect(() => {
    const element = document.querySelector(selector);
    if (element && !odometerRef.current) {
      odometerRef.current = initOdometer(element, value);
    } else if (odometerRef.current) {
      updateOdometer(odometerRef.current, value);
    }
  }, [value, selector]);

  return odometerRef.current;
};

