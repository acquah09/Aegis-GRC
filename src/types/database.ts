// Database Types generated from schema.sql
// These types represent the database structure for Aegis GRC platform

export type Organization = {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  org_id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role: 'user' | 'admin' | 'grc_manager' | 'risk_owner' | 'auditor';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

export type Framework = {
  id: string;
  org_id: string;
  name: string;
  version?: string;
  description?: string;
  status: 'active' | 'draft' | 'archived';
  created_by?: string;
  created_at: string;
  updated_at: string;
};

export type Control = {
  id: string;
  org_id: string;
  framework_id?: string;
  control_ref?: string;
  title: string;
  description?: string;
  category?: string;
  type?: string;
  effectiveness: number;
  status: 'implemented' | 'partial' | 'gap';
  owner_id?: string;
  evidence_notes?: string;
  last_reviewed?: string;
  created_at: string;
  updated_at: string;
};

export type Risk = {
  id: string;
  org_id: string;
  title: string;
  description?: string;
  category: 'Cyber/IT' | 'Operational' | 'Third-Party' | 'Regulatory' | 'Data';
  likelihood: number;
  impact: number;
  risk_score: number;
  status: 'identified' | 'assessed' | 'mitigated' | 'accepted' | 'monitored';
  owner_id?: string;
  treatment_plan?: string;
  review_date?: string;
  created_at: string;
  updated_at: string;
};

export type ComplianceItem = {
  id: string;
  org_id: string;
  framework_id: string;
  control_ref?: string;
  title: string;
  description?: string;
  status: 'compliant' | 'non_compliant' | 'in_progress' | 'not_applicable';
  evidence_url?: string;
  assigned_to?: string;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
};

export type AuditLog = {
  id: string;
  org_id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
};

export type RiskAssessmentHistory = {
  id: string;
  org_id: string;
  risk_id: string;
  previous_likelihood?: number;
  previous_impact?: number;
  new_likelihood: number;
  new_impact: number;
  previous_score?: number;
  new_score: number;
  assessment_by?: string;
  notes?: string;
  created_at: string;
};

export type ControlEvidence = {
  id: string;
  org_id: string;
  control_id: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  uploaded_by?: string;
  description?: string;
  created_at: string;
};

export type RiskMitigationPlan = {
  id: string;
  org_id: string;
  risk_id: string;
  strategy: string;
  description?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  assigned_to?: string;
  due_date?: string;
  completion_date?: string;
  effectiveness_rating?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
};

// Form data types for create/update operations
export type OrganizationFormData = {
  name: string;
  slug: string;
  domain?: string;
  settings?: Record<string, any>;
};

export type ProfileFormData = {
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'user' | 'admin' | 'grc_manager' | 'risk_owner' | 'auditor';
  avatar_url?: string;
};

export type FrameworkFormData = {
  name: string;
  version?: string;
  description?: string;
  status: 'active' | 'draft' | 'archived';
};

export type ControlFormData = {
  framework_id?: string;
  control_ref?: string;
  title: string;
  description?: string;
  category?: string;
  type?: string;
  effectiveness?: number;
  status: 'implemented' | 'partial' | 'gap';
  owner_id?: string;
  evidence_notes?: string;
};

export type RiskFormData = {
  title: string;
  description?: string;
  category: 'Cyber/IT' | 'Operational' | 'Third-Party' | 'Regulatory' | 'Data';
  likelihood: number;
  impact: number;
  status: 'identified' | 'assessed' | 'mitigated' | 'accepted' | 'monitored';
  owner_id?: string;
  treatment_plan?: string;
  review_date?: string;
};

export type ComplianceItemFormData = {
  framework_id: string;
  control_ref?: string;
  title: string;
  description?: string;
  status: 'compliant' | 'non_compliant' | 'in_progress' | 'not_applicable';
  evidence_url?: string;
  assigned_to?: string;
  due_date?: string;
  completed_at?: string;
};

export type AuditLogFormData = {
  action: string;
  resource_type: string;
  resource_id?: string;
  metadata?: Record<string, any>;
};

export type RiskAssessmentHistoryFormData = {
  risk_id: string;
  previous_likelihood?: number;
  previous_impact?: number;
  new_likelihood: number;
  new_impact: number;
  notes?: string;
};

export type ControlEvidenceFormData = {
  control_id: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  uploaded_by?: string;
  description?: string;
};

export type RiskMitigationPlanFormData = {
  risk_id: string;
  strategy: string;
  description?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  assigned_to?: string;
  due_date?: string;
  completion_date?: string;
  effectiveness_rating?: number;
};

// Filter and search types
export type RiskFilters = {
  category?: Risk['category'];
  status?: Risk['status'];
  owner_id?: Risk['owner_id'];
  search?: string;
  min_score?: number;
  max_score?: number;
};

export type ControlFilters = {
  framework_id?: Control['framework_id'];
  status?: Control['status'];
  owner_id?: Control['owner_id'];
  category?: Control['category'];
  type?: Control['type'];
  search?: string;
};

export type ComplianceFilters = {
  framework_id?: ComplianceItem['framework_id'];
  status?: ComplianceItem['status'];
  assigned_to?: ComplianceItem['assigned_to'];
  search?: string;
  due_overdue?: boolean;
};

export type AuditLogFilters = {
  user_id?: AuditLog['user_id'];
  action?: AuditLog['action'];
  resource_type?: AuditLog['resource_type'];
  date_from?: string;
  date_to?: string;
  search?: string;
};

// Dashboard and analytics types
export type RiskMetrics = {
  total_risks: number;
  high_risks: number;
  medium_risks: number;
  low_risks: number;
  risks_by_category: Record<Risk['category'], number>;
  average_risk_score: number;
  risks_treated: number;
  risks_monitoring: number;
};

export type ComplianceMetrics = {
  total_controls: number;
  implemented_controls: number;
  gap_controls: number;
  compliance_percentage: number;
  compliance_by_framework: Record<string, {
    total: number;
    compliant: number;
    percentage: number;
  }>;
};

export type AuditMetrics = {
  total_actions: number;
  actions_by_type: Record<string, number>;
  actions_by_user: Record<string, number>;
  recent_actions: AuditLog[];
};

// API Response types
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  count: number;
  page: number;
  limit: number;
  has_more: boolean;
};
