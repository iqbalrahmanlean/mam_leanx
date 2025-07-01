// components/ui/otp-input.tsx
"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Check, RotateCcw, AlertCircle } from "lucide-react"

interface OTPInputProps {
  // Core props
  length?: number
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  
  // Validation
  pattern?: RegExp
  allowedChars?: 'numeric' | 'alphabetic' | 'alphanumeric' | 'custom'
  customPattern?: RegExp
  
  // UI customization
  className?: string
  inputClassName?: string
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'success' | 'error' | 'warning'
  
  // Behavior
  autoFocus?: boolean
  disabled?: boolean
  placeholder?: string
  mask?: boolean
  
  // Labels and messages
  label?: string
  description?: string
  errorMessage?: string
  successMessage?: string
  
  // Timer functionality
  showTimer?: boolean
  timerDuration?: number
  onTimerEnd?: () => void
  onResend?: () => void
  resendText?: string
  
  // Loading states
  loading?: boolean
  verifying?: boolean
  
  // Styling options
  separator?: boolean
  separatorText?: string
  groupSize?: number
}

// Character validation patterns
const PATTERNS = {
  numeric: /^[0-9]$/,
  alphabetic: /^[A-Za-z]$/,
  alphanumeric: /^[A-Za-z0-9]$/,
  custom: /^.$/
}

