// src/app/compliance/compliance-client.tsx
// Compliance module main client component

'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText,
  Plus,
  ExternalLink,
  Edit,
  Save,
  X,
  Link
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useOrg } from '@/contexts/OrgContext';
import { useRouter } from 'next/navigation';
import type { Framework, ComplianceItem } from '@/types/database';
import { ExportMenu } from '@/components/ExportMenu';
import { seedISO27001Framework } from '@/app/actions/seed-frameworks';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const supabase = createClient();

interface Framework {
  id: string;
  name: string;
  version?: string;
  description?: string;
  status: 'active' | 'draft' | 'archived';
  total_controls: number;
  compliant_controls: number;
  completion_percentage: number;
  created_at: string;
}

interface ComplianceClientProps {}

export function ComplianceClient({}: ComplianceClientProps) {
  const { currentOrg } = useOrg();
  const router = useRouter();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const queryClient = useQueryClient();

  // Handle seeding ISO 27001:2022 framework
  const handleSeedISO27001 = async () => {
    setIsSeeding(true);
    try {
      const result = await seedISO27001Framework();
      
      if (result.success) {
        toast({
          title: "Framework Added Successfully",
          description: `Added ${result.count} controls from ${result.frameworkName}`,
        });
        // Refresh the frameworks list
        queryClient.invalidateQueries({ queryKey: ['frameworks', currentOrg?.id] });
      } else {
        toast({
          title: "Error Adding Framework",
          description: result.error || "Failed to add framework",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while adding the framework",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  // Fetch frameworks
  const { data: frameworks = [], isLoading, error } = useQuery({
    queryKey: ['frameworks', currentOrg?.id],
    queryFn: async () => {
      if (!currentOrg?.id) return [];
      
      const { data, error } = await supabase
        .from('frameworks')
        .select('*')
        .eq('org_id', currentOrg.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Calculate compliance stats for each framework
      const frameworksWithStats = await Promise.all(
        (data || []).map(async (framework) => {
          const { data: complianceItems } = await supabase
            .from('compliance_items')
            .select('status')
            .eq('framework_id', framework.id);
          
          const totalControls = complianceItems?.length || 0;
          const compliantControls = complianceItems?.filter(item => item.status === 'compliant').length || 0;
          const completionPercentage = totalControls > 0 ? Math.round((compliantControls / totalControls) * 100) : 0;
          
          return {
            ...framework,
            total_controls: totalControls,
            compliant_controls: compliantControls,
            completion_percentage: completionPercentage,
          };
        })
      );
      
      return frameworksWithStats;
    },
    enabled: !!currentOrg?.id,
  });

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'draft':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'archived':
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  // Get progress color
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-2"></div>
          <div className="h-4 bg-muted rounded w-96"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-4" />
          <p className="text-red-600">Error loading frameworks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" onClick={() => router.back()}>
            ← Back
          </Button>
          {frameworks.length > 0 && (
            <>
              <h1 className="text-3xl font-bold">{frameworks[0].name}</h1>
              {frameworks[0].version && (
                <Badge variant="outline">v{frameworks[0].version}</Badge>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ExportMenu 
            dataType="compliance" 
            data={[]} 
            orgId={currentOrg?.id || ''} 
          />
          <Button onClick={() => router.push('/compliance/frameworks/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Framework
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Frameworks</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{frameworks.length}</div>
            <p className="text-xs text-muted-foreground">
              Active compliance programs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliant Controls</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {frameworks.reduce((sum, fw) => sum + fw.compliant_controls, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all frameworks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {frameworks.length > 0 
                ? Math.round(frameworks.reduce((sum, fw) => sum + fw.completion_percentage, 0) / frameworks.length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Framework completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {frameworks.filter(fw => fw.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently tracking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Framework Library */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Framework Library</h2>
          <div className="flex gap-2">
            <Button onClick={handleSeedISO27001} disabled={isSeeding} variant="outline" size="sm">
              {isSeeding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Add ISO 27001:2022
                </>
              )}
            </Button>
            <Button onClick={() => router.push('/compliance/frameworks/new')} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Framework
            </Button>
          </div>
        </div>
        
        {frameworks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No frameworks yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Get started by adding your first compliance framework to track controls and monitor compliance status.
              </p>
              <div className="flex gap-3">
                <Button onClick={handleSeedISO27001} disabled={isSeeding}>
                  {isSeeding ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding Framework...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Add ISO 27001:2022
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => router.push('/compliance/frameworks/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom Framework
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {frameworks.map((framework) => (
              <Card key={framework.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{framework.name}</CardTitle>
                      {framework.version && (
                        <Badge variant="outline" className="text-xs">
                          v{framework.version}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(framework.status)}
                      <Badge className={getStatusBadge(framework.status)}>
                        {framework.status}
                      </Badge>
                    </div>
                  </div>
                  {framework.description && (
                    <CardDescription className="line-clamp-2">
                      {framework.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Compliance Progress</span>
                      <span className="font-medium">{framework.completion_percentage}%</span>
                    </div>
                    <Progress 
                      value={framework.completion_percentage} 
                      className="h-2"
                    />
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">{framework.total_controls}</div>
                      <div className="text-gray-600">Total Controls</div>
                    </div>
                    <div>
                      <div className="font-medium text-green-600">{framework.compliant_controls}</div>
                      <div className="text-gray-600">Compliant</div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <Button 
                    className="w-full" 
                    onClick={() => router.push(`/compliance/frameworks/${framework.id}`)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Framework
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Popular Frameworks */}
      {frameworks.length === 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Popular Frameworks</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'SOC 2 Type II', description: 'Security controls for service organizations', controls: 64 },
              { name: 'ISO 27001', description: 'Information security management system', controls: 114 },
              { name: 'NIST CSF', description: 'Cybersecurity framework', controls: 98 },
              { name: 'GDPR', description: 'Data protection regulation', controls: 99 },
            ].map((framework, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{framework.name}</CardTitle>
                  <CardDescription>{framework.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 mb-4">
                    {framework.controls} controls
                  </div>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => router.push('/compliance/frameworks/new')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Framework
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
