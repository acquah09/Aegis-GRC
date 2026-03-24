// supabase/functions/ai-risk-score/index.ts
// AI-powered individual risk scoring using Anthropic Claude

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Risk category context for scoring
const categoryScoringContext = {
  'Cyber/IT': {
    'high_likelihood_indicators': ['unpatched systems', 'no security monitoring', 'remote access', 'cloud misconfiguration', 'weak passwords'],
    'high_impact_indicators': ['data breach', 'system downtime', 'customer data', 'financial systems', 'reputational damage'],
    'typical_ranges': { likelihood: [2, 4], impact: [3, 5] }
  },
  'Operational': {
    'high_likelihood_indicators': ['manual processes', 'single point of failure', 'no backup', 'understaffed', 'complex workflows'],
    'high_impact_indicators': ['production stoppage', 'customer impact', 'revenue loss', 'service disruption', 'quality issues'],
    'typical_ranges': { likelihood: [2, 4], impact: [2, 4] }
  },
  'Third-Party': {
    'high_likelihood_indicators': ['no vendor assessment', 'critical dependency', 'no SLA', 'single supplier', 'poor monitoring'],
    'high_impact_indicators': ['supply chain failure', 'service interruption', 'compliance breach', 'cost overruns', 'quality issues'],
    'typical_ranges': { likelihood: [1, 3], impact: [3, 5] }
  },
  'Regulatory': {
    'high_likelihood_indicators': ['no compliance program', 'outdated policies', 'no monitoring', 'complex regulations', 'frequent changes'],
    'high_impact_indicators': ['fines', 'legal action', 'license loss', 'reputational damage', 'business suspension'],
    'typical_ranges': { likelihood: [1, 3], impact: [4, 5] }
  },
  'Data': {
    'high_likelihood_indicators': ['no encryption', 'poor access controls', 'no backup', 'data sharing', 'inadequate storage'],
    'high_impact_indicators': ['data loss', 'privacy breach', 'compliance violation', 'customer impact', 'intellectual property loss'],
    'typical_ranges': { likelihood: [2, 4], impact: [3, 5] }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { title, description, category } = await req.json()

    if (!title || !category) {
      return new Response(
        JSON.stringify({ error: 'Title and category are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate category
    if (!Object.keys(categoryScoringContext).includes(category)) {
      return new Response(
        JSON.stringify({ error: 'Invalid category' }),
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
    const context = categoryScoringContext[category as keyof typeof categoryScoringContext]

    // Prepare AI prompt for risk scoring
    const prompt = `You are an expert risk assessment specialist with deep experience in ${category} risk management. 

Analyze the following risk and provide scoring recommendations:

Risk Information:
- Title: "${title}"
- Description: "${description || 'No description provided'}"
- Category: ${category}

Scoring Criteria:
- Likelihood (1-5): 1=Very Rare, 2=Rare, 3=Possible, 4=Likely, 5=Very Likely
- Impact (1-5): 1=Insignificant, 2=Minor, 3=Moderate, 4=Major, 5=Catastrophic

Category Context:
- High Likelihood Indicators: ${context.high_likelihood_indicators.join(', ')}
- High Impact Indicators: ${context.high_impact_indicators.join(', ')}
- Typical Ranges: Likelihood ${context.typical_ranges.likelihood[0]}-${context.typical_ranges.likelihood[1]}, Impact ${context.typical_ranges.impact[0]}-${context.typical_ranges.impact[1]}

Provide a detailed analysis in this JSON format:
{
  "likelihood": <number 1-5>,
  "impact": <number 1-5>,
  "reasoning": {
    "likelihood": "Detailed explanation for the likelihood score, considering probability, historical data, and contributing factors",
    "impact": "Detailed explanation for the impact score, considering financial, operational, reputational, and regulatory consequences"
  },
  "confidence": "high|medium|low"
}

Guidelines:
- Consider both the title and description in your analysis
- Provide specific, evidence-based reasoning for each score
- Consider the context of the ${category} category
- Assess confidence based on information quality and clarity
- Be objective and conservative in scoring
- Return ONLY valid JSON, no additional text

Example reasoning format:
"Likelihood: Based on the mention of [specific factors], this risk has a [high/medium/low] probability of occurring because [detailed explanation]."

"Impact: If this risk materializes, it would result in [specific consequences] affecting [financial/operational/reputational] aspects, justified by [detailed explanation]."`

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
        max_tokens: 1200,
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
        JSON.stringify({ error: 'Failed to generate AI scoring suggestions' }),
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

    // Validate AI response structure
    if (
      typeof aiResponse.likelihood !== 'number' || 
      typeof aiResponse.impact !== 'number' ||
      !aiResponse.reasoning ||
      !aiResponse.reasoning.likelihood ||
      !aiResponse.reasoning.impact
    ) {
      console.error('Invalid AI response structure:', aiResponse)
      return new Response(
        JSON.stringify({ error: 'AI response missing required fields' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate score ranges
    if (aiResponse.likelihood < 1 || aiResponse.likelihood > 5 || 
        aiResponse.impact < 1 || aiResponse.impact > 5) {
      console.error('Invalid score ranges:', aiResponse)
      return new Response(
        JSON.stringify({ error: 'AI response contains invalid scores' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log usage for monitoring
    try {
      await supabase
        .from('ai_usage_logs')
        .insert({
          service: 'anthropic',
          model: 'claude-3-sonnet-20240229',
          request_type: 'risk_scoring',
          input_tokens: anthropicResponse.usage?.input_tokens || 0,
          output_tokens: anthropicResponse.usage?.output_tokens || 0,
          created_at: new Date().toISOString()
        })
    } catch (logError) {
      console.error('Error logging AI usage:', logError)
    }

    return new Response(
      JSON.stringify({
        likelihood: aiResponse.likelihood,
        impact: aiResponse.impact,
        reasoning: {
          likelihood: aiResponse.reasoning.likelihood,
          impact: aiResponse.reasoning.impact
        },
        confidence: aiResponse.confidence || 'medium'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error in AI risk scoring:', error)
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
