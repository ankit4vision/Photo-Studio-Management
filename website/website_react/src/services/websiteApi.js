// Website API Service - Fetch dynamic content from backend
// Base URL should be configured in environment variables

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

class WebsiteApi {
  /**
   * Make API request
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  /**
   * Get hero slider images
   */
  async getSlider() {
    try {
      const response = await this.request('/website/slider')
      return {
        success: true,
        data: response.data || [],
      }
    } catch (error) {
      console.error('Error fetching slider:', error)
      // Return empty array on error to prevent breaking the website
      return {
        success: false,
        data: [],
        error: error.message,
      }
    }
  }

  /**
   * Get services
   */
  async getServices() {
    try {
      const response = await this.request('/website/services')
      return {
        success: true,
        data: response.data || [],
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      // Return empty array on error to prevent breaking the website
      return {
        success: false,
        data: [],
        error: error.message,
      }
    }
  }

  /**
   * Get projects (featured for homepage)
   */
  async getProjects(featured = true) {
    try {
      const endpoint = featured ? '/website/projects?featured=true' : '/website/projects'
      const response = await this.request(endpoint)
      return {
        success: true,
        data: response.data || [],
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      return {
        success: false,
        data: [],
        error: error.message,
      }
    }
  }

  /**
   * Get home gallery images
   */
  async getHomeGallery() {
    try {
      const response = await this.request('/website/home-gallery')
      return {
        success: true,
        data: response.data || [],
      }
    } catch (error) {
      console.error('Error fetching home gallery:', error)
      return {
        success: false,
        data: [],
        error: error.message,
      }
    }
  }

  /**
   * Get testimonials (featured for homepage)
   */
  async getTestimonials(featured = true) {
    try {
      const endpoint = featured ? '/website/testimonials?featured=true' : '/website/testimonials'
      const response = await this.request(endpoint)
      return {
        success: true,
        data: response.data || [],
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      return {
        success: false,
        data: [],
        error: error.message,
      }
    }
  }

  /**
   * Get gallery images (with pagination)
   */
  async getGallery(page = 1, perPage = 20, category = null) {
    try {
      let endpoint = `/website/gallery?page=${page}&per_page=${perPage}`
      if (category) {
        endpoint += `&category=${category}`
      }
      const response = await this.request(endpoint)
      return {
        success: true,
        data: response.data || [],
        meta: response.meta || null,
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
      return {
        success: false,
        data: [],
        meta: null,
        error: error.message,
      }
    }
  }

  /**
   * Get gallery videos
   */
  async getGalleryVideos() {
    try {
      const response = await this.request('/website/gallery-videos')
      return {
        success: true,
        data: response.data || [],
      }
    } catch (error) {
      console.error('Error fetching gallery videos:', error)
      return {
        success: false,
        data: [],
        error: error.message,
      }
    }
  }


  /**
   * Get project details by ID
   */
  async getProjectDetail(projectId) {
    try {
      const response = await this.request(`/website/projects/${projectId}`)
      return {
        success: true,
        data: response.data || null,
      }
    } catch (error) {
      console.error('Error fetching project detail:', error)
      return {
        success: false,
        data: null,
        error: error.message,
      }
    }
  }
}

// Create and export singleton instance
const websiteApi = new WebsiteApi()
export default websiteApi

