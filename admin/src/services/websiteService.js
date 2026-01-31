// Website CMS Service - API calls for website content management
import apiClient from '../config/apiClient'
import { API_ENDPOINTS } from '../constants/api'

class WebsiteService {
  transformListResponse(payload) {
    if (!payload) {
      return {
        success: false,
        data: [],
        meta: null,
        message: 'No response received from server.',
      }
    }

    const data = Array.isArray(payload.data)
      ? payload.data
      : Array.isArray(payload.data?.data)
        ? payload.data.data
        : payload.data || []

    const meta = payload.meta ?? {}

    return {
      success: payload.success ?? true,
      data,
      meta: {
        total: meta.total ?? data.length,
        page: meta.page ?? 1,
        limit: meta.limit ?? (data.length || 1),
        totalPages: meta.totalPages ?? 1,
        hasNext: meta.hasNext ?? false,
        hasPrev: meta.hasPrev ?? false,
        sortBy: meta.sortBy ?? null,
        sortDirection: meta.sortDirection ?? null,
      },
      links: payload.links ?? null,
      message: payload.message ?? '',
    }
  }

  transformItemResponse(payload) {
    if (!payload) {
      return {
        success: false,
        data: null,
        message: 'No response received from server.',
      }
    }

    return {
      success: payload.success ?? true,
      data: payload.data ?? payload,
      message: payload.message ?? '',
    }
  }

  buildQueryParams(params = {}) {
    const query = {}

    if (params.page) query.page = params.page
    if (params.limit) query.limit = params.limit
    if (params.per_page) query.limit = params.per_page
    if (params.search) query.search = params.search
    if (params.is_active !== undefined) query.is_active = params.is_active
    if (params.sortBy) query.sort_by = params.sortBy
    if (params.sortDirection) query.sort_direction = params.sortDirection

    return query
  }

  // ==================== SLIDER METHODS ====================

  // Get all sliders (admin)
  async getSliders(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WEBSITE.SLIDER.LIST, {
        params: this.buildQueryParams(params),
      })

