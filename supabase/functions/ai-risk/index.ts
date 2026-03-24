// supabase/functions/ai-risk/index.ts
// AI-powered risk description assistant using Anthropic Claude

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Risk category context for AI
const categoryContext = {
  'Cyber/IT': 'Information technology, cybersecurity, data breaches, system failures, network security, cloud infrastructure, software vulnerabilities, ransomware, phishing attacks, data loss',
  'Operational': 'Business operations, process failures, supply chain disruptions, equipment failures, human errors, operational inefficiencies, quality control issues, service delivery',
  'Third-Party': 'Vendor relationships, supplier risks, outsourcing, partner dependencies, contractor issues, service provider failures, supply chain vulnerabilities',
  'Regulatory': 'Compliance violations, regulatory changes, legal requirements, audit failures, licensing issues, privacy regulations, industry standards, government oversight',
  'Data': 'Data management, privacy breaches, data quality issues, analytics failures, data governance, information lifecycle management, data security, backup and recovery'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { title, category } = await req.json()

    if (!title || !category) {
      return new Response(
        JSON.stringify({ error: 'Title and category are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate category
    if (!Object.keys(categoryContext).includes(category)) {
      return new Response(
        JSON.stringify({ error: 'Invalid category' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Anthropic API key from Supabase Vault
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Retrieve API key from secrets/vault
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

    // Prepare AI prompt
    const prompt = `You are a senior risk management consultant helping to create comprehensive risk assessments. 

Based on the following risk information:
- Risk Title: "${title}"
- Risk Category: "${category}" (${categoryContext[category as keyof typeof categoryContext]})

Please provide a detailed risk analysis in the following JSON format:
{
  "description": "A comprehensive risk description that explains what the risk is, why it occurs, and what factors contribute to it. Be specific and detailed (2-3 paragraphs).",
  "impact_statement": "A clear statement about the potential impact on the organization if this risk materializes, including financial, operational, reputational, and regulatory consequences.",
  "suggested_controls": [
    "First specific control measure to mitigate this risk",
    "Second specific control measure to mitigate this risk", 
    "Third specific control measure to mitigate this risk"
  ]
}

Guidelines:
- Make the description detailed enough for risk assessment purposes
- Focus on practical, actionable controls
- Consider the specific category context
- Ensure controls are specific and measurable
- Write in a professional, business-appropriate tone
- Return ONLY valid JSON, no additional text`

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
        max_tokens: 1500,
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
        JSON.stringify({ error: 'Failed to generate AI suggestions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const anthropicResponse = await response.json()
    const aiText = anthropicResponse.content[0].text

    // Parse AI response
    let aiResponse
    try {
      // Extract JSON from response (in case there's additional text)
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
    if (!aiResponse.description || !aiResponse.impact_statement || !Array.isArray(aiResponse.suggested_controls)) {
      console.error('Invalid AI response structure:', aiResponse)
      return new Response(
        JSON.stringify({ error: 'AI response missing required fields' }),
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
          request_type: 'risk_generation',
          input_tokens: anthropicResponse.usage?.input_tokens || 0,
          output_tokens: anthropicResponse.usage?.output_tokens || 0,
          created_at: new Date().toISOString()
        })
    } catch (logError) {
      console.error('Error logging AI usage:', logError)
      // Don't fail the request if logging fails
    }

    return new Response(
      JSON.stringify({
        description: aiResponse.description,
        impact_statement: aiResponse.impact_statement,
        suggested_controls: aiResponse.suggested_controls.slice(0, 3) // Ensure max 3 controls
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error in AI risk generation:', error)
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
