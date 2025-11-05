import { useState, useEffect, useCallback } from 'react'
import apiService from '../api'

// useAuth Hook - Authentication state management
export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user

  // Login function
  const login = useCallback(async (credentials) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiService.login(credentials)
      setUser(response.user)
      setToken(response.token)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    setLoading(true)
    try {
      await apiService.logout()
    } finally {
      setUser(null)
      setToken(null)
      setError(null)
      setLoading(false)
    }
  }, [])

  // Update user function
  const updateUser = useCallback((userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }, [])

  // Check permissions
  const hasPermission = useCallback((permission) => {
    if (!user || !user.permissions) return false
    return user.permissions.includes(permission)
  }, [user])

  const hasRole = useCallback((role) => {
    if (!user) return false
    return user.role === role
  }, [user])

  const hasAnyRole = useCallback((roles) => {
    if (!user) return false
    return roles.includes(user.role)
  }, [user])

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    updateUser,
    hasPermission,
    hasRole,
    hasAnyRole,
  }
}

// useApi Hook - API request management
export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (apiCall) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiCall()
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    request,
  }
}

// useLocalStorage Hook - Local storage management
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

// useDebounce Hook - Debounced values
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// useToggle Hook - Boolean state toggle
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => setValue(prev => !prev), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return [value, { toggle, setTrue, setFalse }]
}

// usePermissions Hook - Permission checking
export const usePermissions = () => {
  const { user } = useAuth()

  const hasPermission = useCallback((permission) => {
    if (!user || !user.permissions) return false
    return user.permissions.includes(permission)
  }, [user])

  const hasAnyPermission = useCallback((permissions) => {
    if (!user || !user.permissions) return false
    return permissions.some(permission => user.permissions.includes(permission))
  }, [user])

  const hasAllPermissions = useCallback((permissions) => {
    if (!user || !user.permissions) return false
    return permissions.every(permission => user.permissions.includes(permission))
  }, [user])

  const hasRole = useCallback((role) => {
    if (!user) return false
    return user.role === role
  }, [user])

  const hasAnyRole = useCallback((roles) => {
    if (!user) return false
    return roles.includes(user.role)
  }, [user])

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    user,
  }
}

// useUserManagement Hook - User management operations
export const useUserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiService.get('/users', { params })
      setUsers(response.data)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createUser = useCallback(async (userData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiService.post('/users', userData)
      setUsers(prev => [...prev, response.data])
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUser = useCallback(async (userId, userData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiService.put(`/users/${userId}`, userData)
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...response.data } : user
      ))
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteUser = useCallback(async (userId) => {
    setLoading(true)
    setError(null)
    
    try {
      await apiService.delete(`/users/${userId}`)
      setUsers(prev => prev.filter(user => user.id !== userId))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  }
}

// useRoleManagement Hook - Role management operations
export const useRoleManagement = () => {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchRoles = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiService.get('/roles')
      setRoles(response.data)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createRole = useCallback(async (roleData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiService.post('/roles', roleData)
      setRoles(prev => [...prev, response.data])
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateRole = useCallback(async (roleId, roleData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiService.put(`/roles/${roleId}`, roleData)
      setRoles(prev => prev.map(role => 
        role.id === roleId ? { ...role, ...response.data } : role
      ))
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteRole = useCallback(async (roleId) => {
    setLoading(true)
    setError(null)
    
    try {
      await apiService.delete(`/roles/${roleId}`)
      setRoles(prev => prev.filter(role => role.id !== roleId))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    roles,
    loading,
    error,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
  }
}

export default {
  useAuth,
  useApi,
  useLocalStorage,
  useDebounce,
  useToggle,
  usePermissions,
  useUserManagement,
  useRoleManagement,
}