      return this.transformListResponse(response?.data)
    } catch (error) {
      console.error('Error fetching sliders:', error)
      throw error
    }
  }

  // Get slider by ID
  async getSliderById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WEBSITE.SLIDER.GET_BY_ID(id))
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.error('Error fetching slider:', error)
      throw error
    }
  }

  // Create new slider
  async createSlider(sliderData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.WEBSITE.SLIDER.CREATE, sliderData)
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.error('Error creating slider:', error)
      throw error
    }
  }

  // Update slider
  async updateSlider(id, sliderData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.WEBSITE.SLIDER.UPDATE(id), sliderData)
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.error('Error updating slider:', error)
      throw error
    }
  }

  // Delete slider
  async deleteSlider(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.WEBSITE.SLIDER.DELETE(id))
      return this.transformItemResponse(response?.data ?? { success: true })
    } catch (error) {
      console.error('Error deleting slider:', error)
      throw error
    }
  }

  // Reorder sliders
  async reorderSliders(sliders) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.WEBSITE.SLIDER.REORDER, { sliders })
      return this.transformItemResponse(response?.data ?? { success: true })
    } catch (error) {
      console.error('Error reordering sliders:', error)
      throw error
    }
  }

  // ==================== SERVICE METHODS ====================

  // Get all services (admin)
  async getServices(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WEBSITE.SERVICE.LIST, {
        params: this.buildQueryParams(params),
      })

      return this.transformListResponse(response?.data)
    } catch (error) {
      console.error('Error fetching services:', error)
      throw error
    }
  }

  // Get service by ID
  async getServiceById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WEBSITE.SERVICE.GET_BY_ID(id))
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.error('Error fetching service:', error)
      throw error
    }
  }

  // Create new service
  async createService(serviceData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.WEBSITE.SERVICE.CREATE, serviceData)
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.error('Error creating service:', error)
      throw error
    }
  }

  // Update service
  async updateService(id, serviceData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.WEBSITE.SERVICE.UPDATE(id), serviceData)
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.error('Error updating service:', error)
      throw error
    }
  }

  // Delete service
  async deleteService(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.WEBSITE.SERVICE.DELETE(id))
      return this.transformItemResponse(response?.data ?? { success: true })
    } catch (error) {
      console.error('Error deleting service:', error)
      throw error
    }
  }

  // Reorder services
  async reorderServices(services) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.WEBSITE.SERVICE.REORDER, { services })
      return this.transformItemResponse(response?.data ?? { success: true })
    } catch (error) {
      console.error('Error reordering services:', error)
      throw error
    }
  }

  // ==================== PROJECT METHODS ====================

  // Get all projects (admin)
  async getProjects(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WEBSITE.PROJECT.LIST, {
        params: this.buildQueryParams(params),
      })

      return this.transformListResponse(response?.data)
    } catch (error) {
      console.error('Error fetching projects:', error)
      throw error
    }
  }

  // Get project by ID
  async getProjectById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WEBSITE.PROJECT.GET_BY_ID(id))
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.error('Error fetching project:', error)
      throw error
    }
  }

  // Create new project
  async createProject(projectData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.WEBSITE.PROJECT.CREATE, projectData)
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }

  // Update project
  async updateProject(id, projectData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.WEBSITE.PROJECT.UPDATE(id), projectData)
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  }

  // Delete project
  async deleteProject(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.WEBSITE.PROJECT.DELETE(id))
      return this.transformItemResponse(response?.data ?? { success: true })
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  }

  // ==================== HOME GALLERY METHODS ====================

  // Get all home gallery images (admin)
  async getHomeGallery(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WEBSITE.HOME_GALLERY.LIST, {
        params: this.buildQueryParams(params),
      })

      return this.transformListResponse(response?.data)
    } catch (error) {
      console.error('Error fetching home gallery:', error)
      throw error
    }
  }

  // Get home gallery image by ID
  async getHomeGalleryById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WEBSITE.HOME_GALLERY.GET_BY_ID(id))
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.error('Error fetching home gallery:', error)
      throw error
    }
  }

  // Create new home gallery image
  async createHomeGallery(galleryData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.WEBSITE.HOME_GALLERY.CREATE, galleryData)
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.error('Error creating home gallery:', error)
      throw error
    }
  }

  // Update home gallery image
  async updateHomeGallery(id, galleryData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.WEBSITE.HOME_GALLERY.UPDATE(id), galleryData)
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.error('Error updating home gallery:', error)
      throw error
    }
  }

  // Delete home gallery image
  async deleteHomeGallery(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.WEBSITE.HOME_GALLERY.DELETE(id))
      return this.transformItemResponse(response?.data ?? { success: true })
    } catch (error) {
      console.error('Error deleting home gallery:', error)
      throw error
    }
  }

  // ==================== TESTIMONIAL METHODS ====================

  // Get all testimonials (admin)
  async getTestimonials(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WEBSITE.TESTIMONIAL.LIST, {
        params: this.buildQueryParams(params),
      })

      return this.transformListResponse(response?.data)
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      throw error
    }
  }

  // Get testimonial by ID
  async getTestimonialById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WEBSITE.TESTIMONIAL.GET_BY_ID(id))
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.error('Error fetching testimonial:', error)
      throw error
    }
  }

  // Create new testimonial
  async createTestimonial(testimonialData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.WEBSITE.TESTIMONIAL.CREATE, testimonialData)
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.error('Error creating testimonial:', error)
      throw error
    }
  }

  // Update testimonial
  async updateTestimonial(id, testimonialData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.WEBSITE.TESTIMONIAL.UPDATE(id), testimonialData)
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.error('Error updating testimonial:', error)
      throw error
    }
  }

  // Delete testimonial
  async deleteTestimonial(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.WEBSITE.TESTIMONIAL.DELETE(id))
      return this.transformItemResponse(response?.data ?? { success: true })
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      throw error
    }
  }

  // ==================== GALLERY METHODS ====================

  // Get all gallery images (admin)
  async getGallery(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WEBSITE.GALLERY.LIST, {
        params: this.buildQueryParams(params),
      })

      return this.transformListResponse(response?.data)
    } catch (error) {
      console.error('Error fetching gallery:', error)
      throw error
    }
  }

  // Get gallery image by ID
  async getGalleryById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WEBSITE.GALLERY.GET_BY_ID(id))
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.error('Error fetching gallery:', error)
      throw error
    }
  }

  // Create new gallery image
  async createGallery(galleryData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.WEBSITE.GALLERY.CREATE, galleryData)
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.error('Error creating gallery:', error)
      throw error
    }
  }

  // Update gallery image
  async updateGallery(id, galleryData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.WEBSITE.GALLERY.UPDATE(id), galleryData)
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.error('Error updating gallery:', error)
      throw error
    }
  }

  // Delete gallery image
  async deleteGallery(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.WEBSITE.GALLERY.DELETE(id))
      return this.transformItemResponse(response?.data ?? { success: true })
    } catch (error) {
      console.error('Error deleting gallery:', error)
      throw error
    }
  }

  // ==================== GALLERY VIDEO METHODS ====================

  // Get all gallery videos (admin)
  async getGalleryVideos(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WEBSITE.GALLERY_VIDEO.LIST, {
        params: this.buildQueryParams(params),
      })

      return this.transformListResponse(response?.data)
    } catch (error) {
      console.error('Error fetching gallery videos:', error)
      throw error
    }
  }

  // Get gallery video by ID
  async getGalleryVideoById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WEBSITE.GALLERY_VIDEO.GET_BY_ID(id))
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.error('Error fetching gallery video:', error)
      throw error
    }
  }

  // Create new gallery video
  async createGalleryVideo(videoData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.WEBSITE.GALLERY_VIDEO.CREATE, videoData)
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.error('Error creating gallery video:', error)
      throw error
    }
  }

  // Update gallery video
  async updateGalleryVideo(id, videoData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.WEBSITE.GALLERY_VIDEO.UPDATE(id), videoData)
      return this.transformItemResponse(response?.data)
    } catch (error) {
      console.error('Error updating gallery video:', error)
      throw error
    }
  }

  // Delete gallery video
  async deleteGalleryVideo(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.WEBSITE.GALLERY_VIDEO.DELETE(id))
      return this.transformItemResponse(response?.data ?? { success: true })
    } catch (error) {
      console.error('Error deleting gallery video:', error)
      throw error
    }
  }

}

// Create and export singleton instance
const websiteService = new WebsiteService()
export default websiteService

