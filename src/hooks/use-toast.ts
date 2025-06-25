// hooks/use-toast.ts
"use client"

import { toast } from "sonner"
import { CheckCircle, XCircle, AlertCircle, Info, Loader2 } from "lucide-react"
import React from "react"

export const useToast = () => {
  const success = (message: string, description?: string) => {
    toast.success(message, {
      description,
      icon: React.createElement(CheckCircle, { className: "h-4 w-4" }),
    })
  }

  const error = (message: string, description?: string) => {
    toast.error(message, {
      description,
      icon: React.createElement(XCircle, { className: "h-4 w-4" }),
    })
  }

  const warning = (message: string, description?: string) => {
    toast.warning(message, {
      description,
      icon: React.createElement(AlertCircle, { className: "h-4 w-4" }),
    })
  }

  const info = (message: string, description?: string) => {
    toast.info(message, {
      description,
      icon: React.createElement(Info, { className: "h-4 w-4" }),
    })
  }

  const loading = (message: string, description?: string) => {
    return toast.loading(message, {
      description,
      icon: React.createElement(Loader2, { className: "h-4 w-4 animate-spin" }),
    })
  }

  const promise = <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return toast.promise(promise, messages)
  }

  const dismiss = (toastId?: string | number) => {
    toast.dismiss(toastId)
  }

  return {
    success,
    error,
    warning,
    info,
    loading,
    promise,
    dismiss
  }
}

// Alternative: Direct export functions (even simpler)
export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      icon: React.createElement(CheckCircle, { className: "h-4 w-4" }),
    })
  },

  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      icon: React.createElement(XCircle, { className: "h-4 w-4" }),
    })
  },

  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      icon: React.createElement(AlertCircle, { className: "h-4 w-4" }),
    })
  },

  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      icon: React.createElement(Info, { className: "h-4 w-4" }),
    })
  },

  loading: (message: string, description?: string) => {
    return toast.loading(message, {
      description,
      icon: React.createElement(Loader2, { className: "h-4 w-4 animate-spin" }),
    })
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return toast.promise(promise, messages)
  },

  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId)
  }
}