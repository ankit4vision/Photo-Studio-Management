import rolesData from '../mock/roles.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const roleService = {
  // Get all roles
  async getRoles() {
    return {
      success: true,
      data: rolesData,
      message: 'Roles fetched successfully'
    }
  },

  // Get role by ID
  async getRoleById(id) {
    const role = rolesData.find(r => r.id === parseInt(id))
    if (role) {
      return {
        success: true,
        data: role,
        message: 'Role fetched successfully'
      }
    } else {
      return {
        success: false,
        data: null,
        message: 'Role not found'
      }
    }
  },

  // Create new role
  async createRole(roleData) {
    await delay(800)
    
    // Generate unique ID
    const existingIds = rolesData.map(r => parseInt(r.id)).filter(id => !isNaN(id))
    const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1
    
    const newRole = {
      id: newId,
      ...roleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // In a real app, this would be saved to the backend
    rolesData.push(newRole)
    
    return {
      success: true,
      data: newRole,
      message: 'Role created successfully'
    }
  },

  // Update role
  async updateRole(id, roleData) {
    await delay(600)
    const roleIndex = rolesData.findIndex(r => r.id === parseInt(id))
    
    if (roleIndex !== -1) {
      rolesData[roleIndex] = {
        ...rolesData[roleIndex],
        ...roleData,
        updatedAt: new Date().toISOString()
      }
      
      return {
        success: true,
        data: rolesData[roleIndex],
        message: 'Role updated successfully'
      }
    } else {
      return {
        success: false,
        data: null,
        message: 'Role not found'
      }
    }
  },

  // Delete role
  async deleteRole(id) {
    await delay(400)
    const roleIndex = rolesData.findIndex(r => r.id === parseInt(id))
    
    if (roleIndex !== -1) {
      const deletedRole = rolesData.splice(roleIndex, 1)[0]
      return {
        success: true,
        data: deletedRole,
        message: 'Role deleted successfully'
      }
    } else {
      return {
        success: false,
        data: null,
        message: 'Role not found'
      }
    }
  },

  // Get permissions
  async getPermissions() {
    await delay(200)
    const permissions = [
      { id: 'user:read', label: 'Read Users', category: 'User Management' },
      { id: 'user:write', label: 'Create/Edit Users', category: 'User Management' },
      { id: 'user:delete', label: 'Delete Users', category: 'User Management' },
      { id: 'role:read', label: 'Read Roles', category: 'Role Management' },
      { id: 'role:write', label: 'Create/Edit Roles', category: 'Role Management' },
      { id: 'role:delete', label: 'Delete Roles', category: 'Role Management' },
      { id: 'dashboard:read', label: 'View Dashboard', category: 'System Access' },
      { id: 'dashboard:write', label: 'Edit Dashboard', category: 'System Access' },
      { id: 'settings:access', label: 'System Settings', category: 'System Access' },
      { id: 'reports:read', label: 'View Reports', category: 'Reports' },
      { id: 'reports:write', label: 'Create Reports', category: 'Reports' }
    ]
    
    return {
      success: true,
      data: permissions,
      message: 'Permissions fetched successfully'
    }
  }
}

export default roleService