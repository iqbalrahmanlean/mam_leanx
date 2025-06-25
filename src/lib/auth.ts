
"use client"

export interface UserData {
  email: string
  name: string
  loginTime: string
}

export const authUtils = {
  // Check if user is authenticated (client-side)
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false
    
    const authToken = getCookie('auth-token')
    const userSession = getCookie('user-session')
    
    return Boolean(authToken || userSession)
  },

  // Get user data from cookie
  getUserData: (): UserData | null => {
    if (typeof window === 'undefined') return null
    
    const userSession = getCookie('user-session')
    if (userSession) {
      try {
        return JSON.parse(userSession) as UserData
      } catch (error) {
        console.error('Failed to parse user session:', error)
        return null
      }
    }
    return null
  },

  // Set authentication data (called after successful login)
  setAuthData: (email: string, rememberMe: boolean = false) => {
    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7 // 30 days or 7 days
    
    // Set auth token
    const authToken = `demo-user-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    document.cookie = `auth-token=${authToken}; path=/; max-age=${maxAge}; SameSite=Lax`
    
    // Set user data
    const userData: UserData = {
      email: email,
      name: email.split('@')[0],
      loginTime: new Date().toISOString()
    }
    document.cookie = `user-session=${JSON.stringify(userData)}; path=/; max-age=${maxAge}; SameSite=Lax`
  },

  // Logout function
  logout: () => {
    // Clear auth cookies
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    document.cookie = 'user-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    
    // Clear any localStorage data if you use it
    if (typeof window !== 'undefined') {
      localStorage.removeItem('i18nextLng')
      // Add any other localStorage items you want to clear
      localStorage.clear() // Optional: clear all localStorage
    }
    
    // Redirect to login
    window.location.href = '/login'
  },

  // Check if remember me is set
  hasRememberMe: (): boolean => {
    if (typeof window === 'undefined') return false
    
    const authToken = getCookie('auth-token')
    return Boolean(authToken)
  },

  // Get auth token
  getAuthToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return getCookie('auth-token')
  },

  // Check if session is expired (optional feature)
  isSessionExpired: (): boolean => {
    const userData = authUtils.getUserData()
    if (!userData) return true
    
    const loginTime = new Date(userData.loginTime)
    const now = new Date()
    const diffHours = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)
    
    // Consider session expired after 24 hours of inactivity
    return diffHours > 24
  },

  // Refresh session (update login time)
  refreshSession: () => {
    const userData = authUtils.getUserData()
    if (userData) {
      userData.loginTime = new Date().toISOString()
      document.cookie = `user-session=${JSON.stringify(userData)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    }
  }
}

// Helper function to get cookie value
function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null
  
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue || null
  }
  return null
}

// Server-side cookie checker for middleware
export function getServerSideCookie(cookieString: string, name: string): string | null {
  if (!cookieString) return null
  
  const value = `; ${cookieString}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue || null
  }
  return null
}

// Utility function for login page
export const handleLogin = (email: string, password: string, rememberMe: boolean = false) => {
  // Your existing login validation logic here
  if (email === "demo@example.com" && password === "password123") {
    authUtils.setAuthData(email, rememberMe)
    return true
  }
  return false
}

// Utility function for logout (to be used in components)
export const handleLogout = () => {
  authUtils.logout()
}

// Hook to get current user (optional, for React components)
export const useAuth = () => {
  const [user, setUser] = React.useState<UserData | null>(null)
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  
  React.useEffect(() => {
    const userData = authUtils.getUserData()
    const authenticated = authUtils.isAuthenticated()
    
    setUser(userData)
    setIsAuthenticated(authenticated)
  }, [])
  
  return {
    user,
    isAuthenticated,
    logout: authUtils.logout,
    refreshSession: authUtils.refreshSession
  }
}

// Add React import for the hook
import React from 'react'