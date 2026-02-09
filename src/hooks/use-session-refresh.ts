// src/hooks/use-session-refresh.ts
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function useSessionRefresh(interval = 5 * 60 * 1000) {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const refreshSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          // Only refresh if the session is about to expire soon
          const timeUntilExpiry = new Date(session.expires_at! * 1000).getTime() - Date.now()
          if (timeUntilExpiry < 5 * 60 * 1000) { // Refresh if less than 5 minutes remaining
            await supabase.auth.refreshSession()
          }
        }
      } catch (error) {
        console.error("Session refresh error:", error)
        // Force sign out if there's an error refreshing
        await supabase.auth.signOut()
        router.push("/auth/sign-in")
      }
    }

    const refreshInterval = setInterval(refreshSession, interval)
    refreshSession() // Initial check

    return () => clearInterval(refreshInterval)
  }, [router, supabase, interval])
}