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
import { authUtils } from "@/lib/auth"
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
  const pathname = usePathname()

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
        },
        {
          id: "collection",
          label: "Collection",
          icon: Layers,
          href: "/collection",
          hasSubmenu: true,
          submenu: [
            {
              id: "view-collection",
              label: "View Collection",
              href: "/collection/view",
            },
            {
              id: "view-payments",
              label: "View Payments",
              href: "/collection/payments",
            }
          ]
        },
         {
          id: "product",
          label: "Products",
          icon: Package,
          href: "/products",
          hasSubmenu: true,
          submenu: [
            {
              id: "manage-products",
              label: "Manage Products",
              href: "/products/manage",
            },
            {
              id: "categories-products",
              label: "Category Product",
              href: "/products/categories",
            },
             {
              id: "subcategories-products",
              label: "Subcategory Product",
              href: "/products/subcategories",
            },
          ]
        },
        {
          id: "customers",
          label: "Customers",
          icon: Users,
          href: "/customers",
        },   
        {
          id: "account",
          label: "Accounts",
          icon: User,
          href: "/accounts",
          badge: null,
        },  
        {
          id: "payout",
          label: "Pay Out",
          icon: DollarSign,
          href: "/payout",
        },     
        {
          id: "poolfund",
          label: "Pool Fund",
          icon: PieChart,
          href: "/poolfund",
          badge: null,
        },  
        {
          id: "settlement",
          label: "Settlement",
          icon: CreditCard,
          href: "/settlement",
        },  
        {
          id: "report",
          label: "Report",
          icon: FileText,
          href: "/report",
          badge: null,
        },  
        {
          id: "api",
          label: "API",
          icon: Settings,
          href: "/api",
          badge: null,
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
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
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
        <Button
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

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-2">
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
      </ScrollArea>

      {/* Sticky Footer with User Dropdown */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
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