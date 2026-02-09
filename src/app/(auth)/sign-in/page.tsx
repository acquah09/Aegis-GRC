// src/app/(auth)/sign-in/page.tsx
import { SignInForm } from "@/components/sign-in-form"
import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    const redirectTo = Array.isArray(searchParams.redirectedFrom) 
      ? searchParams.redirectedFrom[0] 
      : searchParams.redirectedFrom || "/dashboard"
    redirect(redirectTo)
  }

  return (
    <div className="container mx-auto flex h-screen w-full items-center justify-center">
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <SignInForm />
            <p className="text-center text-sm mt-4">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}