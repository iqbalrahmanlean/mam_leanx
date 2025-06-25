// layout.tsx
import type { Metadata } from "next"
import { Toaster } from "sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { ConditionalLayout } from "@/components/layout/conditional-layout"
import { SessionWrapper } from "@/components/SessionWrapper"

export const metadata: Metadata = {
  title: "LeanX - Merchant Acquiring Module",
  description: "Payment Gateway",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <SessionWrapper>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </SessionWrapper>
          </TooltipProvider>
          <Toaster 
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}