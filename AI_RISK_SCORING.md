# AI Risk Scoring Assistant

## Overview
The AI Risk Scoring Assistant provides intelligent risk scoring suggestions using Anthropic's Claude AI model. It includes both individual risk scoring for the risk creation form and batch analysis capabilities for reviewing existing risk scores across the organization.

## Components

### 1. RiskScoreAdvisor Component (`src/components/RiskScoreAdvisor.tsx`)
- **Purpose**: Interactive AI scoring assistant for individual risks
- **Features**:
  - Real-time AI scoring suggestions for likelihood and impact
  - Detailed reasoning explanations for each score
  - Interactive sliders with AI suggestions clearly marked
  - Confidence indicators and acceptance tracking
  - Visual comparison of current vs suggested scores

**Key Features**:
- **Smart Activation**: Analyzes risk title and description
- **Dual Scoring**: Provides both likelihood and impact suggestions
- **Detailed Reasoning**: AI explains why each score was recommended
- **Interactive Controls**: Users can accept individual scores or both together
- **Visual Feedback**: Color-coded scores and confidence badges

### 2. BatchRescoreAdvisor Component
- **Purpose**: Analyzes multiple risks for scoring inconsistencies
- **Features**:
  - Batch analysis of all open risks
  - Priority-based issue identification
  - One-click application of AI suggestions
  - Comprehensive reasoning for each flagged risk

## AI Capabilities

### Individual Risk Scoring

**Input Data**:
- Risk title (required)
- Risk description (optional but recommended)
- Risk category

**Output Data**:
```json
{
  "likelihood": 3,
  "impact": 4,
  "reasoning": {
    "likelihood": "Detailed explanation for likelihood score...",
    "impact": "Detailed explanation for impact score..."
  },
  "confidence": "high|medium|low"
}
```

**Scoring Criteria**:
- **Likelihood (1-5)**: Very Rare → Rare → Possible → Likely → Very Likely
- **Impact (1-5)**: Insignificant → Minor → Moderate → Major → Catastrophic

### Batch Risk Analysis

**Input Data**: Array of risks with current scores
**Output Data**: Array of flagged risks with suggested corrections

**Priority Levels**:
- **High**: Score difference ≥ 8 points, or critical risks with clear scoring errors
- **Medium**: Score difference ≥ 5 points, or moderate discrepancies
- **Low**: Score difference ≥ 3 points, or minor inconsistencies

## Technical Implementation

### Edge Functions

#### 1. Individual Scoring (`/functions/v1/ai-risk-score`)
```typescript
// Method: POST
// Body: { title: string, description: string, category: string }
// Response: AI scoring suggestions with reasoning
```

#### 2. Batch Analysis (`/functions/v1/ai-batch-score`)
```typescript
// Method: POST
// Body: { risks: RiskData[] }
// Response: Array of scoring issues and suggestions
```

### Category-Specific Context

The AI uses category-specific indicators for more accurate scoring:

**Cyber/IT**:
- High Likelihood: Unpatched systems, no monitoring, remote access
- High Impact: Data breach, system downtime, customer data

**Operational**:
- High Likelihood: Manual processes, single points of failure
- High Impact: Production stoppage, customer impact, revenue loss

**Third-Party**:
- High Likelihood: No vendor assessment, critical dependencies
- High Impact: Supply chain failure, service interruption

**Regulatory**:
- High Likelihood: No compliance program, outdated policies
- High Impact: Fines, legal action, license loss

**Data**:
- High Likelihood: No encryption, poor access controls
- High Impact: Data loss, privacy breach, compliance violation

## User Interface

### Individual Risk Scoring Interface

**Visual Elements**:
- **AI Assistant Card**: Blue-themed card with brain icon
- **Score Comparison**: Current vs AI-suggested scores with arrows
- **Interactive Sliders**: Likelihood and impact sliders with AI suggestions
- **Reasoning Panels**: Detailed AI explanations for each score
- **Accept/Reject Controls**: Individual or batch acceptance of suggestions

**User Workflow**:
1. Enter risk title and description
2. Click "Get AI Score" button
3. Review AI suggestions with detailed reasoning
4. Accept individual scores or both together
5. Adjust manually if needed

### Batch Analysis Interface

**Visual Elements**:
- **Analysis Button**: Large button to analyze all risks
- **Results Panel**: Card showing flagged risks with priority badges
- **Risk Cards**: Individual risk analysis with apply buttons
- **Priority Indicators**: Color-coded priority badges

**User Workflow**:
1. Click "Analyze All Risk Scores" button
2. Review flagged risks with AI reasoning
3. Apply suggestions individually or in batch
4. Monitor progress through visual indicators

## Integration Points

### Risk Form Integration
- **Location**: Risk creation/editing forms
- **Trigger**: Automatic analysis when title/description entered
- **Data Flow**: AI suggestions populate form sliders
- **User Control**: Users maintain final approval authority

### Risk Register Integration
- **Location**: Risk register page header
- **Batch Processing**: Analyzes all open risks simultaneously
- **Priority Sorting**: Issues ranked by severity and priority
- **Quick Actions**: One-click application of corrections

