// components/dashboard/sidebar.tsx
"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { authUtils } from "@/lib/auth"
import { RecentPages } from "./recent-pages"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  Users,
  Settings,
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  LogOut,
  User,
  CreditCard,
  HelpCircle,
  Package,
  ShoppingCart,
  Layers,
  Globe,
  MessageSquare,
  Store,
} from "lucide-react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className = "" }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [keySequence, setKeySequence] = useState<string[]>([])
  const [showShortcuts, setShowShortcuts] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Keyboard shortcuts mapping
  const keyboardShortcuts: Record<string, string> = {
    'g,d': '/dashboard',
    'g,c': '/collections',
    'g,p': '/products',
    'g,u': '/customers',
    'g,o': '/orders',
    'g,s': '/storefront',
  }

  // Command palette shortcut - using Cmd/Ctrl + K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Listen for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if command palette is open or user is typing in an input
      if (commandOpen || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Don't interfere with browser shortcuts
      if (e.metaKey || e.ctrlKey || e.altKey) {
        return
      }

      const key = e.key.toLowerCase()
      
      // Start sequence with 'g'
      if (key === 'g') {
        e.preventDefault()
        setKeySequence(['g'])
        setShowShortcuts(true)
        
        // Hide shortcuts after 3 seconds
        setTimeout(() => {
          setShowShortcuts(false)
          setKeySequence([])
        }, 3000)
        return
      }

      // Complete sequence
      if (keySequence.length === 1 && keySequence[0] === 'g') {
        e.preventDefault()
        const sequence = `g,${key}`
        const route = keyboardShortcuts[sequence]
        
        if (route) {
          router.push(route)
        }
        
        setKeySequence([])
        setShowShortcuts(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [keySequence, commandOpen, router, keyboardShortcuts])

  // Clear sequence on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setKeySequence([])
        setShowShortcuts(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      description: "Main dashboard overview",
      shortcut: "G then D"
    },
    {
      id: "collections",
      label: "Collections",
      icon: Layers,
      href: "/collections",
      description: "Manage your collections",
      shortcut: "G then C"
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      href: "/products",
      description: "Product management",
      shortcut: "G then P"
    },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
      href: "/customers",
      description: "Customer management",
      shortcut: "G then U"
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      href: "/orders",
      description: "Order management",
      shortcut: "G then O"
    },
    {
      id: "storefront",
      label: "Storefront",
      icon: Store,
      href: "/storefront",
      description: "Manage your storefront",
      shortcut: "G then S"
    }
  ]

  const runCommand = (href: string) => {
    setCommandOpen(false)
    router.push(href)
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const handleLogout = () => {
    authUtils.logout()
  }

  const getShortcutDisplay = (shortcut: string) => {
    if (!shortcut) return null
    const parts = shortcut.split(' then ')
    return (
      <div className="flex items-center gap-1">
        {parts.map((part, index) => (
          <div key={index} className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
              {part}
            </kbd>
            {index < parts.length - 1 && <span className="text-xs text-muted-foreground">then</span>}
          </div>
        ))}
      </div>
    )
  }

  const renderNavigationItem = (item: any) => {
    const Icon = item.icon
    const active = isActive(item.href)

    return (
      <div key={item.id} className="group">
        <Link href={item.href}>
          <Button
            variant={active ? "secondary" : "ghost"}
            className="w-full justify-start h-auto p-2 relative"
          >
            <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.label}</span>
                <div className="flex items-center gap-2">
                  {/* Show keyboard shortcut on hover or when sequence is active */}
                  {(showShortcuts || keySequence.length > 0) && item.shortcut && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {getShortcutDisplay(item.shortcut)}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-tight">
                {item.description}
              </p>
            </div>
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Command Palette */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <CommandItem 
                  key={item.id} 
                  onSelect={() => runCommand(item.href)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </div>
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                </CommandItem>
              )
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Floating toggle button when sidebar is collapsed */}
      {isCollapsed && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className="fixed top-4 left-4 z-50 shadow-lg"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Keyboard shortcuts overlay */}
      {showShortcuts && keySequence.length > 0 && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/90 text-white px-4 py-2 rounded-lg text-sm">
          Press the next key...
          <div className="flex gap-1 mt-1">
            <kbd className="px-2 py-1 bg-white/20 rounded text-xs">G</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">D/C/P/U/O/S</kbd>
          </div>
        </div>
      )}

      <div className={`${className} flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${isCollapsed ? 'w-0 overflow-hidden' : 'w-64'}`}>
        {/* STICKY HEADER */}
        <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <img
              src="https://leanx.io/images/300ppi/logo.png"
              alt="LeanX Logo"
              className="w-6 h-6 object-contain"
            />
            <div>
              <span className="font-bold text-base">LeanX</span>
              <p className="text-xs text-muted-foreground">Merchant Acquiring Module</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* COMMAND PALETTE TRIGGER */}
        <div className="flex-shrink-0 p-3 border-b border-gray-200 dark:border-gray-800">
          <Button
            variant="ghost"
            onClick={() => setCommandOpen(true)}
            className="w-full justify-start h-9 px-3 text-muted-foreground text-sm"
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Search collections, products...</span>
            <CommandShortcut className="ml-auto">⌘K</CommandShortcut>
          </Button>
        </div>

        {/* SCROLLABLE NAVIGATION */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="px-3 py-2">
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">
                    Navigation
                  </h4>
                  <div className="space-y-1">
                    {menuItems.map(renderNavigationItem)}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* RECENT PAGES SECTION */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 p-3">
          <RecentPages 
            isCollapsed={isCollapsed}
            maxItems={3}
            className=""
          />
        </div>

        {/* STICKY FOOTER */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@leanx.io</p>
                </div>
                <ChevronUp className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" side="top">
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
    </>
  )
}