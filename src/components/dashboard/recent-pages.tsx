// components/dashboard/recent-pages.tsx
"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Clock,
  Home,
  Users,
  Package,
  FileText,
  Settings,
  CreditCard,
  DollarSign,
  PieChart,
  Layers,
  BarChart3,
  Calendar,
  Bell,
  User,
  ShoppingCart,
  Tags,
  TrendingUp,
  Archive,
  Eye,
  Truck,
  Gift,
  Mail,
  Target,
  Zap
} from "lucide-react"

interface RecentPage {
  href: string
  title: string
  iconName: string // Changed from icon to iconName
  timestamp: number
  visitCount: number
}

interface RecentPagesProps {
  isCollapsed?: boolean
  className?: string
  maxItems?: number
}

// Page mapping for titles and icon names (not the actual components)
const PAGE_CONFIG: Record<string, { title: string; iconName: string }> = {
  "/dashboard": { title: "Dashboard", iconName: "Home" },
  "/collection": { title: "Collection", iconName: "Layers" },
  "/collection/view": { title: "View Collection", iconName: "Eye" },
  "/collection/payments": { title: "View Payments", iconName: "CreditCard" },
  "/products": { title: "Products", iconName: "Package" },
  "/products/manage": { title: "Manage Products", iconName: "Package" },
  "/products/categories": { title: "Category Product", iconName: "Tags" },
  "/products/subcategories": { title: "Subcategory Product", iconName: "Archive" },
  "/customers": { title: "Customers", iconName: "Users" },
  "/accounts": { title: "Accounts", iconName: "User" },
  "/payout": { title: "Pay Out", iconName: "DollarSign" },
  "/poolfund": { title: "Pool Fund", iconName: "PieChart" },
  "/settlement": { title: "Settlement", iconName: "CreditCard" },
  "/report": { title: "Report", iconName: "FileText" },
  "/api": { title: "API Management", iconName: "Settings" },
  "/webhooks": { title: "Webhooks", iconName: "Zap" },
  "/integrations": { title: "Integrations", iconName: "Settings" },
  "/api-docs": { title: "API Docs", iconName: "FileText" },
  "/api-keys": { title: "API Keys", iconName: "Settings" },
  "/rate-limits": { title: "Rate Limits", iconName: "Settings" },
}

// Icon mapping to get actual components from names
const ICON_MAP: Record<string, any> = {
  Home,
  Users,
  Package,
  FileText,
  Settings,
  CreditCard,
  DollarSign,
  PieChart,
  Layers,
  BarChart3,
  Calendar,
  Bell,
  User,
  ShoppingCart,
  Tags,
  TrendingUp,
  Archive,
  Eye,
  Truck,
  Gift,
  Mail,
  Target,
  Zap
}

const STORAGE_KEY = "recent-pages"

