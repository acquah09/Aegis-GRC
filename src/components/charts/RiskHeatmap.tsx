// src/components/charts/RiskHeatmap.tsx
// Interactive risk heatmap component

'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Risk } from '@/types/database';
import { useOrg } from '@/contexts/OrgContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, Calendar, User, X } from 'lucide-react';

const supabase = createClient();

interface RiskHeatmapProps {
  className?: string;
  onRiskClick?: (risk: Risk) => void;
}

interface HeatmapCell {
  likelihood: number;
  impact: number;
  risks: Risk[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  color: string;
}

export function RiskHeatmap({ className, onRiskClick }: RiskHeatmapProps) {
  const { currentOrg } = useOrg();
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ likelihood: number; impact: number } | null>(null);

  // Fetch risks for the heatmap
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

  // Calculate severity and color for each cell
  const getSeverity = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (score <= 4) return 'low';
    if (score <= 9) return 'medium';
    if (score <= 14) return 'high';
    return 'critical';
  };

  const getCellColor = (severity: 'low' | 'medium' | 'high' | 'critical'): string => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 hover:bg-green-200';
      case 'medium':
        return 'bg-yellow-100 hover:bg-yellow-200';
      case 'high':
        return 'bg-orange-100 hover:bg-orange-200';
      case 'critical':
        return 'bg-red-100 hover:bg-red-200';
      default:
        return 'bg-gray-100';
    }
  };

  const getRiskDotColor = (score: number): string => {
    if (score <= 4) return 'bg-green-600';
    if (score <= 9) return 'bg-yellow-600';
    if (score <= 14) return 'bg-orange-600';
    return 'bg-red-600';
  };

  // Create heatmap grid data
  const heatmapData = useMemo(() => {
    const grid: HeatmapCell[][] = [];
    
    for (let impact = 5; impact >= 1; impact--) {
      const row: HeatmapCell[] = [];
      for (let likelihood = 1; likelihood <= 5; likelihood++) {
        const cellRisks = risks.filter(
          risk => risk.likelihood === likelihood && risk.impact === impact
        );
        
        const maxScore = Math.max(...cellRisks.map(r => r.risk_score), 0);
        const severity = getSeverity(maxScore);
        
        row.push({
          likelihood,
          impact,
          risks: cellRisks,
          severity,
          color: getCellColor(severity),
        });
      }
      grid.push(row);
    }
    
    return grid;
  }, [risks]);

  // Handle risk click
  const handleRiskClick = (risk: Risk) => {
    setSelectedRisk(risk);
    onRiskClick?.(risk);
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

  // Get owner name
  const getOwnerName = (ownerId: string | undefined) => {
    if (!ownerId) return 'Unassigned';
    // This would be fetched from users data in a real implementation
    return 'Team Member';
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Risk Heatmap</CardTitle>
          <CardDescription>Loading risk data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Risk Heatmap</CardTitle>
          <CardDescription>Error loading risk data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Risk Heatmap</CardTitle>
              <CardDescription>
                Visual representation of risks by likelihood and impact
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-100 rounded"></div>
                <span className="text-xs text-gray-600">Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-100 rounded"></div>
                <span className="text-xs text-gray-600">Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-100 rounded"></div>
                <span className="text-xs text-gray-600">High</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-100 rounded"></div>
                <span className="text-xs text-gray-600">Critical</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Axis labels */}
            <div className="flex items-center justify-end">
              <div className="w-16 text-right text-sm font-medium text-gray-600">Impact</div>
              <div className="flex gap-2">
                {[5, 4, 3, 2, 1].map((value) => (
                  <div key={value} className="w-16 text-center text-sm text-gray-600">
                    {value}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Heatmap grid */}
            <div className="flex items-center gap-2">
              <div className="w-16 text-right text-sm font-medium text-gray-600">
                Likelihood
              </div>
              <div className="space-y-2">
                {heatmapData.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-2">
                    <div className="w-16 text-right text-sm text-gray-600">
                      {rowIndex + 1}
                    </div>
                    {row.map((cell, colIndex) => (
                      <Tooltip key={`${rowIndex}-${colIndex}`}>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-16 h-16 rounded-lg border border-gray-200 cursor-pointer transition-colors relative ${cell.color}`}
                            onMouseEnter={() => setHoveredCell({ likelihood: cell.likelihood, impact: cell.impact })}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            {/* Risk dots */}
                            <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-1 p-1">
                              {cell.risks.slice(0, 4).map((risk, index) => (
                                <button
                                  key={risk.id}
                                  onClick={() => handleRiskClick(risk)}
                                  className={`w-2 h-2 rounded-full ${getRiskDotColor(risk.risk_score)} hover:scale-125 transition-transform`}
                                  style={{
                                    position: 'absolute',
                                    left: `${(index % 2) * 8 + 4}px`,
                                    top: `${Math.floor(index / 2) * 8 + 4}px`,
                                  }}
                                />
                              ))}
                            </div>
                            
                            {/* Count badge for multiple risks */}
                            {cell.risks.length > 4 && (
                              <div className="absolute top-1 right-1">
                                <Badge variant="secondary" className="text-xs">
                                  +{cell.risks.length - 4}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-2">
                            <div className="font-medium">
                              Likelihood: {cell.likelihood}, Impact: {cell.impact}
                            </div>
                            {cell.risks.length > 0 && (
                              <div>
                                <div className="font-medium text-sm">Risks in this cell:</div>
                                <ul className="text-sm space-y-1">
                                  {cell.risks.slice(0, 3).map((risk) => (
                                    <li key={risk.id} className="flex items-center justify-between gap-2">
                                      <span className="truncate max-w-[200px]">{risk.title}</span>
                                      <Badge className={getStatusBadge(risk.status)}>
                                        {risk.risk_score}
                                      </Badge>
                                    </li>
                                  ))}
                                  {cell.risks.length > 3 && (
                                    <li className="text-gray-500">
                                      ... and {cell.risks.length - 3} more
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bottom axis label */}
            <div className="flex items-center justify-end">
              <div className="w-16"></div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="w-16 text-center text-sm text-gray-600">
                    {value}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Statistics */}
          <div className="mt-6 pt-4 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {risks.filter(r => r.risk_score <= 4).length}
                </div>
                <div className="text-sm text-gray-600">Low Risks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {risks.filter(r => r.risk_score >= 5 && r.risk_score <= 9).length}
                </div>
                <div className="text-sm text-gray-600">Medium Risks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {risks.filter(r => r.risk_score >= 10 && r.risk_score <= 14).length}
                </div>
                <div className="text-sm text-gray-600">High Risks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {risks.filter(r => r.risk_score >= 15).length}
                </div>
                <div className="text-sm text-gray-600">Critical Risks</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Details Dialog */}
      <Dialog open={!!selectedRisk} onOpenChange={() => setSelectedRisk(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Details
            </DialogTitle>
            <DialogDescription>
              View and manage risk information
            </DialogDescription>
          </DialogHeader>
          
          {selectedRisk && (
            <div className="space-y-6">
              {/* Risk Header */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{selectedRisk.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusBadge(selectedRisk.status)}>
                    {selectedRisk.status}
                  </Badge>
                  <Badge variant="outline">{selectedRisk.category}</Badge>
                  <Badge className={getRiskDotColor(selectedRisk.risk_score)}>
                    Score: {selectedRisk.risk_score}
                  </Badge>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600">Likelihood</div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-medium">
                      {selectedRisk.likelihood}
                    </div>
                    <span className="text-sm">
                      {selectedRisk.likelihood === 1 && 'Very Low'}
                      {selectedRisk.likelihood === 2 && 'Low'}
                      {selectedRisk.likelihood === 3 && 'Medium'}
                      {selectedRisk.likelihood === 4 && 'High'}
                      {selectedRisk.likelihood === 5 && 'Very High'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600">Impact</div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-800 flex items-center justify-center text-sm font-medium">
                      {selectedRisk.impact}
                    </div>
                    <span className="text-sm">
                      {selectedRisk.impact === 1 && 'Very Low'}
                      {selectedRisk.impact === 2 && 'Low'}
                      {selectedRisk.impact === 3 && 'Medium'}
                      {selectedRisk.impact === 4 && 'High'}
                      {selectedRisk.impact === 5 && 'Very High'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedRisk.description && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600">Description</div>
                  <p className="text-sm">{selectedRisk.description}</p>
                </div>
              )}

              {/* Treatment Plan */}
              {selectedRisk.treatment_plan && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600">Treatment Plan</div>
                  <p className="text-sm">{selectedRisk.treatment_plan}</p>
                </div>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600">Owner</div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{getOwnerName(selectedRisk.owner_id)}</span>
                  </div>
                </div>
                
                {selectedRisk.review_date && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600">Review Date</div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {new Date(selectedRisk.review_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedRisk(null)}>
                  Close
                </Button>
                <Button onClick={() => onRiskClick?.(selectedRisk)}>
                  Edit Risk
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
