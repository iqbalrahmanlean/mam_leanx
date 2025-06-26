"use client"

import React, { useState, useMemo, useCallback } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel, // Add this for collapsible rows
  flexRender,
  ColumnDef,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  PaginationState,
  ExpandedState, // Add this
  FilterFn,
} from "@tanstack/react-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"
import {
  ChevronDown,
  ChevronRight, // Add this for collapsible rows
  Search,
  Filter,
  Columns,
  ChevronLeft,
  ChevronRight as ChevronRightPagination,
  ChevronsLeft,
  ChevronsRight,
  X,
  SortAsc,
  SortDesc,
  Copy,
  Edit,
  Trash2,
  Download,
  ExternalLink,
  FileText,
  Share2,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Helper function to format dates
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Filter Types
export type FilterType =
  | 'text'
  | 'select'
  | 'multiselect'
  | 'dateRange'
  | 'numberRange'
  | 'boolean'
  | 'custom'

export interface FilterOption {
  label: string
  value: string | number | boolean
}

export interface FilterConfig {
  id: string
  type: FilterType
  label: string
  placeholder?: string
  options?: FilterOption[]
  component?: React.ComponentType<any>
  filterFn?: FilterFn<any>
}

export interface ViewPreset {
  name: string
  icon?: string
  description?: string
  columns: Record<string, boolean>
}

export interface ContextMenuAction {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: (row: any) => void
  variant?: 'default' | 'destructive'
  separator?: boolean
}

// Add sticky column interface
export interface StickyColumn {
  id: string
  position: 'left' | 'right'
  width?: number
}

export interface DataTableProps<TData, TValue> {
  // Core props
  data: TData[]
  columns: ColumnDef<TData, TValue>[]

  // Styling
  className?: string
  variant?: 'default' | 'striped' | 'bordered' | 'minimal'

  // Features
  enableSorting?: boolean
  enableFiltering?: boolean
  enableColumnVisibility?: boolean
  enablePagination?: boolean
  enableGlobalSearch?: boolean
  enableContextMenu?: boolean
  enableExpanding?: boolean // Add this for collapsible rows
  enableStickyColumns?: boolean // Add this for sticky columns

  // Filter configuration
  filters?: FilterConfig[]

  // View presets
  viewPresets?: Record<string, ViewPreset>
  defaultView?: string

  // Pagination
  pageSize?: number
  pageSizeOptions?: number[]

  // Context menu
  contextMenuActions?: ContextMenuAction[]

  // Sticky columns
  stickyColumns?: StickyColumn[]

  // Expandable rows
  getRowCanExpand?: (row: any) => boolean
  renderSubComponent?: (props: { row: any }) => React.ReactElement

  // Customization
  title?: string
  description?: string
  searchPlaceholder?: string
  emptyMessage?: string

  // Callbacks
  onRowClick?: (row: TData) => void
  onRowSelect?: (rows: TData[]) => void
}

// Custom filter functions
const customFilterFns: Record<string, FilterFn<any>> = {
  dateRange: (row, columnId, value) => {
    const date = new Date(row.getValue(columnId))
    const [start, end] = value || []
    if (!start && !end) return true
    if (start && !end) return date >= start
    if (!start && end) return date <= end
    return date >= start && date <= end
  },
  numberRange: (row, columnId, value) => {
    const num = Number(row.getValue(columnId))
    const [min, max] = value || []
    if (min !== undefined && max !== undefined) return num >= min && num <= max
    if (min !== undefined) return num >= min
    if (max !== undefined) return num <= max
    return true
  },
  multiselect: (row, columnId, value) => {
    if (!value || value.length === 0) return true
    const cellValue = row.getValue(columnId)
    return value.includes(cellValue)
  }
}

// Filter Components (same as before - TextFilter, SelectFilter, etc.)
const TextFilter: React.FC<{
  value: string
  onChange: (value: string) => void
  placeholder?: string
}> = ({ value, onChange, placeholder }) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder={placeholder || "Search..."}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="pl-9"
    />
  </div>
)

