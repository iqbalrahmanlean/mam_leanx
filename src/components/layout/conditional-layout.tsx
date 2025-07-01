"use client"

import { usePathname } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Pages that should NOT have the dashboard layout
  const publicPages = ['/login', '/register', '/forgot-password', '/ui' , '/otp-demo']
  
  // Check if current page should have dashboard layout
  const shouldShowDashboardLayout = !publicPages.includes(pathname)

  if (shouldShowDashboardLayout) {
    return <AppLayout>{children}</AppLayout>
  }

  // For login, register, etc. - just show the page without sidebar
  return <>{children}</>
}