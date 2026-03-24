// src/components/RiskForm.tsx
// Risk creation and editing form with AI-powered description assistant

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Loader2, Sparkles, Check, X, Edit } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Form schema
const riskFormSchema = z.object({
  title: z.string().min(1, 'Risk title is required'),
  description: z.string().optional(),
  category: z.enum(['Cyber/IT', 'Operational', 'Third-Party', 'Regulatory', 'Data']),
  likelihood: z.number().min(1).max(5),
  impact: z.number().min(1).max(5),
  treatment_plan: z.string().optional(),
  owner_id: z.string().optional(),
  review_date: z.string().optional(),
});

type RiskFormData = z.infer<typeof riskFormSchema>;

interface AIResponse {
  description: string;
  impact_statement: string;
  suggested_controls: string[];
}

interface RiskFormProps {
  defaultValues?: Partial<RiskFormData>;
  onSubmit: (data: RiskFormData) => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

export function RiskForm({ 
  defaultValues, 
  onSubmit, 
  isLoading = false, 
  mode = 'create' 
}: RiskFormProps) {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AIResponse | null>(null);
  const [acceptedSuggestions, setAcceptedSuggestions] = useState({
    description: false,
    impact_statement: false,
    controls: [] as string[]
  });

  const form = useForm<RiskFormData>({
    resolver: zodResolver(riskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Cyber/IT',
      likelihood: 3,
      impact: 3,
      treatment_plan: '',
      owner_id: '',
      review_date: '',
      ...defaultValues,
    },
  });

  // AI Generation Function
  const generateWithAI = async () => {
    const title = form.getValues('title');
    const category = form.getValues('category');

    if (!title.trim()) {
      form.setError('title', { message: 'Please enter a risk title first' });
      return;
    }

    setIsGeneratingAI(true);
    setAiSuggestions(null);

    try {
      const response = await fetch('/functions/v1/ai-risk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          category: category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI suggestions');
      }

      const aiResponse: AIResponse = await response.json();
      setAiSuggestions(aiResponse);
      setAcceptedSuggestions({
        description: false,
        impact_statement: false,
        controls: []
      });
    } catch (error) {
      console.error('AI generation error:', error);
      // Show error to user
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Accept AI Suggestion
  const acceptSuggestion = (type: 'description' | 'impact_statement', value: string) => {
    if (type === 'description') {
      form.setValue('description', value);
      setAcceptedSuggestions(prev => ({ ...prev, description: true }));
    } else if (type === 'impact_statement') {
      // Add impact statement to description or treatment plan
      const currentDescription = form.getValues('description') || '';
      const updatedDescription = currentDescription 
        ? `${currentDescription}\n\nImpact: ${value}`
        : `Impact: ${value}`;
      form.setValue('description', updatedDescription);
      setAcceptedSuggestions(prev => ({ ...prev, impact_statement: true }));
    }
  };

  // Accept Control Suggestion
  const acceptControl = (control: string) => {
    const currentTreatment = form.getValues('treatment_plan') || '';
    const updatedTreatment = currentTreatment
      ? `${currentTreatment}\n• ${control}`
      : `• ${control}`;
    form.setValue('treatment_plan', updatedTreatment);
    setAcceptedSuggestions(prev => ({
      ...prev,
      controls: [...prev.controls, control]
    }));
  };

  // Dismiss AI Suggestions
  const dismissSuggestions = () => {
    setAiSuggestions(null);
    setAcceptedSuggestions({
      description: false,
      impact_statement: false,
      controls: []
    });
  };

  const watchedTitle = form.watch('title');
  const watchedCategory = form.watch('category');

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{mode === 'create' ? 'Create New Risk' : 'Edit Risk'}</CardTitle>
              <CardDescription>
                {mode === 'create' 
                  ? 'Add a new risk to the register. Use AI assistance for detailed descriptions.'
                  : 'Update the risk information.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter risk title..." 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Category *</FormLabel>
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

              {/* Description with AI Assistant */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Risk Description
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateWithAI}
                        disabled={isGeneratingAI || !watchedTitle.trim()}
                        className="h-7 px-2"
                      >
                        {isGeneratingAI ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3 w-3 mr-1" />
                            Generate with AI
                          </>
                        )}
                      </Button>
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter detailed risk description..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* AI Suggestions */}
              {aiSuggestions && (
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        AI Suggestions
                      </CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={dismissSuggestions}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Description Suggestion */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Enhanced Description</h4>
                        {!acceptedSuggestions.description && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => acceptSuggestion('description', aiSuggestions.description)}
                            className="h-7 px-2"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Accept
                          </Button>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground bg-white p-3 rounded border">
                        {aiSuggestions.description}
                      </div>
                      {acceptedSuggestions.description && (
                        <Badge variant="secondary" className="mt-2">
                          <Check className="h-3 w-3 mr-1" />
                          Accepted
                        </Badge>
                      )}
                    </div>

                    <Separator />

                    {/* Impact Statement */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Impact Statement</h4>
                        {!acceptedSuggestions.impact_statement && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => acceptSuggestion('impact_statement', aiSuggestions.impact_statement)}
                            className="h-7 px-2"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Accept
                          </Button>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground bg-white p-3 rounded border">
                        {aiSuggestions.impact_statement}
                      </div>
                      {acceptedSuggestions.impact_statement && (
                        <Badge variant="secondary" className="mt-2">
                          <Check className="h-3 w-3 mr-1" />
                          Accepted
                        </Badge>
                      )}
                    </div>

                    <Separator />

                    {/* Suggested Controls */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Suggested Mitigating Controls</h4>
                      <div className="space-y-2">
                        {aiSuggestions.suggested_controls.map((control, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground bg-white p-2 rounded border flex-1">
                              {control}
                            </div>
                            {!acceptedSuggestions.controls.includes(control) && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => acceptControl(control)}
                                className="h-7 px-2 ml-2"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                            )}
                            {acceptedSuggestions.controls.includes(control) && (
                              <Badge variant="secondary" className="ml-2">
                                <Check className="h-3 w-3 mr-1" />
                                Added
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Risk Assessment */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="likelihood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Likelihood (1-5) *</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select likelihood" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 - Very Rare</SelectItem>
                          <SelectItem value="2">2 - Rare</SelectItem>
                          <SelectItem value="3">3 - Possible</SelectItem>
                          <SelectItem value="4">4 - Likely</SelectItem>
                          <SelectItem value="5">5 - Very Likely</SelectItem>
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
                      <FormLabel>Impact (1-5) *</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select impact" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 - Insignificant</SelectItem>
                          <SelectItem value="2">2 - Minor</SelectItem>
                          <SelectItem value="3">3 - Moderate</SelectItem>
                          <SelectItem value="4">4 - Major</SelectItem>
                          <SelectItem value="5">5 - Catastrophic</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Treatment Plan */}
              <FormField
                control={form.control}
                name="treatment_plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treatment Plan</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe mitigation strategies and controls..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Owner and Review Date */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="owner_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Owner</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select owner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Unassigned</SelectItem>
                          {/* TODO: Fetch users from organization */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="review_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                <>
                  {mode === 'create' ? 'Create Risk' : 'Update Risk'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