const SelectFilter: React.FC<{
  value: string
  onChange: (value: string) => void
  options: FilterOption[]
  placeholder?: string
}> = ({ value, onChange, options, placeholder }) => (
  <Select value={value || ""} onValueChange={onChange}>
    <SelectTrigger>
      <SelectValue placeholder={placeholder || "Select..."} />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="">All</SelectItem>
      {options.map((option) => (
        <SelectItem key={option.value.toString()} value={option.value.toString()}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)

const MultiSelectFilter: React.FC<{
  value: string[]
  onChange: (value: string[]) => void
  options: FilterOption[]
  placeholder?: string
}> = ({ value = [], onChange, options, placeholder }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="w-full justify-between">
        {value.length > 0 ? `${value.length} selected` : placeholder || "Select..."}
        <ChevronDown className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      {options.map((option) => (
        <DropdownMenuCheckboxItem
          key={option.value.toString()}
          checked={value.includes(option.value.toString())}
          onCheckedChange={(checked) => {
            if (checked) {
              onChange([...value, option.value.toString()])
            } else {
              onChange(value.filter(v => v !== option.value.toString()))
            }
          }}
        >
          {option.label}
        </DropdownMenuCheckboxItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
)

const DateRangeFilter: React.FC<{
  value: [Date?, Date?]
  onChange: (value: [Date?, Date?]) => void
  placeholder?: string
}> = ({ value = [], onChange, placeholder }) => {
  const [start, end] = value

  return (
    <div className="flex space-x-2">
      <input
        type="date"
        value={start ? start.toISOString().split('T')[0] : ''}
        onChange={(e) => onChange([e.target.value ? new Date(e.target.value) : undefined, end])}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Start date"
      />
      <input
        type="date"
        value={end ? end.toISOString().split('T')[0] : ''}
        onChange={(e) => onChange([start, e.target.value ? new Date(e.target.value) : undefined])}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="End date"
      />
    </div>
  )
}

const NumberRangeFilter: React.FC<{
  value: [number?, number?]
  onChange: (value: [number?, number?]) => void
  placeholder?: string
}> = ({ value = [], onChange, placeholder }) => {
  const [min, max] = value

  return (
    <div className="flex space-x-2">
      <Input
        type="number"
        placeholder="Min"
        value={min || ""}
        onChange={(e) => onChange([e.target.value ? Number(e.target.value) : undefined, max])}
      />
      <Input
        type="number"
        placeholder="Max"
        value={max || ""}
        onChange={(e) => onChange([min, e.target.value ? Number(e.target.value) : undefined])}
      />
    </div>
  )
}

const BooleanFilter: React.FC<{
  value: boolean | undefined
  onChange: (value: boolean | undefined) => void
  label?: string
}> = ({ value, onChange, label }) => (
  <div className="flex items-center space-x-2">
    <Checkbox
      checked={value === true}
      onCheckedChange={(checked) => onChange(checked ? true : undefined)}
    />
    <Label>{label || "Enabled"}</Label>
  </div>
)

export function DataTable<TData, TValue>({
  data,
  columns,
  className,
  variant = 'default',
  enableSorting = true,
  enableFiltering = true,
  enableColumnVisibility = true,
  enablePagination = true,
  enableGlobalSearch = true,
  enableContextMenu = false,
  enableExpanding = false, // Add this
  enableStickyColumns = false, // Add this
  filters = [],
  viewPresets = {},
  defaultView = 'default',
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
  contextMenuActions = [],
  stickyColumns = [], // Add this
  getRowCanExpand, // Add this
  renderSubComponent, // Add this
  title,
  description,
  searchPlaceholder = "Search all columns...",
  emptyMessage = "No results found.",
  onRowClick,
  onRowSelect,
}: DataTableProps<TData, TValue>) {
  // State
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  })
  const [currentView, setCurrentView] = useState(defaultView)
  const [expanded, setExpanded] = useState<ExpandedState>({}) // Add this for collapsible rows

  // Copy functions for context menu (same as before)
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
      console.log(`Row data copied as ${format.toUpperCase()}!`)
    }).catch(() => {
      console.error('Failed to copy to clipboard')
    })
  }, [])

  const copyField = useCallback((value: string, fieldName: string) => {
    navigator.clipboard.writeText(value).then(() => {
      console.log(`${fieldName} copied to clipboard!`)
    }).catch(() => {
      console.error('Failed to copy to clipboard')
    })
  }, [])

  // Default context menu actions (same as before)
  const defaultContextMenuActions: ContextMenuAction[] = [
    {
      id: 'copy-row-json',
      label: 'Copy Row (JSON)',
      icon: Copy,
      onClick: (row) => copyRowData(row, 'json')
    },
    {
      id: 'copy-row-csv',
      label: 'Copy Row (CSV)',
      icon: FileText,
      onClick: (row) => copyRowData(row, 'csv')
    },
    {
      id: 'copy-row-text',
      label: 'Copy Row (Text)',
      icon: Share2,
      onClick: (row) => copyRowData(row, 'text'),
      separator: true
    },
    {
      id: 'view-details',
      label: 'View Details',
      icon: Eye,
      onClick: (row) => console.log('View details:', row.original)
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: Edit,
      onClick: (row) => console.log('Edit:', row.original)
    },
    {
      id: 'download',
      label: 'Download',
      icon: Download,
      onClick: (row) => console.log('Download:', row.original)
    },
    {
      id: 'open-new-tab',
      label: 'Open in New Tab',
      icon: ExternalLink,
      onClick: (row) => console.log('Open in new tab:', row.original),
      separator: true
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      variant: 'destructive' as const,
      onClick: (row) => {
        if (confirm('Are you sure you want to delete this item?')) {
          console.log('Delete:', row.original)
        }
      }
    }
  ]

  // Use custom context menu actions or defaults
  const finalContextMenuActions = contextMenuActions.length > 0 ? contextMenuActions : defaultContextMenuActions

  // Active filters count
  const activeFiltersCount = columnFilters.length + (globalFilter ? 1 : 0)

  // Apply view preset
  const applyViewPreset = useCallback((viewKey: string) => {
    const preset = viewPresets[viewKey]
    if (preset) {
      setColumnVisibility(preset.columns)
      setCurrentView(viewKey)
    }
  }, [viewPresets])

  // Calculate sticky positions
  const getStickyStyle = useCallback((columnId: string, index: number) => {
    if (!enableStickyColumns) return {}

    const stickyColumn = stickyColumns.find(col => col.id === columnId)
    if (!stickyColumn) return {}

    const leftColumns = stickyColumns.filter(col => col.position === 'left')
    const rightColumns = stickyColumns.filter(col => col.position === 'right')

    if (stickyColumn.position === 'left') {
      const leftOffset = leftColumns
        .filter(col => stickyColumns.indexOf(col) < stickyColumns.indexOf(stickyColumn))
        .reduce((acc, col) => acc + (col.width || 150), 0)

      return {
        position: 'sticky' as const,
        left: leftOffset,
        zIndex: 10,
        backgroundColor: 'hsl(var(--background))',
        borderRight: '1px solid hsl(var(--border))'
      }
    }

    if (stickyColumn.position === 'right') {
      const rightOffset = rightColumns
        .filter(col => stickyColumns.indexOf(col) < stickyColumns.indexOf(stickyColumn))
        .reduce((acc, col) => acc + (col.width || 150), 0)

      return {
        position: 'sticky' as const,
        right: rightOffset,
        zIndex: 10,
        backgroundColor: 'hsl(var(--background))',
        borderLeft: '1px solid hsl(var(--border))'
      }
    }

    return {}
  }, [enableStickyColumns, stickyColumns])

  // Filter component renderer
  const renderFilter = useCallback((filter: FilterConfig) => {
    const columnFilter = columnFilters.find(f => f.id === filter.id)
    const value = columnFilter?.value

    const updateFilter = (newValue: any) => {
      if (newValue === "" || newValue === undefined ||
        (Array.isArray(newValue) && newValue.length === 0)) {
        setColumnFilters(prev => prev.filter(f => f.id !== filter.id))
      } else {
        setColumnFilters(prev => [
          ...prev.filter(f => f.id !== filter.id),
          { id: filter.id, value: newValue }
        ])
      }
    }

    switch (filter.type) {
      case 'text':
        return (
          <TextFilter
            value={value as string}
            onChange={updateFilter}
            placeholder={filter.placeholder}
          />
        )
      case 'select':
        return (
          <SelectFilter
            value={value as string}
            onChange={updateFilter}
            options={filter.options || []}
            placeholder={filter.placeholder}
          />
        )
      case 'multiselect':
        return (
          <MultiSelectFilter
            value={value as string[]}
            onChange={updateFilter}
            options={filter.options || []}
            placeholder={filter.placeholder}
          />
        )
      case 'dateRange':
        return (
          <DateRangeFilter
            value={value as [Date?, Date?]}
            onChange={updateFilter}
            placeholder={filter.placeholder}
          />
        )
      case 'numberRange':
        return (
          <NumberRangeFilter
            value={value as [number?, number?]}
            onChange={updateFilter}
            placeholder={filter.placeholder}
          />
        )
      case 'boolean':
        return (
          <BooleanFilter
            value={value as boolean | undefined}
            onChange={updateFilter}
            label={filter.label}
          />
        )
      case 'custom':
        return filter.component ? (
          <filter.component value={value} onChange={updateFilter} />
        ) : null
      default:
        return null
    }
  }, [columnFilters])

  // Render table row with optional context menu and expandable support
  const renderTableRow = useCallback((row: any) => {
  const rowContent = (
    <>
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && "selected"}
        className={`w-full ${onRowClick ? "cursor-pointer" : ""} ${enableContextMenu ? "cursor-context-menu" : ""} hover:bg-muted/50`}
        onClick={() => onRowClick?.(row.original)}
      >
        {row.getVisibleCells().map((cell: any, index: number) => (
          <TableCell
            key={cell.id}
            style={getStickyStyle(cell.column.id, index)}
            className="px-4 py-2"
          >
            {/* Add expand/collapse button for first cell if expandable */}
            {enableExpanding && index === 0 && getRowCanExpand?.(row) && (
              <Button
                variant="ghost"
                size="sm"
                className="mr-2 h-4 w-4 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  row.toggleExpanded()
                }}
              >
                {row.getIsExpanded() ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
            {flexRender(
              cell.column.columnDef.cell,
              cell.getContext()
            )}
          </TableCell>
        ))}
      </TableRow>

      {/* Render expanded content if row is expanded */}
      {enableExpanding && row.getIsExpanded() && renderSubComponent && (
        <TableRow key={`${row.id}-expanded`} className="w-full">
          <TableCell colSpan={row.getVisibleCells().length} className="w-full">
            {renderSubComponent({ row })}
          </TableCell>
        </TableRow>
      )}
    </>
  )

  if (enableContextMenu && finalContextMenuActions.length > 0) {
    return (
      <ContextMenu key={row.id}>
        <ContextMenuTrigger asChild>
          {/* FIXED: Remove the div wrapper */}
          <tbody className="contents">
            {rowContent}
          </tbody>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          {finalContextMenuActions.map((action, index) => (
            <React.Fragment key={action.id}>
              <ContextMenuItem
                onClick={() => action.onClick(row)}
                className={action.variant === 'destructive' ? 'text-red-600' : ''}
              >
                {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                {action.label}
              </ContextMenuItem>
              {action.separator && index < finalContextMenuActions.length - 1 && (
                <ContextMenuSeparator />
              )}
            </React.Fragment>
          ))}
        </ContextMenuContent>
      </ContextMenu>
    )
  }

  return <React.Fragment key={row.id}>{rowContent}</React.Fragment>
}, [onRowClick, enableContextMenu, finalContextMenuActions, enableExpanding, getRowCanExpand, renderSubComponent, getStickyStyle])

  // Table configuration
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination,
      expanded, // Add this for collapsible rows
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded, // Add this for collapsible rows
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getExpandedRowModel: enableExpanding ? getExpandedRowModel() : undefined, // Add this
    getRowCanExpand: getRowCanExpand, // Add this
    filterFns: customFilterFns,
    enableSorting,
    enableFilters: enableFiltering,
    enableGlobalFilter: enableGlobalSearch,
    enableExpanding, // Add this
    manualPagination: false,
  })

  // Table variants
  const tableVariants = {
    default: "",
    striped: "[&_tbody_tr:nth-child(odd)]:bg-muted/50",
    bordered: "border border-border rounded-md",
    minimal: "border-none [&_thead_tr]:border-none [&_tbody_tr]:border-none",
  }

  return (
    <Card className={cn("w-full", className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardHeader>
      )}

      <CardContent className="space-y-4">
        {/* Controls Bar (same as before) */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 lg:items-center lg:justify-between">
          {/* Left side - Search and Filters */}
          <div className="flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2 lg:items-center">
            {/* Global Search */}
            {enableGlobalSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={globalFilter || ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-9 lg:w-64"
                />
              </div>
            )}

            {/* Filters Toggle */}
            {enableFiltering && filters.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {activeFiltersCount}
                      </Badge>
                    )}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-80">
                  <div className="p-4 space-y-4">
                    {filters.map((filter) => (
                      <div key={filter.id} className="space-y-2">
                        <Label className="text-sm font-medium">{filter.label}</Label>
                        {renderFilter(filter)}
                      </div>
                    ))}
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setColumnFilters([])
                          setGlobalFilter("")
                        }}
                        className="w-full"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Right side - View Controls */}
          <div className="flex space-x-2">
            {/* View Presets */}
            {Object.keys(viewPresets).length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Views
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {Object.entries(viewPresets).map(([key, preset]) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => applyViewPreset(key)}
                      className={currentView === key ? "bg-accent" : ""}
                    >
                      {preset.icon && <span className="mr-2">{preset.icon}</span>}
                      <div>
                        <div className="font-medium">{preset.name}</div>
                        {preset.description && (
                          <div className="text-xs text-muted-foreground">
                            {preset.description}
                          </div>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Column Visibility */}
            {enableColumnVisibility && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Columns className="h-4 w-4 mr-2" />
                    Columns
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Table with horizontal scroll for sticky columns */}
        <div className="rounded-md border overflow-x-auto">
          <Table className={cn(tableVariants[variant], "min-w-full table-fixed")}>
          <TableHeader>
  {table.getHeaderGroups().map((headerGroup) => (
    <TableRow key={headerGroup.id}>
      {headerGroup.headers.map((header, index) => (
        <TableHead 
          key={header.id}
          style={{
            ...getStickyStyle(header.id, index),
            width: header.getSize(),
            minWidth: header.getSize(),
          }}
          className={cn(
            "px-4 py-2 text-left",
            header.id === 'amount' && "text-right"
          )}
        >
          {header.isPlaceholder ? null : (
            <div
              className={cn(
                "flex items-center space-x-2",
                header.column.getCanSort() && "cursor-pointer select-none",
                header.id === 'amount' && "justify-end"
              )}
              onClick={header.column.getToggleSortingHandler()}
            >
              {flexRender(
                header.column.columnDef.header,
                header.getContext()
              )}
              {header.column.getCanSort() && (
                <div className="flex flex-col">
                  {header.column.getIsSorted() === "asc" && (
                    <SortAsc className="h-4 w-4" />
                  )}
                  {header.column.getIsSorted() === "desc" && (
                    <SortDesc className="h-4 w-4" />
                  )}
                  {!header.column.getIsSorted() && (
                    <div className="h-4 w-4" />
                  )}
                </div>
              )}
            </div>
          )}
        </TableHead>
      ))}
    </TableRow>
  ))}
</TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => renderTableRow(row))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination (same as before) */}
        {enablePagination && (
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRightPagination className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>

  )
}