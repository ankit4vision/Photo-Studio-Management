// Settings Management Service
import apiClient from '../config/apiClient'
import { handleApiError } from '../utils/errorHandler'

class SettingsService {
  // Get all settings with optional filters
  async getSettings(params = {}) {
    try {
      const response = await apiClient.get('/global-settings/', { params })
      return {
        success: true,
        data: response.data,
        message: 'Settings fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Get settings by section
  async getSettingsBySection(section) {
    try {
      const response = await apiClient.get(`/global-settings/by-section/${encodeURIComponent(section)}`)
      return {
        success: true,
        data: response.data,
        message: 'Settings fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Get all sections with their settings
  async getAllSections() {
    try {
      const response = await apiClient.get('/global-settings/by-section')
      return {
        success: true,
        data: response.data,
        message: 'Sections fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Get setting by ID
  async getSettingById(id) {
    try {
      const response = await apiClient.get(`/global-settings/${id}`)
      return {
        success: true,
        data: response.data,
        message: 'Setting fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Get setting by key
  async getSettingByKey(key) {
    try {
      const response = await apiClient.get(`/global-settings/key/${encodeURIComponent(key)}`)
      return {
        success: true,
        data: response.data,
        message: 'Setting fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Create new setting
  async createSetting(settingData) {
    try {
      const response = await apiClient.post('/global-settings/', settingData)
      return {
        success: true,
        data: response.data,
        message: 'Setting created successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Update setting by ID
  async updateSetting(id, settingData) {
    try {
      const response = await apiClient.put(`/global-settings/${id}`, settingData)
      return {
        success: true,
        data: response.data,
        message: 'Setting updated successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Update setting by key
  async updateSettingByKey(key, settingData) {
    try {
      const response = await apiClient.put(`/global-settings/key/${encodeURIComponent(key)}`, settingData)
      return {
        success: true,
        data: response.data,
        message: 'Setting updated successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Save or update a single setting by key (used for auto-save on change)
  async saveSetting(key, section, value) {
    try {
      // First, try to get the setting to check if it exists
      const getResponse = await this.getSettingByKey(key)
      
      if (getResponse.success && getResponse.data) {
        // Setting exists - update it
        return await this.updateSettingByKey(key, { value: String(value) })
      } else {
        // Setting doesn't exist - create it
        return await this.createSetting({
          key: key,
          section: section,
          value: String(value)
        })
      }
    } catch (error) {
      // If getSettingByKey fails with 404, create the setting
      if (error.response?.status === 404) {
        return await this.createSetting({
          key: key,
          section: section,
          value: String(value)
        })
      }
      return handleApiError(error)
    }
  }

  // Delete setting by ID
  async deleteSetting(id) {
    try {
      await apiClient.delete(`/global-settings/${id}`)
      return {
        success: true,
        data: null,
        message: 'Setting deleted successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Delete setting by key
  async deleteSettingByKey(key) {
    try {
      await apiClient.delete(`/global-settings/key/${encodeURIComponent(key)}`)
      return {
        success: true,
        data: null,
        message: 'Setting deleted successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Update multiple settings at once (helper method)
  // This method will create settings if they don't exist, or update them if they do
  async updateAllSettings(settingsData) {
    try {
      // Define all settings that should exist with their mapping
      const settingsMapping = [
        // Tax & Pricing
        { key: 'defaultGstRate', section: 'Tax & Pricing', formPath: ['taxPricing', 'defaultGstRate'], type: 'number' },
        { key: 'defaultProfitMargin', section: 'Tax & Pricing', formPath: ['taxPricing', 'defaultProfitMargin'], type: 'number' },
        // Business Information
        { key: 'businessName', section: 'Business Information', formPath: ['businessInfo', 'businessName'], type: 'string' },
        { key: 'gstNumber', section: 'Business Information', formPath: ['businessInfo', 'gstNumber'], type: 'string' },
        { key: 'businessAddress', section: 'Business Information', formPath: ['businessInfo', 'businessAddress'], type: 'string' },
        // Email & Notification
        { key: 'supportEmail', section: 'Email & Notification', formPath: ['emailNotifications', 'supportEmail'], type: 'string' },
        { key: 'adminEmail', section: 'Email & Notification', formPath: ['emailNotifications', 'adminEmail'], type: 'string' },
        { key: 'enableOrderNotifications', section: 'Email & Notification', formPath: ['emailNotifications', 'enableOrderNotifications'], type: 'boolean' },
        // Currency & Regional
        { key: 'currency', section: 'Currency & Regional', formPath: ['currencyRegional', 'currency'], type: 'string' },
        { key: 'dateFormat', section: 'Currency & Regional', formPath: ['currencyRegional', 'dateFormat'], type: 'string' },
        { key: 'timeZone', section: 'Currency & Regional', formPath: ['currencyRegional', 'timeZone'], type: 'string' },
        // Security
        { key: 'sessionTimeout', section: 'Security', formPath: ['security', 'sessionTimeout'], type: 'number' },
        { key: 'passwordExpiry', section: 'Security', formPath: ['security', 'passwordExpiry'], type: 'number' },
        { key: 'enableTwoFactor', section: 'Security', formPath: ['security', 'enableTwoFactor'], type: 'boolean' }
      ]

      // Get all current settings to check what exists
      const currentSettingsResponse = await this.getAllSections()
      const existingSettingsMap = new Map()
      
      if (currentSettingsResponse.success && currentSettingsResponse.data) {
        currentSettingsResponse.data.forEach(section => {
          if (section.settings && Array.isArray(section.settings)) {
            section.settings.forEach(setting => {
              existingSettingsMap.set(setting.key, setting)
            })
          }
        })
      }

      const errors = []
      const successes = []

      // Process each setting mapping
      for (const mapping of settingsMapping) {
        try {
          // Get value from form data
          const formValue = settingsData[mapping.formPath[0]]?.[mapping.formPath[1]]
          
          // Convert value to string for API
          let stringValue = ''
          if (mapping.type === 'number') {
            stringValue = String(formValue ?? 0)
          } else if (mapping.type === 'boolean') {
            stringValue = String(formValue ?? false)
          } else {
            stringValue = String(formValue ?? '')
          }

          // Check if setting exists
          const existingSetting = existingSettingsMap.get(mapping.key)
          
          if (existingSetting) {
            // Setting exists - update it only if value changed
            const currentValue = existingSetting.value || ''
            if (currentValue !== stringValue) {
              const updateResponse = await this.updateSettingByKey(mapping.key, { value: stringValue })
              if (updateResponse.success) {
                successes.push(mapping.key)
              } else {
                errors.push({ key: mapping.key, error: updateResponse.message })
              }
            } else {
              // Value unchanged, skip update
              successes.push(mapping.key + ' (unchanged)')
            }
          } else {
            // Setting doesn't exist - create it
            const createResponse = await this.createSetting({
              key: mapping.key,
              section: mapping.section,
              value: stringValue
            })
            if (createResponse.success) {
              successes.push(mapping.key + ' (created)')
            } else {
              errors.push({ key: mapping.key, error: createResponse.message })
            }
          }
        } catch (err) {
          errors.push({ key: mapping.key, error: err.message || 'Unknown error' })
        }
      }

      if (errors.length > 0) {
        return {
          success: false,
          data: { successes, errors },
          message: `Some settings failed: ${errors.map(e => e.key).join(', ')}`
        }
    }

    return {
        success: true,
        data: { successes, errors: [] },
        message: 'All settings saved successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }

  // Helper method to find setting value in nested structure
  findSettingValue(settingsData, section, key) {
    // Map section names to settingsData keys
    const sectionMap = {
      'Tax & Pricing': 'taxPricing',
      'Business Information': 'businessInfo',
      'Email & Notification': 'emailNotifications',
      'Currency & Regional': 'currencyRegional',
      'Security': 'security'
    }

    const sectionKey = sectionMap[section]
    if (!sectionKey || !settingsData[sectionKey]) {
      return undefined
    }

    // Map API keys to form field names
    const keyMap = {
      'defaultGstRate': 'defaultGstRate',
      'defaultProfitMargin': 'defaultProfitMargin',
      'businessName': 'businessName',
      'gstNumber': 'gstNumber',
      'businessAddress': 'businessAddress',
      'supportEmail': 'supportEmail',
      'adminEmail': 'adminEmail',
      'enableOrderNotifications': 'enableOrderNotifications',
      'currency': 'currency',
      'dateFormat': 'dateFormat',
      'timeZone': 'timeZone',
      'sessionTimeout': 'sessionTimeout',
      'passwordExpiry': 'passwordExpiry',
      'enableTwoFactor': 'enableTwoFactor'
    }

    const fieldName = keyMap[key] || key
    return settingsData[sectionKey][fieldName]
  }

  // Transform API settings response to form structure
  transformSettingsToForm(apiSections) {
    // Define default values - these will be used if API response is empty or missing fields
    const formData = {
      taxPricing: {
        defaultGstRate: 15,
        defaultProfitMargin: 25
      },
      businessInfo: {
        businessName: 'Photo Studio Management',
        gstNumber: '',
        businessAddress: ''
      },
      emailNotifications: {
        supportEmail: '',
        adminEmail: '',
        enableOrderNotifications: false
      },
      currencyRegional: {
        currency: 'NZD',
        dateFormat: 'DD/MM/YYYY',
        timeZone: 'Pacific/Auckland'
      },
      security: {
        sessionTimeout: 30,
        passwordExpiry: 90,
        enableTwoFactor: false
      }
    }

    // Key mapping from API keys to form structure
    // Fields with 'useDefaultIfEmpty: true' will use default value if API returns empty string
    const keyMapping = {
      'defaultGstRate': { section: 'Tax & Pricing', field: 'taxPricing', prop: 'defaultGstRate', type: 'number', useDefaultIfEmpty: true },
      'defaultProfitMargin': { section: 'Tax & Pricing', field: 'taxPricing', prop: 'defaultProfitMargin', type: 'number', useDefaultIfEmpty: true },
      'businessName': { section: 'Business Information', field: 'businessInfo', prop: 'businessName', type: 'string', useDefaultIfEmpty: true },
      'gstNumber': { section: 'Business Information', field: 'businessInfo', prop: 'gstNumber', type: 'string', useDefaultIfEmpty: false },
      'businessAddress': { section: 'Business Information', field: 'businessInfo', prop: 'businessAddress', type: 'string', useDefaultIfEmpty: false },
      'supportEmail': { section: 'Email & Notification', field: 'emailNotifications', prop: 'supportEmail', type: 'string', useDefaultIfEmpty: false },
      'adminEmail': { section: 'Email & Notification', field: 'emailNotifications', prop: 'adminEmail', type: 'string', useDefaultIfEmpty: false },
      'enableOrderNotifications': { section: 'Email & Notification', field: 'emailNotifications', prop: 'enableOrderNotifications', type: 'boolean', useDefaultIfEmpty: true },
      'currency': { section: 'Currency & Regional', field: 'currencyRegional', prop: 'currency', type: 'string', useDefaultIfEmpty: true },
      'dateFormat': { section: 'Currency & Regional', field: 'currencyRegional', prop: 'dateFormat', type: 'string', useDefaultIfEmpty: true },
      'timeZone': { section: 'Currency & Regional', field: 'currencyRegional', prop: 'timeZone', type: 'string', useDefaultIfEmpty: true },
      'sessionTimeout': { section: 'Security', field: 'security', prop: 'sessionTimeout', type: 'number', useDefaultIfEmpty: true },
      'passwordExpiry': { section: 'Security', field: 'security', prop: 'passwordExpiry', type: 'number', useDefaultIfEmpty: true },
      'enableTwoFactor': { section: 'Security', field: 'security', prop: 'enableTwoFactor', type: 'boolean', useDefaultIfEmpty: true }
    }

    // If API response is null, undefined, or empty array, return defaults
    if (!apiSections || !Array.isArray(apiSections) || apiSections.length === 0) {
      return formData
    }

    // Process each section from API
    apiSections.forEach(section => {
      // Skip if section is invalid or has no settings
      if (!section || !section.settings || !Array.isArray(section.settings) || section.settings.length === 0) {
        return
      }

      // Process each setting in the section
      section.settings.forEach(setting => {
        // Skip if setting is invalid
        if (!setting || !setting.key) {
          return
        }

        const mapping = keyMapping[setting.key]
        if (!mapping || !formData[mapping.field]) {
          return
        }

        let value = setting.value
        
        // Handle null/undefined - always use default
        if (value === null || value === undefined) {
          return // Keep default value
        }

        // Handle empty string for fields that should use defaults
        if (mapping.useDefaultIfEmpty && value === '') {
          return // Keep default value
        }

        // Convert value based on type
        if (mapping.type === 'number') {
          const numValue = parseFloat(value)
          // If conversion fails, keep default; otherwise use parsed value or 0
          if (!isNaN(numValue)) {
            formData[mapping.field][mapping.prop] = numValue
          }
          // If NaN, keep default (don't update)
        } else if (mapping.type === 'boolean') {
          // Convert various boolean representations
          formData[mapping.field][mapping.prop] = (
            value === 'true' || 
            value === true || 
            value === '1' || 
            value === 1
          )
        } else {
          // String type - use the value (even if empty string, unless useDefaultIfEmpty is true)
          formData[mapping.field][mapping.prop] = value
        }
      })
    })

    return formData
  }
}

// Create and export service instance
export const settingsService = new SettingsService()

// Export class for testing
export { SettingsService }

export default settingsService
