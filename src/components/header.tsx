"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession } from "./session-provider"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Shield, TrendingUp, FileText, Settings, LogOut } from "lucide-react"

export default function Header() {
  const { session } = useSession()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/sign-in")
  }

  return (
    <header className="border-b bg-teal-600 backdrop-blur supports-[backdrop-filter]:bg-teal-700/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">Aegis GRC</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-sm font-medium text-white hover:text-primary">
              Dashboard
            </Link>
            <Link href="/risks" className="text-sm font-medium text-white hover:text-primary">
              Risk Management
            </Link>
            <Link href="/controls" className="text-sm font-medium text-white hover:text-primary">
              Controls
            </Link>
            <Link href="/compliance" className="text-sm font-medium text-white hover:text-primary">
              Compliance
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-white">
              {session?.user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
