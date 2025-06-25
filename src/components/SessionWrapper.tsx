// components/SessionWrapper.tsx
"use client"

import { usePathname } from "next/navigation"
import { useSessionTimeout } from "@/hooks/useSessionTimeout"
import { SessionTimeoutModal } from "@/components/SessionTimeoutModal"

interface SessionWrapperProps {
  children: React.ReactNode
}

export function SessionWrapper({ children }: SessionWrapperProps) {
  const pathname = usePathname()
  
  // Pages that should NOT have session timeout
  const publicPages = ['/login', '/register', '/forgot-password', '/']
  
  // Check if current page should have session timeout
  const shouldHaveSessionTimeout = !publicPages.includes(pathname)

  const { showWarning, timeLeft, extendSession } = useSessionTimeout({
    timeout: 1 * 60 * 1000, // 1 minute for testing
    warningTime: 15 * 1000, // 15 seconds warning for testing
    enabled: shouldHaveSessionTimeout, // Only enable on protected pages
    onTimeout: () => {
      // Auto logout
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      localStorage.removeItem('i18nextLng')
      window.location.href = "/login"
    },
    onWarning: () => {
      // Optional: Play sound, send analytics, etc.
      console.log('Session warning triggered')
    }
  })

  const handleLogout = () => {
    // Manual logout
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    localStorage.removeItem('i18nextLng')
    window.location.href = "/login"
  }

  return (
    <>
      {children}
      {shouldHaveSessionTimeout && (
        <SessionTimeoutModal
          isOpen={showWarning}
          timeLeft={timeLeft}
          onExtend={extendSession}
          onLogout={handleLogout}
        />
      )}
    </>
  )
}