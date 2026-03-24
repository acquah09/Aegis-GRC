// src/app/compliance/frameworks/[id]/page.tsx
// Framework detail page with controls checklist

import { Metadata } from "next"
import { getServerSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { FrameworkDetail } from "./framework-detail"
import Header from "@/components/header"

interface PageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: "Framework Details",
  description: "View and manage compliance framework controls",
}

export default async function FrameworkPage({ params }: PageProps) {
  const session = await getServerSession()

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6">
        <FrameworkDetail frameworkId={params.id} />
      </main>
    </>
  )
}
