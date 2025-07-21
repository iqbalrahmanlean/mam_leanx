"use client"

import React, { useState, useCallback, useEffect, useMemo } from "react"
import SimpleLineChart from '@/components/ui/line-chart'
import { DataTable } from '@/components/ui/data-table' // Import your new DataTable component
// import DataTable from '@/components/ui/data-table'
import { ColumnDef } from "@tanstack/react-table"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Home,
  Settings,
  RefreshCw,
  ChevronDown,
  Copy,
  Edit,
  Trash2,
  Download,
  ExternalLink,
  FileText,
  Share2,
  Eye,
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

export default function DashboardPage() {
  const currentTheme = useCurrentTheme()

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

  // Payment data
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

  // Column definitions for DataTable
  const paymentColumns: ColumnDef<Payment>[] = useMemo(() => [
    {
      id: 'paymentDate',
      accessorKey: 'paymentDate',
      header: 'PAYMENT DATE',
      size: 180,
      cell: ({ row }) => {
        const date = row.getValue('paymentDate') as string
        return (
          <div className="text-sm min-w-[160px]">
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
      size: 220, // Increase width
      cell: ({ row }) => (
        <div className="font-mono text-sm min-w-[200px] max-w-[220px]">
          <span className="truncate block" title={row.getValue('referenceNumber')}>
            {row.getValue('referenceNumber')}
          </span>
        </div>
      ),
    },
    {
      id: 'collection',
      accessorKey: 'collection',
      header: 'COLLECTION',
      size: 200, // Increase width
      cell: ({ row }) => (
        <div className="min-w-[180px] max-w-[200px]">
          <Badge variant="outline" className="text-teal-600 border-teal-200 truncate">
            {row.getValue('collection')}
          </Badge>
        </div>
      ),
    },
    {
      id: 'invoice',
      accessorKey: 'invoice',
      header: 'INVOICE #',
      size: 150,
      cell: ({ row }) => (
        <div className="min-w-[130px] max-w-[150px]">
          <span className="text-teal-600 truncate block" title={row.getValue('invoice')}>
            {row.getValue('invoice')}
          </span>
        </div>
      ),
    },
    {
      id: 'paymentMethod',
      accessorKey: 'paymentMethod',
      header: 'PAYMENT METHOD',
      size: 160,
      cell: ({ row }) => (
        <div className="min-w-[140px] max-w-[160px]">
          <Badge variant="secondary" className="truncate">
            {row.getValue('paymentMethod')}
          </Badge>
        </div>
      ),
    },
    {
      id: 'amount',
      accessorKey: 'amount',
      header: ({ column }) => (
        <div className="text-right">AMOUNT</div>
      ),
      size: 120,
      cell: ({ row }) => (
        <div className="text-right font-medium min-w-[100px]">
          <div className="text-sm">
            <div className="text-muted-foreground">{row.original.currency}</div>
            <div>{row.original.amount}</div>
          </div>
        </div>
      ),
    },
  ], [])

  // Filter configuration for the payment table
  const paymentFilters = [
    {
      id: "invoice",
      type: "text" as const,
      label: "Invoice Number",
      placeholder: "Search by invoice..."
    },
    {
      id: "paymentMethod",
      type: "multiselect" as const,
      label: "Payment Method",
      placeholder: "Select payment methods...",
      options: [
        { label: "FPX", value: "FPX SBIA" },
        { label: "Bank Rakyat FPX", value: "BANK RAKYAT FPX" },
        { label: "Visa/Mastercard", value: "VISA MASTERCARD" },
        { label: "Credit Card", value: "CREDIT CARD" }
      ]
    },
    {
      id: "collection",
      type: "text" as const,
      label: "Collection",
      placeholder: "Search by collection..."
    },
    {
      id: "referenceNumber",
      type: "text" as const,
      label: "Reference Number",
      placeholder: "Search by reference..."
    },
    {
      id: "paymentDate",
      type: "dateRange" as const,
      label: "Payment Date Range",
      placeholder: "Select date range..."
    }
  ]

  // Context menu actions for payment table
  const paymentContextMenuActions = [
    {
      id: 'copy-row-json',
      label: 'Copy Row (JSON)',
      icon: Copy,
      onClick: (row: Payment) => {
        const textToCopy = JSON.stringify(row, null, 2)
        navigator.clipboard.writeText(textToCopy).then(() => {
          alert('Row data copied as JSON!')
        }).catch(() => {
          alert('Failed to copy to clipboard')
        })
      }
    },
    {
      id: 'copy-row-csv',
      label: 'Copy Row (CSV)',
      icon: FileText,
      onClick: (row: Payment) => {
        const headers = Object.keys(row).join(',')
        const values = Object.values(row).join(',')
        const textToCopy = `${headers}\n${values}`
        navigator.clipboard.writeText(textToCopy).then(() => {
          alert('Row data copied as CSV!')
        }).catch(() => {
          alert('Failed to copy to clipboard')
        })
      }
    },
    {
      id: 'copy-row-text',
      label: 'Copy Row (Text)',
      icon: Share2,
      onClick: (row: Payment) => {
        const textToCopy = Object.entries(row)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')
        navigator.clipboard.writeText(textToCopy).then(() => {
          alert('Row data copied as Text!')
        }).catch(() => {
          alert('Failed to copy to clipboard')
        })
      },
      separator: true
    },
    {
      id: 'copy-invoice',
      label: 'Copy Invoice #',
      icon: Copy,
      onClick: (row: Payment) => {
        navigator.clipboard.writeText(row.invoice).then(() => {
          alert('Invoice Number copied to clipboard!')
        }).catch(() => {
          alert('Failed to copy to clipboard')
        })
      }
    },
    {
      id: 'copy-reference',
      label: 'Copy Reference #',
      icon: Copy,
      onClick: (row: Payment) => {
        navigator.clipboard.writeText(row.referenceNumber).then(() => {
          alert('Reference Number copied to clipboard!')
        }).catch(() => {
          alert('Failed to copy to clipboard')
        })
      }
    },
    {
      id: 'copy-amount',
      label: 'Copy Amount',
      icon: Copy,
      onClick: (row: Payment) => {
        navigator.clipboard.writeText(row.amount).then(() => {
          alert('Amount copied to clipboard!')
        }).catch(() => {
          alert('Failed to copy to clipboard')
        })
      }
    },
    {
      id: 'copy-payment-method',
      label: 'Copy Payment Method',
      icon: Copy,
      onClick: (row: Payment) => {
        navigator.clipboard.writeText(row.paymentMethod).then(() => {
          alert('Payment Method copied to clipboard!')
        }).catch(() => {
          alert('Failed to copy to clipboard')
        })
      },
      separator: true
    },
    {
      id: 'view-details',
      label: 'View Details',
      icon: Eye,
      onClick: (row: Payment) => {
        alert(`Viewing details for ${row.invoice}`)
        // Add your navigation logic here
      }
    },
    {
      id: 'edit',
      label: 'Edit Payment',
      icon: Edit,
      onClick: (row: Payment) => {
        alert(`Editing payment ${row.invoice}`)
        // Add your edit logic here
      }
    },
    {
      id: 'download',
      label: 'Download Receipt',
      icon: Download,
      onClick: (row: Payment) => {
        alert(`Downloading receipt for ${row.invoice}`)
        // Add your download logic here
      }
    },
    {
      id: 'open-new-tab',
      label: 'Open in New Tab',
      icon: ExternalLink,
      onClick: (row: Payment) => {
        window.open(`/payment/${row.invoice}`, '_blank')
      },
      separator: true
    },
    {
      id: 'delete',
      label: 'Delete Payment',
      icon: Trash2,
      variant: 'destructive' as const,
      onClick: (row: Payment) => {
        if (confirm(`Are you sure you want to delete payment ${row.invoice}?`)) {
          alert(`Deleted payment ${row.invoice}`)
          // Add your delete logic here
        }
      }
    }
  ]

  // View presets for the payment table
  const paymentViewPresets = {
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
  }

  return (
    <div className="space-y-6">
      {/* Header Section with Pool Information */}
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

      {/* Recent Payments Table - Using DataTable Component with Context Menu */}
      <DataTable
        data={recentPayments}
        columns={paymentColumns}
        title="Recent Payment"
        description="View and manage recent payment transactions"
        filters={paymentFilters}
        viewPresets={paymentViewPresets}
        defaultView="full"
        variant="default"
        enableSorting
        enableFiltering
        enableColumnVisibility
        enablePagination
        enableGlobalSearch
        enableContextMenu
        contextMenuActions={paymentContextMenuActions}
        searchPlaceholder="Search payments..."
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        emptyMessage="No payments found"
        onRowClick={(payment) => {
          console.log('Payment clicked:', payment)
          //  navigation logic here

        }}
      />
    </div>

  )
}