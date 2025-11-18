// Common File Upload Service
import apiClient from '../config/apiClient'
import { handleApiError } from '../utils/errorHandler'

class UploadService {
  /**
   * Upload a file using the common upload API
   * 
   * @param {File|string} file - File object or base64 string
   * @param {Object} options - Upload options
   * @param {string} options.module - Module name (e.g., 'users', 'settings', 'customers')
   * @param {string} options.folder - Folder name (e.g., 'avatars', 'logos', 'photos')
   * @param {string} [options.filename] - Optional custom filename
   * @param {string} [options.visibility='public'] - Visibility: 'public' or 'private'
   * @param {string} [options.existingPath] - Existing file path to replace
   * @returns {Promise<{success: boolean, data: Object, message: string}>}
   */
  async uploadFile(file, options = {}) {
    try {
      const {
        module,
        folder,
        filename = null,
        visibility = 'public',
        existingPath = null
      } = options

      // Validate required options
      if (!module || !folder) {
        return {
          success: false,
          data: null,
          message: 'Module and folder are required'
        }
      }

      // Prepare form data
      const formData = new FormData()
      
      // Handle file input (File object or base64 string)
      if (file instanceof File) {
        formData.append('file', file)
      } else if (typeof file === 'string' && file.startsWith('data:image/')) {
        // Base64 string
        formData.append('file_base64', file)
      } else {
        return {
          success: false,
          data: null,
          message: 'Invalid file format. Expected File object or base64 string.'
        }
      }

      // Add metadata
      formData.append('module', module)
      formData.append('folder', folder)
      formData.append('visibility', visibility)
      
      if (filename) {
        formData.append('filename', filename)
      }
      
      if (existingPath) {
        formData.append('existing_path', existingPath)
      }

      const response = await apiClient.post('/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data?.success && response.data?.data) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'File uploaded successfully'
        }
      }

      return {
        success: false,
        data: null,
        message: response.data?.message || 'Upload failed'
      }
    } catch (error) {
      console.error('Upload error:', error)
      return handleApiError(error)
    }
  }

  /**
   * Upload image for user avatar
   * 
   * @param {File|string} file - File object or base64 string
   * @param {number} userId - User ID for filename generation
   * @param {string} [existingPath] - Existing avatar path to replace
   * @returns {Promise<{success: boolean, data: Object, message: string}>}
   */
  async uploadAvatar(file, userId = null, existingPath = null) {
    let filename = null
    if (userId) {
      // Get file extension from file object or base64 string
      let extension = 'jpg' // default
      if (file instanceof File) {
        const fileName = file.name
        const lastDot = fileName.lastIndexOf('.')
        extension = lastDot > 0 ? fileName.substring(lastDot + 1).toLowerCase() : 'jpg'
      } else if (typeof file === 'string' && file.startsWith('data:image/')) {
        // Extract from base64 data URI
        const match = file.match(/^data:image\/(\w+);base64,/)
        if (match) {
          extension = match[1].toLowerCase()
        }
      }
      filename = `user_${userId}_${Date.now()}.${extension}`
    }
    return this.uploadFile(file, {
      module: 'users',
      folder: 'avatars',
      filename,
      visibility: 'public',
      existingPath
    })
  }

  /**
   * Upload business logo
   * 
   * @param {File|string} file - File object or base64 string
   * @param {string} [existingPath] - Existing logo path to replace
   * @returns {Promise<{success: boolean, data: Object, message: string}>}
   */
  async uploadLogo(file, existingPath = null) {
    const filename = `business_logo_${Date.now()}_${Math.random().toString(36).substring(7)}`
    return this.uploadFile(file, {
      module: 'settings',
      folder: 'logos',
      filename,
      visibility: 'public',
      existingPath
    })
  }

  /**
   * Upload customer photo
   * 
   * @param {File|string} file - File object or base64 string
   * @param {number} customerId - Customer ID for filename generation
   * @param {string} [existingPath] - Existing photo path to replace
   * @returns {Promise<{success: boolean, data: Object, message: string}>}
   */
  async uploadCustomerPhoto(file, customerId, existingPath = null) {
    const filename = `customer_${customerId}_${Date.now()}`
    return this.uploadFile(file, {
      module: 'customers',
      folder: 'photos',
      filename,
      visibility: 'public',
      existingPath
    })
  }

  /**
   * Upload order photo
   * 
   * @param {File|string} file - File object or base64 string
   * @param {number} orderId - Order ID for filename generation
   * @param {string} [existingPath] - Existing photo path to replace
   * @returns {Promise<{success: boolean, data: Object, message: string}>}
   */
  async uploadOrderPhoto(file, orderId, existingPath = null) {
    const filename = `order_${orderId}_${Date.now()}`
    return this.uploadFile(file, {
      module: 'orders',
      folder: 'photos',
      filename,
      visibility: 'public',
      existingPath
    })
  }

  /**
   * Upload package image
   * 
   * @param {File|string} file - File object or base64 string
   * @param {number} packageId - Package ID for filename generation
   * @param {string} [existingPath] - Existing image path to replace
   * @returns {Promise<{success: boolean, data: Object, message: string}>}
   */
  async uploadPackageImage(file, packageId, existingPath = null) {
    const filename = `package_${packageId}_${Date.now()}`
    return this.uploadFile(file, {
      module: 'packages',
      folder: 'images',
      filename,
      visibility: 'public',
      existingPath
    })
  }

  /**
   * Upload branch image
   * 
   * @param {File|string} file - File object or base64 string
   * @param {number} branchId - Branch ID for filename generation
   * @param {string} [existingPath] - Existing image path to replace
   * @returns {Promise<{success: boolean, data: Object, message: string}>}
   */
  async uploadBranchImage(file, branchId, existingPath = null) {
    const filename = `branch_${branchId}_${Date.now()}`
    return this.uploadFile(file, {
      module: 'branches',
      folder: 'images',
      filename,
      visibility: 'public',
      existingPath
    })
  }

  /**
   * Upload payment receipt
   * 
   * @param {File|string} file - File object or base64 string
   * @param {number} paymentId - Payment ID for filename generation
   * @param {string} [existingPath] - Existing receipt path to replace
   * @returns {Promise<{success: boolean, data: Object, message: string}>}
   */
  async uploadPaymentReceipt(file, paymentId, existingPath = null) {
    const filename = `payment_${paymentId}_${Date.now()}`
    return this.uploadFile(file, {
      module: 'payments',
      folder: 'receipts',
      filename,
      visibility: 'private',
      existingPath
    })
  }
}

// Create and export service instance
export const uploadService = new UploadService()

// Export class for testing
export { UploadService }

export default uploadService

