"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentActivity } from "@/components/recent-activity"
import { Shield, FileText, AlertTriangle, CheckCircle2, TrendingUp, BarChart3 } from "lucide-react"
import { RiskDistributionChart, TrendChart } from "@/components/charts"
import { useState, useEffect } from "react"

interface DashboardMetrics {
  frameworks: {
    count: number
    change: number
  }
  controls: {
    count: number
    change: number
  }
  risks: {
    count: number
    change: number
  }
  compliance: {
    score: number
    change: number
  }
  recentActivity: any[]
}

interface DashboardClientProps {
  user: { 
    email: string | null
    firstName: string | null
    lastName: string | null
  }
}

// Check if user is new (no activity)
const isNewUser = (metrics: DashboardMetrics | null) => {
  if (!metrics) return true
  return (
    metrics.frameworks?.count === 0 &&
    metrics.controls?.count === 0 &&
    metrics.risks?.count === 0 &&
    metrics.compliance?.count === 0
  )
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/dashboard/metrics")
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard metrics")
        }
        const data = await response.json()
        setMetrics(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-2"></div>
          <div className="h-4 bg-muted rounded w-96"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-muted rounded"></div>
            </div>
          ))}
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
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {isNewUser(metrics) ? (
            <span>Hello, {user.firstName || user.email?.split('@')[0]}</span>
          ) : (
            <span>Hello, {user.firstName || user.email?.split('@')[0]}</span>
          )}
        </h2>
        <p className="text-muted-foreground">
          {isNewUser(metrics) ? (
            <span>Let's start building your risk management foundation. Begin by adding your first risk assessment to establish your organisation's risk profile.</span>
          ) : (
            <span>An overview of your organisation's current governance and risk position.</span>
          )}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frameworks</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.frameworks?.count || 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.frameworks?.change && metrics.frameworks.change > 0 ? '+' : ''}{metrics?.frameworks?.change || 0} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Controls</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.controls?.count || 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.controls?.change && metrics.controls.change > 0 ? '+' : ''}{metrics?.controls?.change || 0} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.risks?.count || 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.risks?.change && metrics.risks.change > 0 ? '+' : ''}{metrics?.risks?.change || 0} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.compliance?.score || 100}%</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.compliance?.change && metrics.compliance.change > 0 ? '+' : ''}{metrics?.compliance?.change || 0}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview metrics={metrics} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest changes in your GRC programs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={metrics?.recentActivity || []} />
          </CardContent>
        </Card>
      </div>
      
      {/* Charts and Visualizations */}
      {!isNewUser(metrics) && (
        <div className="grid gap-4 md:grid-cols-2">
          <RiskDistributionChart 
            data={[
              { name: "High Risk", value: metrics?.risks?.high || 0, total: metrics?.risks?.count || 1, color: "bg-red-500" },
              { name: "Medium Risk", value: metrics?.risks?.medium || 0, total: metrics?.risks?.count || 1, color: "bg-yellow-500" },
              { name: "Low Risk", value: metrics?.risks?.low || 0, total: metrics?.risks?.count || 1, color: "bg-green-500" }
            ]}
            title="Risk Distribution"
          />
          <TrendChart 
            data={[
              { month: "Jan", risks: 5, controls: 8, compliance: 3 },
              { month: "Feb", risks: 8, controls: 12, compliance: 7 },
              { month: "Mar", risks: 12, controls: 15, compliance: 11 }
            ]}
            title="Monthly Trends"
          />
        </div>
      )}
    </div>
  )
}
