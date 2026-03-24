import { Metadata } from "next"
import { getServerSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { ComplianceClient } from "./compliance-client"
import Header from "@/components/header"

export const metadata: Metadata = {
  title: "Compliance Management",
  description: "Manage compliance frameworks and controls",
}

export default async function CompliancePage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6">
        <ComplianceClient />
      </main>
    </>
  )
}
