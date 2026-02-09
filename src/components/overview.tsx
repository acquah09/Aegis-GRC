"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface OverviewProps {
  metrics?: {
    frameworks: { count: number; change: number }
    controls: { count: number; change: number }
    risks: { count: number; change: number }
    compliance: { score: number; change: number }
  }
}

export function Overview({ metrics }: OverviewProps) {
  const totalRisks = metrics?.risks.count || 0
  const complianceScore = metrics?.compliance.score || 100
  const totalControls = metrics?.controls.count || 0
  const auditsCount = 0 // Would come from metrics.audits.count

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Risks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRisks}</div>
          <p className="text-xs text-muted-foreground">
            {totalRisks === 0 ? "No risks identified yet" : `${totalRisks} active risks`}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{complianceScore}%</div>
          <p className="text-xs text-muted-foreground">
            {complianceScore === 100 ? "Fully compliant" : `${100 - complianceScore}% improvement needed`}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalControls}</div>
          <p className="text-xs text-muted-foreground">
            {totalControls === 0 ? "No controls configured" : `${totalControls} controls active`}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Audits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{auditsCount}</div>
          <p className="text-xs text-muted-foreground">
            {auditsCount === 0 ? "No audits scheduled" : `${auditsCount} audits planned`}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
