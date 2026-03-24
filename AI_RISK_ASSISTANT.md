# AI-Powered Risk Description Assistant

## Overview
The AI-powered risk description assistant enhances the risk creation process by automatically generating comprehensive risk descriptions, impact statements, and suggested mitigating controls using Anthropic's Claude AI model.

## Components

### 1. RiskForm Component (`src/components/RiskForm.tsx`)
- **Purpose**: Enhanced risk creation/editing form with AI assistance
- **Features**:
  - "Generate with AI" button next to description field
  - Real-time AI suggestion display
  - Accept/edit/dismiss functionality for AI suggestions
  - Integration with existing form validation

**Key Features**:
- **AI Generation Button**: Appears next to description field, enabled when title is entered
- **Suggestion Panel**: Shows AI-generated content in an organized, interactive format
- **Accept/Reject Controls**: Users can accept individual suggestions or dismiss all
- **Visual Feedback**: Loading states, success indicators, and error handling

### 2. AI Edge Function (`supabase/functions/ai-risk/index.ts`)
- **Purpose**: Server-side AI processing using Anthropic Claude API
- **Features**:
  - Secure API key management via Supabase Vault
  - Context-aware prompt engineering
  - Structured JSON response parsing
  - Usage logging and monitoring

**Technical Implementation**:
```typescript
// API endpoint: /functions/v1/ai-risk
// Method: POST
// Body: { title: string, category: string }
// Response: { description: string, impact_statement: string, suggested_controls: string[] }
```

## AI Capabilities

### Generated Content Types

1. **Enhanced Description** (2-3 paragraphs)
   - Detailed explanation of the risk
   - Contributing factors and context
   - Category-specific considerations

2. **Impact Statement**
   - Financial, operational, reputational impacts
   - Regulatory and compliance implications
   - Business consequence analysis

3. **Suggested Controls** (3 specific controls)
   - Practical, actionable mitigation strategies
   - Industry-standard control measures
   - Category-recommended best practices

### Risk Category Context
The AI uses category-specific context to generate relevant content:

- **Cyber/IT**: Information security, data breaches, system vulnerabilities
- **Operational**: Process failures, supply chain, equipment issues
- **Third-Party**: Vendor risks, outsourcing, partner dependencies
- **Regulatory**: Compliance violations, legal requirements, audit failures
- **Data**: Data management, privacy breaches, quality issues

## Security & Architecture

### API Key Management
- **Storage**: Supabase Vault (secrets table)
- **Retrieval**: Server-side only, never exposed to client
- **Rotation**: Support for key rotation through vault updates

### Data Flow
1. Client sends title and category to Edge Function
2. Edge Function retrieves Anthropic API key from Supabase Vault
3. AI service processes request with category-specific context
4. Structured response returned to client
5. User can accept, edit, or dismiss suggestions

### Usage Monitoring
- **Logging**: All AI requests logged to `ai_usage_logs` table
- **Metrics**: Token usage, model version, request type tracking
- **Cost Management**: Monitor API usage for cost optimization

## Integration Points

### Risk Register Integration
- **Location**: `/risks` page risk creation dialog
- **Trigger**: "Generate with AI" button in RiskForm
- **Data Flow**: AI suggestions populate form fields

### Form Enhancement
- **Existing Forms**: RiskForm component replaces basic form fields
- **Validation**: Maintains existing form validation and Zod schemas
- **State Management**: Integrates with React Hook Form

## User Experience

### Workflow
1. User enters risk title and selects category
2. Clicks "Generate with AI" button
3. AI processes request (2-3 seconds)
4. Suggestions displayed in interactive panel
5. User can:
   - Accept individual suggestions
   - Edit suggestions before accepting
   - Dismiss all suggestions
   - Continue with manual input

### Visual Design
- **Loading States**: Spinner and "Generating..." text
- **Success Indicators**: Green checkmarks for accepted items
- **Error Handling**: User-friendly error messages
- **Responsive**: Works on mobile and desktop

## Configuration

### Required Environment Variables
```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Service (stored in Supabase Vault)
anthropic_api_key=your_anthropic_api_key
```

### Database Setup
```sql
-- Secrets table for API key storage
CREATE TABLE secrets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  secret TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI usage logging
CREATE TABLE ai_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service TEXT NOT NULL,
  model TEXT NOT NULL,
  request_type TEXT NOT NULL,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Error Handling

### Client-Side Errors
- **Validation**: Form validation before AI requests
- **Network**: Graceful handling of API failures
- **User Feedback**: Clear error messages and retry options

### Server-Side Errors
- **API Key**: Secure handling of missing/invalid keys
- **Rate Limits**: Handling Anthropic API rate limits
- **Parsing**: Robust JSON parsing with error recovery

## Performance Considerations

### Optimization
- **Caching**: Consider caching common risk patterns
- **Batching**: Batch multiple AI requests when possible
- **Timeouts**: Appropriate timeout values for AI requests

### Cost Management
- **Token Limits**: Reasonable limits on AI response length
- **Usage Tracking**: Monitor token usage for cost control
- **Model Selection**: Using Claude Sonnet for balance of quality/cost

## Future Enhancements

### Potential Improvements
1. **Multi-language Support**: Generate descriptions in multiple languages
2. **Risk Templates**: Pre-built templates for common risk types
3. **Bulk Generation**: Generate AI descriptions for multiple risks
4. **Integration**: Connect with external risk databases
5. **Custom Prompts**: Allow organizations to customize AI prompts

### Advanced Features
1. **Risk Scoring**: AI-assisted risk impact and likelihood scoring
2. **Control Mapping**: Automated control framework mapping
3. **Trend Analysis**: AI analysis of risk patterns and trends
4. **Predictive Analytics**: Risk prediction based on historical data

## Testing

### Unit Tests
- Test AI response parsing
- Test form integration
- Test error handling

### Integration Tests
- Test Edge Function endpoints
- Test API key retrieval
- Test usage logging

### User Testing
- Test user workflow
- Test error scenarios
- Test performance under load

## Monitoring & Analytics

### Metrics to Track
- **Usage**: Number of AI requests per day/week
- **Success Rate**: Percentage of successful AI generations
- **User Adoption**: How often users accept AI suggestions
- **Cost**: Token usage and associated costs

### Alerts
- **High Error Rates**: Alert on AI service failures
- **Cost Thresholds**: Alert on unusual cost increases
- **Usage Anomalies**: Alert on unusual usage patterns

## Compliance & Privacy

### Data Privacy
- **No PII**: Ensure no personally identifiable information sent to AI
- **Data Retention**: Clear policies on AI request data retention
- **Consent**: User consent for AI processing

### Compliance
- **SOC 2**: Ensure AI features comply with SOC 2 requirements
- **GDPR**: Compliance with data protection regulations
- **Industry Standards**: Alignment with risk management standards

This AI-powered risk description assistant significantly enhances the risk management workflow by providing intelligent, context-aware suggestions while maintaining security, privacy, and user control.
