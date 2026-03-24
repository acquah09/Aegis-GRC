// src/hooks/usePermissions.ts
// Hook for managing user permissions and role-based access control

'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { 
  UserRole, 
  Resource, 
  Action
} from '@/lib/permissions';

const PERMISSION_GROUPS = {
  dashboard: ['dashboard', 'dashboard:overview', 'dashboard:metrics'],
  riskManagement: ['risks', 'risks:create', 'risks:read', 'risks:update', 'risks:assess', 'risks:mitigate'],
  complianceManagement: ['compliance', 'compliance:create', 'compliance:read', 'compliance:update', 'compliance:assess'],
  controlManagement: ['controls', 'controls:create', 'controls:read', 'controls:update'],
  frameworkManagement: ['frameworks', 'frameworks:read'],
  auditManagement: ['audit', 'audit:read', 'audit:export'],
  userManagement: ['users', 'users:read', 'users:create', 'users:update', 'users:delete', 'users:manage_roles'],
  organizationManagement: ['organization', 'organization:read', 'organization:update', 'organization:manage'],
  systemManagement: ['system', 'system:settings', 'system:monitoring', 'system:backup']
} as const;

const supabase = createClient();

interface UsePermissionsOptions {
  organizationId?: string;
}

interface UsePermissionsReturn {
  userRole: UserRole | null;
  permissions: string[];
  isLoading: boolean;
  error: Error | null;
  can: (action: Action, resource?: Resource) => boolean;
  canAny: (permissions: Array<{ action: Action; resource?: Resource }>) => boolean;
  canAccessGroup: (group: keyof typeof PERMISSION_GROUPS) => boolean;
  hasRole: (roles: UserRole[]) => boolean;
  isAtLeastRole: (role: UserRole) => boolean;
  isAdmin: () => boolean;
  isAnalyst: () => boolean;
  isViewer: () => boolean;
}

export function usePermissions(options: UsePermissionsOptions = {}): UsePermissionsReturn {
  const {
    data: user,
    isLoading,
    error
  } = useQuery({
    queryKey: ['user-role', options.organizationId],
    queryFn: async () => {
      if (!options.organizationId) return null;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .eq('org_id', options.organizationId)
        .single();
        
      return profile?.role || null;
    },
    enabled: !!options.organizationId,
    retry: 1
  });

  const userRole = user?.role || null;
  
  // Get permissions based on role
  const getRolePermissions = (role: UserRole): string[] => {
    switch (role) {
      case 'viewer':
        return [
          'dashboard', 'dashboard:overview', 'dashboard:metrics',
          'risks', 'risks:read',
          'compliance', 'compliance:read',
          'controls', 'controls:read',
          'frameworks', 'frameworks:read',
          'audit', 'audit:read',
          'organization', 'organization:read'
        ];
      case 'analyst':
        return [
          'dashboard', 'dashboard:overview', 'dashboard:metrics',
          'risks', 'risks:create', 'risks:read', 'risks:update', 'risks:assess', 'risks:mitigate',
          'compliance', 'compliance:create', 'compliance:read', 'compliance:update', 'compliance:assess',
          'controls', 'controls:create', 'controls:read', 'controls:update',
          'frameworks', 'frameworks:read',
          'audit', 'audit:read', 'audit:export'
        ];
      case 'admin':
        return [
          ...getRolePermissions('viewer'),
          ...getRolePermissions('analyst'),
          'risks:delete',
          'compliance:delete',
          'controls:delete',
          'frameworks:create', 'frameworks:update', 'frameworks:delete',
          'users', 'users:read', 'users:create', 'users:update', 'users:delete', 'users:manage_roles',
          'organization', 'organization:update', 'organization:manage',
          'system', 'system:settings', 'system:monitoring', 'system:backup'
        ];
      default:
        return [];
    }
  };

  const permissions = userRole ? getRolePermissions(userRole) : [];

  return {
    userRole,
    permissions,
    isLoading,
    error,
    can: (action, resource) => {
      const rolePermissions = getRolePermissions(userRole);
      
      if (!rolePermissions) {
        return false;
      }
      
      if (resource && !rolePermissions.some((p: string) => p.startsWith(resource))) {
        return false;
      }
      
      const permission = resource ? `${resource}:${action}` : action;
      return rolePermissions.includes(permission as Resource);
    },
    canAny: (permissions) => {
      const rolePermissions = getRolePermissions(userRole);
      
      if (!rolePermissions) {
        return false;
      }
      
      return permissions.some(({ action, resource }: { action: Action; resource?: Resource }) => {
        if (resource && !rolePermissions.some((p: string) => p.startsWith(resource))) {
          return false;
        }
        
        const permission = resource ? `${resource}:${action}` : action;
        return rolePermissions.includes(permission as Resource);
      });
    },
    canAccessGroup: (group) => {
      const rolePermissions = getRolePermissions(userRole);
      
      if (!rolePermissions) {
        return false;
      }
      
      const groupPermissions = PERMISSION_GROUPS[group];
      return groupPermissions.some((permission: string) => rolePermissions.includes(permission as Resource));
    },
    hasRole: (roles) => userRole ? roles.includes(userRole) : false,
    isAtLeastRole: (role) => {
      if (!userRole) return false;
      
      const getRoleLevel = (r: UserRole) => {
        switch (r) {
          case 'viewer':
            return 1;
          case 'analyst':
            return 2;
          case 'admin':
            return 3;
          default:
            return 0;
        }
      };
      
      const userLevel = getRoleLevel(userRole);
      const requiredLevel = getRoleLevel(role);
      return userLevel >= requiredLevel;
    },
    isAdmin: () => userRole === 'admin',
    isAnalyst: () => userRole === 'analyst' || userRole === 'admin',
    isViewer: () => userRole === 'viewer' || userRole === 'analyst' || userRole === 'admin',
  };
}

// Hook for getting all users with their roles (admin only)
export function useUserManagement(organizationId: string) {
  return useQuery({
    queryKey: ['users', organizationId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return [];
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, role, created_at, updated_at')
        .eq('org_id', organizationId)
        .order('created_at', { ascending: false });
      
      return profile || [];
    },
    enabled: !!organizationId,
    retry: 1
  });
}

// Hook for organization settings (admin only)
export function useOrganizationSettings(organizationId: string) {
  return useQuery({
    queryKey: ['organization-settings', organizationId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .eq('org_id', organizationId)
        .single();
      
      if (!profile || profile.role !== 'admin') return null;
      
      const { data: org } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', organizationId)
        .single();
      
      return org;
    },
    enabled: !!organizationId,
    retry: 1
  });
}
