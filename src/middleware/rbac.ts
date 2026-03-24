// src/middleware/rbac.ts
// RBAC middleware for protecting dashboard routes

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { UserRole } from '@/lib/permissions';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/dashboard/overview',
  '/dashboard/metrics',
  '/risks',
  '/risks/create',
  '/compliance',
  '/compliance/create',
  '/controls',
  '/controls/create',
  '/frameworks',
  '/audit',
  '/users',
  '/organization',
  '/settings'
];

// Routes that require admin access
const ADMIN_ONLY_ROUTES = [
  '/users',
  '/users/create',
  '/organization',
  '/settings',
  '/system'
];

// Routes that require analyst or admin access
const ANALYST_OR_ADMIN_ROUTES = [
  '/risks/create',
  '/risks/assess',
  '/risks/mitigate',
  '/compliance/create',
  '/compliance/assess',
  '/controls/create',
  '/audit/export'
];

export async function rbacMiddleware(request: NextRequest) {
  // ✅ Fix 1: destructure from the URL object, not from .pathname
  const { pathname } = new URL(request.url);

  // ✅ Fix 2: create the Supabase client per-request, not at module level
  const supabase = await createClient();

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    // Redirect to sign-in for protected routes
    if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
    return NextResponse.next();
  }

  // Get user profile with role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, org_id')
    .eq('id', session?.user?.id || '')
    .single();

  if (!profile) {
    return NextResponse.next();
  }

  const userRole = profile.role as UserRole;

  // Check admin-only routes
  if (ADMIN_ONLY_ROUTES.some(route => pathname.startsWith(route))) {
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard?error=access_denied', request.url));
    }
  }

  // Check analyst-or-admin routes
  if (ANALYST_OR_ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    if (userRole !== 'analyst' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard?error=insufficient_permissions', request.url));
    }
  }

  // Add role information to headers for client-side usage
  const response = NextResponse.next();
  response.headers.set('x-user-role', userRole);
  response.headers.set('x-user-org', profile.org_id);

  return response;
}

// Helper function to check if route requires specific permissions
export function getRequiredPermissions(pathname: string): string[] {
  const permissions: string[] = [];

  // Risk management permissions
  if (pathname.startsWith('/risks')) {
    if (pathname.includes('/create')) permissions.push('risks:create');
    if (pathname.includes('/assess')) permissions.push('risks:assess');
    if (pathname.includes('/mitigate')) permissions.push('risks:mitigate');
    permissions.push('risks:read');
  }

  // Compliance management permissions
  if (pathname.startsWith('/compliance')) {
    if (pathname.includes('/create')) permissions.push('compliance:create');
    if (pathname.includes('/assess')) permissions.push('compliance:assess');
    permissions.push('compliance:read');
  }

  // Control management permissions
  if (pathname.startsWith('/controls')) {
    if (pathname.includes('/create')) permissions.push('controls:create');
    permissions.push('controls:read');
  }

  // Framework management permissions
  if (pathname.startsWith('/frameworks')) {
    permissions.push('frameworks:read');
  }

  // Audit permissions
  if (pathname.startsWith('/audit')) {
    if (pathname.includes('/export')) permissions.push('audit:export');
    permissions.push('audit:read');
  }

  // User management permissions
  if (pathname.startsWith('/users')) {
    permissions.push('users:read');
    if (pathname.includes('/create')) permissions.push('users:create');
    if (pathname.includes('/edit')) permissions.push('users:update');
    if (pathname.includes('/delete')) permissions.push('users:delete');
    permissions.push('users:manage_roles');
  }

  // Organization management permissions
  if (pathname.startsWith('/organization')) {
    permissions.push('organization:read');
    if (pathname.includes('/edit')) permissions.push('organization:update');
    if (pathname.includes('/manage')) permissions.push('organization:manage');
  }

  // System permissions
  if (pathname.startsWith('/settings') || pathname.startsWith('/system')) {
    permissions.push('system:settings', 'system:monitoring', 'system:backup');
  }

  // Always add basic dashboard permissions
  if (pathname.startsWith('/dashboard')) {
    permissions.push('dashboard', 'dashboard:overview', 'dashboard:metrics');
  }

  return permissions;
}