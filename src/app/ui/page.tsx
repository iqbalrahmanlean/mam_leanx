// app/customers/page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dropzone } from "@/components/ui/dropzone"
import {
  Users,
  Upload,
  FileSpreadsheet,
  Image,
  CheckCircle,
  AlertCircle,
  Download
} from "lucide-react"

// Types for uploaded files
interface UploadedFile {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'completed' | 'error'
  progress: number
  error?: string
}

export default function CustomersPage() {
  const [singleFiles, setSingleFiles] = useState<UploadedFile[]>([])
  const [multipleFiles, setMultipleFiles] = useState<UploadedFile[]>([])
  const [singleUploading, setSingleUploading] = useState(false)
  const [multipleUploading, setMultipleUploading] = useState(false)

  // Handle single file upload
  const handleSingleFileAdd = (file: UploadedFile) => {
    setSingleFiles([file]) // Replace existing file
  }

  const handleSingleFileRemove = (fileId: string) => {
    setSingleFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleSingleUpload = async (files: UploadedFile[]) => {
    setSingleUploading(true)
    
    // Simulate upload process
    for (const file of files) {
      // Update file status to uploading
      setSingleFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'uploading', progress: 0 } : f
      ))

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setSingleFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress } : f
        ))
      }

      // Mark as completed
      setSingleFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'completed', progress: 100 } : f
      ))
    }
    
    setSingleUploading(false)
  }

  // Handle multiple files upload
  const handleMultipleFileAdd = (file: UploadedFile) => {
    setMultipleFiles(prev => [...prev, file])
  }

  const handleMultipleFileRemove = (fileId: string) => {
    setMultipleFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleMultipleUpload = async (files: UploadedFile[]) => {
    setMultipleUploading(true)
    
    // Process files simultaneously
    const uploadPromises = files.map(async (file) => {
      // Update file status to uploading
      setMultipleFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'uploading', progress: 0 } : f
      ))

      // Simulate progress for each file
      for (let progress = 0; progress <= 100; progress += 25) {
        await new Promise(resolve => setTimeout(resolve, 150))
        setMultipleFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress } : f
        ))
      }

      // Mark as completed
      setMultipleFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'completed', progress: 100 } : f
      ))
    })

    await Promise.all(uploadPromises)
    setMultipleUploading(false)
  }

  // Get upload statistics
  const getSingleStats = () => {
    const total = singleFiles.length
    const completed = singleFiles.filter(f => f.status === 'completed').length
    const pending = singleFiles.filter(f => f.status === 'pending').length
    const errors = singleFiles.filter(f => f.status === 'error').length
    
    return { total, completed, pending, errors }
  }

  const getMultipleStats = () => {
    const total = multipleFiles.length
    const completed = multipleFiles.filter(f => f.status === 'completed').length
    const pending = multipleFiles.filter(f => f.status === 'pending').length
    const errors = multipleFiles.filter(f => f.status === 'error').length
    
    return { total, completed, pending, errors }
  }

  const singleStats = getSingleStats()
  const multipleStats = getMultipleStats()

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Customer File Upload</h1>
        <p className="text-muted-foreground mt-2">
          Upload customer data files individually or in batches
        </p>
      </div>

      {/* Single File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Single File Upload
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload one customer data file at a time (CSV, Excel, or Image)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Single Upload Stats */}
          {singleFiles.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-sm font-medium">Total</div>
                  <div className="text-lg font-bold text-blue-600">{singleStats.total}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <div className="text-sm font-medium">Completed</div>
                  <div className="text-lg font-bold text-green-600">{singleStats.completed}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                <Upload className="h-4 w-4 text-yellow-600" />
                <div>
                  <div className="text-sm font-medium">Pending</div>
                  <div className="text-lg font-bold text-yellow-600">{singleStats.pending}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <div>
                  <div className="text-sm font-medium">Errors</div>
                  <div className="text-lg font-bold text-red-600">{singleStats.errors}</div>
                </div>
              </div>
            </div>
          )}

          {/* Single File Dropzone */}
          <Dropzone
            accept=".csv,.xlsx,.xls,image/*"
            multiple={false}
            maxFiles={1}
            maxSize={10485760} // 10MB
            variant="default"
            title="Upload Single Customer File"
            description="CSV, Excel, or Image files up to 10MB"
            buttonText="Choose File"
            files={singleFiles}
            uploading={singleUploading}
            onFileAdd={handleSingleFileAdd}
            onFileRemove={handleSingleFileRemove}
            onUpload={handleSingleUpload}
            className="border-dashed border-2 border-blue-200 bg-blue-50/30"
          />

          {/* Action Buttons for Single Upload */}
          {singleFiles.length > 0 && (
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setSingleFiles([])}
                disabled={singleUploading}
              >
                Clear
              </Button>
              {singleStats.completed > 0 && (
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Results
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Multiple Files Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Multiple Files Upload
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload multiple customer data files at once (up to 20 files)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Multiple Upload Stats */}
          {multipleFiles.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                <FileSpreadsheet className="h-4 w-4 text-purple-600" />
                <div>
                  <div className="text-sm font-medium">Total Files</div>
                  <div className="text-lg font-bold text-purple-600">{multipleStats.total}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <div className="text-sm font-medium">Completed</div>
                  <div className="text-lg font-bold text-green-600">{multipleStats.completed}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                <Upload className="h-4 w-4 text-orange-600" />
                <div>
                  <div className="text-sm font-medium">Pending</div>
                  <div className="text-lg font-bold text-orange-600">{multipleStats.pending}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <div>
                  <div className="text-sm font-medium">Errors</div>
                  <div className="text-lg font-bold text-red-600">{multipleStats.errors}</div>
                </div>
              </div>
            </div>
          )}

          {/* Multiple Files Dropzone */}
          <Dropzone
            accept=".csv,.xlsx,.xls,image/*"
            multiple={true}
            maxFiles={20}
            maxSize={10485760} // 10MB
            variant="default"
            title="Upload Multiple Customer Files"
            description="CSV, Excel, or Image files up to 10MB each (max 20 files)"
            buttonText="Choose Files"
            files={multipleFiles}
            uploading={multipleUploading}
            onFileAdd={handleMultipleFileAdd}
            onFileRemove={handleMultipleFileRemove}
            onUpload={handleMultipleUpload}
            className="border-dashed border-2 border-purple-200 bg-purple-50/30"
          />

          {/* Action Buttons for Multiple Upload */}
          {multipleFiles.length > 0 && (
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setMultipleFiles([])}
                disabled={multipleUploading}
              >
                Clear All
              </Button>
              {multipleStats.completed > 0 && (
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Batch Results
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Summary */}
      {(singleFiles.length > 0 || multipleFiles.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Single Upload Summary */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Single Upload Status
                </h4>
                <div className="space-y-2">
                  {singleStats.total > 0 ? (
                    <>
                      <div className="flex justify-between">
                        <span>Files Uploaded:</span>
                        <Badge variant="outline">{singleStats.total}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Success Rate:</span>
                        <Badge className={singleStats.completed === singleStats.total ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                          {singleStats.total > 0 ? Math.round((singleStats.completed / singleStats.total) * 100) : 0}%
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No files uploaded yet</p>
                  )}
                </div>
              </div>

              {/* Multiple Upload Summary */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Batch Upload Status
                </h4>
                <div className="space-y-2">
                  {multipleStats.total > 0 ? (
                    <>
                      <div className="flex justify-between">
                        <span>Files Uploaded:</span>
                        <Badge variant="outline">{multipleStats.total}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Success Rate:</span>
                        <Badge className={multipleStats.completed === multipleStats.total ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                          {multipleStats.total > 0 ? Math.round((multipleStats.completed / multipleStats.total) * 100) : 0}%
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No files uploaded yet</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}