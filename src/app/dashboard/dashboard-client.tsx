"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RiskHeatmap } from "@/components/charts/RiskHeatmap"
import { RecentActivity } from "@/components/recent-activity"
import { Shield, FileText, AlertTriangle, CheckCircle2, TrendingUp, BarChart3, Activity } from "lucide-react"
import { useState, useEffect } from "react"
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useOrg } from '@/contexts/OrgContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const supabase = createClient()

interface DashboardMetrics {
  totalRisks: number
  criticalRisks: number
  avgComplianceScore: number
  openActionItems: number
  risksByCategory: Array<{
    category: string
    count: number
    color: string
  }>
  recentActivity: any[]
}

interface DashboardClientProps {
  user: { 
    email: string | null
    firstName: string | null
    lastName: string | null
  }
}

const COLORS = {
  'Cyber/IT': '#3b82f6',
  'Operational': '#10b981', 
  'Third-Party': '#f59e0b',
  'Regulatory': '#8b5cf6',
  'Data': '#ef4444'
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const { currentOrg } = useOrg()

  // Fetch dashboard metrics
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['dashboard-metrics', currentOrg?.id],
    queryFn: async () => {
      if (!currentOrg?.id) return null
      
      // Fetch risks
      const { data: risks } = await supabase
        .from('risks')
        .select('risk_score, category')
        .eq('org_id', currentOrg.id)
      
      // Fetch compliance items
      const { data: complianceItems } = await supabase
        .from('compliance_items')
        .select('status')
        .eq('org_id', currentOrg.id)
      
      // Fetch audit logs (recent activity)
      const { data: auditLogs } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('org_id', currentOrg.id)
        .order('created_at', { ascending: false })
        .limit(10)
      
      // Calculate metrics
      const totalRisks = risks?.length || 0
      const criticalRisks = risks?.filter(r => r.risk_score >= 15).length || 0
      
      const compliantCount = complianceItems?.filter(item => item.status === 'compliant').length || 0
      const avgComplianceScore = complianceItems?.length > 0 
        ? Math.round((compliantCount / complianceItems.length) * 100)
        : 0
      
      // Open action items (risks that need mitigation)
      const openActionItems = risks?.filter(r => 
        r.risk_score >= 10 && (r.category === 'Cyber/IT' || r.category === 'Data')
      ).length || 0
      
      // Risks by category
      const risksByCategory = Object.entries(
        (risks || []).reduce((acc, risk) => {
          const category = risk.category || 'Other'
          acc[category] = (acc[category] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      ).map(([category, count]) => ({
        category,
        count,
        color: COLORS[category as keyof typeof COLORS] || '#6b7280'
      }))
      
      return {
        totalRisks,
        criticalRisks,
        avgComplianceScore,
        openActionItems,
        risksByCategory,
        recentActivity: auditLogs || []
      }
    },
    enabled: !!currentOrg?.id,
  })

  // Handle risk click from heatmap
  const handleRiskClick = (risk: any) => {
    console.log('Risk clicked:', risk)
    // Could implement navigation or open a modal here
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-2"></div>
          <div className="h-4 bg-muted rounded w-96"></div>
        </div>
        
        {/* KPI Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-muted rounded"></div>
            </div>
          ))}
        </div>
        
        {/* Charts Skeleton */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="animate-pulse">
            <div className="h-64 bg-muted rounded"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
        
        {/* Activity Feed Skeleton */}
        <div className="animate-pulse">
          <div className="h-48 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-destructive">
          Error loading dashboard data. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Executive GRC Dashboard
        </h2>
        <p className="text-muted-foreground">
          Real-time overview of your organization's governance, risk, and compliance posture
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalRisks || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active risk items
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics?.criticalRisks || 0}</div>
            <p className="text-xs text-muted-foreground">
              Score ≥ 15
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics?.avgComplianceScore || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Average compliance rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Action Items</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics?.openActionItems || 0}</div>
            <p className="text-xs text-muted-foreground">
              High-priority items
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Risk Heatmap */}
        <RiskHeatmap onRiskClick={handleRiskClick} />
        
        {/* Risks by Category Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Risks by Category</CardTitle>
            <CardDescription>
              Distribution of risks across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics?.risksByCategory || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {(metrics?.risksByCategory || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest audit logs and system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics?.recentActivity && metrics.recentActivity.length > 0 ? (
              metrics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border bg-muted/50">
                  <div className="flex-shrink-0">
                    <Activity className="h-4 w-4 text-muted-foreground mt-0.5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.resource_type}
                      {activity.metadata && (
                        <span className="ml-2 text-xs">
                          {JSON.stringify(activity.metadata)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-600">No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
