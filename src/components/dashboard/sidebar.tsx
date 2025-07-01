// components/dashboard/sidebar.tsx
"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { authUtils } from "@/lib/auth"
import { RecentPages } from "./recent-pages"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Home,
  BarChart3,
  Users,
  Settings,
  FileText,
  Calendar,
  MessageSquare,
  Bell,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LogOut,
  User,
  CreditCard,
  HelpCircle,
  Shield,
  Zap,
  TrendingUp,
  Package,
  Star,
  ShoppingCart,
  Tags,
  Layers,
  Globe,
  Palette,
  Image,
  Truck,
  DollarSign,
  PieChart,
  Target,
  Gift,
  Percent,
  Mail,
  Megaphone,
  UserCheck,
  Archive,
  Eye,
  Store,
  Smartphone,
  Monitor,
  Scissors,
  Paintbrush
} from "lucide-react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className = "" }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openMenus, setOpenMenus] = useState<string[]>([]) // Track which menus are open
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const pathname = usePathname()

  // Sample data for search
  const recentSearches = [
    "Payment transactions",
    "Customer analytics",
    "Product inventory",
    "Monthly reports"
  ]

  const quickActions = [
    { label: "Create Collection", icon: Plus },
    { label: "Add Product", icon: Package },
    { label: "New Customer", icon: Users },
    { label: "Generate Report", icon: FileText }
  ]

  const menuSections = [
    {
      title: "Overview",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: Home,
          href: "/dashboard",
          badge: null,
          description: "Main dashboard overview"
        },
        {
          id: "collection",
          label: "Collection",
          icon: Layers,
          href: "/collection",
          description: "Manage your collections",
          hasSubmenu: true,
          submenu: [
            {
              id: "view-collection",
              label: "View Collection",
              href: "/collection/view",
              description: "Browse all collections"
            },
            {
              id: "view-payments",
              label: "View Payments",
              href: "/collection/payments",
              description: "View payment history"
            }
          ]
        },
        {
          id: "product",
          label: "Products",
          icon: Package,
          href: "/products",
          description: "Product management",
          hasSubmenu: true,
          submenu: [
            {
              id: "manage-products",
              label: "Manage Products",
              href: "/products/manage",
              description: "Add, edit, remove products"
            },
            {
              id: "categories-products",
              label: "Category Product",
              href: "/products/categories",
              description: "Manage product categories"
            },
            {
              id: "subcategories-products",
              label: "Subcategory Product",
              href: "/products/subcategories",
              description: "Manage product subcategories"
            },
          ]
        },
        {
          id: "customers",
          label: "Customers",
          icon: Users,
          href: "/customers",
          description: "Customer management"
        },
        {
          id: "account",
          label: "Accounts",
          icon: User,
          href: "/accounts",
          badge: null,
          description: "Account settings"
        },
        {
          id: "payout",
          label: "Pay Out",
          icon: DollarSign,
          href: "/payout",
          description: "Manage payouts"
        },
        {
          id: "poolfund",
          label: "Pool Fund",
          icon: PieChart,
          href: "/poolfund",
          badge: null,
          description: "Pool fund management"
        },
        {
          id: "settlement",
          label: "Settlement",
          icon: CreditCard,
          href: "/settlement",
          description: "Settlement processing"
        },
        {
          id: "report",
          label: "Report",
          icon: FileText,
          href: "/report",
          badge: null,
          description: "Analytics and reports"
        },
        {
          id: "api-1",
          label: "API Management",
          icon: Settings,
          href: "/api",
          badge: null,
          description: "API configuration"
        },
        {
          id: "api-2",
          label: "Webhooks",
          icon: Zap,
          href: "/webhooks",
          badge: null,
          description: "Webhook management"
        },
        {
          id: "api-3",
          label: "Integrations",
          icon: Settings,
          href: "/integrations",
          badge: null,
          description: "Third-party integrations"
        },
        {
          id: "api-4",
          label: "API Docs",
          icon: FileText,
          href: "/api-docs",
          badge: null,
          description: "API documentation"
        },
        {
          id: "api-5",
          label: "API Keys",
          icon: Settings,
          href: "/api-keys",
          badge: null,
          description: "Manage API keys"
        },
        {
          id: "api-6",
          label: "Rate Limits",
          icon: Settings,
          href: "/rate-limits",
          badge: null,
          description: "API rate limiting"
        },
      ]
    },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const isMenuOpen = (menuId: string) => {
    return openMenus.includes(menuId)
  }

  const toggleMenu = (menuId: string) => {
    setOpenMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    )
  }

  const handleLogout = () => {
    authUtils.logout()
  }

  const renderSubmenuItem = (subItem: any, parentActive: boolean, isLast: boolean = false) => {
    const active = isActive(subItem.href)

    return (
      <div key={subItem.id} className="relative">
        {/* Vertical line connecting to parent */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

        {/* Horizontal line to submenu item */}
        <div className="absolute left-6 top-4 w-4 h-px bg-border" />

        {/* Small dot at the end of horizontal line */}
        <div className="absolute left-9 top-4 w-1 h-1 bg-border rounded-full transform -translate-y-0.5" />

        <Link href={subItem.href}>
          <Button
            variant={active ? "secondary" : "ghost"}
            className="w-full justify-start h-auto p-2 ml-10 relative"
            size="sm"
          >
            <div className="flex-1 text-left">
              <span className="text-sm">{subItem.label}</span>
              <p className="text-xs text-muted-foreground mt-1 leading-tight">
                {subItem.description}
              </p>
            </div>
          </Button>
        </Link>
      </div>
    )
  }

  const renderNavigationItem = (item: any) => {
    const Icon = item.icon
    const active = isActive(item.href)
    const hasSubmenu = item.hasSubmenu && item.submenu
    const isOpen = isMenuOpen(item.id)

    if (isCollapsed && hasSubmenu) {
      return (
        <DropdownMenu key={item.id}>
          <DropdownMenuTrigger asChild>
            <Button
              data-tour={`${item.id}-link`}
              variant={active ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-center p-2 relative"
            >
              <Icon className="h-4 w-4" />
              {item.badge && (
                <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5 text-xs">
                  {item.badge}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-56">
            <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {item.submenu.map((subItem: any) => (
              <DropdownMenuItem key={subItem.id} asChild>
                <Link href={subItem.href} className="w-full">
                  {subItem.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    // For collapsed sidebar without submenu
    if (isCollapsed && !hasSubmenu) {
      return (
        <Tooltip key={item.id}>
          <TooltipTrigger asChild>
            <Link href={item.href}>
              <Button
                data-tour={`${item.id}-link`}
                variant={active ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-center p-2 relative"
              >
                <Icon className="h-4 w-4" />
                {item.badge && (
                  <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col">
            <span className="font-medium">{item.label}</span>
            <span className="text-xs text-muted-foreground">{item.description}</span>
          </TooltipContent>
        </Tooltip>
      )
    }

    // For expanded sidebar with submenu
    if (hasSubmenu) {
      return (
        <div key={item.id} className="relative">
          <Collapsible open={isOpen} onOpenChange={() => toggleMenu(item.id)}>
            <CollapsibleTrigger asChild>
              <Button
                data-tour={`${item.id}-link`}
                variant={active ? "secondary" : "ghost"}
                className="w-full justify-start h-auto p-3"
              >
                <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.label}</span>
                    <div className="flex items-center">
                      {item.badge && (
                        <Badge className="mr-2 px-2 py-1 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                      {isOpen ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-tight">
                    {item.description}
                  </p>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pb-2">
              {/* Main vertical line for the submenu group */}
              <div className="relative">
                {item.submenu.map((subItem: any, index: number) =>
                  renderSubmenuItem(subItem, active, index === item.submenu.length - 1)
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )
    }

    // For expanded sidebar without submenu
    return (
      <Link key={item.id} href={item.href}>
        <Button
          data-tour={`${item.id}-link`}
          variant={active ? "secondary" : "ghost"}
          className="w-full justify-start h-auto p-3"
        >
          <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
          <div className="flex-1 text-left">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{item.label}</span>
              {item.badge && (
                <Badge className="ml-2 px-2 py-1 text-xs">
                  {item.badge}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-tight">
              {item.description}
            </p>
          </div>
        </Button>
      </Link>
    )
  }

  return (
    <div className={`${className} flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-80'}`}>
      {/* STICKY HEADER */}
      <div
        data-tour="sidebar-header"
        className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800"
      >
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <img
              src="https://leanx.io/images/300ppi/logo.png"
              alt="LeanX Logo"
              className="w-8 h-8 object-contain"
            />
            <div>
              <span className="font-bold text-lg">LeanX</span>
              <p className="text-xs text-muted-foreground">Merchant Acquiring Module</p>
            </div>
          </div>
        )}
        {/* Collapse Button */}
        <Button
          data-tour="collapse-button"
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* STICKY SEARCH SECTION */}
      {!isCollapsed && (
        <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-800">
          <Dialog>
            <DialogTrigger asChild>
              <div
                data-tour="search-section"
                className="relative cursor-pointer"
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search collections, products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600"
                  readOnly
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
        </div>
      )}

      {/* SCROLLABLE NAVIGATION - Only this part scrolls */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="px-4 py-2">
            <div className="space-y-4">
              {menuSections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  {!isCollapsed && (
                    <>
                      {sectionIndex > 0 && <Separator className="my-4" />}
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-2">
                        {section.title}
                      </h4>
                    </>
                  )}
                  <div className="space-y-1">
                    {section.items.map(renderNavigationItem)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* RECENT PAGES SECTION */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 p-4">
        <RecentPages 
          isCollapsed={isCollapsed}
          maxItems={3}
          className=""
        />
      </div>

      {/* STICKY FOOTER */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger data-tour="user-profile" asChild>
            {isCollapsed ? (
              // Collapsed state - just avatar
              <Button variant="ghost" className="w-full p-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            ) : (
              // Expanded state - full user info
              <Button variant="ghost" className="w-full justify-start p-3 h-auto">
                <Avatar className="w-8 h-8 mr-3">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@leanx.io</p>
                </div>
                <ChevronUp className="h-4 w-4 ml-2" />
              </Button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" side={isCollapsed ? "right" : "top"}>
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
        </DropdownMenu>
      </div>
    </div>
  )
}