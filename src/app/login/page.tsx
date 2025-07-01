// login/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { showToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { authUtils } from "@/lib/auth"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import * as TooltipPrimitive from "@/components/ui/tooltip"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Github,
  Chrome,
  Loader2,
  User,
  Shield,
  Fingerprint,
  Globe,
  Check,
  X,
  Smartphone
} from "lucide-react"

import { useTranslation } from 'react-i18next'
import '@/lib/i18n'

export default function LoginPage() {
  const { t, i18n } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginProgress, setLoginProgress] = useState(0)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false)
  const [showDemoCard, setShowDemoCard] = useState(true)

  const languages = [
    { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
    { code: "ms", name: "Malaysian", nativeName: "Bahasa Malaysia", flag: "🇲🇾" }
  ]

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === selectedLanguage) || languages[0]
  }
  const handleLanguageChange = (languageCode: string) => {
    console.log('Changing language to:', languageCode) // Debug log
    i18n.changeLanguage(languageCode)
    const selectedLang = languages.find(lang => lang.code === languageCode)
    showToast.success(t('language_changed'), t('language_switched', { language: selectedLang?.nativeName }));

    setIsLanguageModalOpen(false)
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError("")
  setIsLoading(true)
  setLoginProgress(0)

  if (!email || !password) {
    setError(t('fill_required_fields'))
    setIsLoading(false)
    return
  }

  if (!email.includes("@")) {
    setError(t('valid_email'))
    setIsLoading(false)
    return
  }

  if (password.length < 6) {
    setError(t('password_length'))
    setIsLoading(false)
    return
  }

  const progressInterval = setInterval(() => {
    setLoginProgress(prev => {
      if (prev >= 90) {
        clearInterval(progressInterval)
        return 90
      }
      return prev + 10
    })
  }, 200)

  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoginProgress(100)

    if (email === "demo@example.com" && password === "password123") {
      // Use auth utility to set authentication data
      authUtils.setAuthData(email, rememberMe)
      
      showToast.success(t('login_successful'), t('welcome_back_user', { name: email.split('@')[0] }))
      
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 1000)
    } else {
      setError(t('invalid_credentials'))
    }
  } catch (err) {
    setError(t('something_wrong'))
    showToast.error(t('login_failed'), t('check_credentials'))
  } finally {
    setIsLoading(false)
    setLoginProgress(0)
  }
}
  const handleForgotPassword = () => {
    if (!email) {
      showToast.warning(t('email_required'), t('enter_email_first'))
      return
    }
    showToast.success(t('reset_link_sent'), t('reset_instructions', { email }))
  }

  return (
    <TooltipPrimitive.TooltipProvider>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-20 h-20 flex items-center justify-center">
              <img
                src="https://leanx.io/images/300ppi/logo.png"
                alt="LeanX Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{t('welcome_back')}</h1>
            <p className="text-muted-foreground">
              Sign in to your LeanX account to continue
            </p>
          </div>

          {showDemoCard && (
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {t('demo')}
                    </Badge>
                    <span className="text-sm font-medium">{t('try_demo')}</span>
                  </div>
                  <TooltipPrimitive.Tooltip>
                    <TooltipPrimitive.TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowDemoCard(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipPrimitive.TooltipTrigger>
                    <TooltipPrimitive.TooltipContent>
                      <p>Close demo info</p>
                    </TooltipPrimitive.TooltipContent>
                  </TooltipPrimitive.Tooltip>
                </div>
                <div className="mt-2 text-xs text-muted-foreground space-y-1">
                  <p><strong>{t('email')}:</strong> demo@example.com</p>
                  <p><strong>{t('password')}:</strong> password123</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Login Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">{t('sign_in')}</CardTitle>
              <CardDescription className="text-center">
                {t('enter_credentials')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {isLoading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{t('authenticating')}</span>
                      <span>{loginProgress}%</span>
                    </div>
                    <Progress value={loginProgress} className="h-2" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">{t('email_address')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('enter_email')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t('enter_password')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isLoading}
                      required
                    />
                    <TooltipPrimitive.Tooltip>
                      <TooltipPrimitive.TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </TooltipPrimitive.TooltipTrigger>
                      <TooltipPrimitive.TooltipContent>
                        <p>{showPassword ? t('hide_password') : t('show_password')}</p>
                      </TooltipPrimitive.TooltipContent>
                    </TooltipPrimitive.Tooltip>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="remember" className="text-sm cursor-pointer">
                      {t('remember_me')}
                    </Label>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-sm"
                        type="button"
                        disabled={isLoading}
                      >
                        {t('forgot_password')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('reset_password')}</DialogTitle>
                        <DialogDescription>
                          {t('reset_description')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="reset-email">{t('email_address')}</Label>
                          <Input
                            id="reset-email"
                            type="email"
                            placeholder={t('enter_email')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleForgotPassword} className="w-full">
                          {t('send_reset_link')}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('signing_in')}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {t('sign_in')}
                    </>
                  )}
                </Button>
              </form>

              {/* Social Login */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Footer */}
          <div className="space-y-4">
            {/* OTP Demo Link */}
            <div className="flex justify-center">
              <Link href="/otp-demo">
                <Button variant="outline" size="sm" className="text-muted-foreground hover:text-foreground border-dashed">
                  <Smartphone className="mr-2 h-4 w-4" />
                  Try OTP Component Demo
                </Button>
              </Link>
            </div>

            {/* Language Selector */}
            <div className="flex justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Globe className="mr-2 h-4 w-4" />
                    {getCurrentLanguage().flag} {getCurrentLanguage().name}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      {t('select_language')}
                    </DialogTitle>
                    <DialogDescription>
                      {t('language_description')}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-2 py-4">
                    {languages.map((language) => (
                      <Button
                        key={language.code}
                        variant={i18n.language === language.code ? "default" : "ghost"}
                        className="justify-start h-12"
                        onClick={() => handleLanguageChange(language.code)}
                      >
                        <span className="mr-3 text-lg">{language.flag}</span>
                        <span className="flex-1 text-left">{language.nativeName}</span>
                        {i18n.language === language.code && (
                          <Check className="h-4 w-4 ml-2" />
                        )}
                      </Button>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                    {t('more_languages')}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Terms and Privacy */}
            <div className="text-center text-xs text-muted-foreground">
              <p>
                {t('terms_agreement')}{" "}
                <Button variant="link" className="p-0 h-auto text-xs underline">
                  {t('terms_service')}
                </Button>{" "}
                {t('and')}{" "}
                <Button variant="link" className="p-0 h-auto text-xs underline">
                  {t('privacy_policy')}
                </Button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </TooltipPrimitive.TooltipProvider>
  )
}