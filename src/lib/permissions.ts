// src/lib/permissions.ts
// Role-Based Access Control (RBAC) permissions system

export type UserRole = 'viewer' | 'analyst' | 'admin';

export type Resource = 
  // Dashboard resources
  | 'dashboard' 
  | 'dashboard:overview'
  | 'dashboard:metrics'
  
  // Risk management
  | 'risks' 
  | 'risks:create'
  | 'risks:read'
  | 'risks:update'
  | 'risks:delete'
  | 'risks:assess'
  | 'risks:mitigate'
  
  // Compliance management
  | 'compliance' 
  | 'compliance:read'
  | 'compliance:create'
  | 'compliance:update'
  | 'compliance:delete'
  | 'compliance:assess'
  
  // Control management
  | 'controls' 
  | 'controls:read'
  | 'controls:create'
  | 'controls:update'
  | 'controls:delete'
  
  // Framework management
  | 'frameworks' 
  | 'frameworks:read'
  | 'frameworks:create'
  | 'frameworks:update'
  | 'frameworks:delete'
  
  // Audit and logs
  | 'audit' 
  | 'audit:read'
  | 'audit:export'
  
  // User management
  | 'users' 
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:delete'
  | 'users:manage_roles'
  
  // Organization management
  | 'organization' 
  | 'organization:read'
  | 'organization:update'
  | 'organization:manage'
  
  // System
  | 'system' 
  | 'system:settings'
  | 'system:monitoring'
  | 'system:backup';

export type Action = 
  // CRUD operations
  | 'create' | 'read' | 'update' | 'delete'
  
  // Special actions
  | 'assess' | 'mitigate' | 'export' | 'manage_roles'
  | 'manage' | 'monitor' | 'backup' | 'settings';

// Role permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Resource[]> = {
  viewer: [
    // Dashboard - read only
    'dashboard', 'dashboard:overview', 'dashboard:metrics',
    
    // Risk management - read only
    'risks', 'risks:read',
    
    // Compliance - read only
    'compliance', 'compliance:read',
    
    // Controls - read only
    'controls', 'controls:read',
    
    // Frameworks - read only
    'frameworks', 'frameworks:read',
    
    // Audit - read only
    'audit', 'audit:read',
    
    // Organization - read only
    'organization', 'organization:read'
  ],
  
  analyst: [
    // Dashboard - full access
    'dashboard', 'dashboard:overview', 'dashboard:metrics',
    
    // Risk management - create/edit
    'risks', 'risks:create', 'risks:read', 'risks:update', 'risks:assess', 'risks:mitigate',
    
    // Compliance - create/edit
    'compliance', 'compliance:create', 'compliance:read', 'compliance:update', 'compliance:assess',
    
    // Controls - create/edit
    'controls', 'controls:create', 'controls:read', 'controls:update',
    
    // Frameworks - read only (analysts typically don't manage frameworks)
    'frameworks', 'frameworks:read',
    
    // Audit - read/export
    'audit', 'audit:read', 'audit:export'
  ],
  
  admin: [
    // All permissions
    ...Object.values(ROLE_PERMISSIONS.viewer),
    ...Object.values(ROLE_PERMISSIONS.analyst),
    
    // Additional admin-only permissions
    'risks:delete',
    'compliance:delete',
    'controls:delete',
    'frameworks:create', 'frameworks:update', 'frameworks:delete',
    'users', 'users:read', 'users:create', 'users:update', 'users:delete', 'users:manage_roles',
    'organization', 'organization:update', 'organization:manage',
    'system', 'system:settings', 'system:monitoring', 'system:backup'
  ]
};

// Permission checking helper
export function can(role: UserRole, action: Action, resource?: Resource): boolean {
  const rolePermissions = getRolePermissions(role);
  
  if (!rolePermissions) {
    return false;
  }
  
  // Check if user has access to the resource category
  if (resource && !rolePermissions.some(p => p.startsWith(resource))) {
    return false;
  }
  
  // Check specific permission
  const permission = resource ? `${resource}:${action}` : action;
  
  return rolePermissions.includes(permission as Resource);
}

