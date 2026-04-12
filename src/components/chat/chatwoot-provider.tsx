'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    chatwootSettings?: {
      hideMessageBubble?: boolean
      position?: 'left' | 'right'
      locale?: string
      useBrowserLanguage?: boolean
      zIndex?: number
    }
    chatwootSDK?: {
      run: (config: {
        websiteToken: string
        baseUrl: string
      }) => void
    }
  }
}

interface ChatwootProviderProps {
  websiteToken: string
}

export function ChatwootProvider({ websiteToken }: ChatwootProviderProps) {
  useEffect(() => {
    if (!websiteToken || websiteToken === 'YOUR_CHATWOOT_WEBSITE_TOKEN') {
      console.log('Chatwoot: Website token not configured')
      return
    }

    const initChatwoot = () => {
      window.chatwootSettings = {
        hideMessageBubble: false,
        position: 'right',
        locale: 'en',
        useBrowserLanguage: true,
        zIndex: 9999,
      }

      const script = document.createElement('script')
      script.src = 'https://cdn.chatwoot.app/sdk.js'
      script.async = true
      script.defer = true
      script.onload = () => {
        if (window.chatwootSDK) {
          window.chatwootSDK.run({
            websiteToken,
            baseUrl: 'https://app.chatwoot.com',
          })
        }
      }
      document.head.appendChild(script)
    }

    if (!document.querySelector('script[src*="chatwoot"]')) {
      initChatwoot()
    }
  }, [websiteToken])

  return null
}

export function openChatwootWidget() {
  if (typeof window !== 'undefined' && window.chatwootSDK) {
    if ('chatwootWidget' in window) {
      ;(window as { chatwootWidget: { show: () => void } }).chatwootWidget.show()
    }
  }
}

export function closeChatwootWidget() {
  if (typeof window !== 'undefined' && window.chatwootSDK) {
    if ('chatwootWidget' in window) {
      ;(window as { chatwootWidget: { hide: () => void } }).chatwootWidget.hide()
    }
  }
}

export function toggleChatwootWidget() {
  if (typeof window !== 'undefined' && window.chatwootSDK) {
    if ('chatwootWidget' in window) {
      ;(window as { chatwootWidget: { toggle: () => void } }).chatwootWidget.toggle()
    }
  }
}
