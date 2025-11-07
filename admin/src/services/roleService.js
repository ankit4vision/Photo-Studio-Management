import apiService from '../api'
import { API_ENDPOINTS } from '../constants/api'

const mapRole = (role = {}) => ({
  ...role,
  isActive: role.status === true || role.status === 1,
  createdAt: role.created_at || role.createdAt,
  updatedAt: role.updated_at || role.updatedAt,
  permissions: role.permissions || [],
})

const extractPayload = (response) => response?.data ?? response

export const roleService = {
  async getRoles() {
    const payload = extractPayload(await apiService.get(API_ENDPOINTS.ROLES.LIST))
    const roles = Array.isArray(payload?.data)
      ? payload.data.map(mapRole)
      : (Array.isArray(payload) ? payload.map(mapRole) : [])

    return {
      success: payload?.success ?? true,
      data: roles,
      message: payload?.message ?? 'Roles fetched successfully',
    }
  },

  async getRoleById(id) {
    const payload = extractPayload(await apiService.get(API_ENDPOINTS.ROLES.GET_BY_ID(id)))
    return {
      success: payload?.success ?? true,
      data: mapRole(payload?.data ?? payload),
      message: payload?.message ?? 'Role fetched successfully',
    }
  },

  async createRole(roleData) {
    const payload = extractPayload(await apiService.post(API_ENDPOINTS.ROLES.CREATE, roleData))
    return {
      success: payload?.success ?? true,
      data: mapRole(payload?.data ?? payload),
      message: payload?.message ?? 'Role created successfully',
    }
  },

  async updateRole(id, roleData) {
    const payload = extractPayload(await apiService.put(API_ENDPOINTS.ROLES.UPDATE(id), roleData))
    return {
      success: payload?.success ?? true,
      data: mapRole(payload?.data ?? payload),
      message: payload?.message ?? 'Role updated successfully',
    }
  },

  async deleteRole(id) {
    const payload = extractPayload(await apiService.delete(API_ENDPOINTS.ROLES.DELETE(id)))
    return {
      success: payload?.success ?? true,
      data: payload?.data ?? null,
      message: payload?.message ?? 'Role deleted successfully',
    }
  },
}

export default roleService