import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get counts for different entities
    const [
      { count: frameworksCount },
      { count: controlsCount }, 
      { count: risksCount },
      { count: auditsCount }
    ] = await Promise.all([
      supabase.from('frameworks').select('*', { count: 'exact', head: true }),
      supabase.from('controls').select('*', { count: 'exact', head: true }),
      supabase.from('risks').select('*', { count: 'exact', head: true }),
      supabase.from('audits').select('*', { count: 'exact', head: true })
    ])

    // Get recent risks for activity
    const { data: recentRisks } = await supabase
      .from('risks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    // Get compliance score (simplified calculation)
    const { data: complianceData } = await supabase
      .from('controls')
      .select('status')
      .eq('status', 'implemented')

    const totalControls = controlsCount || 0
    const implementedControls = complianceData?.length || 0
    const complianceScore = totalControls > 0 ? Math.round((implementedControls / totalControls) * 100) : 100

    return NextResponse.json({
      frameworks: {
        count: frameworksCount || 0,
        change: 1 // This would be calculated from historical data
      },
      controls: {
        count: controlsCount || 0,
        change: 5
      },
      risks: {
        count: risksCount || 0,
        change: -2
      },
      compliance: {
        score: complianceScore,
        change: 3
      },
      recentActivity: recentRisks || []
    })
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    )
  }
}
