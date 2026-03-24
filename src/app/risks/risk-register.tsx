// src/app/risks/risk-register.tsx
// Risk register component with data table and slide-over panel

'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Risk } from '@/types/database';
import { useOrg } from '@/contexts/OrgContext';
import { RiskForm } from '@/components/RiskForm';
import { ExportMenu } from '@/components/ExportMenu';

const supabase = createClient();

// Zod schema for risk form
const riskFormSchema = z.object({
  title: z.string().min(1, 'Risk title is required'),
  description: z.string().optional(),
  category: z.enum(['Cyber/IT', 'Operational', 'Third-Party', 'Regulatory', 'Data']),
  likelihood: z.number().min(1).max(5),
  impact: z.number().min(1).max(5),
  status: z.enum(['identified', 'assessed', 'mitigated', 'accepted', 'monitored']),
  owner_id: z.string().optional(),
  treatment_plan: z.string().optional(),
  review_date: z.string().optional(),
});

type RiskFormData = z.infer<typeof riskFormSchema>;

interface RiskRegisterProps {
  className?: string;
}

export function RiskRegister({ className }: RiskRegisterProps) {
  const { currentOrg } = useOrg();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  const [sortBy, setSortBy] = useState<'risk_score' | 'title' | 'created_at'>('risk_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Form for create/edit
  const form = useForm<RiskFormData>({
    resolver: zodResolver(riskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Cyber/IT',
      likelihood: 3,
      impact: 3,
      status: 'identified',
      owner_id: '',
      treatment_plan: '',
      review_date: '',
    },
  });

  // Fetch risks
  const { data: risks = [], isLoading, error } = useQuery({
    queryKey: ['risks', currentOrg?.id],
    queryFn: async () => {
      if (!currentOrg?.id) return [];
      
      const { data, error } = await supabase
        .from('risks')
        .select('*')
        .eq('org_id', currentOrg.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentOrg?.id,
  });

  // Fetch users for owner selection
  const { data: users = [] } = useQuery({
    queryKey: ['users', currentOrg?.id],
    queryFn: async () => {
      if (!currentOrg?.id) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .eq('org_id', currentOrg.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentOrg?.id,
  });

  // Create risk mutation
  const createRiskMutation = useMutation({
    mutationFn: async (data: RiskFormData) => {
      if (!currentOrg?.id) throw new Error('No organization selected');
      
      const { data: risk, error } = await supabase
        .from('risks')
        .insert({
          ...data,
          org_id: currentOrg.id,
          risk_score: data.likelihood * data.impact,
        })
        .select()
        .single();
      
      if (error) throw error;
      return risk;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risks', currentOrg?.id] });
      setIsCreateModalOpen(false);
      form.reset();
    },
  });

  // Update risk mutation
  const updateRiskMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RiskFormData }) => {
      if (!currentOrg?.id) throw new Error('No organization selected');
      
      const { data: risk, error } = await supabase
        .from('risks')
        .update({
          ...data,
          risk_score: data.likelihood * data.impact,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return risk;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risks', currentOrg?.id] });
      setEditingRisk(null);
      form.reset();
    },
  });

  // Delete risk mutation
  const deleteRiskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('risks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risks', currentOrg?.id] });
    },
  });

  // Filter and sort risks
  const filteredRisks = useMemo(() => {
    let filtered = risks;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(risk =>
        risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        risk.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(risk => risk.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(risk => risk.category === categoryFilter);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortBy) {
        case 'risk_score':
          aValue = a.risk_score;
          bValue = b.risk_score;
          break;
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          aValue = a.risk_score;
          bValue = b.risk_score;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return filtered;
  }, [risks, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder]);

  // Get risk score badge color
  const getRiskScoreBadge = (score: number) => {
    if (score <= 4) return 'bg-green-100 text-green-800';
    if (score <= 9) return 'bg-yellow-100 text-yellow-800';
    if (score <= 14) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'identified':
        return 'bg-blue-100 text-blue-800';
      case 'assessed':
        return 'bg-purple-100 text-purple-800';
      case 'mitigated':
        return 'bg-green-100 text-green-800';
      case 'accepted':
        return 'bg-gray-100 text-gray-800';
      case 'monitored':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get trend icon
  const getTrendIcon = (risk: Risk) => {
    // This would normally compare with previous assessment
    // For now, return a default icon
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  // Get owner name
  const getOwnerName = (ownerId: string | undefined) => {
    if (!ownerId) return 'Unassigned';
    const user = users.find(u => u.id === ownerId);
    if (!user) return 'Unknown';
    return user.first_name || user.email || 'Unknown';
  };

  // Handle form submission
  const onSubmit = (data: RiskFormData) => {
    if (editingRisk) {
      updateRiskMutation.mutate({ id: editingRisk.id, data });
    } else {
      createRiskMutation.mutate(data);
    }
  };

  // Handle edit
  const handleEdit = (risk: Risk) => {
    setEditingRisk(risk);
    form.reset({
      title: risk.title,
      description: risk.description || '',
      category: risk.category,
      likelihood: risk.likelihood,
      impact: risk.impact,
      status: risk.status,
      owner_id: risk.owner_id || '',
      treatment_plan: risk.treatment_plan || '',
      review_date: risk.review_date || '',
    });
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this risk?')) {
      deleteRiskMutation.mutate(id);
    }
  };

  // Calculate risk score
  const calculatedRiskScore = form.watch('likelihood') * form.watch('impact');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading risks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-4" />
          <p className="text-red-600">Error loading risks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk Register</h1>
          <p className="text-muted-foreground">
            Manage and track organizational risks with comprehensive assessment and mitigation planning
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportMenu 
            dataType="risks" 
            data={filteredRisks} 
            orgId={currentOrg?.id || ''} 
          />
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Risk
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter risks by category, status, or search by title
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search risks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Cyber/IT">Cyber/IT</SelectItem>
                <SelectItem value="Operational">Operational</SelectItem>
                <SelectItem value="Third-Party">Third-Party</SelectItem>
                <SelectItem value="Regulatory">Regulatory</SelectItem>
                <SelectItem value="Data">Data</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="identified">Identified</SelectItem>
                <SelectItem value="assessed">Assessed</SelectItem>
                <SelectItem value="mitigated">Mitigated</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="monitored">Monitored</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'risk_score' | 'title' | 'created_at')}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="risk_score">Risk Score</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="created_at">Created Date</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setCategoryFilter('all')
                setStatusFilter('all')
                setSortBy('risk_score')
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Risk Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Likelihood</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRisks.map((risk) => (
                <TableRow key={risk.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{risk.title}</div>
                      {risk.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {risk.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{risk.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-medium">
                        {risk.likelihood}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-100 text-red-800 flex items-center justify-center text-sm font-medium">
                        {risk.impact}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskScoreBadge(risk.risk_score)}>
                        {risk.risk_score}
                      </Badge>
                      {getTrendIcon(risk)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(risk.status)}>
                      {risk.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {getOwnerName(risk.owner_id)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(risk)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(risk.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredRisks.length === 0 && (
            <div className="text-center py-8">
              <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No risks found</p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add your first risk
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog
        open={isCreateModalOpen || !!editingRisk}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            setEditingRisk(null);
            form.reset();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRisk ? 'Edit Risk' : 'Create New Risk'}
            </DialogTitle>
            <DialogDescription>
              {editingRisk 
                ? 'Update the risk details below.'
                : 'Fill in the details to create a new risk.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter risk title" {...field} />
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
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cyber/IT">Cyber/IT</SelectItem>
                          <SelectItem value="Operational">Operational</SelectItem>
                          <SelectItem value="Third-Party">Third-Party</SelectItem>
                          <SelectItem value="Regulatory">Regulatory</SelectItem>
                          <SelectItem value="Data">Data</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter risk description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="likelihood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Likelihood</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select likelihood" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 - Very Low</SelectItem>
                          <SelectItem value="2">2 - Low</SelectItem>
                          <SelectItem value="3">3 - Medium</SelectItem>
                          <SelectItem value="4">4 - High</SelectItem>
                          <SelectItem value="5">5 - Very High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="impact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Impact</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select impact" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 - Very Low</SelectItem>
                          <SelectItem value="2">2 - Low</SelectItem>
                          <SelectItem value="3">3 - Medium</SelectItem>
                          <SelectItem value="4">4 - High</SelectItem>
                          <SelectItem value="5">5 - Very High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="treatment_plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treatment Plan</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter treatment plan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingRisk(null);
                  form.reset();
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createRiskMutation.isPending || updateRiskMutation.isPending}>
                  {createRiskMutation.isPending || updateRiskMutation.isPending ? 'Saving...' : (editingRisk ? 'Update Risk' : 'Create Risk')}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
