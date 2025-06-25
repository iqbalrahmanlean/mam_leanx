"use client"

import React, { useState, useCallback, useEffect, useMemo } from "react"
import SimpleLineChart from '@/components/ui/line-chart'

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"
import {
  Home,
  Settings,
  RefreshCw,
  ChevronDown,
  ArrowUpDown,
  Columns,
  Eye,
  Check,
  Copy,
  Edit,
  Trash2,
  Download,
  ExternalLink,
  FileText,
  Share2
} from "lucide-react"

type Payment = {
  paymentDate: string
  referenceNumber: string
  collection: string
  invoice: string
  paymentMethod: string
  amount: string
  currency: string
}

// Theme detection hook
const useCurrentTheme = () => {
  const [currentTheme, setCurrentTheme] = useState('default')
  
  useEffect(() => {
    const detectTheme = () => {
      if (typeof window !== 'undefined') {
        const root = document.documentElement
        const classList = root.classList
        
        if (classList.contains('theme-leanx')) {
          setCurrentTheme('leanx')
        } else if (classList.contains('theme-payright')) {
          setCurrentTheme('payright')
        } else {
          setCurrentTheme('default')
        }
      }
    }
    
    detectTheme()
    
    // Listen for theme changes
    const observer = new MutationObserver(detectTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])
  
  return currentTheme
}

// Move viewPresets outside component to prevent recreation
const VIEW_PRESETS = {
  essential: {
    name: "Essential View",
    icon: "📊",
    description: "Payment Date, Invoice No, Amount",
    columns: {
      paymentDate: true,
      invoice: true,
      amount: true,
      referenceNumber: false,
      collection: false,
      paymentMethod: false,
    }
  },
  financial: {
    name: "Financial View",
    icon: "💰",
    description: "Payment Date, Invoice No, Amount, Reference No",
    columns: {
      paymentDate: true,
      invoice: true,
      amount: true,
      referenceNumber: true,
      collection: false,
      paymentMethod: false,
    }
  },
  operations: {
    name: "Operations View",
    icon: "📄",
    description: "Payment Date, Invoice No, Collection, Payment Method",
    columns: {
      paymentDate: true,
      invoice: true,
      collection: true,
      paymentMethod: true,
      referenceNumber: false,
      amount: false,
    }
  },
  full: {
    name: "Full Details",
    icon: "🔍",
    description: "All columns",
    columns: {
      paymentDate: true,
      referenceNumber: true,
      collection: true,
      invoice: true,
      paymentMethod: true,
      amount: true,
    }
  }
} as const

// Default column visibility - separate constant
const DEFAULT_COLUMN_VISIBILITY: VisibilityState = {
  paymentDate: true,
  referenceNumber: true,
  collection: true,
  invoice: true,
  paymentMethod: true,
  amount: true,
}

export default function DashboardPage() {
  const currentTheme = useCurrentTheme()
  
  // State with proper defaults
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(DEFAULT_COLUMN_VISIBILITY)
  const [currentView, setCurrentView] = useState<string>('full')

  // Sample data - memoized to prevent recreation
  const poolData = useMemo(() => ({
    payout: { amount: "184037.04", currency: "MYR" },
    collection: { amount: "407438.18", currency: "MYR" }
  }), [])

  // Theme-aware color generator
  const getThemeColors = useMemo(() => {
    switch (currentTheme) {
      case 'leanx':
        return {
          primary: '#fed049',      // LeanX main color
          secondary: '#ffd319',    // Lighter yellow
          accent: '#e6c043',       // Darker yellow
          success: '#f5d563',      // Success yellow
          warning: '#ffdc5c',      // Warning yellow
          info: '#f0c930',         // Info yellow
          chart1: '#fed049',
          chart2: '#ffd319',
          chart3: '#e6c043',
          chart4: '#f5d563',
          chart5: '#ffdc5c',
          chart6: '#f0c930',
        }
      case 'payright':
        return {
          primary: '#161346',      // Payright main color
          secondary: '#1f1a5c',    // Lighter purple
          accent: '#0d0e35',       // Darker purple
          success: '#252065',      // Success purple
          warning: '#2a2470',      // Warning purple
          info: '#1a1750',         // Info purple
          chart1: '#161346',
          chart2: '#1f1a5c',
          chart3: '#252065',
          chart4: '#2a2470',
          chart5: '#1a1750',
          chart6: '#0d0e35',
        }
      default:
        return {
          primary: '#059669',
          secondary: '#8b5cf6',
          accent: '#f59e0b',
          success: '#ef4444',
          warning: '#06b6d4',
          info: '#6b7280',
          chart1: '#059669',
          chart2: '#8b5cf6',
          chart3: '#f59e0b',
          chart4: '#ef4444',
          chart5: '#06b6d4',
          chart6: '#6b7280',
        }
    }
  }, [currentTheme])

  const salesMetrics = useMemo(() => [
    {
      title: "Total Sales (All Time)",
      amount: "483,604.67",
      currency: "MYR",
      hasChart: true,
      chartColor: getThemeColors.chart1,
      useThemeColor: true,
      chartData: [
        { time: '2010', value: 12500 },
        { time: '2011', value: 18200 },
        { time: '2012', value: 24800 },
        { time: '2013', value: 31200 },
        { time: '2014', value: 28900 },
        { time: '2015', value: 35600 },
        { time: '2016', value: 42100 },
        { time: '2017', value: 38750 },
        { time: '2018', value: 45300 },
        { time: '2019', value: 52800 },
        { time: '2020', value: 28400 },    // Lower due to pandemic
        { time: '2021', value: 35900 },    // Recovery
        { time: '2022', value: 48200 },
        { time: '2023', value: 55400 },
        { time: '2024', value: 62300 },
        { time: '2025', value: 337218 }    // Current year total so far
      ]
    },
    {
      title: "Total Sales Today (18 Jun 2025)",
      amount: "47.00",
      currency: "MYR",
      hasChart: true,
      chartColor: getThemeColors.chart2,
      useThemeColor: true,
      chartData: [
        { time: '12AM', value: 0 },
        { time: '1AM', value: 0 },
        { time: '2AM', value: 0 },
        { time: '3AM', value: 0 },
        { time: '4AM', value: 0 },
        { time: '5AM', value: 0 },
        { time: '6AM', value: 0 },
        { time: '7AM', value: 3 },
        { time: '8AM', value: 7 },
        { time: '9AM', value: 15 },
        { time: '10AM', value: 18 },
        { time: '11AM', value: 22 },
        { time: '12PM', value: 28 },
        { time: '1PM', value: 25 },
        { time: '2PM', value: 22 },
        { time: '3PM', value: 22 },
        { time: '4PM', value: 28 },
        { time: '5PM', value: 32 },
        { time: '6PM', value: 35 },
        { time: '7PM', value: 38 },
        { time: '8PM', value: 42 },
        { time: '9PM', value: 47 },
        { time: '10PM', value: 47 },
        { time: '11PM', value: 47 }
      ]
    },
    {
      title: "Total Sales Yesterday (17 Jun 2025)",
      amount: "48.00",
      currency: "MYR",
      hasChart: true,
      chartColor: getThemeColors.chart3,
      useThemeColor: true,
      chartData: [
        { time: '00:00', value: 0 },    // Midnight - no sales
        { time: '01:00', value: 0 },    // 1 AM - no sales
        { time: '02:00', value: 0 },    // 2 AM - no sales
        { time: '03:00', value: 0 },    // 3 AM - no sales
        { time: '04:00', value: 0 },    // 4 AM - no sales
        { time: '05:00', value: 0 },    // 5 AM - no sales
        { time: '06:00', value: 0 },    // 6 AM - no sales
        { time: '07:00', value: 2 },    // 7 AM - early morning
        { time: '08:00', value: 5 },    // 8 AM - morning start
        { time: '09:00', value: 12 },   // 9 AM - business hours
        { time: '10:00', value: 15 },   // 10 AM - picking up
        { time: '11:00', value: 18 },   // 11 AM - pre-lunch
        { time: '12:00', value: 25 },   // 12 PM - lunch peak
        { time: '13:00', value: 22 },   // 1 PM - post lunch
        { time: '14:00', value: 20 },   // 2 PM - afternoon
        { time: '15:00', value: 18 },   // 3 PM - mid afternoon
        { time: '16:00', value: 24 },   // 4 PM - picking up
        { time: '17:00', value: 28 },   // 5 PM - after work
        { time: '18:00', value: 32 },   // 6 PM - dinner time
        { time: '19:00', value: 35 },   // 7 PM - evening peak
        { time: '20:00', value: 40 },   // 8 PM - peak hours
        { time: '21:00', value: 48 },   // 9 PM - end of day total
        { time: '22:00', value: 48 },   // 10 PM - no new sales
        { time: '23:00', value: 48 }    // 11 PM - no new sales
      ]
    },
    {
      title: "Total Sales (Last 7 Days)",
      amount: "5,095.00",
      currency: "MYR",
      hasChart: true,
      chartColor: getThemeColors.chart4,
      useThemeColor: true,
      chartData: [
        { time: 'Mon', value: 680 },
        { time: 'Tue', value: 750 },
        { time: 'Wed', value: 620 },
        { time: 'Thu', value: 890 },
        { time: 'Fri', value: 720 },
        { time: 'Sat', value: 850 },
        { time: 'Sun', value: 585 }
      ]
    },
    {
      title: "Total Sales This Month (Jun 2025)",
      amount: "153,781.90",
      currency: "MYR",
      hasChart: true,
      chartColor: getThemeColors.chart5,
      useThemeColor: true,
      chartData: [
        { time: 'Jun 1', value: 4500 },
        { time: 'Jun 2', value: 5200 },
        { time: 'Jun 3', value: 4800 },
        { time: 'Jun 4', value: 6100 },
        { time: 'Jun 5', value: 5500 },
        { time: 'Jun 6', value: 4900 },
        { time: 'Jun 7', value: 5300 },
        { time: 'Jun 8', value: 4700 },
        { time: 'Jun 9', value: 5800 },
        { time: 'Jun 10', value: 6200 },
        { time: 'Jun 11', value: 5900 },
        { time: 'Jun 12', value: 4600 },
        { time: 'Jun 13', value: 5400 },
        { time: 'Jun 14', value: 5100 },
        { time: 'Jun 15', value: 4800 },
        { time: 'Jun 16', value: 5700 },
        { time: 'Jun 17', value: 6000 },
        { time: 'Jun 18', value: 5200 },
        { time: 'Jun 19', value: 4900 },
        { time: 'Jun 20', value: 5600 },
        { time: 'Jun 21', value: 5800 },
        { time: 'Jun 22', value: 5300 },
        { time: 'Jun 23', value: 4700 },
        { time: 'Jun 24', value: 5100 },
        { time: 'Jun 25', value: 5900 },
        { time: 'Jun 26', value: 5400 },
        { time: 'Jun 27', value: 4800 },
        { time: 'Jun 28', value: 5200 },
        { time: 'Jun 29', value: 5600 },
        { time: 'Jun 30', value: 4781 }
      ]
    },
    {
      title: "Total Sales Last Month (May 2025)",
      amount: "5,743.98",
      currency: "MYR",
      hasChart: true,
      chartColor: getThemeColors.chart6,
      useThemeColor: true,
      chartData: [
        { time: 'May 1', value: 150 },
        { time: 'May 2', value: 180 },
        { time: 'May 3', value: 160 },
        { time: 'May 4', value: 220 },
        { time: 'May 5', value: 190 },
        { time: 'May 6', value: 170 },
        { time: 'May 7', value: 200 },
        { time: 'May 8', value: 240 },
        { time: 'May 9', value: 210 },
        { time: 'May 10', value: 180 },
        { time: 'May 11', value: 190 },
        { time: 'May 12', value: 160 },
        { time: 'May 13', value: 170 },
        { time: 'May 14', value: 200 },
        { time: 'May 15', value: 230 },
        { time: 'May 16', value: 250 },
        { time: 'May 17', value: 180 },
        { time: 'May 18', value: 190 },
        { time: 'May 19', value: 160 },
        { time: 'May 20', value: 210 },
        { time: 'May 21', value: 180 },
        { time: 'May 22', value: 170 },
        { time: 'May 23', value: 200 },
        { time: 'May 24', value: 190 },
        { time: 'May 25', value: 160 },
        { time: 'May 26', value: 180 },
        { time: 'May 27', value: 170 },
        { time: 'May 28', value: 190 },
        { time: 'May 29', value: 200 },
        { time: 'May 30', value: 210 },
        { time: 'May 31', value: 163.98 }
      ]
    },
    {
      title: "Total Sales This Year (2025)",
      amount: "337,217.52",
      currency: "MYR",
      hasChart: true,
      chartColor: getThemeColors.chart1,
      useThemeColor: true,
      chartData: [
        { time: 'Jan', value: 45000 },
        { time: 'Feb', value: 52000 },
        { time: 'Mar', value: 48000 },
        { time: 'Apr', value: 61000 },
        { time: 'May', value: 5744 },
        { time: 'Jun', value: 125474 },
        { time: 'Jul', value: 155000 },    // Projected
        { time: 'Aug', value: 162000 },    // Projected
        { time: 'Sep', value: 158000 },    // Projected
        { time: 'Oct', value: 165000 },    // Projected
        { time: 'Nov', value: 172000 },    // Projected
        { time: 'Dec', value: 180000 }     // Projected
      ]
    },
    {
      title: "Settlement (All Time)",
      amount: "0.00",
      currency: "MYR",
      hasChart: true,
      chartColor: getThemeColors.info,
      useThemeColor: true,
      chartData: [
        { time: '2010', value: 0 },
        { time: '2011', value: 0 },
        { time: '2012', value: 0 },
        { time: '2013', value: 0 },
        { time: '2014', value: 0 },
        { time: '2015', value: 1200 },     // Some historical settlements
        { time: '2016', value: 2500 },
        { time: '2017', value: 1800 },
        { time: '2018', value: 3200 },
        { time: '2019', value: 2900 },
        { time: '2020', value: 1500 },     // Lower due to pandemic
        { time: '2021', value: 2100 },
        { time: '2022', value: 2800 },
        { time: '2023', value: 3500 },
        { time: '2024', value: 4200 },
        { time: '2025', value: 0 }          // Current year - no settlements yet
      ]
    }
  ], [getThemeColors])

  const recentPayments: Payment[] = useMemo(() => [
    {
      paymentDate: "Jul 30, 2024, 5:05:39 PM",
      referenceNumber: "FPX1722330336K9VS3hG8",
      collection: "CL-AUTH-A9F49AAC9C-LNP",
      invoice: "WOO-LEANX--118",
      paymentMethod: "FPX SBIA",
      amount: "19.99",
      currency: "MYR"
    },
    {
      paymentDate: "Feb 18, 2024, 12:41:33 AM",
      referenceNumber: "FPX1708188085sMBzpS2m",
      collection: "CL-AUTH-35775712FA-LNP",
      invoice: "TEST-REF00001",
      paymentMethod: "BANK RAKYAT FPX",
      amount: "100.00",
      currency: "MYR"
    },
    {
      paymentDate: "Mar 28, 2024, 2:59:28 PM",
      referenceNumber: "BOLDPAY1711091966oUUvXVPZ",
      collection: "CL-AUTH-35775712FA-LNP",
      invoice: "speedmart-87654432",
      paymentMethod: "VISA MASTERCARD",
      amount: "119.00",
      currency: "MYR"
    },
    {
      paymentDate: "Mar 27, 2024, 9:50:20 PM",
      referenceNumber: "SENANGPAY1711547417PDrKyccm",
      collection: "CL-AUTH-35775712FA-LNP",
      invoice: "speedmart-87654432",
      paymentMethod: "VISA MASTERCARD",
      amount: "119.00",
      currency: "MYR"
    }
  ], [])

  // Memoized columns to prevent recreation
  const columns: ColumnDef<Payment>[] = useMemo(() => [
    {
      id: 'paymentDate',
      accessorKey: 'paymentDate',
      header: 'PAYMENT DATE',
      enableHiding: false,
      cell: ({ row }) => {
        const date = row.getValue('paymentDate') as string
        return (
          <div className="text-sm">
            <div>{date.split(',')[0]},</div>
            <div className="text-muted-foreground">
              {date.split(',').slice(1).join(',')}
            </div>
          </div>
        )
      },
    },
    {
      id: 'referenceNumber',
      accessorKey: 'referenceNumber',
      header: 'REFERENCE NUMBER',
      enableHiding: true,
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.getValue('referenceNumber')}</span>
      ),
    },
    {
      id: 'collection',
      accessorKey: 'collection',
      header: 'COLLECTION',
      enableHiding: true,
      cell: ({ row }) => (
        <Badge variant="outline" className="text-teal-600 border-teal-200">
          {row.getValue('collection')}
        </Badge>
      ),
    },
    {
      id: 'invoice',
      accessorKey: 'invoice',
      header: 'INVOICE #',
      enableHiding: true,
      cell: ({ row }) => (
        <span className="text-teal-600">{row.getValue('invoice')}</span>
      ),
    },
    {
      id: 'paymentMethod',
      accessorKey: 'paymentMethod',
      header: 'PAYMENT METHOD',
      enableHiding: true,
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue('paymentMethod')}</Badge>
      ),
    },
    {
      id: 'amount',
      accessorKey: 'amount',
      header: 'AMOUNT',
      enableHiding: true,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          <div className="text-sm">
            <div className="text-muted-foreground">{row.original.currency}</div>
            <div>{row.original.amount}</div>
          </div>
        </div>
      ),
    },
  ], [])

  // Copy functions
  const copyRowData = useCallback((row: any, format: 'json' | 'csv' | 'text' = 'json') => {
    const rowData = row.original
    let textToCopy = ''

    switch (format) {
      case 'json':
        textToCopy = JSON.stringify(rowData, null, 2)
        break
      case 'csv':
        const headers = Object.keys(rowData).join(',')
        const values = Object.values(rowData).join(',')
        textToCopy = `${headers}\n${values}`
        break
      case 'text':
        textToCopy = Object.entries(rowData)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')
        break
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      alert(`Row data copied as ${format.toUpperCase()}!`)
    }).catch(() => {
      alert('Failed to copy to clipboard')
    })
  }, [])

  const copyField = useCallback((value: string, fieldName: string) => {
    navigator.clipboard.writeText(value).then(() => {
      alert(`${fieldName} copied to clipboard!`)
    }).catch(() => {
      alert('Failed to copy to clipboard')
    })
  }, [])

  // Function to apply view preset - with immediate state update
  const applyViewPreset = useCallback((viewKey: keyof typeof VIEW_PRESETS) => {
    const preset = VIEW_PRESETS[viewKey]
    if (preset) {
      // Use React.startTransition for immediate UI update
      React.startTransition(() => {
        setColumnVisibility({ ...preset.columns })
        setCurrentView(viewKey)
      })
    }
  }, [])

  // Handle column visibility change with immediate update
  const handleColumnVisibilityChange = useCallback((updater: any) => {
    React.startTransition(() => {
      setColumnVisibility(updater)
      setCurrentView('custom')
    })
  }, [])

  // Create table with optimized configuration
  const table = useReactTable({
    data: recentPayments,
    columns,
    state: {
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableHiding: true,
    // Add these for better performance
    manualFiltering: false,
    manualPagination: false,
    manualSorting: false,
  })

  // Individual column toggle handler with immediate update
  const toggleColumn = useCallback((columnId: string, visible: boolean) => {
    React.startTransition(() => {
      setColumnVisibility(prev => ({
        ...prev,
        [columnId]: visible
      }))
      setCurrentView('custom')
    })
  }, [])

  return (
    <div className="space-y-6">
      {/* Header Section with Pool Information */}
   {/* Header Section with Pool Information - Using existing CSS variables */}
<Card className="bg-primary border-primary/20">
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-8">
        <div>
          <p className="text-primary-foreground/80 text-sm font-medium">Payout Pool</p>
          <p className="text-2xl font-bold text-primary-foreground">
            {poolData.payout.currency} {poolData.payout.amount}
          </p>
        </div>
        <div className="h-8 w-px bg-primary-foreground/30"></div>
        <div>
          <p className="text-primary-foreground/80 text-sm font-medium">Collection Pool</p>
          <p className="text-2xl font-bold text-primary-foreground">
            {poolData.collection.currency} {poolData.collection.amount}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-medium text-primary-foreground">LeanX Demo</p>
          <p className="text-xs text-primary-foreground/80">LeanX Demo Sdn Bhd</p>
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-foreground/20">
          <span className="text-primary-foreground font-medium">👤</span>
        </div>
      </div>
    </div>
  </CardContent>
</Card>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Home className="h-5 w-5 text-muted-foreground" />
          <span className="text-muted-foreground">›</span>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Sales Metrics Grid with Theme-Aware LineChart Integration */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {salesMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-2xl font-bold">
                  {metric.currency} {metric.amount}
                </p>

                {/* Dynamic LineChart with Real Data and Theme Colors */}
                {metric.hasChart && metric.chartData && (
                  <div className="h-16">
                    <SimpleLineChart
                      data={metric.chartData}
                      xKey="time"
                      yKey="value"
                      height={64}
                      color={metric.chartColor}
                      useThemeColor={metric.useThemeColor}
                      showGrid={false}
                      showTooltip={true}
                      showAxes={false}
                      strokeWidth={2}
                      tooltipFormatter={(value, name) => [
                        `MYR ${value.toLocaleString()}`,
                        'Sales'
                      ]}
                      tooltipLabelFormatter={(label) => {
                        const labelStr = label?.toString() || ''

                        if (metric.title.includes('All Time') || metric.title.includes('Settlement')) {
                          return `Year: ${labelStr}`
                        } else if (metric.title.includes('This Year')) {
                          return `Month: ${labelStr}`
                        } else if (metric.title.includes('This Month')) {
                          return `Date: ${labelStr}`
                        } else if (metric.title.includes('Last Month')) {
                          return `Date: ${labelStr}`
                        } else if (metric.title.includes('Today')) {
                          return `Today at ${labelStr}`
                        } else if (metric.title.includes('Yesterday')) {
                          if (labelStr.includes && labelStr.includes(':')) {
                            const [hours, minutes] = labelStr.split(':')
                            const hour24 = parseInt(hours)
                            const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
                            const ampm = hour24 >= 12 ? 'PM' : 'AM'
                            return `Yesterday at ${hour12}${ampm}`
                          } else {
                            return `Yesterday at ${labelStr}`
                          }
                        } else if (metric.title.includes('7 Days')) {
                          return `${labelStr}`
                        }
                        return labelStr
                      }}
                    />
                  </div>
                )}

                {/* Fallback for metrics without chartData */}
                {metric.hasChart && !metric.chartData && (
                  <div className="h-16">
                    <SimpleLineChart
                      data={[
                        { time: 1, value: 20 },
                        { time: 2, value: 35 },
                        { time: 3, value: 25 },
                        { time: 4, value: 45 },
                        { time: 5, value: 30 },
                        { time: 6, value: 40 }
                      ]}
                      xKey="time"
                      yKey="value"
                      height={64}
                      color={metric.chartColor}
                      useThemeColor={true}
                      showGrid={false}
                      showTooltip={false}
                      showAxes={false}
                      strokeWidth={2}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Payment</CardTitle>

            {/* Controls Section */}
            <div className="flex gap-2">
              {/* Test Button - Quick Hide/Show Reference */}
              <Button
                onClick={() => {
                  const currentlyVisible = columnVisibility.referenceNumber
                  toggleColumn('referenceNumber', !currentlyVisible)
                }}
                size="sm"
                variant={columnVisibility.referenceNumber ? "destructive" : "default"}
              >
                {columnVisibility.referenceNumber ? 'Hide Ref#' : 'Show Ref#'}
              </Button>

              {/* Debug Button */}
              <Button
                onClick={() => {
                  console.log('=== DEBUG INFO ===')
                  console.log('Column Visibility State:', columnVisibility)
                  console.log('Current View:', currentView)
                  console.log('Current Theme:', currentTheme)
                  console.log('Theme Colors:', getThemeColors)
                  console.log('Visible Columns:', table.getVisibleLeafColumns().map(c => c.id))
                  console.log('Table State:', table.getState())
                }}
                size="sm"
                variant="secondary"
              >
                Debug
              </Button>

              {/* Preset Views Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    {currentView === 'custom' ? 'Custom View' :
                      currentView in VIEW_PRESETS ? VIEW_PRESETS[currentView as keyof typeof VIEW_PRESETS].name : 'View'}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[280px]">
                  {Object.entries(VIEW_PRESETS).map(([key, preset]) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => applyViewPreset(key as keyof typeof VIEW_PRESETS)}
                      className={`flex items-start p-3 cursor-pointer ${currentView === key ? 'bg-accent' : ''}`}
                    >
                      <span className="mr-3 text-lg">{preset.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {preset.description}
                        </div>
                      </div>
                      {currentView === key && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Custom Column Visibility Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Columns className="h-4 w-4 mr-2" />
                    Columns
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      const isVisible = columnVisibility[column.id] ?? true
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          checked={isVisible}
                          onCheckedChange={(checked) => {
                            toggleColumn(column.id, !!checked)
                          }}
                        >
                          {column.id === 'referenceNumber' ? 'Reference Number' :
                            column.id === 'paymentMethod' ? 'Payment Method' :
                              column.id === 'paymentDate' ? 'Payment Date' :
                                column.id.charAt(0).toUpperCase() + column.id.slice(1)}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className={header.id === 'amount' ? 'text-right' : ''}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <ContextMenu key={row.id}>
                    <ContextMenuTrigger asChild>
                      <TableRow className="cursor-context-menu hover:bg-muted/50">
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-56">
                      {/* Copy Row Options */}
                      <ContextMenuItem onClick={() => copyRowData(row, 'json')}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Row (JSON)
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => copyRowData(row, 'csv')}>
                        <FileText className="mr-2 h-4 w-4" />
                        Copy Row (CSV)
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => copyRowData(row, 'text')}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Copy Row (Text)
                      </ContextMenuItem>

                      <ContextMenuSeparator />

                      {/* Copy Individual Fields */}
                      <ContextMenuItem onClick={() => copyField(row.original.invoice, 'Invoice Number')}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Invoice #
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => copyField(row.original.referenceNumber, 'Reference Number')}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Reference #
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => copyField(row.original.amount, 'Amount')}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Amount
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => copyField(row.original.paymentMethod, 'Payment Method')}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Payment Method
                      </ContextMenuItem>

                      <ContextMenuSeparator />

                      {/* Additional Actions */}
                      <ContextMenuItem onClick={() => alert(`Viewing details for ${row.original.invoice}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => alert(`Editing payment ${row.original.invoice}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Payment
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => alert(`Downloading receipt for ${row.original.invoice}`)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Receipt
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => window.open(`/payment/${row.original.invoice}`, '_blank')}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open in New Tab
                      </ContextMenuItem>

                      <ContextMenuSeparator />

                      <ContextMenuItem
                        className="text-red-600"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete payment ${row.original.invoice}?`)) {
                            alert(`Deleted payment ${row.original.invoice}`)
                          }
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Payment
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}