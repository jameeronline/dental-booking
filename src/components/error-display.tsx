'use client'

import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorDisplayProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorDisplay({ 
  title = 'Something went wrong', 
  message, 
  onRetry,
  className = '' 
}: ErrorDisplayProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="bg-destructive/10 p-4 rounded-full mb-4">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </div>
  )
}

interface ErrorBannerProps {
  message: string
  onDismiss?: () => void
  className?: string
}

export function ErrorBanner({ message, onDismiss, className = '' }: ErrorBannerProps) {
  return (
    <div className={`bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6 text-sm flex items-center justify-between ${className}`}>
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="ml-4 hover:opacity-80">
          ×
        </button>
      )}
    </div>
  )
}