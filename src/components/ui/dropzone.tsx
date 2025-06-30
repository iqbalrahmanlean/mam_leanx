// components/ui/dropzone.tsx
"use client"

import React, { useCallback, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  Upload, 
  X, 
  FileImage, 
  File, 
  Check, 
  AlertCircle,
  FileText,
  FileSpreadsheet,
  Folder,
  Download
} from "lucide-react"

// Types
interface DropzoneFile {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'completed' | 'error'
  progress: number
  error?: string
}

interface DropzoneProps {
  // Configuration
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  maxFiles?: number
  
  // UI Configuration
  variant?: 'default' | 'compact' | 'minimal'
  showPreview?: boolean
  showProgress?: boolean
  disabled?: boolean
  
  // Content customization
  title?: string
  description?: string
  buttonText?: string
  
  // Styling
  className?: string
  dropzoneClassName?: string
  
  // Callbacks
  onDrop?: (files: File[]) => void
  onFileAdd?: (file: DropzoneFile) => void
  onFileRemove?: (fileId: string) => void
  onUpload?: (files: DropzoneFile[]) => Promise<void> | void
  onUploadProgress?: (fileId: string, progress: number) => void
  
  // External control
  files?: DropzoneFile[]
  uploading?: boolean
}

// File type detection
const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return FileImage
  if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv')) return FileSpreadsheet
  if (fileType.includes('text') || fileType.includes('document')) return FileText
  return File
}

const getFileTypeColor = (fileType: string) => {
  if (fileType.startsWith('image/')) return 'text-blue-600'
  if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv')) return 'text-green-600'
  if (fileType.includes('text') || fileType.includes('document')) return 'text-purple-600'
  return 'text-gray-600'
}

// File Preview Component
interface FilePreviewProps {
  fileData: DropzoneFile
  onRemove: (fileId: string) => void
  showProgress?: boolean
  className?: string
}

