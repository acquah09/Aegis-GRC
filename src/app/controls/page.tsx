import { Metadata } from "next"
import { getServerSession } from "@/lib/session"
import { redirect } from "next/navigation"
import ControlsDashboard from "./controls-dashboard"
import Header from "@/components/header"

export const metadata: Metadata = {
  title: "Controls",
  description: "Manage and track organizational controls",
}

export default async function ControlsPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6">
        <ControlsDashboard />
      </main>
    </>
  )
}
