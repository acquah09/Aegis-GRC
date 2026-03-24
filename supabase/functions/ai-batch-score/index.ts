// supabase/functions/ai-batch-score/index.ts
// AI-powered batch risk scoring analysis using Anthropic Claude

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { risks } = await req.json()

    if (!risks || !Array.isArray(risks) || risks.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Risks array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Anthropic API key from Supabase Vault
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: secret, error: secretError } = await supabase
      .from('secrets')
      .select('secret')
      .eq('name', 'anthropic_api_key')
      .single()

    if (secretError || !secret) {
      console.error('Error retrieving Anthropic API key:', secretError)
      return new Response(
        JSON.stringify({ error: 'AI service configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const anthropicApiKey = secret.secret

    // Prepare risks for batch analysis
    const risksText = risks.map((risk: any, index: number) => 
      `${index + 1}. ID: ${risk.id}
   Title: "${risk.title}"
   Description: "${risk.description || 'No description provided'}"
   Category: ${risk.category}
   Current Scores: Likelihood ${risk.current_likelihood}, Impact ${risk.current_impact} (Score: ${risk.current_likelihood * risk.current_impact})`
    ).join('\n\n')

    // Prepare AI prompt for batch analysis
    const prompt = `You are an expert risk assessment specialist conducting a comprehensive review of risk scores across an organization's risk register.

Review the following risks and identify potential scoring inconsistencies or issues:

${risksText}

For each risk that appears to have questionable scoring, provide:
1. Suggested corrected likelihood score (1-5)
2. Suggested corrected impact score (1-5) 
3. Detailed reasoning for the changes
4. Priority level (high/medium/low) based on scoring discrepancy severity

Scoring Criteria:
- Likelihood (1-5): 1=Very Rare, 2=Rare, 3=Possible, 4=Likely, 5=Very Likely
- Impact (1-5): 1=Insignificant, 2=Minor, 3=Moderate, 4=Major, 5=Catastrophic

Focus on risks where:
- Current scores seem inconsistent with the risk description/title
- High-impact risks have unusually low likelihood scores
- Low-impact risks have unusually high scores
- Category-specific patterns suggest misalignment
- Scores don't align with industry standards

Return your analysis in this JSON format:
{
  "analysis": [
    {
      "risk_id": "risk_id_here",
      "suggested_likelihood": <number 1-5>,
      "suggested_impact": <number 1-5>,
      "reasoning": "Detailed explanation of why the current scoring appears incorrect and why the suggested scores are more appropriate",
      "priority": "high|medium|low"
    }
  ]
}

Guidelines:
- Only include risks that genuinely appear mis-scored (significant discrepancies)
- Prioritize high-impact risks with questionable scoring
- Provide specific, evidence-based reasoning
- Consider the context of each risk category
- If most scores appear reasonable, return an empty analysis array
- Be conservative - only flag clear scoring issues
- Return ONLY valid JSON, no additional text

Priority Guidelines:
- High: Score difference >= 8 points, or high-impact risks with clearly wrong scores
- Medium: Score difference >= 5 points, or moderate discrepancies
- Low: Score difference >= 3 points, or minor inconsistencies`

    // Call Anthropic Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Anthropic API error:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to analyze risk scores' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const anthropicResponse = await response.json()
    const aiText = anthropicResponse.content[0].text

    // Parse AI response
    let aiResponse
    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response')
      }
      
      aiResponse = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      console.error('Raw AI response:', aiText)
      return new Response(
        JSON.stringify({ error: 'Invalid AI response format' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate and process results
    if (!aiResponse.analysis || !Array.isArray(aiResponse.analysis)) {
      console.error('Invalid AI response structure:', aiResponse)
      return new Response(
        JSON.stringify({ error: 'AI response missing required analysis array' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Process results and match with original risk data
    const results = aiResponse.analysis.map((analysis: any) => {
      const originalRisk = risks.find((r: any) => r.id === analysis.risk_id)
      if (!originalRisk) {
        console.warn('Risk not found for analysis:', analysis.risk_id)
        return null
      }

      const currentScore = originalRisk.current_likelihood * originalRisk.current_impact
      const suggestedScore = analysis.suggested_likelihood * analysis.suggested_impact

      return {
        risk_id: analysis.risk_id,
        title: originalRisk.title,
        current_score: currentScore,
        suggested_likelihood: analysis.suggested_likelihood,
        suggested_impact: analysis.suggested_impact,
        suggested_score: suggestedScore,
        reasoning: analysis.reasoning,
        priority: analysis.priority || 'medium'
      }
    }).filter(Boolean)

    // Log usage for monitoring
    try {
      await supabase
        .from('ai_usage_logs')
        .insert({
          service: 'anthropic',
          model: 'claude-3-sonnet-20240229',
          request_type: 'batch_risk_scoring',
          input_tokens: anthropicResponse.usage?.input_tokens || 0,
          output_tokens: anthropicResponse.usage?.output_tokens || 0,
          metadata: {
            risks_analyzed: risks.length,
            issues_found: results.length
          },
          created_at: new Date().toISOString()
        })
    } catch (logError) {
      console.error('Error logging AI usage:', logError)
    }

    return new Response(
      JSON.stringify(results),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error in batch risk scoring:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
