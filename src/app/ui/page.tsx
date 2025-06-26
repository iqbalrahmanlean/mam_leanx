"use client"

import { useState, useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { showToast } from "@/hooks/use-toast"
import { DataTable } from "@/components/ui/data-table" // Add our DataTable
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Calendar,
  Star,
  Heart,
  Settings,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Download,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Bell,
  Home,
  Menu,
  X,
  Check,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Eye,
  Copy,
  FileText,
  Share2,
  ExternalLink,
  ChevronRight,
  DollarSign,
  CreditCard,
  Activity
} from "lucide-react"

// Sample data for DataTable demo
type SampleUser = {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'moderator'
  status: 'active' | 'inactive' | 'suspended'
  lastLogin: string
  joinDate: string
  department: string
  isVerified: boolean
}

type SamplePayment = {
  id: string
  date: string
  amount: number
  currency: string
  method: string
  status: 'completed' | 'pending' | 'failed'
  customer: string
  description: string
}

export default function UIShowcase() {
  const [progress, setProgress] = useState(33)
  const [isChecked, setIsChecked] = useState(false)
  const [isSwitchOn, setIsSwitchOn] = useState(false)

  // Sample data for tables
  const sampleUsers: SampleUser[] = useMemo(() => [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      status: "active",
      lastLogin: "2024-06-26T10:30:00Z",
      joinDate: "2024-01-15T08:00:00Z",
      department: "Engineering",
      isVerified: true
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "user",
      status: "active",
      lastLogin: "2024-06-25T15:45:00Z",
      joinDate: "2024-02-20T09:30:00Z",
      department: "Marketing",
      isVerified: false
    },
    {
      id: "3",
      name: "Bob Wilson",
      email: "bob@example.com",
      role: "moderator",
      status: "suspended",
      lastLogin: "2024-06-20T12:15:00Z",
      joinDate: "2024-03-10T14:20:00Z",
      department: "Sales",
      isVerified: true
    }
  ], [])

  const samplePayments: SamplePayment[] = useMemo(() => [
    {
      id: "1",
      date: "2024-06-26T10:30:00Z",
      amount: 299.99,
      currency: "USD",
      method: "Credit Card",
      status: "completed",
      customer: "Alice Johnson",
      description: "Premium subscription"
    },
    {
      id: "2",
      date: "2024-06-25T14:20:00Z",
      amount: 49.99,
      currency: "USD",
      method: "PayPal",
      status: "pending",
      customer: "Bob Smith",
      description: "Monthly plan"
    },
    {
      id: "3",
      date: "2024-06-24T09:15:00Z",
      amount: 99.99,
      currency: "USD",
      method: "Bank Transfer",
      status: "failed",
      customer: "Carol Davis",
      description: "Annual subscription"
    }
  ], [])

  // User table columns
  const userColumns: ColumnDef<SampleUser>[] = useMemo(() => [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback>{row.getValue<string>("name").charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: 'Email',
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        const variants = {
          admin: "destructive",
          moderator: "default",
          user: "secondary"
        }
        return (
          <Badge variant={variants[role as keyof typeof variants] as any}>
            {role}
          </Badge>
        )
      },
    },
    {
      id: 'department',
      accessorKey: 'department',
      header: 'Department',
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const variants = {
          active: "default",
          inactive: "secondary",
          suspended: "destructive"
        }
        return (
          <Badge variant={variants[status as keyof typeof variants] as any}>
            {status}
          </Badge>
        )
      },
    },
    {
      id: 'isVerified',
      accessorKey: 'isVerified',
      header: 'Verified',
      cell: ({ row }) => (
        <Badge variant={row.getValue("isVerified") ? "default" : "secondary"}>
          {row.getValue("isVerified") ? "✓ Verified" : "⚠ Unverified"}
        </Badge>
      ),
    },
  ], [])

  // Payment table columns
  const paymentColumns: ColumnDef<SamplePayment>[] = useMemo(() => [
    {
      id: 'customer',
      accessorKey: 'customer',
      header: 'Customer',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("customer")}</div>
      ),
    },
    {
      id: 'amount',
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        const payment = row.original
        return (
          <div className="font-medium">
            ${payment.amount.toFixed(2)} {payment.currency}
          </div>
        )
      },
    },
    {
      id: 'method',
      accessorKey: 'method',
      header: 'Method',
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("method")}</Badge>
      ),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const variants = {
          completed: "default",
          pending: "secondary",
          failed: "destructive"
        }
        return (
          <Badge variant={variants[status as keyof typeof variants] as any}>
            {status}
          </Badge>
        )
      },
    },
    {
      id: 'description',
      accessorKey: 'description',
      header: 'Description',
    },
  ], [])

  // Filter configurations
  const userFilters = [
    {
      id: "name",
      type: "text" as const,
      label: "Name",
      placeholder: "Search by name..."
    },
    {
      id: "role",
      type: "multiselect" as const,
      label: "Role",
      placeholder: "Select roles...",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Moderator", value: "moderator" },
        { label: "User", value: "user" }
      ]
    },
    {
      id: "status",
      type: "select" as const,
      label: "Status",
      placeholder: "All statuses",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Suspended", value: "suspended" }
      ]
    },
    {
      id: "isVerified",
      type: "boolean" as const,
      label: "Email Verified"
    }
  ]

  const paymentFilters = [
    {
      id: "customer",
      type: "text" as const,
      label: "Customer",
      placeholder: "Search by customer..."
    },
    {
      id: "method",
      type: "multiselect" as const,
      label: "Payment Method",
      placeholder: "Select methods...",
      options: [
        { label: "Credit Card", value: "Credit Card" },
        { label: "PayPal", value: "PayPal" },
        { label: "Bank Transfer", value: "Bank Transfer" }
      ]
    },
    {
      id: "status",
      type: "select" as const,
      label: "Status",
      options: [
        { label: "Completed", value: "completed" },
        { label: "Pending", value: "pending" },
        { label: "Failed", value: "failed" }
      ]
    }
  ]

  // View presets
  const userViewPresets = {
    basic: {
      name: "Basic Info",
      icon: "👤",
      description: "Name, Email, Role",
      columns: {
        name: true,
        email: true,
        role: true,
        department: false,
        status: false,
        isVerified: false,
      }
    },
    management: {
      name: "Management View",
      icon: "⚡",
      description: "Full management details",
      columns: {
        name: true,
        email: true,
        role: true,
        department: true,
        status: true,
        isVerified: true,
      }
    }
  }

  // Context menu actions
  const userContextActions = [
    {
      id: 'view',
      label: 'View Profile',
      icon: Eye,
      onClick: (row: SampleUser) => showToast.info("View", `Viewing ${row.name}'s profile`)
    },
    {
      id: 'edit',
      label: 'Edit User',
      icon: Edit,
      onClick: (row: SampleUser) => showToast.info("Edit", `Editing ${row.name}`)
    },
    {
      id: 'copy-email',
      label: 'Copy Email',
      icon: Copy,
      onClick: (row: SampleUser) => {
        navigator.clipboard.writeText(row.email)
        showToast.success("Copied", "Email copied to clipboard")
      },
      separator: true
    },
    {
      id: 'delete',
      label: 'Delete User',
      icon: Trash2,
      variant: 'destructive' as const,
      onClick: (row: SampleUser) => {
        if (confirm(`Delete ${row.name}?`)) {
          showToast.error("Deleted", `${row.name} has been deleted`)
        }
      }
    }
  ]

  // Sticky columns for payment table
  const paymentStickyColumns = [
    { id: 'customer', position: 'left' as const, width: 200 }
  ]

  const handleToastExamples = () => {
    showToast.success("Success!", "This is a success message")

    setTimeout(() => {
      showToast.error("Error!", "This is an error message")
    }, 1000)

    setTimeout(() => {
      showToast.warning("Warning!", "This is a warning message")
    }, 2000)

    setTimeout(() => {
      showToast.info("Info!", "This is an info message")
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center">
            <a className="flex items-center space-x-2" href="/">
              <span className="font-bold text-lg">
                UI Components
              </span>
            </a>
          </div>
          <nav className="flex items-center space-x-6">
            <a href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </a>
            <a href="/ui" className="text-sm font-medium text-primary">
              Components
            </a>
          </nav>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-12">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">UI Components Showcase</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive showcase of all available UI components in your design system.
            Use this as a reference for building your applications.
          </p>
        </div>

        <Tabs defaultValue="tables" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="tables">Data Tables</TabsTrigger>
            <TabsTrigger value="buttons">Buttons & Actions</TabsTrigger>
            <TabsTrigger value="forms">Forms & Inputs</TabsTrigger>
            <TabsTrigger value="data">Data Display</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>

          {/* NEW: Data Tables Tab */}
          <TabsContent value="tables" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  DataTable Component
                </CardTitle>
                <CardDescription>
                  Advanced table with sorting, filtering, pagination, sticky columns, and context menus
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* User Management Table */}
                <div className="space-y-4">
                  <h4 className="font-semibold">User Management Table</h4>
                  <p className="text-sm text-muted-foreground">
                    Features: Filtering, view presets, context menu, column visibility
                  </p>
                  <DataTable
                    data={sampleUsers}
                    columns={userColumns}
                    title="User Management"
                    description="Manage users and their permissions"
                    filters={userFilters}
                    viewPresets={userViewPresets}
                    defaultView="management"
                    variant="striped"
                    enableSorting
                    enableFiltering
                    enableColumnVisibility
                    enablePagination
                    enableGlobalSearch
                    enableContextMenu
                    contextMenuActions={userContextActions}
                    searchPlaceholder="Search users..."
                    pageSize={5}
                    pageSizeOptions={[5, 10, 20]}
                    onRowClick={(user) => showToast.info("Row Click", `Clicked on ${user.name}`)}
                  />
                </div>

                <Separator />

                {/* Payment Table with Sticky Columns */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Payment Table (Sticky Columns)</h4>
                  <p className="text-sm text-muted-foreground">
                    Features: Sticky columns, expandable rows, minimal variant
                  </p>
                  <DataTable
                    data={samplePayments}
                    columns={paymentColumns}
                    title="Payment History"
                    description="Track all payment transactions"
                    filters={paymentFilters}
                    variant="bordered"
                    enableSorting
                    enableFiltering
                    enableColumnVisibility
                    enablePagination
                    enableGlobalSearch
                    enableStickyColumns
                    stickyColumns={paymentStickyColumns}
                    enableExpanding
                    getRowCanExpand={(row) => true}
                    renderSubComponent={({ row }) => (
                      <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                        <h5 className="font-semibold">Payment Details</h5>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Payment ID:</span> {row.original.id}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {new Date(row.original.date).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Customer:</span> {row.original.customer}
                          </div>
                          <div>
                            <span className="font-medium">Description:</span> {row.original.description}
                          </div>
                        </div>
                      </div>
                    )}
                    searchPlaceholder="Search payments..."
                    pageSize={3}
                    onRowClick={(payment) => showToast.info("Payment", `Payment ${payment.id} clicked`)}
                  />
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>DataTable Features</AlertTitle>
                  <AlertDescription>
                    The DataTable supports filtering (text, select, multiselect, date range, number range, boolean),
                    sorting, pagination, column visibility, view presets, context menus, sticky columns,
                    expandable rows, and custom styling variants.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Buttons & Actions Tab */}
          <TabsContent value="buttons" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Different button variants and sizes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Variants</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="default">Default</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Sizes</h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">With Icons</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button><Download className="mr-2 h-4 w-4" />Download</Button>
                    <Button variant="outline"><Edit className="mr-2 h-4 w-4" />Edit</Button>
                    <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
                    <Button size="icon"><Plus className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dropdown Menu</CardTitle>
                <CardDescription>Contextual menus and dropdowns</CardDescription>
              </CardHeader>
              <CardContent>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <MoreHorizontal className="h-4 w-4 mr-2" />
                      Options
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dialog</CardTitle>
                <CardDescription>Modal dialogs and overlays</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Dialog Title</DialogTitle>
                      <DialogDescription>
                        This is a dialog description. You can put any content here.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value="John Doe" className="col-span-3" />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forms & Inputs Tab */}
          <TabsContent value="forms" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Form Controls</CardTitle>
                <CardDescription>Input fields, selects, and form elements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Enter your password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="select">Select</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                        <SelectItem value="option3">Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="textarea">Message</Label>
                    <Textarea id="textarea" placeholder="Enter your message" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Checkboxes & Switches</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={isChecked}
                        onCheckedChange={(checked) => setIsChecked(checked === true)}
                      />
                      <Label htmlFor="terms">Accept terms and conditions</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="notifications"
                        checked={isSwitchOn}
                        onCheckedChange={setIsSwitchOn}
                      />
                      <Label htmlFor="notifications">Enable notifications</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Display Tab */}
          <TabsContent value="data" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Badges & Status</CardTitle>
                <CardDescription>Status indicators and labels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avatars</CardTitle>
                <CardDescription>User profile pictures and initials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress & Loading</CardTitle>
                <CardDescription>Progress bars and loading states</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
                      Decrease
                    </Button>
                    <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
                      Increase
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Skeleton Loading</h4>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Alerts</CardTitle>
                <CardDescription>Important messages and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Heads up!</AlertTitle>
                  <AlertDescription>
                    This is a default alert message.
                  </AlertDescription>
                </Alert>

                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Something went wrong. Please try again.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Toast Notifications</CardTitle>
                <CardDescription>Temporary notifications and feedback</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button onClick={() => showToast.success("Success!", "Operation completed")}>
                    Success
                  </Button>
                  <Button onClick={() => showToast.error("Error!", "Something went wrong")}>
                    Error
                  </Button>
                  <Button onClick={() => showToast.warning("Warning!", "Please check input")}>
                    Warning
                  </Button>
                  <Button onClick={() => showToast.info("Info!", "Useful information")}>
                    Info
                  </Button>
                </div>
                <Button onClick={handleToastExamples} variant="outline" className="w-full">
                  Show All Toast Types (Sequential)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Cards</CardTitle>
                <CardDescription>Content containers and sections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Simple Card</CardTitle>
                      <CardDescription>A basic card component</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        This is the card content area.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Featured Card
                      </CardTitle>
                      <CardDescription>Card with icon in title</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Cards can include icons and various content types.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Separator</CardTitle>
                <CardDescription>Visual dividers for content sections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm">Content above separator</p>
                  <Separator />
                  <p className="text-sm">Content below separator</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Code Examples Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Quick Reference
            </CardTitle>
            <CardDescription>Common component usage patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">DataTable Basic Usage</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm">
                    {`<DataTable data={users}
columns={userColumns}
enableSorting
enableFiltering
filters={userFilters}
/>`}
                  </code>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">DataTable with Sticky Columns</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm">
                    {`<DataTabledata={data}
columns={columns}
enableStickyColumns
stickyColumns={[
{ id: 'name', position: 'left' }
]}
/>`}
                  </code>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Toast Notification</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm">
                    {`showToast.success(
  "Success!", 
  "Operation completed"
)`}
                  </code>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Form with Validation</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm">
                    {`<div className="space-y-2"><Label htmlFor="email">Email</Label>
<Input 
 id="email" 
 type="email" 
 placeholder="Enter email" 
/>
</div>`}
                  </code>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Status Badge</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm">
                    {`<Badge variant={status === 'active'
? 'default'
: 'secondary'
}>
{status}
</Badge>`}
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>{/* DataTable Props Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              DataTable Props Reference
            </CardTitle>
            <CardDescription>Complete list of DataTable component properties</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600">Core Props</h4>
                <div className="space-y-2 text-sm">
                  <div><code>data</code> - Table data array</div>
                  <div><code>columns</code> - Column definitions</div>
                  <div><code>title</code> - Table title</div>
                  <div><code>description</code> - Table description</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-blue-600">Feature Toggles</h4>
                <div className="space-y-2 text-sm">
                  <div><code>enableSorting</code> - Column sorting</div>
                  <div><code>enableFiltering</code> - Advanced filters</div>
                  <div><code>enablePagination</code> - Table pagination</div>
                  <div><code>enableContextMenu</code> - Right-click menu</div>
                  <div><code>enableStickyColumns</code> - Pin columns</div>
                  <div><code>enableExpanding</code> - Collapsible rows</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-purple-600">Configuration</h4>
                <div className="space-y-2 text-sm">
                  <div><code>filters</code> - Filter configurations</div>
                  <div><code>viewPresets</code> - Column presets</div>
                  <div><code>stickyColumns</code> - Sticky column config</div>
                  <div><code>contextMenuActions</code> - Menu actions</div>
                  <div><code>variant</code> - Table styling</div>
                </div>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Pro Tip</AlertTitle>
              <AlertDescription>
                The DataTable component is highly configurable. Start with basic props and add features as needed.
                All filter types (text, select, multiselect, dateRange, numberRange, boolean) are supported.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex items-center justify-center py-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            Built with shadcn/ui components and TanStack Table • Visit{" "}
            <a href="https://ui.shadcn.com" className="underline" target="_blank">
              shadcn/ui
            </a>{" "}
            and{" "}
            <a href="https://tanstack.com/table" className="underline" target="_blank">
              TanStack Table
            </a>{" "}
            for more information
          </p>
        </div>
      </div>
    </div>
  )
}