export function RecentPages({ 
  isCollapsed = false, 
  className = "",
  maxItems = 3 
}: RecentPagesProps) {
  const [recentPages, setRecentPages] = useState<RecentPage[]>([])
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()

  // Get icon component from icon name
  const getIconComponent = (iconName: string) => {
    return ICON_MAP[iconName] || FileText // Fallback to FileText icon
  }

  // Ensure client-side only
  useEffect(() => {
    setIsClient(true)
    // Load recent pages from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setRecentPages(parsed)
      } catch (error) {
        console.error("Failed to parse recent pages:", error)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  // Track page visits
  useEffect(() => {
    if (!isClient || !pathname || pathname === '/') return

    const pageConfig = PAGE_CONFIG[pathname]
    if (!pageConfig) return

    const updateRecentPages = () => {
      const now = Date.now()
      
      setRecentPages(prev => {
        // Check if page already exists
        const existingIndex = prev.findIndex(page => page.href === pathname)
        
        let updated: RecentPage[]
        
        if (existingIndex >= 0) {
          // Update existing page
          updated = [...prev]
          updated[existingIndex] = {
            ...updated[existingIndex],
            timestamp: now,
            visitCount: updated[existingIndex].visitCount + 1
          }
        } else {
          // Add new page
          const newPage: RecentPage = {
            href: pathname,
            title: pageConfig.title,
            iconName: pageConfig.iconName, // Store icon name, not component
            timestamp: now,
            visitCount: 1
          }
          updated = [newPage, ...prev]
        }
        
        // Sort by timestamp (most recent first) and limit to maxItems
        updated = updated
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, maxItems)
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        
        return updated
      })
    }

    // Debounce the update to avoid too frequent calls
    const timeoutId = setTimeout(updateRecentPages, 1000)
    return () => clearTimeout(timeoutId)
  }, [pathname, maxItems, isClient])

  // Clear recent pages
  const clearRecentPages = () => {
    setRecentPages([])
    localStorage.removeItem(STORAGE_KEY)
  }

  // Format relative time
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(timestamp).toLocaleDateString()
  }

  // Don't render until client-side
  if (!isClient) {
    return null
  }

  // Don't render if no recent pages
  if (recentPages.length === 0) {
    return null
  }

  // Collapsed view
  if (isCollapsed) {
    return (
      <div className={`space-y-1 ${className}`}>
        {recentPages.map((page, index) => {
          const IconComponent = getIconComponent(page.iconName)
          const isCurrentPage = pathname === page.href
          
          return (
            <Link key={page.href} href={page.href}>
              <Button
                variant={isCurrentPage ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-center p-2 relative"
                title={`${page.title} - ${formatRelativeTime(page.timestamp)}`}
              >
                <IconComponent className="h-4 w-4" />
                {page.visitCount > 1 && (
                  <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5 text-xs">
                    {page.visitCount}
                  </Badge>
                )}
              </Button>
            </Link>
          )
        })}
      </div>
    )
  }

  // Expanded view
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Recent Pages
          </span>
        </div>
        {recentPages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearRecentPages}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Recent pages list */}
      <div className="space-y-1">
        {recentPages.map((page, index) => {
          const IconComponent = getIconComponent(page.iconName)
          const isCurrentPage = pathname === page.href
          
          return (
            <Link key={page.href} href={page.href}>
              <Button
                variant={isCurrentPage ? "secondary" : "ghost"}
                className="w-full justify-start h-auto p-2 relative group"
                size="sm"
              >
                <IconComponent className="mr-3 h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-foreground" />
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{page.title}</span>
                    <div className="flex items-center space-x-1 ml-2">
                      {page.visitCount > 1 && (
                        <Badge variant="outline" className="px-1 py-0 text-xs h-4">
                          {page.visitCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {formatRelativeTime(page.timestamp)}
                  </p>
                </div>
              </Button>
            </Link>
          )
        })}
      </div>

      {/* Show hint if user has visited many pages */}
      {recentPages.length >= maxItems && (
        <div className="px-2">
          <p className="text-xs text-muted-foreground">
            Showing {maxItems} most recent pages
          </p>
        </div>
      )}
    </div>
  )
}

// Hook for managing recent pages (optional - for external usage)
export function useRecentPages(maxItems = 3) {
  const [recentPages, setRecentPages] = useState<RecentPage[]>([])
  const pathname = usePathname()

  // Get icon component from icon name
  const getIconComponent = (iconName: string) => {
    return ICON_MAP[iconName] || FileText
  }

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setRecentPages(parsed)
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  const addPage = (href: string, title: string, iconName: string) => {
    const now = Date.now()
    setRecentPages(prev => {
      const existingIndex = prev.findIndex(page => page.href === href)
      let updated: RecentPage[]
      
      if (existingIndex >= 0) {
        updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          timestamp: now,
          visitCount: updated[existingIndex].visitCount + 1
        }
      } else {
        const newPage: RecentPage = { href, title, iconName, timestamp: now, visitCount: 1 }
        updated = [newPage, ...prev]
      }
      
      updated = updated
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, maxItems)
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const clearPages = () => {
    setRecentPages([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return { recentPages, addPage, clearPages }
}