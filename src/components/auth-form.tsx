"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SignInForm } from "./sign-in-form"
import { SignUpForm } from "./sign-up-form"

type AuthVariant = "signin" | "signup"

interface AuthFormProps {
  defaultVariant?: AuthVariant
}

export function AuthForm({ defaultVariant = "signin" }: AuthFormProps) {
  const [variant, setVariant] = useState<AuthVariant>(defaultVariant)

  return (
    <div className="w-full max-w-md space-y-6">
      {variant === "signin" ? <SignInForm /> : <SignUpForm />}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {variant === "signin" ? "New to Aegis GRC?" : "Already have an account?"}
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setVariant(variant === "signin" ? "signup" : "signin")}
      >
        {variant === "signin" ? "Create an account" : "Sign in instead"}
      </Button>
    </div>
  )
}