export function OTPInput({
  length = 6,
  value = "",
  onChange,
  onComplete,
  pattern,
  allowedChars = 'numeric',
  customPattern,
  className = "",
  inputClassName = "",
  size = 'default',
  variant = 'default',
  autoFocus = true,
  disabled = false,
  placeholder = "",
  mask = false,
  label,
  description,
  errorMessage,
  successMessage,
  showTimer = false,
  timerDuration = 60,
  onTimerEnd,
  onResend,
  resendText = "Resend Code",
  loading = false,
  verifying = false,
  separator = false,
  separatorText = "-",
  groupSize = 3
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(
    value.split('').concat(new Array(Math.max(0, length - value.length)).fill(''))
  )
  const [activeIndex, setActiveIndex] = useState(autoFocus ? 0 : -1)
  const [timer, setTimer] = useState(showTimer ? timerDuration : 0)
  const [timerActive, setTimerActive] = useState(showTimer)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Get validation pattern
  const getValidationPattern = useCallback(() => {
    if (pattern) return pattern
    if (customPattern && allowedChars === 'custom') return customPattern
    return PATTERNS[allowedChars]
  }, [pattern, customPattern, allowedChars])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setTimerActive(false)
            onTimerEnd?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerActive, timer, onTimerEnd])

  // Update OTP when value prop changes
  useEffect(() => {
    const newOtp = value.split('').concat(new Array(Math.max(0, length - value.length)).fill(''))
    setOtp(newOtp)
  }, [value, length])

  // Focus management
  const focusInput = useCallback((index: number) => {
    if (index >= 0 && index < length && inputRefs.current[index]) {
      inputRefs.current[index]?.focus()
      setActiveIndex(index)
    }
  }, [length])

  const handleChange = (index: number, inputValue: string) => {
    if (disabled || loading || verifying) return

    const validationPattern = getValidationPattern()
    
    // Allow empty string for deletion
    if (inputValue === '') {
      const newOtp = [...otp]
      newOtp[index] = ''
      setOtp(newOtp)
      onChange?.(newOtp.join(''))
      return
    }

    // Validate input
    if (!validationPattern.test(inputValue)) return

    const newOtp = [...otp]
    newOtp[index] = inputValue

    setOtp(newOtp)
    onChange?.(newOtp.join(''))

    // Check if OTP is complete
    const otpValue = newOtp.join('')
    if (otpValue.length === length && !otpValue.includes('')) {
      onComplete?.(otpValue)
    } else {
      // Move to next input
      if (index < length - 1) {
        focusInput(index + 1)
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (disabled || loading || verifying) return

    switch (e.key) {
      case 'Backspace':
        e.preventDefault()
        if (otp[index]) {
          // Clear current input
          const newOtp = [...otp]
          newOtp[index] = ''
          setOtp(newOtp)
          onChange?.(newOtp.join(''))
        } else if (index > 0) {
          // Move to previous input and clear it
          const newOtp = [...otp]
          newOtp[index - 1] = ''
          setOtp(newOtp)
          onChange?.(newOtp.join(''))
          focusInput(index - 1)
        }
        break
      
      case 'ArrowLeft':
        e.preventDefault()
        if (index > 0) focusInput(index - 1)
        break
      
      case 'ArrowRight':
        e.preventDefault()
        if (index < length - 1) focusInput(index + 1)
        break
      
      case 'Delete':
        e.preventDefault()
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
        onChange?.(newOtp.join(''))
        break

      case 'Home':
        e.preventDefault()
        focusInput(0)
        break

      case 'End':
        e.preventDefault()
        focusInput(length - 1)
        break
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, length)
    const validationPattern = getValidationPattern()
    
    const filteredData = pastedData
      .split('')
      .filter(char => validationPattern.test(char))
      .slice(0, length)

    const newOtp = [...new Array(length)].map((_, index) => 
      filteredData[index] || ''
    )

    setOtp(newOtp)
    onChange?.(newOtp.join(''))

    const otpValue = newOtp.join('')
    if (otpValue.length === length && !otpValue.includes('')) {
      onComplete?.(otpValue)
    } else {
      // Focus the next empty input
      const nextEmptyIndex = newOtp.findIndex(val => val === '')
      if (nextEmptyIndex !== -1) {
        focusInput(nextEmptyIndex)
      }
    }
  }

  const handleResend = () => {
    if (onResend) {
      setTimer(timerDuration)
      setTimerActive(true)
      onResend()
      // Clear OTP
      const newOtp = new Array(length).fill('')
      setOtp(newOtp)
      onChange?.('')
      focusInput(0)
    }
  }

  const clearOTP = () => {
    const newOtp = new Array(length).fill('')
    setOtp(newOtp)
    onChange?.('')
    focusInput(0)
  }

  // Size variants
  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    default: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg"
  }

  // Variant styles
  const variantClasses = {
    default: "border-input",
    success: "border-green-500 bg-green-50 dark:bg-green-950",
    error: "border-red-500 bg-red-50 dark:bg-red-950",
    warning: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
  }

  // Render separator
  const renderSeparator = (index: number) => {
    if (!separator || !groupSize) return null
    if ((index + 1) % groupSize === 0 && index < length - 1) {
      return (
        <span key={`sep-${index}`} className="mx-1 text-muted-foreground">
          {separatorText}
        </span>
      )
    }
    return null
  }

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Label */}
      {label && (
        <div className="space-y-1">
          <Label className="text-sm font-medium">{label}</Label>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* OTP Input Fields */}
      <div className="flex items-center justify-center space-x-2">
        {otp.map((digit, index) => (
          <React.Fragment key={index}>
            <Input
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              type={mask ? "password" : "text"}
              maxLength={1}
              value={digit}
              placeholder={placeholder}
              disabled={disabled || loading || verifying}
              className={cn(
                "text-center font-mono",
                sizeClasses[size],
                variantClasses[variant],
                activeIndex === index && "ring-2 ring-ring ring-offset-2",
                (loading || verifying) && "animate-pulse",
                inputClassName
              )}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(-1)}
              onPaste={index === 0 ? handlePaste : undefined}
              autoComplete="one-time-code"
              inputMode={allowedChars === 'numeric' ? 'numeric' : 'text'}
            />
            {renderSeparator(index)}
          </React.Fragment>
        ))}
      </div>

      {/* Status Messages */}
      {successMessage && variant === 'success' && (
        <div className="flex items-center space-x-2 text-green-600">
          <Check className="h-4 w-4" />
          <span className="text-sm">{successMessage}</span>
        </div>
      )}

      {errorMessage && variant === 'error' && (
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{errorMessage}</span>
        </div>
      )}

      {/* Loading/Verifying State */}
      {(loading || verifying) && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>{verifying ? 'Verifying...' : 'Loading...'}</span>
          </div>
        </div>
      )}

      {/* Timer and Actions */}
      {(showTimer || onResend) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearOTP}
              disabled={disabled || loading || verifying}
              className="h-8 px-2"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {showTimer && timer > 0 && (
              <span className="text-sm text-muted-foreground">
                {formatTime(timer)}
              </span>
            )}
            
            {onResend && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResend}
                disabled={disabled || loading || verifying || (showTimer && timer > 0)}
                className="h-8 px-2"
              >
                {resendText}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export { type OTPInputProps }