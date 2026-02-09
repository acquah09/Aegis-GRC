import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { z } from "zod"

const riskSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  category: z.string(),
  impact: z.number().min(1).max(5),
  likelihood: z.number().min(1).max(5),
  riskScore: z.number(),
  riskLevel: z.string(),
  existingControls: z.string().optional(),
  mitigationPlan: z.string().optional(),
  riskOwner: z.string(),
  status: z.string(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = riskSchema.parse(body)
    
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('risks')
      .insert({
        ...validatedData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating risk:', error)
      return NextResponse.json(
        { error: 'Failed to create risk' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error in risk creation:', error)
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('risks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching risks:', error)
      return NextResponse.json(
        { error: 'Failed to fetch risks' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in risk fetch:', error)
    return NextResponse.json(
      { error: 'Failed to fetch risks' },
      { status: 500 }
    )
  }
}
