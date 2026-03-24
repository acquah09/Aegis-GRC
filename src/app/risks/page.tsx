import { Metadata } from "next"
import { getServerSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { RiskRegister } from "./risk-register"
import Header from "@/components/header"

export const metadata: Metadata = {
  title: "Risk Register",
  description: "Manage and track organizational risks",
}

export default async function RisksPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6">
        <RiskRegister />
      </main>
    </>
  )
}
