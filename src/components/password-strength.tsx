// src/components/password-strength.tsx
"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface PasswordStrengthProps {
  password: string
  className?: string
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0)

  useEffect(() => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (password.match(/[a-z]+/)) strength += 1
    if (password.match(/[A-Z]+/)) strength += 1
    if (password.match(/[0-9]+/)) strength += 1
    if (password.match(/[^a-zA-Z0-9]+/)) strength += 1
    setStrength(Math.min(strength, 5))
  }, [password])

  const getStrengthText = () => {
    if (!password) return ""
    const texts = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"]
    return texts[strength]
  }

  const getStrengthColor = () => {
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-green-600",
    ]
    return colors[strength]
  }

  if (!password) return null

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={cn(
            "h-full transition-all duration-300",
            getStrengthColor()
          )}
          style={{ width: `${(strength / 5) * 100}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Password strength:{" "}
        <span
          className={cn("font-medium", {
            "text-red-500": strength <= 1,
            "text-orange-500": strength === 2,
            "text-yellow-500": strength === 3,
            "text-blue-500": strength === 4,
            "text-green-500": strength === 5,
          })}
        >
          {getStrengthText()}
        </span>
      </p>
    </div>
  )
}