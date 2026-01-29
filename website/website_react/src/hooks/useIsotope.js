import { useEffect, useRef } from 'react'

/**
 * Custom hook to initialize Isotope masonry grid layout
 * @param {string} gridSelector - CSS selector for the grid container (default: '.grid')
 * @param {Object} options - Additional Isotope options
 */
const useIsotope = (gridSelector = '.grid', options = {}, dependencies = []) => {
  const isotopeRef = useRef(null)
  const gridElementRef = useRef(null)

  useEffect(() => {
    let checkInterval = null
    let checkTimeout = null
    let layoutTimeout = null

    // Small delay to ensure React has finished rendering
    const timeoutId = setTimeout(() => {
      // Function to initialize Isotope
      const initIsotope = () => {
        // Check if jQuery and Isotope are loaded
        if (typeof window.jQuery === 'undefined' || typeof window.jQuery.fn.isotope === 'undefined') {
          return false
        }

        const $ = window.jQuery
        const $grid = $(gridSelector)

        // Check if grid exists
        if ($grid.length === 0) {
          return false
        }

        // Destroy existing Isotope instance if it exists
        if (isotopeRef.current) {
          try {
            $grid.isotope('destroy')
          } catch (e) {
            // Ignore errors if already destroyed
          }
        }

        // Mark grid as being initialized
        $grid.attr('data-isotope-initializing', 'true')

        // Check if imagesLoaded is available
        if (typeof $.fn.imagesLoaded === 'undefined') {
          // Initialize Isotope without waiting for images
          isotopeRef.current = $grid.isotope({
            itemSelector: '.grid-item',
            percentPosition: true,
            layoutMode: 'masonry',
            transformsEnabled: true,
            transitionDuration: '700ms',
            resize: true,
            fitWidth: true,
            columnWidth: '.grid-sizer',
            ...options
          })
          
          // Mark as initialized
          $grid.attr('data-isotope-initialized', 'true').removeAttr('data-isotope-initializing')
          
          // Trigger layout after a short delay to ensure images have dimensions
          layoutTimeout = setTimeout(() => {
            if (isotopeRef.current) {
              $grid.isotope('layout')
            }
          }, 100)
        } else {
          // Wait for images to load before initializing Isotope
          $grid.imagesLoaded()
            .progress(() => {
              if (!isotopeRef.current) {
                isotopeRef.current = $grid.isotope({
                  itemSelector: '.grid-item',
                  percentPosition: true,
                  layoutMode: 'masonry',
                  transformsEnabled: true,
                  transitionDuration: '700ms',
                  resize: true,
                  fitWidth: true,
                  columnWidth: '.grid-sizer',
                  ...options
                })
                // Mark as initialized
                $grid.attr('data-isotope-initialized', 'true').removeAttr('data-isotope-initializing')
              } else {
                // Re-layout if already initialized
                $grid.isotope('layout')
              }
            })
            .done(() => {
              // Final layout after all images are loaded
              if (isotopeRef.current) {
                $grid.isotope('layout')
                $grid.attr('data-isotope-initialized', 'true').removeAttr('data-isotope-initializing')
              }
            })
            .fail(() => {
              // If imagesLoaded fails, initialize anyway
              if (!isotopeRef.current) {
                isotopeRef.current = $grid.isotope({
                  itemSelector: '.grid-item',
                  percentPosition: true,
                  layoutMode: 'masonry',
                  transformsEnabled: true,
                  transitionDuration: '700ms',
                  resize: true,
                  fitWidth: true,
                  columnWidth: '.grid-sizer',
                  ...options
                })
                // Mark as initialized
                $grid.attr('data-isotope-initialized', 'true').removeAttr('data-isotope-initializing')
              }
            })
        }

        return true
      }

      // Try to initialize immediately
      let initialized = initIsotope()

      // If not initialized, wait for scripts to load
      if (!initialized) {
        checkInterval = setInterval(() => {
          initialized = initIsotope()
          if (initialized) {
            if (checkInterval) {
              clearInterval(checkInterval)
              checkInterval = null
            }
          }
        }, 100)

        // Cleanup interval after 10 seconds
        checkTimeout = setTimeout(() => {
          if (checkInterval) {
            clearInterval(checkInterval)
            checkInterval = null
          }
        }, 10000)
      }
    }, 50) // Small delay to ensure DOM is ready

    // Cleanup on unmount
    return () => {
      clearTimeout(timeoutId)
      if (checkInterval) {
        clearInterval(checkInterval)
      }
      if (checkTimeout) {
        clearTimeout(checkTimeout)
      }
      if (layoutTimeout) {
        clearTimeout(layoutTimeout)
      }
      if (isotopeRef.current && typeof window.jQuery !== 'undefined') {
        const $ = window.jQuery
        const $grid = $(gridSelector)
        try {
          $grid.isotope('destroy')
        } catch (e) {
          // Ignore errors
        }
        isotopeRef.current = null
      }
    }
  }, [gridSelector, JSON.stringify(options), ...dependencies])

  return isotopeRef.current
}

export default useIsotope

