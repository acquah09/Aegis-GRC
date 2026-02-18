// src/components/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Shield, FileText, AlertTriangle, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/sign-out-button"

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Frameworks",
    href: "/dashboard/frameworks",
    icon: Shield,
  },
  {
    name: "Controls",
    href: "/dashboard/controls",
    icon: FileText,
  },
  {
    name: "Risks",
    href: "/dashboard/risks",
    icon: AlertTriangle,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden h-screen w-64 flex-col border-r bg-background md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-lg font-semibold">Aegis GRC</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="border-t p-4">
        <SignOutButton />
      </div>
    </div>
  )
}