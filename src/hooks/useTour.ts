// hooks/useTour.ts
import { useState, useEffect } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

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
  // Removed overlayClickNext as it doesn't exist in driver.js Config
}

export const useTour = () => {
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
    } catch (error) {
      // Fallback to cookie
      document.cookie = `tour_${tourId}_completed=true; max-age=${365*24*60*60}`
    }
  }

  // Initialize and start tour
  const startTour = (config: TourConfig) => {
    const { tourId, steps, showProgress = true, allowClose = true } = config

    // Check if tour should be shown
    if (checkTourStatus(tourId)) {
      return false // Tour already completed
    }

    const driverObj = driver({
      showProgress,
      allowClose,
      // Removed overlayClickNext as it's not a valid driver.js option
      popoverClass: 'driverjs-theme',
      progressText: 'Step {{current}} of {{total}}',
      nextBtnText: 'Next →',
      prevBtnText: '← Previous',
      doneBtnText: 'Finish Tour ✓',
      steps: steps.map(step => ({
        element: step.element,
        popover: {
          ...step.popover,
          side: step.popover.side || 'bottom',
          align: step.popover.align || 'start'
        }
      })),
      onDestroyed: () => {
        markTourCompleted(tourId)
        setHasSeenTour(true)
      },
      onDeselected: () => {
        // Optional: track if user skips the tour
        console.log('Tour was skipped or closed')
      }
    })

    driverObj.drive()
    return true // Tour was started
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
    startTour(config)
  }

  return {
    startTour,
    restartTour,
    checkTourStatus,
    hasSeenTour
  }
}