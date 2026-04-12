'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

declare global {
  interface Window {
    chatwootWidget?: {
      show: () => void
      hide: () => void
      toggle: () => void
    }
  }
}

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.chatwootWidget) {
        clearInterval(interval)
      }
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (window.chatwootWidget) {
      window.chatwootWidget.toggle()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-3 bg-background rounded-lg shadow-lg border p-3 text-sm animate-in fade-in slide-in-from-bottom-2">
          <p className="text-muted-foreground">
            Need help? Chat with our team!
          </p>
        </div>
      )}
      <Button
        onClick={handleToggle}
        size="icon"
        className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all"
        aria-label="Chat with us"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </Button>
    </div>
  )
}
