// app/otp-demo/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { OTPInput } from "@/components/ui/otp-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { showToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Smartphone,
  Mail,
  Shield,
  Check,
  AlertCircle,
  Copy,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react"

export default function OTPDemoPage() {
  // Demo states
  const [phoneOTP, setPhoneOTP] = useState("")
  const [emailOTP, setEmailOTP] = useState("")
  const [secureOTP, setSecureOTP] = useState("")
  const [customOTP, setCustomOTP] = useState("")
  
  // Demo control states
  const [phoneVerifying, setPhoneVerifying] = useState(false)
  const [emailVerifying, setEmailVerifying] = useState(false)
  const [phoneVariant, setPhoneVariant] = useState<'default' | 'success' | 'error'>('default')
  const [emailVariant, setEmailVariant] = useState<'default' | 'success' | 'error'>('default')
  const [showMask, setShowMask] = useState(true)

  // Simulated phone verification
  const handlePhoneComplete = async (otp: string) => {
    setPhoneVerifying(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (otp === "123456") {
      setPhoneVariant('success')
      showToast.success("Phone Verified!", "Your phone number has been successfully verified.")
    } else {
      setPhoneVariant('error')
      showToast.error("Invalid Code", "The verification code is incorrect. Please try again.")
    }
    
    setPhoneVerifying(false)
  }

  // Simulated email verification  
  const handleEmailComplete = async (otp: string) => {
    setEmailVerifying(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (otp === "ABCD") {
      setEmailVariant('success')
      showToast.success("Email Verified!", "Your email has been successfully verified.")
    } else {
      setEmailVariant('error') 
      showToast.error("Invalid Code", "The verification code is incorrect.")
    }
    
    setEmailVerifying(false)
  }

  // Resend handlers
  const handlePhoneResend = () => {
    setPhoneOTP("")
    setPhoneVariant('default')
    showToast.info("Code Sent", "A new verification code has been sent to your phone.")
  }

  const handleEmailResend = () => {
    setEmailOTP("")
    setEmailVariant('default')
    showToast.info("Code Sent", "A new verification code has been sent to your email.")
  }

  const copyDemoCode = (code: string, type: string) => {
    navigator.clipboard.writeText(code)
    showToast.success("Copied!", `Demo ${type} code copied to clipboard`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">OTP Component Demo</h1>
            <p className="text-muted-foreground">
              Interactive examples of the OTP input component with different configurations
            </p>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Live Demo
          </Badge>
        </div>

        {/* Demo Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Phone Verification Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-blue-600" />
                Phone Verification
              </CardTitle>
              <CardDescription>
                6-digit numeric OTP with timer and resend functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>Demo code: <strong>123456</strong></span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyDemoCode("123456", "phone")}
                    className="h-6 px-2"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </AlertDescription>
              </Alert>
              
              <OTPInput
                length={6}
                value={phoneOTP}
                onChange={setPhoneOTP}
                onComplete={handlePhoneComplete}
                allowedChars="numeric"
                label="Enter verification code"
                description="We sent a 6-digit code to +1 (555) 123-4567"
                showTimer={true}
                timerDuration={60}
                onResend={handlePhoneResend}
                verifying={phoneVerifying}
                variant={phoneVariant}
                successMessage={phoneVariant === 'success' ? "Phone verified successfully!" : undefined}
                errorMessage={phoneVariant === 'error' ? "Invalid code. Please try again." : undefined}
                size="default"
              />
            </CardContent>
          </Card>

          {/* Email Verification Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-green-600" />
                Email Verification
              </CardTitle>
              <CardDescription>
                4-character alphanumeric code with custom styling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>Demo code: <strong>ABCD</strong></span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyDemoCode("ABCD", "email")}
                    className="h-6 px-2"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </AlertDescription>
              </Alert>
              
              <OTPInput
                length={4}
                value={emailOTP}
                onChange={setEmailOTP}
                onComplete={handleEmailComplete}
                allowedChars="alphanumeric"
                label="Email verification code"
                description="Check your email for the 4-character code"
                showTimer={true}
                timerDuration={120}
                onResend={handleEmailResend}
                verifying={emailVerifying}
                variant={emailVariant}
                successMessage={emailVariant === 'success' ? "Email verified successfully!" : undefined}
                errorMessage={emailVariant === 'error' ? "Invalid code. Please try again." : undefined}
                size="lg"
                separator={true}
                separatorText="-"
                groupSize={2}
              />
            </CardContent>
          </Card>

          {/* Secure PIN Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Secure PIN Entry
              </CardTitle>
              <CardDescription>
                4-digit masked PIN with toggle visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Characters are masked for security
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMask(!showMask)}
                  className="h-8 px-2"
                >
                  {showMask ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showMask ? "Show" : "Hide"}
                </Button>
              </div>
              
              <OTPInput
                length={4}
                value={secureOTP}
                onChange={setSecureOTP}
                onComplete={(otp) => showToast.info("PIN Entered", `Your PIN: ${otp}`)}
                allowedChars="numeric"
                label="Enter your secure PIN"
                description="4-digit PIN for account access"
                mask={showMask}
                size="lg"
                variant="default"
                placeholder="•"
              />
            </CardContent>
          </Card>

          {/* Custom Configuration Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-orange-600" />
                Custom Configuration
              </CardTitle>
              <CardDescription>
                8-character code with separators and custom validation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Accepts letters and numbers with custom grouping
              </div>
              
              <OTPInput
                length={8}
                value={customOTP}
                onChange={setCustomOTP}
                onComplete={(otp) => showToast.success("Code Complete", `Custom code: ${otp}`)}
                allowedChars="alphanumeric"
                label="Custom format code"
                description="8-character alphanumeric code"
                size="default"
                separator={true}
                separatorText="-"
                groupSize={4}
                variant="default"
                showTimer={false}
                resendText="Generate New"
                onResend={() => {
                  setCustomOTP("")
                  showToast.info("New Code", "Generated a new code format")
                }}
              />
              
              {customOTP.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  Current value: <code className="bg-muted px-1 rounded">{customOTP}</code>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Component Features</CardTitle>
            <CardDescription>
              Complete overview of OTP component capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Input Types</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Numeric (0-9)</li>
                  <li>• Alphabetic (A-Z)</li>
                  <li>• Alphanumeric (A-Z, 0-9)</li>
                  <li>• Custom patterns</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Sizes & Variants</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Small, Default, Large</li>
                  <li>• Success, Error, Warning</li>
                  <li>• Custom styling support</li>
                  <li>• Dark mode compatible</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Advanced Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Timer with countdown</li>
                  <li>• Resend functionality</li>
                  <li>• Password masking</li>
                  <li>• Paste support</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Validation</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Real-time validation</li>
                  <li>• Custom error messages</li>
                  <li>• Success states</li>
                  <li>• Loading indicators</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Navigation</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Arrow key navigation</li>
                  <li>• Backspace handling</li>
                  <li>• Auto-focus next input</li>
                  <li>• Home/End support</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Customization</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Separators & grouping</li>
                  <li>• Custom labels</li>
                  <li>• Placeholder text</li>
                  <li>• Flexible length</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Implementation</CardTitle>
            <CardDescription>
              Copy these examples to get started quickly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Basic Usage</h4>
                <div className="bg-muted p-3 rounded-lg">
                  <code className="text-sm">
{`<OTPInput
  length={6}
  onComplete={(otp) => verify(otp)}
  label="Enter verification code"
/>`}
                  </code>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">With Timer</h4>
                <div className="bg-muted p-3 rounded-lg">
                  <code className="text-sm">
{`<OTPInput
  length={6}
  showTimer={true}
  timerDuration={60}
  onResend={() => resendCode()}
  onComplete={(otp) => verify(otp)}
/>`}
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex items-center justify-center py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Built with shadcn/ui components and TypeScript
            </p>
            <Link href="/login">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}