const FilePreview: React.FC<FilePreviewProps> = ({ 
  fileData, 
  onRemove, 
  showProgress = true,
  className = ""
}) => {
  const { file, status, progress, error } = fileData
  const FileIcon = getFileIcon(file.type)
  const [preview, setPreview] = useState<string | null>(null)

  React.useEffect(() => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [file])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      case 'completed':
        return <Check className="w-4 h-4 text-green-600" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <FileIcon className="w-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'text-green-600 border-green-200 bg-green-50'
      case 'error': return 'text-red-600 border-red-200 bg-red-50'
      case 'uploading': return 'text-blue-600 border-blue-200 bg-blue-50'
      default: return 'text-muted-foreground border-border bg-background'
    }
  }

  return (
    <div className={cn("relative group border rounded-lg p-3 transition-all hover:shadow-sm", getStatusColor(), className)}>
      {/* Remove Button */}
      <Button
        variant="destructive"
        size="sm"
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onRemove(fileData.id)}
      >
        <X className="w-3 h-3" />
      </Button>

      <div className="flex items-start space-x-3">
        {/* File Icon/Preview */}
        <div className="flex-shrink-0">
          {preview ? (
            <img
              src={preview}
              alt={file.name}
              className="w-12 h-12 object-cover rounded border"
            />
          ) : (
            <div className={cn(
              "w-12 h-12 rounded border flex items-center justify-center",
              getFileTypeColor(file.type)
            )}>
              <FileIcon className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm font-medium truncate" title={file.name}>
              {file.name}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </span>
            <Badge variant="outline" className={cn("text-xs", getStatusColor())}>
              {status}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          {showProgress && status === 'uploading' && (
            <div className="mt-2 space-y-1">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{progress}%</span>
                <span>Uploading...</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {status === 'error' && error && (
            <p className="text-xs text-red-600 mt-1">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// Main Dropzone Component
export const Dropzone: React.FC<DropzoneProps> = ({
  accept = "*",
  multiple = true,
  maxSize = 5242880, // 5MB
  maxFiles = 10,
  variant = 'default',
  showPreview = true,
  showProgress = true,
  disabled = false,
  title,
  description,
  buttonText = "Choose Files",
  className = "",
  dropzoneClassName = "",
  onDrop,
  onFileAdd,
  onFileRemove,
  onUpload,
  files: externalFiles,
  uploading: externalUploading = false
}) => {
  const [internalFiles, setInternalFiles] = useState<DropzoneFile[]>([])
  const [isDragActive, setIsDragActive] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)
  const [internalUploading, setInternalUploading] = useState(false)

  // Use external files if provided, otherwise use internal state
  const files = externalFiles || internalFiles
  const uploading = externalUploading || internalUploading

  // Event handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev + 1)
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true)
    }
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => {
      const newCounter = prev - 1
      if (newCounter === 0) setIsDragActive(false)
      return newCounter
    })
  }, [])

  const validateFile = (file: File): string | null => {
    // Check file size
    if (maxSize && file.size > maxSize) {
      return `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`
    }

    // Check file type
    if (accept !== "*") {
      const acceptedTypes = accept.split(',').map(type => type.trim())
      const isValid = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        }
        return file.type.match(type.replace('*', '.*'))
      })
      
      if (!isValid) {
        return `File type not supported. Accepted: ${accept}`
      }
    }

    return null
  }

  const processFiles = (newFiles: File[]) => {
    if (disabled) return

    // Check max files limit
    if (!multiple && newFiles.length > 1) {
      newFiles = [newFiles[0]]
    }
    
    if (files.length + newFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    const validFiles = newFiles
      .map(file => ({ file, error: validateFile(file) }))
      .filter(({ error }) => {
        if (error) {
          alert(error)
          return false
        }
        return true
      })
      .map(({ file }) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        status: 'pending' as const,
        progress: 0
      }))

    if (validFiles.length === 0) return

    // Add files
    if (externalFiles) {
      validFiles.forEach(fileData => onFileAdd?.(fileData))
    } else {
      setInternalFiles(prev => [...prev, ...validFiles])
    }

    // Call onDrop callback
    onDrop?.(validFiles.map(f => f.file))
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    setDragCounter(0)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files))
      e.dataTransfer.clearData()
    }
  }, [disabled, multiple, maxFiles, maxSize, accept, files.length, onDrop, onFileAdd, externalFiles])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files))
      e.target.value = '' // Reset input
    }
  }

  const removeFile = (fileId: string) => {
    if (externalFiles) {
      onFileRemove?.(fileId)
    } else {
      setInternalFiles(prev => prev.filter(f => f.id !== fileId))
    }
  }

  const clearAllFiles = () => {
    if (externalFiles) {
      files.forEach(file => onFileRemove?.(file.id))
    } else {
      setInternalFiles([])
    }
  }

  // Simulate upload for internal files
  const simulateUpload = async (fileData: DropzoneFile) => {
    const updateFile = (updates: Partial<DropzoneFile>) => {
      if (externalFiles) return
      setInternalFiles(prev => prev.map(f => 
        f.id === fileData.id ? { ...f, ...updates } : f
      ))
    }

    updateFile({ status: 'uploading', progress: 0 })

    try {
      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200))
        updateFile({ progress })
      }
      updateFile({ status: 'completed', progress: 100 })
    } catch (error) {
      updateFile({ status: 'error', error: 'Upload failed' })
    }
  }

  const handleUpload = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending')
    if (pendingFiles.length === 0) return

    if (onUpload) {
      const result = onUpload(pendingFiles)
      // Handle both sync and async functions
      if (result instanceof Promise) {
        await result
      }
    } else {
      setInternalUploading(true)
      for (const file of pendingFiles) {
        await simulateUpload(file)
      }
      setInternalUploading(false)
    }
  }

  // Render different variants
  const getDropzoneContent = () => {
    const baseContent = {
      title: title || (multiple ? "Drop files here or click to browse" : "Drop file here or click to browse"),
      description: description || `Support for ${accept === "*" ? "all file types" : accept.replace(/\./g, '').toUpperCase()} up to ${Math.round(maxSize / 1024 / 1024)}MB${multiple ? " each" : ""}`,
      buttonText
    }

    switch (variant) {
      case 'compact':
        return (
          <div className="flex items-center justify-center space-x-4 py-4">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium">{baseContent.title}</p>
              <p className="text-sm text-muted-foreground">{baseContent.description}</p>
            </div>
            <Button variant="outline" size="sm">
              <Folder className="w-4 h-4 mr-2" />
              {baseContent.buttonText}
            </Button>
          </div>
        )

      case 'minimal':
        return (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">{baseContent.title}</p>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-8">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{baseContent.title}</h3>
            <p className="text-muted-foreground mb-4">{baseContent.description}</p>
            <Button variant="outline">
              <Folder className="w-4 h-4 mr-2" />
              {baseContent.buttonText}
            </Button>
          </div>
        )
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Dropzone Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-colors duration-200 ease-in-out",
          isDragActive 
            ? "border-primary bg-primary/5 border-solid" 
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "cursor-pointer",
          dropzoneClassName
        )}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        {getDropzoneContent()}
      </div>

      {/* File Management */}
      {showPreview && files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Files ({files.length}{maxFiles > 0 && `/${maxFiles}`})
            </h4>
            <div className="flex gap-2">
              {files.some(f => f.status === 'pending') && (
                <Button 
                  size="sm" 
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : `Upload ${files.filter(f => f.status === 'pending').length} files`}
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={clearAllFiles}>
                Clear All
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            {files.map((fileData) => (
              <FilePreview
                key={fileData.id}
                fileData={fileData}
                onRemove={removeFile}
                showProgress={showProgress}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Usage Examples Component
export const DropzoneExamples = () => {
  const [imageFiles, setImageFiles] = useState<DropzoneFile[]>([])
  const [csvFiles, setCsvFiles] = useState<DropzoneFile[]>([])

  const handleImageUpload = (files: DropzoneFile[]) => {
    console.log('Uploading images:', files)
    // Your upload logic here
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Dropzone Examples</h2>
        <p className="text-muted-foreground mb-8">
          Versatile dropzone component with different configurations
        </p>
      </div>

      {/* Image Upload - Default Variant */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Image Upload (Default)</h3>
        <Dropzone
          accept="image/*"
          multiple={true}
          maxFiles={5}
          title="Upload Images"
          description="PNG, JPG, GIF up to 5MB each"
          onDrop={(files) => console.log('Images dropped:', files)}
        />
      </div>

      {/* CSV Import - Compact Variant */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">CSV Import (Compact)</h3>
        <Dropzone
          accept=".csv,.xlsx,.xls"
          multiple={false}
          variant="compact"
          title="Import customer data"
          description="CSV, Excel files only"
          onDrop={(files) => console.log('CSV dropped:', files)}
        />
      </div>

      {/* Document Upload - Minimal Variant */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Document Upload (Minimal)</h3>
        <Dropzone
          accept=".pdf,.doc,.docx"
          multiple={true}
          variant="minimal"
          showPreview={false}
          onDrop={(files) => console.log('Documents dropped:', files)}
        />
      </div>

      {/* External State Management */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">External State Management</h3>
        <Dropzone
          accept="image/*"
          multiple={true}
          files={imageFiles}
          onFileAdd={(file) => setImageFiles(prev => [...prev, file])}
          onFileRemove={(id) => setImageFiles(prev => prev.filter(f => f.id !== id))}
          onUpload={handleImageUpload}
        />
      </div>
    </div>
  )
}