// components/ui/line-chart.tsx
"use client"

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface LineChartProps {
  data: any[]
  xKey: string
  yKey: string
  height?: number
  color?: string
  useThemeColor?: boolean
  showGrid?: boolean
  showTooltip?: boolean
  showAxes?: boolean
  strokeWidth?: number
  className?: string
  tooltipFormatter?: (value: any, name: any) => [string | number, string]
  tooltipLabelFormatter?: (label: any) => string
}

// Convert OKLCH to hex color
const oklchToHex = (oklchValue: string): string => {
  // Simple fallback colors for OKLCH values
  if (oklchValue.includes('0.846') && oklchValue.includes('90')) {
    return '#fed049' // LeanX yellow
  }
  if (oklchValue.includes('0.25') && oklchValue.includes('284')) {
    return '#161346' // Payright purple
  }
      return '#171717' // Default dark gray fallback for light mode
}

// Get theme color with proper detection including dark mode
const getThemeColor = (): string => {
  if (typeof window === 'undefined') {
    return '#171717' // Default dark gray for SSR (assuming light mode)
  }

  const root = document.documentElement
  const classList = root.classList

  // Check if we're in dark mode
  const isDarkMode = classList.contains('dark')

  // Direct theme detection with correct colors
  if (classList.contains('theme-leanx')) {
    return '#fed049' // LeanX yellow (same for both modes)
  } else if (classList.contains('theme-payright')) {
    return '#161346' // Payright purple (same for both modes)
  }

  // For default theme, return appropriate gray based on mode
  if (isDarkMode) {
    return '#e5e5e5' // Light gray for dark mode
  } else {
    return '#171717' // Dark gray for light mode
  }
}

const SimpleLineChart: React.FC<LineChartProps> = ({
  data,
  xKey,
  yKey,
  height = 200,
  color = '#171717', // Default to dark gray for light mode
  useThemeColor = false,
  showGrid = true,
  showTooltip = true,
  showAxes = true,
  strokeWidth = 2,
  className = '',
  tooltipFormatter,
  tooltipLabelFormatter
}) => {
  // State to force re-render when theme changes
  const [themeColor, setThemeColor] = React.useState(color)

  // Effect to watch for theme changes
  React.useEffect(() => {
    if (!useThemeColor) {
      setThemeColor(color)
      return
    }

    const updateThemeColor = () => {
      const newColor = getThemeColor()
      setThemeColor(newColor)
    }

    // Initial color setting
    updateThemeColor()

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          updateThemeColor()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    // Also listen for style changes
    const styleObserver = new MutationObserver(() => {
      updateThemeColor()
    })

    const headElement = document.head
    if (headElement) {
      styleObserver.observe(headElement, {
        childList: true,
        subtree: true
      })
    }

    return () => {
      observer.disconnect()
      styleObserver.disconnect()
    }
  }, [useThemeColor, color])

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value
      const name = payload[0].name || payload[0].dataKey
      
      const [formattedValue, formattedName] = tooltipFormatter 
        ? tooltipFormatter(value, name)
        : [value, name]
      
      const formattedLabel = tooltipLabelFormatter 
        ? tooltipLabelFormatter(label)
        : label

      return (
        <div className="bg-background p-3 border border-border rounded-lg shadow-lg">
          <p className="font-medium text-sm text-foreground">{formattedLabel}</p>
          <p className="text-sm" style={{ color: themeColor }}>
            {formattedName}: {formattedValue}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="opacity-30"
              stroke="hsl(var(--border))"
            />
          )}
          
          {showAxes && (
            <>
              <XAxis 
                dataKey={xKey} 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
            </>
          )}
          
          {showTooltip && (
            <Tooltip content={<CustomTooltip />} />
          )}
          
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={themeColor}
            strokeWidth={strokeWidth}
            dot={{ fill: themeColor, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: themeColor, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SimpleLineChart