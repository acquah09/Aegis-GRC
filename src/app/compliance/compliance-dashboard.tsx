"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  TrendingUp,
  Calendar,
  Target,
  Plus
} from "lucide-react"

interface Framework {
  id: string
  name: string
  description: string
  category: string
  overallScore: number
  status: "compliant" | "partial" | "non-compliant"
  lastAssessment: string
  nextAssessment: string
  totalRequirements: number
  compliantRequirements: number
  findings: number
  criticalFindings: number
}

interface Requirement {
  id: string
  frameworkId: string
  title: string
  description: string
  status: "compliant" | "partial" | "non-compliant"
  category: string
  control: string
  evidence: number
  lastReview: string
}

export default function ComplianceDashboard() {
  const [frameworks, setFrameworks] = useState<Framework[]>([])
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFramework, setSelectedFramework] = useState("all")

  useEffect(() => {
    fetchComplianceData()
  }, [])

  const fetchComplianceData = async () => {
    try {
      // Mock data for now - replace with actual API calls
      const mockFrameworks: Framework[] = [
        {
          id: "1",
          name: "ISO 27001:2022",
          description: "Information Security Management System",
          category: "Information Security",
          overallScore: 85,
          status: "partial",
          lastAssessment: "2024-01-15",
          nextAssessment: "2024-07-15",
          totalRequirements: 114,
          compliantRequirements: 97,
          findings: 3,
          criticalFindings: 0
        },
        {
          id: "2",
          name: "SOC 2 Type II",
          description: "Service Organization Control 2 - Security and Availability",
          category: "Security & Privacy",
          overallScore: 92,
          status: "compliant",
          lastAssessment: "2024-01-10",
          nextAssessment: "2024-04-10",
          totalRequirements: 63,
          compliantRequirements: 58,
          findings: 1,
          criticalFindings: 0
        },
        {
          id: "3",
          name: "GDPR",
          description: "General Data Protection Regulation",
          category: "Data Privacy",
          overallScore: 78,
          status: "partial",
          lastAssessment: "2024-01-20",
          nextAssessment: "2024-04-20",
          totalRequirements: 99,
          compliantRequirements: 77,
          findings: 5,
          criticalFindings: 1
        },
        {
          id: "4",
          name: "NIST CSF",
          description: "Cybersecurity Framework",
          category: "Cybersecurity",
          overallScore: 88,
          status: "partial",
          lastAssessment: "2024-01-05",
          nextAssessment: "2024-07-05",
          totalRequirements: 108,
          compliantRequirements: 95,
          findings: 2,
          criticalFindings: 0
        }
      ]

      const mockRequirements: Requirement[] = [
        {
          id: "1",
          frameworkId: "1",
          title: "A.5.1 Information Security Policies",
          description: "Information security policy shall be defined and approved by management",
          status: "compliant",
          category: "Organizational",
          control: "Information Security Policy",
          evidence: 3,
          lastReview: "2024-01-15"
        },
        {
          id: "2",
          frameworkId: "1",
          title: "A.8.1 Asset Management",
          description: "Assets associated with information and information processing facilities shall be identified",
          status: "partial",
          category: "Asset Management",
          control: "Asset Inventory",
          evidence: 1,
          lastReview: "2024-01-10"
        },
        {
          id: "3",
          frameworkId: "2",
          title: "CC2.1 Common Criteria",
          description: "Security operations procedures are documented and approved",
          status: "compliant",
          category: "Security",
          control: "Security Operations",
          evidence: 5,
          lastReview: "2024-01-10"
        }
      ]

      setFrameworks(mockFrameworks)
      setRequirements(mockRequirements)
    } catch (error) {
      console.error("Failed to fetch compliance data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant": return "bg-green-500"
      case "partial": return "bg-yellow-500"
      case "non-compliant": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "partial": return <Clock className="h-4 w-4 text-yellow-500" />
      case "non-compliant": return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Shield className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const filteredRequirements = selectedFramework === "all" 
    ? requirements 
    : requirements.filter(req => req.frameworkId === selectedFramework)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Management</h1>
          <p className="text-muted-foreground">
            Track compliance across multiple frameworks and standards
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Framework
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Frameworks</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{frameworks.length}</div>
            <p className="text-xs text-muted-foreground">
              Compliance frameworks tracked
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {frameworks.length > 0 ? Math.round(frameworks.reduce((sum, f) => sum + f.overallScore, 0) / frameworks.length) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average compliance score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Findings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {frameworks.reduce((sum, f) => sum + f.findings, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total findings across frameworks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {frameworks.reduce((sum, f) => sum + f.criticalFindings, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Frameworks Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Compliance Frameworks</CardTitle>
          <CardDescription>
            Overview of all compliance frameworks and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading frameworks...</p>
            </div>
          ) : frameworks.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No frameworks found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first compliance framework
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Framework
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {frameworks.map((framework) => (
                <Card key={framework.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(framework.status)}
                          <h3 className="text-lg font-semibold">{framework.name}</h3>
                          <Badge className={`${getStatusColor(framework.status)} text-white`}>
                            {framework.status.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{framework.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <span className="font-medium">Compliance Score:</span>
                            <div className="font-semibold mt-1">{framework.overallScore}%</div>
                          </div>
                          <div>
                            <span className="font-medium">Requirements:</span>
                            <div className="mt-1">{framework.compliantRequirements}/{framework.totalRequirements}</div>
                          </div>
                          <div>
                            <span className="font-medium">Findings:</span>
                            <div className="mt-1">{framework.findings} total</div>
                          </div>
                          <div>
                            <span className="font-medium">Next Assessment:</span>
                            <div className="mt-1">{formatDate(framework.nextAssessment)}</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Compliance Progress</span>
                            <span>{framework.overallScore}%</span>
                          </div>
                          <Progress value={framework.overallScore} className="h-2" />
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

      {/* Requirements Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Compliance Requirements</CardTitle>
          <CardDescription>
            Detailed view of compliance requirements across frameworks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Frameworks</option>
              {frameworks.map(framework => (
                <option key={framework.id} value={framework.id}>
                  {framework.name}
                </option>
              ))}
            </select>
          </div>

          {filteredRequirements.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No requirements found</h3>
              <p className="text-muted-foreground">
                {selectedFramework === "all" 
                  ? "No requirements available" 
                  : "No requirements for this framework"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequirements.map((requirement) => (
                <Card key={requirement.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(requirement.status)}
                          <h4 className="font-semibold">{requirement.title}</h4>
                          <Badge className={`${getStatusColor(requirement.status)} text-white`}>
                            {requirement.status.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">{requirement.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Control: {requirement.control}</span>
                          <span>Evidence: {requirement.evidence} items</span>
                          <span>Last Review: {formatDate(requirement.lastReview)}</span>
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
