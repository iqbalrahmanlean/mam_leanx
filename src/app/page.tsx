"use client"

import { showToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const handleSuccess = () => {
    showToast.success("Success!", "Operation completed successfully")
  }

  const handleError = () => {
    showToast.error("Error occurred", "Something went wrong, please try again")
  }

  const handleWarning = () => {
    showToast.warning("Warning", "Please check your input before proceeding")
  }

  const handleInfo = () => {
    showToast.info("Information", "Here's some useful information for you")
  }

  const handleLoading = () => {
    const loadingToast = showToast.loading("Processing...", "Please wait while we process your request")
    
    // Simulate async operation
    setTimeout(() => {
      showToast.dismiss(loadingToast)
      showToast.success("Completed!", "Your request has been processed successfully")
    }, 3000)
  }

  const handlePromise = () => {
    const apiCall = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve("Data loaded") : reject("Network error")
      }, 2000)
    })

    showToast.promise(apiCall, {
      loading: "Loading data...",
      success: "Data loaded successfully!",
      error: "Failed to load data"
    })
  }

  const handleLogin = async () => {
    // Simulate login API call
    const loginPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.3
        if (success) {
          resolve({ user: "John Doe", email: "john@example.com" })
        } else {
          reject("Invalid credentials")
        }
      }, 1500)
    })

    showToast.promise(loginPromise, {
      loading: "Logging in...",
      success: (data: any) => `Welcome back, ${data.user}!`,
      error: "Login failed. Please check your credentials."
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Toast Demo with Sonner</h1>
          <p className="text-muted-foreground">
            Click the buttons below to see different types of toast notifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Toasts */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Toast Types</CardTitle>
              <CardDescription>
                Simple toast notifications with different styles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleSuccess} className="w-full">
                Success Toast
              </Button>
              <Button onClick={handleError} variant="destructive" className="w-full">
                Error Toast
              </Button>
              <Button onClick={handleWarning} variant="outline" className="w-full">
                Warning Toast
              </Button>
              <Button onClick={handleInfo} variant="secondary" className="w-full">
                Info Toast
              </Button>
            </CardContent>
          </Card>

          {/* Advanced Toasts */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Toast Features</CardTitle>
              <CardDescription>
                Loading states and promise-based toasts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleLoading} variant="outline" className="w-full">
                Loading Toast (3s)
              </Button>
              <Button onClick={handlePromise} variant="outline" className="w-full">
                Promise Toast (Random)
              </Button>
              <Button onClick={handleLogin} variant="default" className="w-full">
                Simulate Login
              </Button>
              <Button 
                onClick={() => showToast.dismiss()} 
                variant="ghost" 
                className="w-full"
              >
                Dismiss All Toasts
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use in Your Components</CardTitle>
            <CardDescription>
              Import and use the toast functions anywhere in your app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
{`import { showToast } from "@/hooks/use-toast"

// Simple usage
showToast.success("Success!")
showToast.error("Error occurred")

// With description
showToast.success("Login successful", "Welcome back!")

// For API calls
showToast.promise(loginAPI(), {
  loading: "Logging in...",
  success: "Welcome back!",
  error: "Login failed"
})

// Loading with manual dismiss
const loadingId = showToast.loading("Processing...")
// Later...
showToast.dismiss(loadingId)`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Real-world Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Real-world Examples</CardTitle>
            <CardDescription>
              Common scenarios where you'd use toasts
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              onClick={() => showToast.success("Profile updated", "Your changes have been saved")} 
              variant="outline"
            >
              Save Profile
            </Button>
            <Button 
              onClick={() => showToast.error("Upload failed", "File size too large")} 
              variant="outline"
            >
              Upload File
            </Button>
            <Button 
              onClick={() => showToast.info("New message", "You have 3 unread messages")} 
              variant="outline"
            >
              Check Messages
            </Button>
            <Button 
              onClick={() => showToast.warning("Session expiring", "Please save your work")} 
              variant="outline"
            >
              Session Warning
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}