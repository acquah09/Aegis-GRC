"use client"

import { ReactNode } from "react"

interface BackgroundWrapperProps {
  children: ReactNode
}

export default function BackgroundWrapper({ children }: BackgroundWrapperProps) {
  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(/Background-element.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="relative" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
