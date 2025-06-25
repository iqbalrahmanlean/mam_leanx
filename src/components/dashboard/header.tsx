// components/dashboard/header.tsx
"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ThemeToggleButton } from "@/components/theme-toggle-button" // ✅ Import is correct
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  CreditCard,
  HelpCircle,
  Moon,
  Sun,
  Globe,
  MessageSquare,
  Calendar,
  ShoppingCart,
  Users,
  TrendingUp,
  Filter,
  Download,
  RefreshCw,
  Maximize,
  Menu,
  Palette,
  Check,
  ChevronDown
} from "lucide-react"

export function DashboardHeader() {
  const [notifications] = useState(5)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState("default") // Add theme state
  const pathname = usePathname()

  // Theme options
  const themeOptions = [
    { value: "default", label: "Default", description: "Standard theme" },
    { value: "leanx", label: "LeanX", description: "LeanX branded theme" },
    { value: "payright", label: "Payright", description: "Payright branded theme" }
  ]

  const getPageTitle = () => {
    const pathMap: { [key: string]: string } = {
      '/dashboard': 'Dashboard',
      '/collection': 'Collection',
      '/products': 'Products',
      '/orders': 'Orders',
      '/customers': 'Customers',
      '/storefront': 'Online Store',
      '/analytics': 'Analytics',
      '/campaigns': 'Marketing Campaigns',
      '/discounts': 'Discounts & Promotions',
      '/reports': 'Reports & Analytics',
      '/settings': 'Settings'
    }
    return pathMap[pathname] || 'Dashboard'
  }

  const getPageDescription = () => {
    const descMap: { [key: string]: string } = {
      '/dashboard': 'Overview of your store performance and key metrics',
      '/collection': 'Organize and manage your product collections',
      '/products': 'Manage your product catalog and inventory',
      '/orders': 'Track and manage customer orders',
      '/customers': 'Manage customer relationships and data',
      '/storefront': 'Customize your online store appearance',
      '/analytics': 'Deep dive into your store analytics',
      '/campaigns': 'Create and manage marketing campaigns',
      '/discounts': 'Set up discount codes and promotional offers',
      '/reports': 'Generate detailed business reports',
      '/settings': 'Configure your store settings'
    }
    return descMap[pathname] || 'Manage your e-commerce business'
  }

  const handleLogout = () => {
    localStorage.removeItem('i18nextLng')
    window.location.href = "/login"
  }

  // Handle theme change
  const handleThemeChange = (themeValue: string) => {
    setSelectedTheme(themeValue)
    // Apply theme logic here
    const root = document.documentElement
    
    // Remove existing theme classes
    root.className = root.className.replace(/theme-\w+/g, '')
    
    // Add new theme class
    if (themeValue !== 'default') {
      root.classList.add(`theme-${themeValue}`)
    }
    
    // Save to localStorage
    localStorage.setItem('selected-theme', themeValue)
  }

  const recentSearches = [
    "Product inventory",
    "Customer orders", 
    "Sales report",
    "Payment methods"
  ]

  const quickActions = [
    { label: "New Order", icon: ShoppingCart, href: "/orders/new" },
    { label: "Add Product", icon: TrendingUp, href: "/products/new" },
    { label: "View Analytics", icon: TrendingUp, href: "/analytics" },
    { label: "Customer Support", icon: MessageSquare, href: "/support" }
  ]

  const notificationItems = [
    {
      id: 1,
      title: "New order received",
      description: "Order #12345 from John Doe",
      time: "2 minutes ago",
      type: "order",
      unread: true
    },
    {
      id: 2,
      title: "Low stock alert",
      description: "Product 'Summer T-Shirt' is running low",
      time: "15 minutes ago",
      type: "inventory",
      unread: true
    },
    {
      id: 3,
      title: "Payment received",
      description: "MYR 150.00 payment confirmed",
      time: "1 hour ago",
      type: "payment",
      unread: false
    },
    {
      id: 4,
      title: "Customer review",
      description: "New 5-star review for your store",
      time: "2 hours ago",
      type: "review",
      unread: false
    },
    {
      id: 5,
      title: "Weekly report ready",
      description: "Your sales report is ready to view",
      time: "1 day ago",
      type: "report",
      unread: false
    }
  ]

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Page Info */}
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {getPageTitle()}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getPageDescription()}
            </p>
          </div>

          {/* Page Actions */}
          <div className="hidden lg:flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh data</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filter data</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export data</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Right Section - Search, Notifications, Theme Controls, User */}
        <div className="flex items-center space-x-4">
          {/* Search Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search products, orders, customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="pl-10 pr-4 py-2 w-64 lg:w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600"
                />
                <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  ⌘K
                </kbd>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Search</DialogTitle>
                <DialogDescription>
                  Search across products, orders, customers, and more
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Type to search..."
                    className="pl-10"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Recent Searches</h4>
                  {recentSearches.map((search, index) => (
                    <Button key={index} variant="ghost" className="w-full justify-start">
                      <Search className="mr-2 h-4 w-4" />
                      {search}
                    </Button>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon
                      return (
                        <Button key={index} variant="ghost" className="justify-start">
                          <Icon className="mr-2 h-4 w-4" />
                          {action.label}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5 text-xs bg-red-500">
                    {notifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Badge variant="secondary">{notifications} new</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <div className="max-h-80 overflow-y-auto">
                {notificationItems.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex items-start space-x-3 p-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.description}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Controls Section */}
          <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-gray-700 pl-4">
            {/* Theme Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Palette className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">
                    {themeOptions.find(t => t.value === selectedTheme)?.label}
                  </span>
                  <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {themeOptions.map((theme) => (
                  <DropdownMenuItem
                    key={theme.value}
                    onClick={() => handleThemeChange(theme.value)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{theme.label}</span>
                      <span className="text-xs text-muted-foreground">{theme.description}</span>
                    </div>
                    {selectedTheme === theme.value && (
                      <Check className="h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dark/Light Mode Toggle */}
            <ThemeToggleButton />
          </div>

          {/* User Menu */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer w-8 h-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">john@leanx.io</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                Billing & Plans
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Globe className="mr-2 h-4 w-4" />
                Language & Region
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Store Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Support
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
    </header>
  )
}