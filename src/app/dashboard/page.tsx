// src/app/dashboard/page.tsx
import { Metadata } from "next"
import { Overview } from "@/components/overview"
import { RecentActivity } from "@/components/recent-activity"
import { getServerSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { Shield, FileText, AlertTriangle, CheckCircle2 } from "lucide-react"
import DashboardClient from "./dashboard-client"
import Header from "@/components/header"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "GRC Sentinel Dashboard",
}

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6">
        <DashboardClient user={{ 
          email: session.user.email,
          firstName: session.user.user_metadata?.first_name || null,
          lastName: session.user.user_metadata?.last_name || null
        }} />
      </main>
    </>
  )
}