## Security & Architecture

### API Key Management
- **Storage**: Supabase Vault (secrets table)
- **Retrieval**: Server-side only, never exposed to client
- **Rotation**: Support for key rotation without service interruption

### Data Privacy
- **No PII**: Risk data sanitized before AI processing
- **Transient Processing**: Data not stored by AI service
- **Compliance**: SOC 2 and GDPR compliant processing

### Usage Monitoring
```sql
-- Track AI usage for cost and performance monitoring
CREATE TABLE ai_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service TEXT NOT NULL,
  model TEXT NOT NULL,
  request_type TEXT NOT NULL,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Performance & Cost Management

### Optimization Strategies
- **Smart Batching**: Group similar risks for batch analysis
- **Caching**: Cache category context and common patterns
- **Token Limits**: Reasonable limits on AI response lengths
- **Timeout Handling**: Appropriate timeouts for AI requests

### Cost Controls
- **Usage Tracking**: Monitor token usage per request type
- **Budget Alerts**: Alert on unusual cost increases
- **Model Selection**: Claude Sonnet for optimal quality/cost balance

### Performance Metrics
- **Response Time**: Target < 3 seconds for individual scoring
- **Batch Processing**: Target < 10 seconds for 50 risks
- **Success Rate**: > 95% successful AI responses
- **User Adoption**: Track AI suggestion acceptance rates

## Configuration

### Required Setup

**Environment Variables**:
```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Service (stored in Supabase Vault)
anthropic_api_key=sk-ant-api-xxx
```

**Database Tables**:
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
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Error Handling & Resilience

### Client-Side Errors
- **Validation**: Input validation before AI requests
- **Network**: Graceful handling of API failures
- **Fallback**: Manual scoring always available
- **User Feedback**: Clear error messages and retry options

### Server-Side Errors
- **API Key Issues**: Secure handling of missing/invalid keys
- **Rate Limits**: Handling Anthropic API rate limits
- **Parsing**: Robust JSON parsing with error recovery
- **Timeouts**: Appropriate timeout handling

### Resilience Features
- **Retry Logic**: Automatic retry for transient failures
- **Circuit Breaker**: Prevent cascade failures
- **Fallback Responses**: Default suggestions when AI unavailable
- **Monitoring**: Real-time error tracking and alerting

## Quality Assurance

### AI Response Validation
- **Score Ranges**: Ensure scores are within 1-5 range
- **Structure Validation**: Validate JSON response structure
- **Content Validation**: Ensure reasoning is present and meaningful
- **Confidence Assessment**: AI self-assessment of response quality

### User Experience Testing
- **Usability Testing**: Test user workflow and interface
- **Accuracy Testing**: Compare AI suggestions with expert assessments
- **Performance Testing**: Test with various risk volumes and complexity
- **Error Scenarios**: Test error handling and recovery

## Analytics & Insights

### Usage Analytics
- **Adoption Rate**: Percentage of users accepting AI suggestions
- **Accuracy Metrics**: Comparison of AI vs expert scoring
- **Efficiency Gains**: Time savings in risk assessment process
- **Error Reduction**: Reduction in scoring inconsistencies

### Business Intelligence
- **Risk Patterns**: AI-identified risk scoring patterns
- **Category Insights**: Category-specific scoring trends
- **Improvement Areas**: Areas where AI provides most value
- **ROI Analysis**: Cost-benefit analysis of AI implementation

## Future Enhancements

### Advanced Features
1. **Learning System**: AI learns from user corrections and preferences
2. **Industry Templates**: Industry-specific scoring templates
3. **Predictive Analytics**: Predict risk evolution and score changes
4. **Integration**: Connect with external risk databases and benchmarks
5. **Multi-language**: Support for multiple languages in scoring analysis

### Automation Opportunities
1. **Scheduled Reviews**: Automated periodic risk score reviews
2. **Threshold Alerts**: Alert on significant score changes
3. **Compliance Checking**: Automated compliance score validation
4. **Reporting**: AI-generated risk scoring reports and insights

## Best Practices

### For Users
- **Review AI Suggestions**: Always review AI reasoning before accepting
- **Provide Context**: Include detailed descriptions for better AI analysis
- **Validate Results**: Cross-check AI suggestions with domain expertise
- **Feedback Loop**: Provide feedback on AI suggestion quality

### For Administrators
- **Monitor Usage**: Track AI usage and costs regularly
- **Update Context**: Keep category context current with industry changes
- **Security Reviews**: Regular security reviews of AI integrations
- **Performance Monitoring**: Monitor AI response times and accuracy

### For Developers
- **Error Handling**: Implement comprehensive error handling
- **Logging**: Detailed logging for troubleshooting and optimization
- **Testing**: Thorough testing of all AI integration points
- **Documentation**: Keep documentation current with AI capabilities

This AI Risk Scoring Assistant significantly enhances the risk management process by providing intelligent, context-aware scoring suggestions while maintaining human oversight and control. The system improves consistency, accuracy, and efficiency in risk assessment across the organization.
