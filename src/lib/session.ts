// src/lib/session.ts
import { createClient } from "./server"
import { redirect } from "next/navigation"

export async function getServerSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function requireSession() {
  const session = await getServerSession()
  if (!session) {
    redirect("/sign-in")
  }
  return session
}