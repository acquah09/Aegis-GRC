// src/lib/supabase/database.ts
// Database client helpers for Aegis GRC platform

import { createClient } from './client';
import type { 
  Organization, 
  Profile, 
  Framework, 
  Control, 
  Risk, 
  ComplianceItem, 
  AuditLog,
  RiskAssessmentHistory,
  ControlEvidence,
  RiskMitigationPlan,
  RiskFilters,
  ControlFilters,
  ComplianceFilters,
  AuditLogFilters,
  ApiResponse,
  PaginatedResponse
} from '@/types/database';

const supabase = createClient();

// Organizations
export const getOrganizations = async (userId?: string) => {
  let query = supabase.from('organizations').select('*');
  
  if (userId) {
    query = query.eq('created_by', userId);
  }
  
  const { data, error } = await query;
  return { data: data || [], error };
};

export const getOrganizationById = async (id: string) => {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single();
    
  return { data, error };
};

export const createOrganization = async (organization: Partial<Organization>) => {
  const { data, error } = await supabase
    .from('organizations')
    .insert(organization)
    .select()
    .single();
    
  return { data, error };
};

export const updateOrganization = async (id: string, updates: Partial<Organization>) => {
  const { data, error } = await supabase
    .from('organizations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  return { data, error };
};

// Profiles
export const getProfiles = async (orgId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('org_id', orgId);
    
  return { data: data || [], error };
};

export const getProfileById = async (id: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
    
  return { data, error };
};

export const updateProfile = async (id: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  return { data, error };
};

// Frameworks
export const getFrameworks = async (orgId: string) => {
  const { data, error } = await supabase
    .from('frameworks')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });
    
  return { data: data || [], error };
};

export const getFrameworkById = async (id: string) => {
  const { data, error } = await supabase
    .from('frameworks')
    .select('*')
    .eq('id', id)
    .single();
    
  return { data, error };
};

export const createFramework = async (framework: Partial<Framework>) => {
  const { data, error } = await supabase
    .from('frameworks')
    .insert(framework)
    .select()
    .single();
    
  return { data, error };
};

export const updateFramework = async (id: string, updates: Partial<Framework>) => {
  const { data, error } = await supabase
    .from('frameworks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  return { data, error };
};

export const deleteFramework = async (id: string) => {
  const { error } = await supabase
    .from('frameworks')
    .delete()
    .eq('id', id);
    
  return { error };
};

// Controls
export const getControls = async (orgId: string, filters?: ControlFilters) => {
  let query = supabase
    .from('controls')
    .select('*')
    .eq('org_id', orgId);
    
  if (filters?.framework_id) {
    query = query.eq('framework_id', filters.framework_id);
  }
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters?.owner_id) {
    query = query.eq('owner_id', filters.owner_id);
  }
  
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters?.type) {
    query = query.eq('type', filters.type);
  }
  
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,control_ref.ilike.%${filters.search}%`);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data: data || [], error };
};

export const getControlById = async (id: string) => {
  const { data, error } = await supabase
    .from('controls')
    .select('*')
    .eq('id', id)
    .single();
    
  return { data, error };
};

export const createControl = async (control: Partial<Control>) => {
  const { data, error } = await supabase
    .from('controls')
    .insert(control)
    .select()
    .single();
    
  return { data, error };
};

export const updateControl = async (id: string, updates: Partial<Control>) => {
  const { data, error } = await supabase
    .from('controls')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  return { data, error };
};

export const deleteControl = async (id: string) => {
  const { error } = await supabase
    .from('controls')
    .delete()
    .eq('id', id);
    
  return { error };
};

// Risks
export const getRisks = async (orgId: string, filters?: RiskFilters) => {
  let query = supabase
    .from('risks')
    .select('*')
    .eq('org_id', orgId);
    
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters?.owner_id) {
    query = query.eq('owner_id', filters.owner_id);
  }
  
  if (filters?.min_score) {
    query = query.gte('risk_score', filters.min_score);
  }
  
  if (filters?.max_score) {
    query = query.lte('risk_score', filters.max_score);
  }
  
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }
  
  const { data, error } = await query.order('risk_score', { ascending: false });
  return { data: data || [], error };
};

export const getRiskById = async (id: string) => {
  const { data, error } = await supabase
    .from('risks')
    .select('*')
    .eq('id', id)
    .single();
    
  return { data, error };
};

export const createRisk = async (risk: Partial<Risk>) => {
  const { data, error } = await supabase
    .from('risks')
    .insert(risk)
    .select()
    .single();
    
  return { data, error };
};

export const updateRisk = async (id: string, updates: Partial<Risk>) => {
  const { data, error } = await supabase
    .from('risks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  return { data, error };
};

export const deleteRisk = async (id: string) => {
  const { error } = await supabase
    .from('risks')
    .delete()
    .eq('id', id);
    
  return { error };
};

// Compliance Items
export const getComplianceItems = async (orgId: string, filters?: ComplianceFilters) => {
  let query = supabase
    .from('compliance_items')
    .select('*')
    .eq('org_id', orgId);
    
  if (filters?.framework_id) {
    query = query.eq('framework_id', filters.framework_id);
  }
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters?.assigned_to) {
    query = query.eq('assigned_to', filters.assigned_to);
  }
  
  if (filters?.due_overdue) {
    query = query.lt('due_date', new Date().toISOString());
  }
  
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,control_ref.ilike.%${filters.search}%`);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data: data || [], error };
};

