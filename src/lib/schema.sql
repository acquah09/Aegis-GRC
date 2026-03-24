-- Aegis GRC Database Schema
-- This file defines the complete database schema for the Aegis GRC platform

-- Enable Row Level Security (RLS)
ALTER DATABASE SET "row_level_security" = on;

-- Organizations Table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    domain TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT profiles_email_org_unique UNIQUE(org_id, email)
);

-- Frameworks Table
CREATE TABLE IF NOT EXISTS frameworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    version TEXT,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Controls Table
CREATE TABLE IF NOT EXISTS controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
    control_ref TEXT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    type TEXT,
    effectiveness INTEGER DEFAULT 0 CHECK (effectiveness >= 0 AND effectiveness <= 100),
    status TEXT NOT NULL DEFAULT 'gap' CHECK (status IN ('implemented', 'partial', 'gap')),
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    evidence_notes TEXT,
    last_reviewed TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Risks Table
CREATE TABLE IF NOT EXISTS risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('Cyber/IT', 'Operational', 'Third-Party', 'Regulatory', 'Data')),
    likelihood INTEGER DEFAULT 1 CHECK (likelihood >= 1 AND likelihood <= 5),
    impact INTEGER DEFAULT 1 CHECK (impact >= 1 AND impact <= 5),
    risk_score INTEGER GENERATED ALWAYS AS (likelihood * impact) STORED,
    status TEXT NOT NULL DEFAULT 'identified' CHECK (status IN ('identified', 'assessed', 'mitigated', 'accepted', 'monitored')),
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    treatment_plan TEXT,
    review_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance Items Table
CREATE TABLE IF NOT EXISTS compliance_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
    control_ref TEXT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'non_compliant' CHECK (status IN ('compliant', 'non_compliant', 'in_progress', 'not_applicable')),
    evidence_url TEXT,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Risk Assessment History Table
CREATE TABLE IF NOT EXISTS risk_assessment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    risk_id UUID REFERENCES risks(id) ON DELETE CASCADE,
    previous_likelihood INTEGER,
    previous_impact INTEGER,
    new_likelihood INTEGER,
    new_impact INTEGER,
    previous_score INTEGER,
    new_score INTEGER,
    assessment_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Control Implementation Evidence Table
CREATE TABLE IF NOT EXISTS control_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    control_id UUID REFERENCES controls(id) ON DELETE CASCADE,
    file_url TEXT,
    file_name TEXT,
    file_type TEXT,
    file_size INTEGER,
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Risk Mitigation Plans Table
CREATE TABLE IF NOT EXISTS risk_mitigation_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    risk_id UUID REFERENCES risks(id) ON DELETE CASCADE,
    strategy TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    completion_date TIMESTAMP WITH TIME ZONE,
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
-- Organizations can only access their own data
CREATE POLICY IF NOT EXISTS "org_isolation" ON organizations
    FOR ALL
    USING (org_id = auth.uid())
    WITH CHECK (true);

-- Profiles can only access their own org's data
CREATE POLICY IF NOT EXISTS "profile_org_access" ON profiles
    FOR ALL
    USING (org_id = auth.uid())
    WITH CHECK (true);

-- Frameworks RLS
CREATE POLICY IF NOT EXISTS "frameworks_rls" ON frameworks
    FOR ALL
    USING (org_id = auth.uid())
    WITH CHECK (true);

-- Controls RLS
CREATE POLICY IF NOT EXISTS "controls_rls" ON controls
    FOR ALL
    USING (org_id = auth.uid())
    WITH CHECK (true);

-- Risks RLS
CREATE POLICY IF NOT EXISTS "risks_rls" ON risks
    FOR ALL
    USING (org_id = auth.uid())
    WITH CHECK (true);

-- Compliance Items RLS
CREATE POLICY IF NOT EXISTS "compliance_items_rls" ON compliance_items
    FOR ALL
    USING (org_id = auth.uid())
    WITH CHECK (true);

-- Audit Logs RLS
CREATE POLICY IF NOT EXISTS "audit_logs_rls" ON audit_logs
    FOR ALL
    USING (org_id = auth.uid())
    WITH CHECK (true);

-- Risk Assessment History RLS
CREATE POLICY IF NOT EXISTS "risk_assessment_history_rls" ON risk_assessment_history
    FOR ALL
    USING (org_id = auth.uid())
    WITH CHECK (true);

-- Control Evidence RLS
CREATE POLICY IF NOT EXISTS "control_evidence_rls" ON control_evidence
    FOR ALL
    USING (org_id = auth.uid())
    WITH CHECK (true);

-- Risk Mitigation Plans RLS
CREATE POLICY IF NOT EXISTS "risk_mitigation_plans_rls" ON risk_mitigation_plans
    FOR ALL
    USING (org_id = auth.uid())
    WITH CHECK (true);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_profiles_org_id ON profiles(org_id);
CREATE INDEX IF NOT EXISTS idx_frameworks_org_id ON frameworks(org_id);
CREATE INDEX IF NOT EXISTS idx_controls_org_id ON controls(org_id);
CREATE INDEX IF NOT EXISTS idx_controls_framework_id ON controls(framework_id);
CREATE INDEX IF NOT EXISTS idx_risks_org_id ON risks(org_id);
CREATE INDEX IF NOT EXISTS idx_risks_owner_id ON risks(owner_id);
CREATE INDEX IF NOT EXISTS idx_risks_category ON risks(category);
CREATE INDEX IF NOT EXISTS idx_risks_status ON risks(status);
CREATE INDEX IF NOT EXISTS idx_compliance_items_org_id ON compliance_items(org_id);
CREATE INDEX IF NOT EXISTS idx_compliance_items_framework_id ON compliance_items(framework_id);
CREATE INDEX IF NOT EXISTS idx_compliance_items_status ON compliance_items(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_id ON audit_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_risk_assessment_history_org_id ON risk_assessment_history(org_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessment_history_risk_id ON risk_assessment_history(risk_id);
CREATE INDEX IF NOT EXISTS idx_control_evidence_org_id ON control_evidence(org_id);
CREATE INDEX IF NOT EXISTS idx_control_evidence_control_id ON control_evidence(control_id);
CREATE INDEX IF NOT EXISTS idx_risk_mitigation_plans_org_id ON risk_mitigation_plans(org_id);
CREATE INDEX IF NOT EXISTS idx_risk_mitigation_plans_risk_id ON risk_mitigation_plans(risk_id);

-- Triggers
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all relevant tables
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_frameworks_updated_at BEFORE UPDATE ON frameworks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_controls_updated_at BEFORE UPDATE ON controls
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risks_updated_at BEFORE UPDATE ON risks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_items_updated_at BEFORE UPDATE ON compliance_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audit_logs_created_at BEFORE INSERT ON audit_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risk_assessment_history_created_at BEFORE INSERT ON risk_assessment_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_control_evidence_created_at BEFORE INSERT ON control_evidence
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risk_mitigation_plans_updated_at BEFORE UPDATE ON risk_mitigation_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
