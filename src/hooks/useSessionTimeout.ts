// hooks/useSessionTimeout.ts
import { useState, useEffect, useRef, useCallback } from 'react'

interface UseSessionTimeoutProps {
  timeout?: number // Total session timeout in milliseconds
  warningTime?: number // Warning time before timeout in milliseconds
  enabled?: boolean // Whether session timeout is enabled
  onTimeout?: () => void // Callback when session times out
  onWarning?: () => void // Callback when warning is triggered
  apiEndpoint?: string // Optional API endpoint to extend session
}

export const useSessionTimeout = ({
  timeout = 1 * 60 * 1000, // 1 minute default for testing
  warningTime = 15 * 1000, 
  enabled = true,
  onTimeout = () => {},
  onWarning = () => {},
  apiEndpoint = '/api/extend-session'
}: UseSessionTimeoutProps = {}) => {
  const [showWarning, setShowWarning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(warningTime / 1000)
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const warningRef = useRef<NodeJS.Timeout | null>(null)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)

  const resetTimer = useCallback(() => {
    if (!enabled) return

    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (warningRef.current) clearTimeout(warningRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
    
    setShowWarning(false)
    setTimeLeft(warningTime / 1000)

    // Set warning timer
    warningRef.current = setTimeout(() => {
      setShowWarning(true)
      setTimeLeft(warningTime / 1000)
      onWarning()

      // Start countdown
      countdownRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (countdownRef.current) clearInterval(countdownRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, timeout - warningTime)

    // Set timeout timer
    timeoutRef.current = setTimeout(() => {
      setShowWarning(false)
      onTimeout()
    }, timeout)
  }, [timeout, warningTime, onTimeout, onWarning, enabled])

  const extendSession = useCallback(async () => {
    if (!enabled) return

    try {
      // Optional: Call API to extend session on server
      // await fetch(apiEndpoint, { 
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      //     'Content-Type': 'application/json'
      //   }
      // })
      
      resetTimer()
      console.log('Session extended successfully')
    } catch (error) {
      console.error('Failed to extend session:', error)
      // Force logout on API failure
      onTimeout()
    }
  }, [resetTimer, apiEndpoint, onTimeout, enabled])

  useEffect(() => {
    if (!enabled) return

    resetTimer()

    // Reset timer on user activity
    const activityEvents = [
      'mousedown', 
      'keydown', 
      'scroll', 
      'touchstart',
      'click',
      'mousemove'
    ]
    
    const handleActivity = () => {
      if (enabled && !showWarning) {
        resetTimer()
      }
    }

    // Add event listeners for user activity
    activityEvents.forEach(event => 
      document.addEventListener(event, handleActivity, { passive: true })
    )

    // Cleanup function
    return () => {
      activityEvents.forEach(event => 
        document.removeEventListener(event, handleActivity)
      )
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (warningRef.current) clearTimeout(warningRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [resetTimer, enabled, showWarning])

  // Handle multiple tabs synchronization
  useEffect(() => {
    if (!enabled) return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sessionExtended') {
        resetTimer()
      } else if (e.key === 'sessionLogout') {
        onTimeout()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [resetTimer, onTimeout, enabled])

  // Sync session extension across tabs
  const extendSessionWithSync = useCallback(async () => {
    await extendSession()
    localStorage.setItem('sessionExtended', Date.now().toString())
  }, [extendSession])

  return {
    showWarning,
    timeLeft,
    extendSession: extendSessionWithSync,
    resetTimer,
    enabled
  }
}