export const getComplianceItemById = async (id: string) => {
  const { data, error } = await supabase
    .from('compliance_items')
    .select('*')
    .eq('id', id)
    .single();
    
  return { data, error };
};

export const createComplianceItem = async (item: Partial<ComplianceItem>) => {
  const { data, error } = await supabase
    .from('compliance_items')
    .insert(item)
    .select()
    .single();
    
  return { data, error };
};

export const updateComplianceItem = async (id: string, updates: Partial<ComplianceItem>) => {
  const { data, error } = await supabase
    .from('compliance_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  return { data, error };
};

export const deleteComplianceItem = async (id: string) => {
  const { error } = await supabase
    .from('compliance_items')
    .delete()
    .eq('id', id);
    
  return { error };
};

// Audit Logs
export const getAuditLogs = async (orgId: string, filters?: AuditLogFilters) => {
  let query = supabase
    .from('audit_logs')
    .select('*')
    .eq('org_id', orgId);
    
  if (filters?.user_id) {
    query = query.eq('user_id', filters.user_id);
  }
  
  if (filters?.action) {
    query = query.eq('action', filters.action);
  }
  
  if (filters?.resource_type) {
    query = query.eq('resource_type', filters.resource_type);
  }
  
  if (filters?.date_from) {
    query = query.gte('created_at', filters.date_from);
  }
  
  if (filters?.date_to) {
    query = query.lte('created_at', filters.date_to);
  }
  
  if (filters?.search) {
    query = query.or(`action.ilike.%${filters.search}%,resource_type.ilike.%${filters.search}%`);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data: data || [], error };
};

export const createAuditLog = async (log: Partial<AuditLog>) => {
  const { data, error } = await supabase
    .from('audit_logs')
    .insert({
      ...log,
      ip_address: 'unknown', // Will be set by server
      user_agent: 'unknown' // Will be set by server
    })
    .select()
    .single();
    
  return { data, error };
};

// Risk Assessment History
export const getRiskAssessmentHistory = async (riskId: string) => {
  const { data, error } = await supabase
    .from('risk_assessment_history')
    .select('*')
    .eq('risk_id', riskId)
    .order('created_at', { ascending: false });
    
  return { data: data || [], error };
};

export const createRiskAssessmentHistory = async (assessment: Partial<RiskAssessmentHistory>) => {
  const { data, error } = await supabase
    .from('risk_assessment_history')
    .insert(assessment)
    .select()
    .single();
    
  return { data, error };
};

// Control Evidence
export const getControlEvidence = async (controlId: string) => {
  const { data, error } = await supabase
    .from('control_evidence')
    .select('*')
    .eq('control_id', controlId)
    .order('created_at', { ascending: false });
    
  return { data: data || [], error };
};

export const createControlEvidence = async (evidence: Partial<ControlEvidence>) => {
  const { data, error } = await supabase
    .from('control_evidence')
    .insert(evidence)
    .select()
    .single();
    
  return { data, error };
};

export const deleteControlEvidence = async (id: string) => {
  const { error } = await supabase
    .from('control_evidence')
    .delete()
    .eq('id', id);
    
  return { error };
};

// Risk Mitigation Plans
export const getRiskMitigationPlans = async (riskId: string) => {
  const { data, error } = await supabase
    .from('risk_mitigation_plans')
    .select('*')
    .eq('risk_id', riskId)
    .order('created_at', { ascending: false });
    
  return { data: data || [], error };
};

export const createRiskMitigationPlan = async (plan: Partial<RiskMitigationPlan>) => {
  const { data, error } = await supabase
    .from('risk_mitigation_plans')
    .insert(plan)
    .select()
    .single();
    
  return { data, error };
};

export const updateRiskMitigationPlan = async (id: string, updates: Partial<RiskMitigationPlan>) => {
  const { data, error } = await supabase
    .from('risk_mitigation_plans')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  return { data, error };
};

// Utility functions
export const getRiskMetrics = async (orgId: string) => {
  const { data: risks, error } = await getRisks(orgId);
  
  if (error || !risks) {
    return { 
      total_risks: 0,
      high_risks: 0,
      medium_risks: 0,
      low_risks: 0,
      risks_by_category: {},
      average_risk_score: 0,
      risks_treated: 0,
      risks_monitoring: 0,
      error 
    };
  }
  
  const totalRisks = risks.length;
  const highRisks = risks.filter(r => r.risk_score >= 15).length;
  const mediumRisks = risks.filter(r => r.risk_score >= 8 && r.risk_score < 15).length;
  const lowRisks = risks.filter(r => r.risk_score < 8).length;
  const averageScore = risks.reduce((sum, r) => sum + r.risk_score, 0) / totalRisks;
  const risksTreated = risks.filter(r => ['mitigated', 'accepted'].includes(r.status)).length;
  const risksMonitoring = risks.filter(r => r.status === 'monitored').length;
  
  const risksByCategory = risks.reduce((acc, risk) => {
    acc[risk.category] = (acc[risk.category] || 0) + 1;
    return acc;
  }, {} as Record<Risk['category'], number>);
  
  return {
    total_risks: totalRisks,
    high_risks: highRisks,
    medium_risks: mediumRisks,
    low_risks: lowRisks,
    risks_by_category: risksByCategory,
    average_risk_score: Math.round(averageScore),
    risks_treated: risksTreated,
    risks_monitoring: risksMonitoring,
  };
};

export const getComplianceMetrics = async (orgId: string) => {
  const { data: frameworks, error } = await getFrameworks(orgId);
  const { data: controls, error: controlsError } = await getControls(orgId);
  
  if (error || controlsError || !frameworks) {
    return {
      total_controls: 0,
      implemented_controls: 0,
      gap_controls: 0,
      compliance_percentage: 0,
      compliance_by_framework: {},
      error
    };
  }
  
  const totalControls = controls?.length || 0;
  const implementedControls = controls?.filter(c => c.status === 'implemented').length || 0;
  const gapControls = totalControls - implementedControls;
  
  const complianceByFramework = frameworks.reduce((acc, framework) => {
    const frameworkControls = controls?.filter(c => c.framework_id === framework.id) || [];
    const implemented = frameworkControls.filter(c => c.status === 'implemented').length;
    const total = frameworkControls.length;
    
    acc[framework.id] = {
      total,
      compliant: implemented,
      percentage: total > 0 ? Math.round((implemented / total) * 100) : 0
    };
    
    return acc;
  }, {} as Record<string, { total: number; compliant: number; percentage: number }>);
  
  const overallCompliance = totalControls > 0 ? Math.round((implementedControls / totalControls) * 100) : 0;
  
  return {
    total_controls: totalControls,
    implemented_controls: implementedControls,
    gap_controls: gapControls,
    compliance_percentage: overallCompliance,
    compliance_by_framework: complianceByFramework,
  };
};

export const getAuditMetrics = async (orgId: string, limit = 50) => {
  const { data: logs, error } = await getAuditLogs(orgId);
  
  if (error || !logs) {
    return {
      total_actions: 0,
      actions_by_type: {},
      actions_by_user: {},
      recent_actions: [],
      error
    };
  }
  
  const recentLogs = logs.slice(0, limit);
  const actionsByType = logs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const actionsByUser = logs.reduce((acc, log) => {
    acc[log.user_id] = (acc[log.user_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    total_actions: logs.length,
    actions_by_type: actionsByType,
    actions_by_user: actionsByUser,
    recent_actions: recentLogs,
  };
};
