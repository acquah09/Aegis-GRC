// src/components/ui/toaster.tsx
"use client"

import * as React from "react"
import { useToast } from "@/components/ui/use-toast"
import { 
  ToastProvider,
  ToastViewport,
  Toast as ToastComponent, 
  ToastTitle, 
  ToastDescription,
  ToastClose 
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()
  
  return (
    <ToastProvider>
      {toasts?.map(function ({ id, title, description, action, ...props }) {
        return (
          <ToastComponent key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </ToastComponent>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}