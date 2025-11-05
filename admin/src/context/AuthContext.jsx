import React, { createContext, useContext, useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'
import apiService from '../api'
import authService from '../services/authService'

// Auth Context
const AuthContext = createContext()

// Auth Actions
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  LOAD_USER: 'LOAD_USER',
  UPDATE_USER: 'UPDATE_USER',
  SET_LOADING: 'SET_LOADING',
}

// Auth Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      }
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      }
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      }
    case AUTH_ACTIONS.LOAD_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      }
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    default:
      return state
  }
}

// Initial State
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUserFromStorage = () => {
      const token = localStorage.getItem('access_token')
      const user = localStorage.getItem('user')

      if (token && user) {
        try {
          const userData = JSON.parse(user)
          dispatch({
            type: AUTH_ACTIONS.LOAD_USER,
            payload: { user: userData, token },
          })
        } catch (error) {
          console.error('Error parsing user data:', error)
          localStorage.removeItem('access_token')
          localStorage.removeItem('user')
        }
      }
    }

    loadUserFromStorage()
  }, [])

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START })
    
    try {
      // Use real API authentication
      const response = await authService.login({
        email: credentials.email,
        password: credentials.password,
      })

      if (response.success && response.data) {
        const { user, token } = response.data

        // Map API user response to app user structure
        const mappedUser = {
          id: user.user_id,
          email: user.email,
          phone: user.phone,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.user_type === 'admin' ? 'admin' : 'user',
          permissions: user.user_type === 'admin' 
            ? ['user:read', 'user:write', 'user:delete', 'role:read', 'role:write', 'role:delete', 'dashboard:read', 'dashboard:write']
            : ['dashboard:read'],
          avatar: user.profile_image_url || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=22c55e&color=ffffff&size=40`,
          isActive: user.is_active,
          isVerified: user.is_verified,
          emailVerified: user.email_verified,
          phoneVerified: user.phone_verified,
          dateOfBirth: user.date_of_birth,
          gender: user.gender,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          lastLogin: user.last_login,
        }

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: mappedUser, token },
        })

        return { success: true, user: mappedUser }
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'Login failed'
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      })
      throw new Error(errorMessage)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.warn('Logout API call failed:', error)
      // Even if logout fails, clear local storage and dispatch logout
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      dispatch({ type: AUTH_ACTIONS.LOGOUT })
    }
  }

  // Update user function
  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData,
    })
  }

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!state.user || !state.user.permissions) return false
    return state.user.permissions.includes(permission)
  }

  // Check if user has role
  const hasRole = (role) => {
    if (!state.user) return false
    return state.user.role === role
  }

  // Check if user has any of the roles
  const hasAnyRole = (roles) => {
    if (!state.user) return false
    return roles.includes(state.user.role)
  }

  // Check if user has all permissions
  const hasAllPermissions = (permissions) => {
    if (!state.user || !state.user.permissions) return false
    return permissions.every(permission => state.user.permissions.includes(permission))
  }

  const value = {
    ...state,
    login,
    logout,
    updateUser,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllPermissions,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
