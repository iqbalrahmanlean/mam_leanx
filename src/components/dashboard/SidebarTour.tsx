// components/dashboard/SidebarTour.tsx
"use client"

import React, { useEffect, useState } from 'react'
import 'driver.js/dist/driver.css'
import { Button } from "@/components/ui/button"
import { HelpCircle, RotateCcw } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Tour hook for managing tour state
const useTour = () => {
  const [hasSeenTour, setHasSeenTour] = useState(false)

  // Check if user has seen the tour
  const checkTourStatus = (tourId: string): boolean => {
    try {
      const tourVersion = '1.0' // Increment this when you update the tour
      const storedVersion = localStorage.getItem(`tour-${tourId}-version`)
      return storedVersion === tourVersion
    } catch (error) {
      // Fallback to cookie if localStorage fails
      return document.cookie.includes(`tour_${tourId}_completed=true`)
    }
  }

  // Mark tour as completed
  const markTourCompleted = (tourId: string) => {
    try {
      const tourVersion = '1.0'
      localStorage.setItem(`tour-${tourId}-version`, tourVersion)
      localStorage.setItem(`tour-${tourId}-completed-date`, new Date().toISOString())
      setHasSeenTour(true)
    } catch (error) {
      // Fallback to cookie
      document.cookie = `tour_${tourId}_completed=true; max-age=${365*24*60*60}`
      setHasSeenTour(true)
    }
  }

  // Initialize and start tour
  const startTour = async (config: TourConfig) => {
    const { tourId, steps, showProgress = true, allowClose = true } = config

    // Check if tour should be shown
    if (checkTourStatus(tourId)) {
      return false // Tour already completed
    }

    try {
      // Dynamic import to avoid SSR issues
      const { driver } = await import('driver.js')
      
      const driverObj = driver({
        showProgress,
        allowClose,
        popoverClass: 'driverjs-theme-sidebar',
        progressText: 'Step {{current}} of {{total}}',
        nextBtnText: 'Next →',
        prevBtnText: '← Previous',
        doneBtnText: 'Finish Tour ✓',
        steps: steps.map(step => ({
          element: step.element,
          popover: {
            ...step.popover,
            side: step.popover.side || 'right',
            align: step.popover.align || 'start'
          }
        })),
        onDestroyed: () => {
          markTourCompleted(tourId)
        },
        onDeselected: () => {
          console.log('Tour was skipped or closed')
        }
      })

      driverObj.drive()
      return true // Tour was started
    } catch (error) {
      console.error('Failed to load driver.js:', error)
      return false
    }
  }

  // Force restart tour (for testing or manual trigger)
  const restartTour = (config: TourConfig) => {
    const { tourId } = config
    try {
      localStorage.removeItem(`tour-${tourId}-version`)
      localStorage.removeItem(`tour-${tourId}-completed-date`)
    } catch (error) {
      document.cookie = `tour_${tourId}_completed=; max-age=0`
    }
    setHasSeenTour(false)
    startTour(config)
  }

  return {
    startTour,
    restartTour,
    checkTourStatus,
    hasSeenTour
  }
}

interface TourStep {
  element: string
  popover: {
    title: string
    description: string
    side?: 'left' | 'right' | 'top' | 'bottom'
    align?: 'start' | 'center' | 'end'
  }
}

interface TourConfig {
  tourId: string
  steps: TourStep[]
  showProgress?: boolean
  allowClose?: boolean
}

interface SidebarTourProps {
  autoStart?: boolean
  delay?: number
  showTourButton?: boolean
}

