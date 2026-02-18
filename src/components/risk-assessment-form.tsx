"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AlertTriangle, Shield, TrendingUp } from "lucide-react"

const riskCategories = [
  "Strategic",
  "Operational", 
  "Financial",
  "Compliance",
  "Technology",
  "Security",
  "Reputation"
]

const impactLevels = [
  { value: 1, label: "Very Low", color: "bg-green-500" },
  { value: 2, label: "Low", color: "bg-blue-500" },
  { value: 3, label: "Medium", color: "bg-yellow-500" },
  { value: 4, label: "High", color: "bg-orange-500" },
  { value: 5, label: "Critical", color: "bg-red-500" }
]

const likelihoodLevels = [
  { value: 1, label: "Rare", description: "Once in 10+ years" },
  { value: 2, label: "Unlikely", description: "Once in 5-10 years" },
  { value: 3, label: "Possible", description: "Once in 1-5 years" },
  { value: 4, label: "Likely", description: "Once in 1 year" },
  { value: 5, label: "Almost Certain", description: "Multiple times per year" }
]

const formSchema = z.object({
  title: z.string().min(5, "Risk title must be at least 5 characters"),
  description: z.string().min(10, "Risk description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  impact: z.number().min(1).max(5),
  likelihood: z.number().min(1).max(5),
  existingControls: z.string().optional(),
  mitigationPlan: z.string().optional(),
  riskOwner: z.string().min(1, "Please specify a risk owner"),
})

type FormData = z.infer<typeof formSchema>

export function RiskAssessmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      impact: 3,
      likelihood: 3,
      existingControls: "",
      mitigationPlan: "",
      riskOwner: "",
    },
  })

  const impact = form.watch("impact")
  const likelihood = form.watch("likelihood")
  const riskScore = impact * likelihood

  const getRiskLevel = (score: number) => {
    if (score <= 4) return { level: "Low", color: "bg-green-500" }
    if (score <= 9) return { level: "Medium", color: "bg-yellow-500" }
    if (score <= 16) return { level: "High", color: "bg-orange-500" }
    return { level: "Critical", color: "bg-red-500" }
  }

  const riskLevel = getRiskLevel(riskScore)

  async function onSubmit(values: FormData) {
    try {
      setIsSubmitting(true)
      
      const response = await fetch("/api/risks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          riskScore,
          riskLevel: riskLevel.level,
          status: "identified"
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create risk")
      }

      toast({
        title: "Risk Created",
        description: "Risk assessment has been successfully recorded.",
      })
      
      form.reset()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create risk assessment",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Risk Assessment Form
        </CardTitle>
        <CardDescription>
          Identify and assess potential risks to your organisation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Risk Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Data Breach Risk" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {riskCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the risk in detail..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Risk Assessment */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Risk Assessment
              </h3>
              
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="impact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Impact Level</FormLabel>
                      <FormDescription>
                        What is the potential impact if this risk materializes?
                      </FormDescription>
                      <FormControl>
                        <div className="space-y-3">
                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm">
                            {impactLevels.map((level) => (
                              <span key={level.value} className="text-center">
                                <div className={`w-3 h-3 rounded-full ${level.color} mx-auto mb-1`}></div>
                                {level.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="likelihood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Likelihood Level</FormLabel>
                      <FormDescription>
                        How likely is this risk to occur?
                      </FormDescription>
                      <FormControl>
                        <div className="space-y-3">
                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="w-full"
                          />
                          <div className="space-y-1">
                            {likelihoodLevels.map((level) => (
                              <div key={level.value} className="flex justify-between text-sm">
                                <span>{level.label}</span>
                                <span className="text-muted-foreground">{level.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Risk Score Display */}
              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5" />
                    <div>
                      <p className="font-semibold">Risk Score: {riskScore}/25</p>
                      <p className="text-sm text-muted-foreground">
                        Impact ({impact}) × Likelihood ({likelihood})
                      </p>
                    </div>
                  </div>
                  <Badge className={`${riskLevel.color} text-white`}>
                    {riskLevel.level} Risk
                  </Badge>
                </div>
              </div>
            </div>

            {/* Controls and Mitigation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Controls & Mitigation</h3>
              
              <FormField
                control={form.control}
                name="existingControls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Existing Controls</FormLabel>
                    <FormDescription>
                      What controls are already in place to address this risk?
                    </FormDescription>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe existing controls..."
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mitigationPlan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mitigation Plan</FormLabel>
                    <FormDescription>
                      What additional measures are needed to reduce this risk?
                    </FormDescription>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe mitigation strategies..."
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="riskOwner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Owner</FormLabel>
                    <FormDescription>
                      Who is responsible for managing this risk?
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="e.g., John Doe - IT Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Risk Assessment..." : "Create Risk Assessment"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
