"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ActivityItem {
  id: string
  title: string
  description: string
  created_at: string
}

interface RecentActivityProps {
  activities?: ActivityItem[]
}

export function RecentActivity({ activities = [] }: RecentActivityProps) {
  const formatActivityMessage = (activity: ActivityItem) => {
    if (activity.title.toLowerCase().includes('risk')) {
      return `New risk identified: ${activity.title}`
    } else if (activity.title.toLowerCase().includes('control')) {
      return `Control updated: ${activity.title}`
    } else if (activity.title.toLowerCase().includes('framework')) {
      return `Framework added: ${activity.title}`
    }
    return activity.title
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest GRC activities and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Welcome to Aegis GRC
                </p>
                <p className="text-sm text-muted-foreground">
                  Get started by configuring your first risk assessment
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest changes in your GRC programs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {formatActivityMessage(activity)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(activity.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