export const SidebarTour: React.FC<SidebarTourProps> = ({ 
  autoStart = true, 
  delay = 2000,
  showTourButton = true
}) => {
  const { startTour, restartTour, checkTourStatus } = useTour()
  const [isLoaded, setIsLoaded] = useState(false)

  // Define tour steps based on your actual sidebar structure
  const sidebarTourSteps: TourStep[] = [
    {
      element: '[data-tour="sidebar-header"]',
      popover: {
        title: '🏠 Welcome to LeanX Dashboard',
        description: 'This is your main navigation sidebar. Here you can access all features of the LeanX Merchant Acquiring Module.',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '[data-tour="collapse-button"]',
      popover: {
        title: '📐 Sidebar Toggle',
        description: 'Click this button to collapse or expand the sidebar for more screen space. The sidebar will remember your preference.',
        side: 'right',
        align: 'center'
      }
    },
    {
      element: '[data-tour="dashboard-link"]',
      popover: {
        title: '📊 Dashboard',
        description: 'Your main dashboard with overview of sales metrics, payment analytics, and key performance indicators.',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '[data-tour="collection-link"]',
      popover: {
        title: '📋 Collection Management',
        description: 'Manage your payment collections and view payment transactions. Click to expand and see sub-options like "View Collection" and "View Payments".',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '[data-tour="product-link"]',
      popover: {
        title: '📦 Product Management',
        description: 'Manage your products, categories, and subcategories. Organize your inventory and product catalog efficiently.',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '[data-tour="customers-link"]',
      popover: {
        title: '👥 Customer Management',
        description: 'View and manage your customer database, track customer transactions, and analyze customer behavior.',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '[data-tour="accounts-link"]',
      popover: {
        title: '👤 Account Management',
        description: 'Manage user accounts, permissions, and access controls for your organization.',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '[data-tour="payout-link"]',
      popover: {
        title: '💰 Pay Out',
        description: 'Handle payouts to merchants, vendors, or partners. Track payout history and manage payment schedules.',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '[data-tour="poolfund-link"]',
      popover: {
        title: '💎 Pool Fund',
        description: 'Monitor your pool fund balance, transactions, and fund allocation across different payment channels.',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '[data-tour="settlement-link"]',
      popover: {
        title: '💳 Settlement',
        description: 'Track settlement transactions, reconcile payments, and manage banking settlement processes.',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '[data-tour="report-link"]',
      popover: {
        title: '📄 Reports',
        description: 'Generate detailed reports on sales, transactions, settlements, and business analytics.',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '[data-tour="api-link"]',
      popover: {
        title: '⚙️ API Management',
        description: 'Manage API keys, webhooks, and integration settings for your payment gateway.',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '[data-tour="user-profile"]',
      popover: {
        title: '👤 User Profile',
        description: 'Access your profile settings, account information, billing details, and logout options. Click to see more options.',
        side: 'right',
        align: 'end'
      }
    }
  ]

  const tourConfig: TourConfig = {
    tourId: 'sidebar-navigation',
    steps: sidebarTourSteps,
    showProgress: true,
    allowClose: true
  }

  useEffect(() => {
    setIsLoaded(true)
    
    if (autoStart && !checkTourStatus('sidebar-navigation')) {
      const timer = setTimeout(() => {
        startTour(tourConfig)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [autoStart, delay])

  const handleRestartTour = () => {
    restartTour(tourConfig)
  }

  const handleStartTour = () => {
    startTour(tourConfig)
  }

  if (!isLoaded) return null

  return (
    <>
      {/* Tour Button - Always visible for manual trigger */}
      {showTourButton && (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleStartTour}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Take Tour
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Start the sidebar navigation tour</p>
            </TooltipContent>
          </Tooltip>

          {/* Development only - Restart tour button */}
          {process.env.NODE_ENV === 'development' && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleRestartTour}
                  size="sm"
                  variant="outline"
                  className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Restart tour (Dev only)</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )}

      {/* Load driver.js CSS dynamically */}
      <style jsx global>{`
        @import url('https://cdn.jsdelivr.net/npm/driver.js@1.3.1/dist/driver.css');

        .driverjs-theme-sidebar .driver-popover {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          max-width: 320px;
          min-width: 280px;
        }

        .driverjs-theme-sidebar .driver-popover-title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .driverjs-theme-sidebar .driver-popover-description {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .driverjs-theme-sidebar .driver-popover-next-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .driverjs-theme-sidebar .driver-popover-next-btn:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .driverjs-theme-sidebar .driver-popover-prev-btn {
          background: transparent;
          color: #6b7280;
          border: 1px solid #d1d5db;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          margin-right: 12px;
          transition: all 0.2s;
          font-size: 14px;
        }

        .driverjs-theme-sidebar .driver-popover-prev-btn:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .driverjs-theme-sidebar .driver-popover-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 20px;
          color: #9ca3af;
          cursor: pointer;
          transition: color 0.2s;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .driverjs-theme-sidebar .driver-popover-close-btn:hover {
          color: #ef4444;
        }

        .driverjs-theme-sidebar .driver-popover-progress-text {
          font-size: 12px;
          color: #9ca3af;
          margin-bottom: 16px;
          text-align: center;
          font-weight: 500;
        }

        .driverjs-theme-sidebar .driver-popover-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
        }

        /* Custom highlight style */
        .driver-highlighted-element {
          background: transparent !important;
          border: 2px solid #3b82f6 !important;
          border-radius: 8px !important;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
        }

        /* Overlay styling */
        .driver-overlay {
          background: rgba(0, 0, 0, 0.5) !important;
          backdrop-filter: blur(2px);
        }

        /* Dark mode support */
        .dark .driverjs-theme-sidebar .driver-popover {
          background: #1f2937;
          border-color: #374151;
          color: #f9fafb;
        }

        .dark .driverjs-theme-sidebar .driver-popover-title {
          color: #f9fafb;
        }

        .dark .driverjs-theme-sidebar .driver-popover-description {
          color: #d1d5db;
        }

        .dark .driverjs-theme-sidebar .driver-popover-prev-btn {
          background: transparent;
          color: #d1d5db;
          border-color: #4b5563;
        }

        .dark .driverjs-theme-sidebar .driver-popover-prev-btn:hover {
          background: #374151;
          border-color: #6b7280;
        }
      `}</style>
    </>
  )
}

// Updated Sidebar component with tour data attributes
// Add these data-tour attributes to your existing sidebar.tsx

/*
INTEGRATION INSTRUCTIONS:

1. Install driver.js:
   npm install driver.js

2. Add these data-tour attributes to your sidebar.tsx:

   - Add data-tour="sidebar-header" to the header div containing the logo
   - Add data-tour="collapse-button" to the collapse/expand button
   - Add data-tour="dashboard-link" to the dashboard link/button
   - Add data-tour="collection-link" to the collection link/button
   - Add data-tour="product-link" to the product link/button
   - Add data-tour="customers-link" to the customers link/button
   - Add data-tour="accounts-link" to the accounts link/button
   - Add data-tour="payout-link" to the payout link/button
   - Add data-tour="poolfund-link" to the poolfund link/button
   - Add data-tour="settlement-link" to the settlement link/button
   - Add data-tour="report-link" to the report link/button
   - Add data-tour="api-link" to the api link/button
   - Add data-tour="user-profile" to the user profile dropdown trigger

3. Import and use in your layout:
   import { SidebarTour } from '@/components/dashboard/SidebarTour'

4. Add the component to your dashboard layout:
   <SidebarTour autoStart={true} delay={3000} showTourButton={true} />

5. Example of how to add data-tour attributes to your sidebar items:

   // For the header
   <div data-tour="sidebar-header" className="flex items-center justify-between p-4...">

   // For the collapse button
   <Button
     data-tour="collapse-button"
     variant="ghost"
     size="sm"
     onClick={() => setIsCollapsed(!isCollapsed)}
     className="p-1"
   >

   // For menu items, modify the renderNavigationItem function:
   <Link key={item.id} href={item.href}>
     <Button
       data-tour={`${item.id}-link`}
       variant={active ? "secondary" : "ghost"}
       className="w-full justify-start h-auto p-3"
     >

   // For user profile
   <DropdownMenuTrigger data-tour="user-profile" asChild>

*/

export default SidebarTour