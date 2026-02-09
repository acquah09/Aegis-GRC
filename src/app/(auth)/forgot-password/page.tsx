// src/app/auth/forgot-password/page.tsx
import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto flex h-screen w-full items-center justify-center">
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Forgot Password</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-center mb-4">
                Enter your email to receive a password reset link
              </p>
              <ForgotPasswordForm />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}