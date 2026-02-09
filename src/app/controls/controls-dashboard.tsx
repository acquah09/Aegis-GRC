"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Plus, 
  Search,
  Filter,
  Eye,
  Edit,
  Settings
} from "lucide-react"

interface Control {
  id: string
  title: string
  description: string
  category: string
  framework: string
  implementationStatus: "implemented" | "partial" | "not-implemented"
  effectiveness: "effective" | "needs-improvement" | "ineffective"
  owner: string
  lastReview: string
  nextReview: string
  evidence: number
  associatedRisks: number
}

export default function ControlsDashboard() {
  const [controls, setControls] = useState<Control[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFramework, setSelectedFramework] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const frameworks = ["all", "ISO 27001", "SOC 2", "NIST", "GDPR", "HIPAA"]
  const statuses = ["all", "implemented", "partial", "not-implemented"]

  useEffect(() => {
    fetchControls()
  }, [])

  const fetchControls = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockControls: Control[] = [
        {
          id: "1",
          title: "Access Control Policy",
          description: "Formal policy for managing user access to systems and data",
          category: "Access Control",
          framework: "ISO 27001",
          implementationStatus: "implemented",
          effectiveness: "effective",
          owner: "Security Team",
          lastReview: "2024-01-15",
          nextReview: "2024-04-15",
          evidence: 5,
          associatedRisks: 3
        },
        {
          id: "2",
          title: "Incident Response Plan",
          description: "Procedures for detecting, responding to, and recovering from security incidents",
          category: "Incident Management",
          framework: "SOC 2",
          implementationStatus: "partial",
          effectiveness: "needs-improvement",
          owner: "IT Operations",
          lastReview: "2024-01-10",
          nextReview: "2024-03-10",
          evidence: 2,
          associatedRisks: 5
        },
        {
          id: "3",
          title: "Data Encryption",
          description: "Encryption of sensitive data at rest and in transit",
          category: "Data Protection",
          framework: "ISO 27001",
          implementationStatus: "implemented",
          effectiveness: "effective",
          owner: "Security Team",
          lastReview: "2024-01-20",
          nextReview: "2024-04-20",
          evidence: 8,
          associatedRisks: 4
        },
        {
          id: "4",
          title: "Vendor Risk Management",
          description: "Process for assessing and managing third-party vendor risks",
          category: "Vendor Management",
          framework: "SOC 2",
          implementationStatus: "not-implemented",
          effectiveness: "ineffective",
          owner: "Procurement",
          lastReview: "2023-12-01",
          nextReview: "2024-03-01",
          evidence: 0,
          associatedRisks: 6
        }
      ]
      setControls(mockControls)
    } catch (error) {
      console.error("Failed to fetch controls:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredControls = controls.filter(control => {
    const matchesSearch = control.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         control.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         control.owner.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFramework = selectedFramework === "all" || control.framework === selectedFramework
    const matchesStatus = selectedStatus === "all" || control.implementationStatus === selectedStatus
    
    return matchesSearch && matchesFramework && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "implemented": return "bg-green-500"
      case "partial": return "bg-yellow-500"
      case "not-implemented": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case "effective": return "text-green-700"
      case "needs-improvement": return "text-yellow-700"
      case "ineffective": return "text-red-700"
      default: return "text-gray-700"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "implemented": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "partial": return <Clock className="h-4 w-4 text-yellow-500" />
      case "not-implemented": return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Shield className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controls Management</h1>
          <p className="text-muted-foreground">
            Manage and track organizational security controls
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Control
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Controls</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{controls.length}</div>
            <p className="text-xs text-muted-foreground">
              Controls being tracked
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Implemented</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {controls.filter(c => c.implementationStatus === "implemented").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Fully implemented controls
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need Attention</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {controls.filter(c => c.implementationStatus === "partial" || c.effectiveness === "needs-improvement").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Implemented</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {controls.filter(c => c.implementationStatus === "not-implemented").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Missing controls
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controls Registry */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Controls Registry</CardTitle>
          <CardDescription>
            View and manage all organizational controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search controls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedFramework}
                onChange={(e) => setSelectedFramework(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                {frameworks.map(framework => (
                  <option key={framework} value={framework}>
                    {framework === "all" ? "All Frameworks" : framework}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === "all" ? "All Statuses" : status.replace("-", " ").toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading controls...</p>
            </div>
          ) : filteredControls.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No controls found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedFramework !== "all" || selectedStatus !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Get started by adding your first control"}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Control
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredControls.map((control) => (
                <Card key={control.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(control.implementationStatus)}
                          <h3 className="text-lg font-semibold">{control.title}</h3>
                          <Badge className={`${getStatusColor(control.implementationStatus)} text-white`}>
                            {control.implementationStatus.replace("-", " ").toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{control.framework}</Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{control.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Effectiveness:</span>
                            <div className={`font-semibold mt-1 ${getEffectivenessColor(control.effectiveness)}`}>
                              {control.effectiveness.replace("-", " ").toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Owner:</span>
                            <div className="mt-1">{control.owner}</div>
                          </div>
                          <div>
                            <span className="font-medium">Evidence:</span>
                            <div className="mt-1">{control.evidence} items</div>
                          </div>
                          <div>
                            <span className="font-medium">Associated Risks:</span>
                            <div className="mt-1">{control.associatedRisks}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <div className="text-sm text-muted-foreground">
                            Next Review: {formatDate(control.nextReview)}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
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
