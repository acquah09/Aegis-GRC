// src/components/RiskScoreAdvisor.tsx
// AI-powered risk scoring assistant with individual and batch scoring

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  RefreshCw,
  Target,
  TrendingUp,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIScoreSuggestion {
  likelihood: number;
  impact: number;
  reasoning: {
    likelihood: string;
    impact: string;
  };
  confidence: 'high' | 'medium' | 'low';
}

interface BatchRescoreResult {
  risk_id: string;
  title: string;
  current_score: number;
  suggested_likelihood: number;
  suggested_impact: number;
  suggested_score: number;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
}

interface RiskScoreAdvisorProps {
  title: string;
  description: string;
  category: string;
  onScoresUpdate: (likelihood: number, impact: number) => void;
  currentLikelihood?: number;
  currentImpact?: number;
  className?: string;
}

export function RiskScoreAdvisor({ 
  title, 
  description, 
  category, 
  onScoresUpdate,
  currentLikelihood = 3,
  currentImpact = 3,
  className 
}: RiskScoreAdvisorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AIScoreSuggestion | null>(null);
  const [acceptedScores, setAcceptedScores] = useState({ likelihood: false, impact: false });
  const [error, setError] = useState<string | null>(null);

  // Generate AI scoring suggestions
  const generateAIScores = async () => {
    if (!title.trim() && !description.trim()) {
      setError('Please enter a risk title or description first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/functions/v1/ai-risk-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category: category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI scoring suggestions');
      }

      const suggestion: AIScoreSuggestion = await response.json();
      setAiSuggestion(suggestion);
      setAcceptedScores({ likelihood: false, impact: false });
    } catch (err) {
      console.error('AI scoring error:', err);
      setError('Failed to generate AI suggestions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Accept AI suggestion
  const acceptSuggestion = (type: 'likelihood' | 'impact') => {
    if (!aiSuggestion) return;

    const newLikelihood = type === 'likelihood' ? aiSuggestion.likelihood : currentLikelihood;
    const newImpact = type === 'impact' ? aiSuggestion.impact : currentImpact;
    
    onScoresUpdate(newLikelihood, newImpact);
    setAcceptedScores(prev => ({ ...prev, [type]: true }));
  };

  // Accept both suggestions
  const acceptBothSuggestions = () => {
    if (!aiSuggestion) return;
    
    onScoresUpdate(aiSuggestion.likelihood, aiSuggestion.impact);
    setAcceptedScores({ likelihood: true, impact: true });
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score <= 2) return 'text-green-600';
    if (score <= 3) return 'text-yellow-600';
    if (score <= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  // Get confidence badge color
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const riskScore = currentLikelihood * currentImpact;
  const suggestedScore = aiSuggestion ? aiSuggestion.likelihood * aiSuggestion.impact : null;

  return (
    <Card className={cn("border-blue-200 bg-blue-50/30", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-600" />
            AI Risk Scoring Assistant
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={generateAIScores}
            disabled={isGenerating || (!title.trim() && !description.trim())}
            className="h-7 px-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Target className="h-3 w-3 mr-1" />
                Get AI Score
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {aiSuggestion && (
          <div className="space-y-4">
            {/* AI Confidence */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">AI Confidence</span>
              <Badge className={getConfidenceColor(aiSuggestion.confidence)}>
                {aiSuggestion.confidence.toUpperCase()}
              </Badge>
            </div>

            <Separator />

            {/* Current vs Suggested Scores */}
            <div className="grid grid-cols-2 gap-4">
              {/* Likelihood */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Likelihood</span>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-lg font-bold", getScoreColor(currentLikelihood))}>
                      {currentLikelihood}
                    </span>
                    {aiSuggestion.likelihood !== currentLikelihood && (
                      <span className={cn("text-sm", getScoreColor(aiSuggestion.likelihood))}>
                        → {aiSuggestion.likelihood}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Slider
                    value={[currentLikelihood]}
                    onValueChange={(value) => onScoresUpdate(value[0], currentImpact)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  
                  {aiSuggestion.likelihood !== currentLikelihood && !acceptedScores.likelihood && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => acceptSuggestion('likelihood')}
                      className="w-full h-7"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Use AI Suggestion ({aiSuggestion.likelihood})
                    </Button>
                  )}
                  
                  {acceptedScores.likelihood && (
                    <Badge variant="secondary" className="w-full justify-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      AI Suggestion Applied
                    </Badge>
                  )}
                </div>

                {/* AI Reasoning for Likelihood */}
                <div className="mt-2 p-2 bg-background rounded border text-xs">
                  <div className="flex items-center gap-1 mb-1">
                    <Info className="h-3 w-3 text-blue-500" />
                    <span className="font-medium">AI Reasoning:</span>
                  </div>
                  <p className="text-muted-foreground">{aiSuggestion.reasoning.likelihood}</p>
                </div>
              </div>

              {/* Impact */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Impact</span>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-lg font-bold", getScoreColor(currentImpact))}>
                      {currentImpact}
                    </span>
                    {aiSuggestion.impact !== currentImpact && (
                      <span className={cn("text-sm", getScoreColor(aiSuggestion.impact))}>
                        → {aiSuggestion.impact}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Slider
                    value={[currentImpact]}
                    onValueChange={(value) => onScoresUpdate(currentLikelihood, value[0])}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  
                  {aiSuggestion.impact !== currentImpact && !acceptedScores.impact && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => acceptSuggestion('impact')}
                      className="w-full h-7"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Use AI Suggestion ({aiSuggestion.impact})
                    </Button>
                  )}
                  
                  {acceptedScores.impact && (
                    <Badge variant="secondary" className="w-full justify-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      AI Suggestion Applied
                    </Badge>
                  )}
                </div>

                {/* AI Reasoning for Impact */}
                <div className="mt-2 p-2 bg-background rounded border text-xs">
                  <div className="flex items-center gap-1 mb-1">
                    <Info className="h-3 w-3 text-blue-500" />
                    <span className="font-medium">AI Reasoning:</span>
                  </div>
                  <p className="text-muted-foreground">{aiSuggestion.reasoning.impact}</p>
                </div>
              </div>
            </div>

            {/* Risk Score Comparison */}
            <div className="flex items-center justify-between p-3 bg-background rounded border">
              <div>
                <span className="text-sm font-medium">Risk Score: </span>
                <span className={cn("text-lg font-bold", getScoreColor(riskScore))}>
                  {riskScore}
                </span>
                {suggestedScore && suggestedScore !== riskScore && (
                  <span className={cn("text-sm ml-2", getScoreColor(suggestedScore))}>
                    AI suggests: {suggestedScore}
                  </span>
                )}
              </div>
              
              {!acceptedScores.likelihood && !acceptedScores.impact && aiSuggestion && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={acceptBothSuggestions}
                  className="h-7"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Accept Both
                </Button>
              )}
            </div>
          </div>
        )}

        {!aiSuggestion && !isGenerating && (
          <div className="text-center py-4">
            <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Enter risk details and click "Get AI Score" for intelligent scoring suggestions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Batch Rescore Component
interface BatchRescoreAdvisorProps {
  risks: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    likelihood: number;
    impact: number;
  }>;
  onRiskUpdate: (riskId: string, likelihood: number, impact: number) => void;
}

export function BatchRescoreAdvisor({ risks, onRiskUpdate }: BatchRescoreAdvisorProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<BatchRescoreResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Analyze all risks for scoring issues
  const analyzeAllRisks = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/functions/v1/ai-batch-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          risks: risks.map(risk => ({
            id: risk.id,
            title: risk.title,
            description: risk.description,
            category: risk.category,
            current_likelihood: risk.likelihood,
            current_impact: risk.impact,
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze risks');
      }

      const analysisResults: BatchRescoreResult[] = await response.json();
      setResults(analysisResults);
      setShowResults(true);
    } catch (err) {
      console.error('Batch analysis error:', err);
      setError('Failed to analyze risks. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Apply AI suggestion for a specific risk
  const applySuggestion = (result: BatchRescoreResult) => {
    onRiskUpdate(result.risk_id, result.suggested_likelihood, result.suggested_impact);
    
    // Remove from results after applying
    setResults(prev => prev.filter(r => r.risk_id !== result.risk_id));
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const significantDiscrepancies = results.filter(r => 
    Math.abs(r.current_score - r.suggested_score) >= 5
  );

  return (
    <div className="space-y-4">
      {/* Batch Analysis Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Batch Risk Score Analysis
          </CardTitle>
          <CardDescription>
            AI will analyze all open risks and identify potential scoring inconsistencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={analyzeAllRisks}
            disabled={isAnalyzing || risks.length === 0}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing {risks.length} risks...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Analyze All Risk Scores
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results Display */}
      {showResults && results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Risk Score Analysis Results
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResults(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Found {significantDiscrepancies.length} risks with significant scoring discrepancies
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {results.map((result) => (
              <div key={result.risk_id} className="border rounded-lg p-4 space-y-3">
                {/* Risk Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{result.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">
                        Current: {result.current_score} (L{result.current_likelihood}×I{result.current_impact})
                      </span>
                      <TrendingUp className="h-3 w-3 text-orange-500" />
                      <span className="text-sm font-medium text-orange-600">
                        Suggested: {result.suggested_score} (L{result.suggested_likelihood}×I{result.suggested_impact})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(result.priority)}>
                      {result.priority.toUpperCase()} PRIORITY
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applySuggestion(result)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Apply
                    </Button>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="bg-muted/50 p-3 rounded text-sm">
                  <div className="flex items-center gap-1 mb-1">
                    <Info className="h-3 w-3 text-blue-500" />
                    <span className="font-medium">AI Analysis:</span>
                  </div>
                  <p className="text-muted-foreground">{result.reasoning}</p>
                </div>
              </div>
            ))}

            {significantDiscrepancies.length === 0 && (
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  All risk scores appear to be consistent with AI analysis
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
