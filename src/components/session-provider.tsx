// src/components/session-provider.tsx
"use client"

import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"

// Create a simple client component client
const createClientComponent = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type SessionContextType = {
  session: Session | null
  isLoading: boolean
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  isLoading: true,
})

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponent()
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setIsLoading(false)

      if (event === "SIGNED_IN") {
        router.refresh()
      } else if (event === "SIGNED_OUT") {
        router.push("/sign-in")
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [router, supabase])

  return (
    <SessionContext.Provider value={{ session, isLoading }}>
      {!isLoading && children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)