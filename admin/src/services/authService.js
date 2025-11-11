// Authentication Service - API calls for authentication
import apiClient from '../config/apiClient'
import { handleApiError } from '../utils/errorHandler'

const PERMISSION_ALIAS_MAP = {
  view_user: ['user:read'],
  create_user: ['user:write', 'user:manage'],
  edit_user: ['user:write', 'user:manage'],
  delete_user: ['user:delete', 'user:manage'],
  view_role: ['role:read'],
  create_role: ['role:write', 'role:manage'],
  edit_role: ['role:write', 'role:manage'],
  delete_role: ['role:delete', 'role:manage'],
  view_permission: ['role:read'],
  view_setting: ['settings:read'],
  edit_setting: ['settings:write'],
  view_branch: ['branch:read'],
  create_branch: ['branch:write', 'branch:manage'],
  edit_branch: ['branch:write', 'branch:manage'],
  delete_branch: ['branch:delete', 'branch:manage'],
}

const startCase = (value = '') =>
  value
    .toString()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const applyPermissionAliases = (permissionNames = []) => {
  const permissionSet = new Set(permissionNames)

  permissionNames.forEach((name) => {
    const aliases = PERMISSION_ALIAS_MAP[name]
    if (aliases) {
      aliases.forEach((alias) => permissionSet.add(alias))
    }
  })

  return Array.from(permissionSet)
}

const normalizeRole = (role) => ({
  id: role.id,
  name: role.name,
  description: role.description || '',
  isActive: role.is_active ?? true,
  isDeleted: role.is_deleted ?? false,
  createdAt: role.created_at || null,
  updatedAt: role.updated_at || null,
})

const normalizePermission = (permission) => ({
  id: permission.id,
  name: permission.name,
  label: permission.description || startCase(permission.name),
  description: permission.description || '',
  module: permission.module || 'general',
  submodule: permission.submodule || 'general',
  type: permission.type || null,
  isActive: permission.is_active ?? true,
  isDeleted: permission.is_deleted ?? false,
})

const normalizeUser = (apiUser, permissions = [], permissionsByModule = {}) => {
  const roles = Array.isArray(apiUser?.roles) ? apiUser.roles.map(normalizeRole) : []
  const primaryRole = roles[0] || null

  const permissionObjects = Array.isArray(permissions)
    ? permissions.map(normalizePermission)
    : []

  const canonicalPermissionNames = permissionObjects
    .filter((permission) => permission?.name)
    .map((permission) => permission.name)

  const permissionNamesWithAliases = applyPermissionAliases(canonicalPermissionNames)

  return {
    id: apiUser.id,
    firstName: apiUser.first_name || '',
    lastName: apiUser.last_name || '',
    email: apiUser.email || '',
    phone: apiUser.phone || '',
    status: apiUser.status || 'active',
    isActive: (apiUser.status || 'active') === 'active',
    address: apiUser.address || '',
    city: apiUser.city || '',
    country: apiUser.country || '',
    bio: apiUser.bio || '',
    role: primaryRole?.name || null,
    roleId: primaryRole?.id || null,
    roles,
    roleNames: roles.map((role) => role.name),
    permissions: permissionNamesWithAliases,
    permissionIdentifiers: canonicalPermissionNames,
    permissionObjects,
    permissionsByModule,
    createdAt: apiUser.created_at || null,
    updatedAt: apiUser.updated_at || null,
    fullName: [apiUser.first_name, apiUser.last_name].filter(Boolean).join(' ').trim(),
  }
}

const storeSession = (token, user) => {
  if (token) {
    localStorage.setItem('access_token', token)
  }

  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  }
}

const clearSession = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
}

const authService = {
  /**
   * Login user
   * @param {Object} credentials - User credentials { email, password }
   * @returns {Promise<{success: boolean, data?: {token: string, user: object}}>}
   */
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials)
      const { token, user, permissions, permissionsByModule } = response.data || {}

      if (!token || !user) {
        return {
          success: false,
          data: null,
          message: 'Invalid authentication response received from server.',
        }
      }

      const normalizedUser = normalizeUser(user, permissions, permissionsByModule)
      storeSession(token, normalizedUser)

      return {
        success: true,
        data: {
          token,
          user: normalizedUser,
        },
        message: 'Login successful',
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.error('[AuthService] Login failed', {
          status: error.response.status,
          data: error.response.data,
          email: credentials.email,
        })
      }

      clearSession()
      return handleApiError(error)
    }
  },

  /**
   * Logout user
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      // Log error but continue clearing the local session
      console.warn('[AuthService] Logout request failed', error)
    } finally {
      clearSession()
    }

    return {
      success: true,
      message: 'Logout successful',
    }
  },

  /**
   * Forgot password
   * @param {String} email - User email
   * @returns {Promise}
   */
  async forgotPassword(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email })
      return {
        success: true,
        data: response.data,
        message: response.data?.message || 'Password reset email sent',
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  /**
   * Fetch authenticated user using existing token
   * @returns {Promise<{success: boolean, data?: object}>}
   */
  async fetchCurrentUser() {
    try {
      const response = await apiClient.get('/auth/user')
      const { user, permissions, permissionsByModule } = response.data || {}

      if (!user) {
        return {
          success: false,
          data: null,
          message: 'Unable to load authenticated user.',
        }
      }

      const normalizedUser = normalizeUser(user, permissions, permissionsByModule)
      localStorage.setItem('user', JSON.stringify(normalizedUser))

      return {
        success: true,
        data: normalizedUser,
      }
    } catch (error) {
      if (error.response?.status === 401) {
        clearSession()
      }
      return handleApiError(error)
    }
  },

  /**
   * Check if user is authenticated
   * @returns {Boolean}
   */
  isAuthenticated() {
    const token = localStorage.getItem('access_token')
    return Boolean(token)
  },

  /**
   * Get stored auth token
   * @returns {String|null}
   */
  getToken() {
    return localStorage.getItem('access_token')
  },

  /**
   * Get stored user object (if any)
   * @returns {Object|null}
   */
  getStoredUser() {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('[AuthService] Failed to parse stored user', error)
      return null
    }
  },
}

export default authService

