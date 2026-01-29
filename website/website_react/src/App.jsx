import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Preloader from './components/Preloader'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Gallery from './pages/Gallery'
import OurWorks from './pages/OurWorks'
import AlbumDetail from './pages/AlbumDetail'
import Contact from './pages/Contact'
import './App.css'

function App() {
  useEffect(() => {
    // Suppress Swiper loop warnings globally (they're just warnings, not errors)
    // These warnings come from theme.js initializing Swiper on elements that don't exist
    const originalWarn = console.warn
    const originalError = console.error
    console.warn = function(...args) {
      // Filter out Swiper loop warnings
      const message = args[0]?.toString() || ''
      if (message.includes('Swiper Loop Warning') || 
          message.includes('The number of slides is not enough for loop mode')) {
        return // Suppress this warning
      }
      originalWarn.apply(console, args)
    }
    
    // Also suppress Swiper-related errors that might occur
    console.error = function(...args) {
      const message = args[0]?.toString() || ''
      if (message.includes('Swiper Loop Warning')) {
        return // Suppress this error
      }
      originalError.apply(console, args)
    }

    // Check if scripts are already loaded to prevent duplicate loading
    const isScriptLoaded = (src) => {
      return Array.from(document.querySelectorAll('script')).some(
        script => script.src.includes(src.split('/').pop())
      )
    }

    // Load external scripts after component mounts
    const loadScript = (src) => {
      // Skip if script is already loaded
      if (isScriptLoaded(src)) {
        return Promise.resolve()
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.onload = resolve
        script.onerror = reject
        document.body.appendChild(script)
      })
    }

    // Load jQuery first (required by other scripts)
    loadScript('/assets/js/jquery-3.6.0.min.js')
      .then(() => {
        // Wait for jQuery to be fully available
        return new Promise((resolve) => {
          if (window.jQuery) {
            resolve()
          } else {
            const checkJQuery = setInterval(() => {
              if (window.jQuery) {
                clearInterval(checkJQuery)
                resolve()
              }
            }, 50)
            setTimeout(() => clearInterval(checkJQuery), 5000)
          }
        })
      })
      .then(() => {
        // Load other scripts after jQuery
        const scripts = [
          '/assets/js/bootstrap.min.js',
          '/plugins/wow/wow.min.js',
          '/plugins/swiper/swiper-bundle.min.js',
          '/plugins/swiper/swiper-gl.min.js',
          '/plugins/odometer/appear.js',
          '/plugins/odometer/odometer.js',
          '/plugins/isotope/imagesloaded.pkgd.min.js',
          '/plugins/isotope/isotope.pkgd.min.js',
          '/plugins/isotope/tilt.jquery.js',
          '/plugins/isotope/isotope-init.js',
          '/plugins/fancybox/jquery.fancybox.min.js',
          '/plugins/flatpickr/flatpickr.min.js',
          '/plugins/nice-select/jquery.nice-select.min.js',
          '/plugins/cursor-effect/cursor-effect.js',
          '/assets/js/theme.js'
          // map.js is not needed - Contact page initializes map directly
        ]

        // Load scripts sequentially, skipping already loaded ones
        scripts.reduce((promise, src) => {
          return promise.then(() => {
            if (!isScriptLoaded(src)) {
              return loadScript(src)
            }
            return Promise.resolve()
          })
        }, Promise.resolve())
      })
      .catch((error) => {
        console.error('Error loading scripts:', error)
      })

    // Initialize WOW.js (only once)
    const initWOW = () => {
      if (window.WOW && !window.wowInitialized) {
        try {
          new window.WOW().init()
          window.wowInitialized = true
        } catch (e) {
          console.warn('WOW.js initialization error:', e)
        }
      }
    }

    // Try to initialize WOW.js after a delay to ensure scripts are loaded
    const wowTimer = setTimeout(initWOW, 1000)
    
    // Also try when WOW becomes available
    if (!window.WOW) {
      const checkWOW = setInterval(() => {
        if (window.WOW) {
          clearInterval(checkWOW)
          initWOW()
        }
      }, 100)
      setTimeout(() => clearInterval(checkWOW), 10000)
    } else {
      initWOW()
    }

    // Scroll to top on route change
    window.scrollTo(0, 0)

    return () => {
      clearTimeout(wowTimer)
      // Restore original console methods on unmount
      if (console.warn !== originalWarn) {
        console.warn = originalWarn
      }
      if (console.error !== originalError) {
        console.error = originalError
      }
    }
  }, [])

  return (
    <div className="App theme-style--gradient">
      <Preloader />
      <Header />
      <main className="wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/our-works" element={<OurWorks />} />
          <Route path="/album-detail" element={<AlbumDetail />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
