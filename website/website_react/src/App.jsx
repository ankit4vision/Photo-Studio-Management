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
    // Load external scripts after component mounts
    const loadScript = (src) => {
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

        // Load scripts sequentially
        scripts.reduce((promise, src) => {
          return promise.then(() => loadScript(src))
        }, Promise.resolve())
      })
      .catch((error) => {
        console.error('Error loading scripts:', error)
      })

    // Initialize WOW.js
    if (window.WOW) {
      new window.WOW().init()
    }

    // Scroll to top on route change
    window.scrollTo(0, 0)
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
