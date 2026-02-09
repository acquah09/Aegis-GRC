"use client"

import { useQuery } from "@tanstack/react-query"

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

export function useDashboardMetrics() {
  return useQuery<DashboardMetrics>({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/metrics")
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard metrics")
      }
      return response.json()
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data fresh for 10 seconds
  })
}
