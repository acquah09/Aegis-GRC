// src/components/protected-route-client.tsx
"use client"

import { useSession } from "@/components/session-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export function ProtectedRouteClient({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !session) {
      router.push("/auth/sign-in")
    }
  }, [session, isLoading, router])

  if (isLoading || !session) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}