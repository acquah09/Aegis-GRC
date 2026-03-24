// src/contexts/OrgContext.tsx
// Organization context for multi-tenant support

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Organization } from '@/types/database';

interface OrgContextType {
  currentOrg: Organization | null;
  setCurrentOrg: (org: Organization | null) => void;
  isLoading: boolean;
  error: Error | null;
  userOrgs: Organization[];
  refetchOrgs: () => Promise<void>;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export function useOrg() {
  const context = useContext(OrgContext);
  if (context === undefined) {
    throw new Error('useOrg must be used within an OrgProvider');
  }
  return context;
}

interface OrgProviderProps {
  children: ReactNode;
}

export function OrgProvider({ children }: OrgProviderProps) {
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [userOrgs, setUserOrgs] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClient();

  // Fetch user's organizations on mount
  useEffect(() => {
    const fetchUserOrgs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          setUserOrgs([]);
          setCurrentOrg(null);
          return;
        }

        const { data: profiles } = await supabase
          .from('profiles')
          .select('org_id')
          .eq('id', session.user.id);

        if (!profiles || profiles.length === 0) {
          setUserOrgs([]);
          setCurrentOrg(null);
          return;
        }

        // Get unique org IDs from user's profiles
        const orgIds = [...new Set(profiles.map(p => p.org_id).filter(Boolean))];
        
        if (orgIds.length === 0) {
          setUserOrgs([]);
          setCurrentOrg(null);
          return;
        }

        // Fetch organizations
        const { data: orgs } = await supabase
          .from('organizations')
          .select('*')
          .in('id', orgIds)
          .order('created_at', { ascending: false });

        if (orgs) {
          setUserOrgs(orgs);
          
          // Set current org from localStorage or first org
          const savedOrgId = localStorage.getItem('current_org_id');
          const savedOrg = orgs.find(org => org.id === savedOrgId);
          setCurrentOrg(savedOrg || orgs[0] || null);
        }
      } catch (err) {
        console.error('Error fetching organizations:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserOrgs();
  }, []);

  // Update current org in localStorage when it changes
  useEffect(() => {
    if (currentOrg) {
      localStorage.setItem('current_org_id', currentOrg.id);
    } else {
      localStorage.removeItem('current_org_id');
    }
  }, [currentOrg]);

  const refetchOrgs = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) return;

    const { data: profiles } = await supabase
      .from('profiles')
      .select('org_id')
      .eq('id', session.user.id);

    if (!profiles || profiles.length === 0) return;

    const orgIds = [...new Set(profiles.map(p => p.org_id).filter(Boolean))];
    
    if (orgIds.length === 0) return;

    const { data: orgs } = await supabase
      .from('organizations')
      .select('*')
      .in('id', orgIds)
      .order('created_at', { ascending: false });

    if (orgs) {
      setUserOrgs(orgs);
    }
  };

  const value: OrgContextType = {
    currentOrg,
    setCurrentOrg,
    isLoading,
    error,
    userOrgs,
    refetchOrgs,
  };

  return (
    <OrgContext.Provider value={value}>
      {children}
    </OrgContext.Provider>
  );
}

// Hook for creating a new organization
export function useCreateOrg() {
  const { setCurrentOrg, userOrgs, refetchOrgs } = useOrg();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClient();

  const createOrg = async (orgData: Partial<Organization>) => {
    try {
      setIsCreating(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      // Create organization
      const { data: newOrg, error: createError } = await supabase
        .from('organizations')
        .insert({
          name: orgData.name,
          slug: orgData.slug || orgData.name?.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          plan: orgData.plan || 'free',
          created_by: session.user.id,
        })
        .select()
        .single();

      if (createError) throw createError;
      if (!newOrg) throw new Error('Failed to create organization');

      // Create user profile for this org
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: session.user.id,
          org_id: newOrg.id,
          role: 'admin', // Creator becomes admin
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Update local state
      const updatedOrgs = [...userOrgs, newOrg];
      setCurrentOrg(newOrg);
      setUserOrgs(updatedOrgs);
      localStorage.setItem('current_org_id', newOrg.id);

      return newOrg;
    } catch (err) {
      console.error('Error creating organization:', err);
      setError(err as Error);
    } finally {
      setIsCreating(false);
    }
  };

  const joinOrg = async (inviteCode: string) => {
    try {
      setIsCreating(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      // In a real implementation, you'd validate the invite code
      // For now, we'll just find org by slug
      const { data: orgs } = await supabase
        .from('organizations')
        .select('*')
        .eq('slug', inviteCode)
        .single();

      if (!orgs) throw new Error('Invalid invite code');

      // Create user profile for this org
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: session.user.id,
          org_id: orgs.id,
          role: 'member', // Joining user becomes member
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Update local state
      const updatedOrgs = [...userOrgs, orgs];
      setCurrentOrg(orgs);
      setUserOrgs(updatedOrgs);
      localStorage.setItem('current_org_id', orgs.id);

      return orgs;
    } catch (err) {
      console.error('Error joining organization:', err);
      setError(err as Error);
    } finally {
      setIsCreating(false);
    }
  };

  const switchOrg = async (orgId: string) => {
    try {
      setError(null);
      
      const org = userOrgs.find(o => o.id === orgId);
      if (!org) throw new Error('Organization not found');

      setCurrentOrg(org);
      localStorage.setItem('current_org_id', orgId);
      return org;
    } catch (err) {
      console.error('Error switching organization:', err);
      setError(err as Error);
    }
  };

  return {
    createOrg,
    joinOrg,
    switchOrg,
    isCreating,
    error,
  };
}

// Hook for organization management (admin only)
export function useOrgManagement() {
  const { currentOrg, userOrgs, refetchOrgs } = useOrg();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClient();

  const updateOrg = async (updates: Partial<Organization>) => {
    if (!currentOrg) return;

    try {
      setIsUpdating(true);
      setError(null);

      const { data, error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', currentOrg.id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to update organization');

      // Update local state
      const updatedOrgs = userOrgs.map(org => 
        org.id === currentOrg.id ? { ...org, ...data } : org
      );
      setUserOrgs(updatedOrgs);
      setCurrentOrg({ ...currentOrg, ...data });

      return data;
    } catch (err) {
      console.error('Error updating organization:', err);
      setError(err as Error);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteOrg = async (orgId: string) => {
    try {
      setError(null);

      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', orgId);

      if (error) throw error;

      // Update local state
      const updatedOrgs = userOrgs.filter(org => org.id !== orgId);
      setUserOrgs(updatedOrgs);
      
      if (currentOrg?.id === orgId) {
        setCurrentOrg(updatedOrgs[0] || null);
        localStorage.setItem('current_org_id', updatedOrgs[0]?.id || '');
      }

      return true;
    } catch (err) {
      console.error('Error deleting organization:', err);
      setError(err as Error);
    }
  };

  return {
    updateOrg,
    deleteOrg,
    isUpdating,
    error,
  };
}
