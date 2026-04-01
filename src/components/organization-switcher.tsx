// src/components/organization-switcher.tsx
// Organization switcher dropdown for sidebar

'use client';

import { useState } from 'react';
import { 
  Building, 
  ChevronDown, 
  Plus, 
  Users, 
  Settings,
  Crown,
  Shield 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useOrg, useCreateOrg } from '@/contexts/OrgContext';
import type { Organization } from '@/types/database';

export function OrganizationSwitcher() {
  const { currentOrg, userOrgs, setCurrentOrg } = useOrg();
  const { createOrg, isCreating, error } = useCreateOrg();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  const handleOrgSwitch = (org: Organization) => {
    setCurrentOrg(org);
  };

  const handleCreateOrg = async () => {
    try {
      const orgName = prompt('Enter organization name:');
      if (!orgName) return;

      const slug = orgName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const newOrg = await createOrg({ name: orgName, slug });
      
      if (newOrg) {
        setIsCreateModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to create org:', err);
    }
  };

  const handleJoinOrg = async () => {
    try {
      if (!inviteCode.trim()) return;

      const newOrg = await createOrg({ name: inviteCode, slug: inviteCode });
      
      if (newOrg) {
        setIsJoinModalOpen(false);
        setInviteCode('');
      }
    } catch (err) {
      console.error('Failed to join org:', err);
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return <Crown className="h-4 w-4 text-purple-500" />;
      case 'pro':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <Building className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return <Badge className="bg-purple-100 text-purple-800">Enterprise</Badge>;
      case 'pro':
        return <Badge className="bg-blue-100 text-blue-800">Pro</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Free</Badge>;
    }
  };

  if (!currentOrg && userOrgs.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-muted">
        <div className="text-center">
          <Building className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Organization</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You need to create or join an organization to get started.
          </p>
          <div className="space-y-2">
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full"
              disabled={isCreating}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Organization
            </Button>
            <Button 
              onClick={() => setIsJoinModalOpen(true)}
              variant="outline"
              className="w-full"
              disabled={isCreating}
            >
              <Users className="h-4 w-4 mr-2" />
              Join Organization
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start">
            <div className="flex items-center gap-2">
              {getPlanIcon(currentOrg.plan)}
              <div className="flex flex-col items-start">
                <span className="font-medium truncate max-w-[150px]">
                  {currentOrg.name}
                </span>
                {getPlanBadge(currentOrg.plan)}
              </div>
              <ChevronDown className="h-4 w-4 shrink-0" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="start" className="w-80">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 mb-2">
              Your Organizations
            </div>
            
            {userOrgs.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => handleOrgSwitch(org)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2 p-1">
                  {getPlanIcon(org.plan)}
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{org.name}</span>
                    {getPlanBadge(org.plan)}
                  </div>
                  {org.id === currentOrg.id && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => setIsCreateModalOpen(true)}>
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Create Organization</span>
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => setIsJoinModalOpen(true)}>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Join Organization</span>
              </div>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Organization Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-96 max-w-[90vw] border">
            <h3 className="text-lg font-semibold mb-4">Create New Organization</h3>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                <p className="text-sm text-red-600">{error.message}</p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Organization Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter organization name"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCreateOrg();
                    }
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateOrg} disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Join Organization Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-96 max-w-[90vw] border">
            <h3 className="text-lg font-semibold mb-4">Join Organization</h3>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                <p className="text-sm text-red-600">{error.message}</p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Invite Code</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter invite code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleJoinOrg();
                    }
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsJoinModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleJoinOrg} disabled={isCreating}>
                  {isCreating ? 'Joining...' : 'Join'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
