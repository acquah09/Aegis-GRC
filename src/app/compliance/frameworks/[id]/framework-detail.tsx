// src/app/compliance/frameworks/[id]/framework-detail.tsx
// Framework detail component with controls checklist

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

const supabase = createClient();

// Zod schema for compliance item form
const complianceItemSchema = z.object({
  control_ref: z.string().optional(),
  title: z.string().min(1, 'Control title is required'),
  description: z.string().optional(),
  status: z.enum(['not-started', 'in-progress', 'compliant', 'not-applicable']),
  evidence_url: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
  assigned_to: z.string().optional(),
  due_date: z.string().optional(),
});

type ComplianceItemFormData = z.infer<typeof complianceItemSchema>;

interface FrameworkDetailProps {
  frameworkId: string;
}

export function FrameworkDetail({ frameworkId }: FrameworkDetailProps) {
  const { currentOrg } = useOrg();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Form for editing compliance items
  const form = useForm<ComplianceItemFormData>({
    resolver: zodResolver(complianceItemSchema),
    defaultValues: {
      control_ref: '',
      title: '',
      description: '',
      status: 'not-started',
      evidence_url: '',
      notes: '',
      assigned_to: '',
      due_date: '',
    },
  });

  // Fetch framework details
  const { data: framework, isLoading: frameworkLoading } = useQuery({
    queryKey: ['framework', frameworkId],
    queryFn: async () => {
      if (!currentOrg?.id) return null;
      
      const { data, error } = await supabase
        .from('frameworks')
        .select('*')
        .eq('id', frameworkId)
        .eq('org_id', currentOrg.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!currentOrg?.id,
  });

  // Fetch compliance items for this framework
  const { data: complianceItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['compliance-items', frameworkId],
    queryFn: async () => {
      if (!currentOrg?.id) return [];
      
      const { data, error } = await supabase
        .from('compliance_items')
        .select('*')
        .eq('framework_id', frameworkId)
        .eq('org_id', currentOrg.id)
        .order('control_ref', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentOrg?.id,
  });

  // Fetch users for assignment
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

  // Update compliance item mutation
  const updateItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ComplianceItemFormData }) => {
      const { data: item, error } = await supabase
        .from('compliance_items')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-items', frameworkId] });
      setEditingItem(null);
      form.reset();
    },
  });

  // Create compliance item mutation
  const createItemMutation = useMutation({
    mutationFn: async (data: ComplianceItemFormData) => {
      if (!currentOrg?.id) throw new Error('No organization selected');
      
      const { data: item, error } = await supabase
        .from('compliance_items')
        .insert({
          ...data,
          framework_id: frameworkId,
          org_id: currentOrg.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-items', frameworkId] });
      setIsAddingItem(false);
      form.reset();
    },
  });

  // Calculate completion percentage
  const completionPercentage = complianceItems.length > 0 
    ? Math.round((complianceItems.filter(item => item.status === 'compliant').length / complianceItems.length) * 100)
    : 0;

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'not-started':
        return 'bg-red-100 text-red-800';
      case 'not-applicable':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'not-started':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'not-applicable':
        return <X className="h-4 w-4 text-gray-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  // Handle form submission
  const onSubmit = (data: ComplianceItemFormData) => {
    if (editingItem) {
      updateItemMutation.mutate({ id: editingItem, data });
    } else {
      createItemMutation.mutate(data);
    }
  };

  // Handle edit
  const handleEdit = (item: ComplianceItem) => {
    setEditingItem(item.id);
    form.reset({
      control_ref: item.control_ref || '',
      title: item.title,
      description: item.description || '',
      status: item.status,
      evidence_url: item.evidence_url || '',
      notes: item.notes || '',
      assigned_to: item.assigned_to || '',
      due_date: item.due_date || '',
    });
  };

  // Handle cancel
  const handleCancel = () => {
    setEditingItem(null);
    setIsAddingItem(false);
    form.reset();
  };

  if (frameworkLoading || itemsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!framework) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-4" />
          <p className="text-red-600">Framework not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" onClick={() => router.back()}>
              ← Back
            </Button>
            <h1 className="text-3xl font-bold">{framework.name}</h1>
            {framework.version && (
              <Badge variant="outline">v{framework.version}</Badge>
            )}
          </div>
          {framework.description && (
            <p className="text-gray-600">{framework.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsAddingItem(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Control
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Progress</CardTitle>
          <CardDescription>
            Overall framework completion status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Completion Rate</span>
              <span className="text-sm font-bold">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-green-600">
                  {complianceItems.filter(item => item.status === 'compliant').length}
                </div>
                <div className="text-gray-600">Compliant</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-yellow-600">
                  {complianceItems.filter(item => item.status === 'in-progress').length}
                </div>
                <div className="text-gray-600">In Progress</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-red-600">
                  {complianceItems.filter(item => item.status === 'not-started').length}
                </div>
                <div className="text-gray-600">Not Started</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-600">
                  {complianceItems.filter(item => item.status === 'not-applicable').length}
                </div>
                <div className="text-gray-600">N/A</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Controls Checklist</CardTitle>
          <CardDescription>
            Manage individual compliance controls and track implementation status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Add New Control Form */}
            {isAddingItem && (
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Add New Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="control_ref"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Control Reference</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., A-1.1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Control Title *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter control title" {...field} />
                              </FormControl>
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
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe the control requirement"
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="not-started">Not Started</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="compliant">Compliant</SelectItem>
                                  <SelectItem value="not-applicable">Not Applicable</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="assigned_to"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Assigned To</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Assign to" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="">Unassigned</SelectItem>
                                  {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                      {user.first_name || user.email}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="due_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Due Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="evidence_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Evidence URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Additional notes or comments"
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createItemMutation.isPending}>
                          {createItemMutation.isPending ? 'Saving...' : 'Add Control'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* Controls List */}
            {complianceItems.map((item) => (
              <Card key={item.id} className={editingItem === item.id ? 'border-blue-200' : ''}>
                <CardContent className="p-4">
                  {editingItem === item.id ? (
                    // Edit Form
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="control_ref"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Control Reference</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., A-1.1" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Control Title *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter control title" {...field} />
                                </FormControl>
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
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe the control requirement"
                                  className="min-h-[60px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Status *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="not-started">Not Started</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="compliant">Compliant</SelectItem>
                                    <SelectItem value="not-applicable">Not Applicable</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="assigned_to"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Assigned To</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Assign to" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="">Unassigned</SelectItem>
                                    {users.map((user) => (
                                      <SelectItem key={user.id} value={user.id}>
                                        {user.first_name || user.email}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="due_date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Due Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="evidence_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Evidence URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notes</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Additional notes or comments"
                                  className="min-h-[60px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={updateItemMutation.isPending}>
                            {updateItemMutation.isPending ? 'Saving...' : 'Update Control'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    // Display Mode
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {item.control_ref && (
                              <Badge variant="outline" className="font-mono">
                                {item.control_ref}
                              </Badge>
                            )}
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <Badge className={getStatusBadge(item.status)}>
                              {getStatusIcon(item.status)}
                              <span className="ml-1">{item.status}</span>
                            </Badge>
                          </div>
                          {item.description && (
                            <p className="text-gray-600 mb-3">{item.description}</p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            {item.assigned_to && (
                              <span>
                                Assigned to: {users.find(u => u.id === item.assigned_to)?.first_name || 'Unknown'}
                              </span>
                            )}
                            {item.due_date && (
                              <span>
                                Due: {new Date(item.due_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {item.evidence_url && (
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <Link className="h-4 w-4 text-gray-500" />
                          <a 
                            href={item.evidence_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline truncate"
                          >
                            {item.evidence_url}
                          </a>
                        </div>
                      )}
                      
                      {item.notes && (
                        <div className="p-3 bg-gray-50 rounded">
                          <div className="text-sm font-medium text-gray-700 mb-1">Notes:</div>
                          <p className="text-sm text-gray-600">{item.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {complianceItems.length === 0 && !isAddingItem && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No controls yet</h3>
                <p className="text-gray-600 mb-4">
                  Add your first control to start tracking compliance for this framework.
                </p>
                <Button onClick={() => setIsAddingItem(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Control
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
