import { useEffect } from 'react'

const Preloader = () => {
  useEffect(() => {
    // Hide preloader when page loads
    const preloader = document.getElementById('preloader')
    if (preloader) {
      window.addEventListener('load', () => {
        preloader.style.opacity = '0'
        setTimeout(() => {
          preloader.style.display = 'none'
        }, 500)
      })
    }
  }, [])

  return (
    <div id="preloader">
      <div className="preloader-inner">
        <div className="spinner">
          <div className="spinner-text">LV_Clicks</div>
        </div>
      </div>
    </div>
  )
}

export default Preloader

