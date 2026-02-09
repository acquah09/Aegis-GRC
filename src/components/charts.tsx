"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ChartData {
  name: string
  value: number
  total: number
  color: string
}

interface ChartsProps {
  data: ChartData[]
  title: string
}

export function RiskDistributionChart({ data, title }: ChartsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm text-muted-foreground">{item.value}/{item.total}</span>
              </div>
              <Progress value={(item.value / item.total) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface TrendData {
  month: string
  risks: number
  controls: number
  compliance: number
}

export function TrendChart({ data, title }: { data: TrendData[], title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 border-b">
              <span className="text-sm">{item.month}</span>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">{item.risks}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">{item.controls}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">{item.compliance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