// Multiple permission check
export function canAny(role: UserRole, permissions: Array<{ action: Action; resource?: Resource }>): boolean {
  const rolePermissions = getRolePermissions(role);
  
  if (!rolePermissions) {
    return false;
  }
  
  return permissions.some(({ action, resource }) => {
    if (resource && !rolePermissions.some(p => p.startsWith(resource))) {
      return false;
    }
    
    const permission = resource ? `${resource}:${action}` : action;
    return rolePermissions.includes(permission as Resource);
  });
}

// Get all permissions for a role
export function getRolePermissions(role: UserRole): Resource[] {
  return ROLE_PERMISSIONS[role] || [];
}

// Check if user has any of the specified roles
export function hasRole(userRole: UserRole, roles: UserRole[]): boolean {
  return roles.includes(userRole);
}

// Get role hierarchy level (for UI organization)
export function getRoleLevel(role: UserRole): number {
  switch (role) {
    case 'viewer':
      return 1;
    case 'analyst':
      return 2;
    case 'admin':
      return 3;
    default:
      return 0;
  }
}

// Role display names
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  viewer: 'Viewer',
  analyst: 'Analyst', 
  admin: 'Administrator'
};

// Role descriptions
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  viewer: 'Can view all data but cannot make changes',
  analyst: 'Can create and edit risks, compliance items, and controls',
  admin: 'Full system access including user management and system settings'
};

// Permission groups for UI organization
export const PERMISSION_GROUPS = {
  dashboard: ['dashboard', 'dashboard:overview', 'dashboard:metrics'],
  riskManagement: ['risks', 'risks:create', 'risks:read', 'risks:update', 'risks:assess', 'risks:mitigate'],
  complianceManagement: ['compliance', 'compliance:create', 'compliance:read', 'compliance:update', 'compliance:assess'],
  controlManagement: ['controls', 'controls:create', 'controls:read', 'controls:update'],
  frameworkManagement: ['frameworks', 'frameworks:read'],
  auditManagement: ['audit', 'audit:read', 'audit:export'],
  userManagement: ['users', 'users:read', 'users:create', 'users:update', 'users:delete', 'users:manage_roles'],
  organizationManagement: ['organization', 'organization:read', 'organization:update', 'organization:manage'],
  systemManagement: ['system', 'system:settings', 'system:monitoring', 'system:backup']
};

// Helper to check permission group access
export function canAccessGroup(role: UserRole, group: keyof typeof PERMISSION_GROUPS): boolean {
  const rolePermissions = ROLE_PERMISSIONS[role];
  
  if (!rolePermissions) {
    return false;
  }
  
  const groupPermissions = PERMISSION_GROUPS[group];
  return groupPermissions.some(permission => rolePermissions.includes(permission as Resource));
}

// Export commonly used permission combinations
export const COMMON_PERMISSIONS = {
  // Read permissions for all authenticated users
  READ_ONLY: ['dashboard:read', 'risks:read', 'compliance:read', 'controls:read', 'frameworks:read', 'audit:read', 'organization:read'],
  
  // Create permissions
  CAN_CREATE: ['risks:create', 'compliance:create', 'controls:create', 'frameworks:create', 'users:create'],
  
  // Update permissions  
  CAN_UPDATE: ['risks:update', 'compliance:update', 'controls:update', 'frameworks:update', 'users:update', 'organization:update'],
  
  // Delete permissions
  CAN_DELETE: ['risks:delete', 'compliance:delete', 'controls:delete', 'frameworks:delete', 'users:delete'],
  
  // Management permissions
  CAN_MANAGE: ['users:manage_roles', 'organization:manage', 'system:settings', 'system:monitoring', 'system:backup']
};
