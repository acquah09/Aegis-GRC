"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { RiskAssessmentForm } from "@/components/risk-assessment-form"
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  Plus, 
  Search,
  Filter,
  Eye,
  Edit,
  Trash2
} from "lucide-react"

interface Risk {
  id: string
  title: string
  description: string
  category: string
  impact: number
  likelihood: number
  riskScore: number
  riskLevel: string
  existingControls?: string
  mitigationPlan?: string
  riskOwner: string
  status: string
  created_at: string
  updated_at: string
}

export default function RiskRegister() {
  const [risks, setRisks] = useState<Risk[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", "Strategic", "Operational", "Financial", "Compliance", "Technology", "Security", "Reputation"]

  useEffect(() => {
    fetchRisks()
  }, [])

  const fetchRisks = async () => {
    try {
      const response = await fetch("/api/risks")
      if (response.ok) {
        const data = await response.json()
        setRisks(data)
      }
    } catch (error) {
      console.error("Failed to fetch risks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRisks = risks.filter(risk => {
    const matchesSearch = risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         risk.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         risk.riskOwner.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || risk.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Low": return "bg-green-500"
      case "Medium": return "bg-yellow-500"
      case "High": return "bg-orange-500"
      case "Critical": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getRiskLevelTextColor = (level: string) => {
    switch (level) {
      case "Low": return "text-green-700"
      case "Medium": return "text-yellow-700"
      case "High": return "text-orange-700"
      case "Critical": return "text-red-700"
      default: return "text-gray-700"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Risk Assessment</h1>
            <p className="text-muted-foreground">
              Identify and assess new risks to your organisation
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowForm(false)}>
            Back to Risk Register
          </Button>
        </div>
        <RiskAssessmentForm />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk Register</h1>
          <p className="text-muted-foreground">
            Manage and track all identified organisational risks
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Risk Assessment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{risks.length}</div>
            <p className="text-xs text-muted-foreground">
              Active risks identified
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Risks</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {risks.filter(r => r.riskLevel === "Critical").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risks</CardTitle>
            <Shield className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {risks.filter(r => r.riskLevel === "High").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need mitigation plans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Risk Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {risks.length > 0 ? Math.round(risks.reduce((sum, r) => sum + r.riskScore, 0) / risks.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of 25 maximum
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Risk Registry</CardTitle>
          <CardDescription>
            View and manage all identified risks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search risks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading risks...</p>
            </div>
          ) : filteredRisks.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No risks found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Get started by creating your first risk assessment"}
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Risk Assessment
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRisks.map((risk) => (
                <Card key={risk.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{risk.title}</h3>
                          <Badge className={`${getRiskLevelColor(risk.riskLevel)} text-white`}>
                            {risk.riskLevel}
                          </Badge>
                          <Badge variant="outline">{risk.category}</Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{risk.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Impact:</span>
                            <div className="flex items-center gap-1 mt-1">
                              <div className={`w-2 h-2 rounded-full ${
                                risk.impact >= 4 ? 'bg-red-500' : 
                                risk.impact >= 3 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}></div>
                              {risk.impact}/5
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Likelihood:</span>
                            <div className="flex items-center gap-1 mt-1">
                              <div className={`w-2 h-2 rounded-full ${
                                risk.likelihood >= 4 ? 'bg-red-500' : 
                                risk.likelihood >= 3 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}></div>
                              {risk.likelihood}/5
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Risk Score:</span>
                            <div className={`font-semibold mt-1 ${getRiskLevelTextColor(risk.riskLevel)}`}>
                              {risk.riskScore}/25
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Owner:</span>
                            <div className="mt-1">{risk.riskOwner}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <div className="text-sm text-muted-foreground">
                            Created: {formatDate(risk.created_at)}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
