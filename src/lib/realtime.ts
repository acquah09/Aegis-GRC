// src/lib/realtime.ts
// Supabase Realtime subscriptions for Aegis GRC platform

import { useEffect, useRef, useState } from 'react';
import { createClient } from './supabase/client';
import type { Risk, ComplianceItem } from '@/types/database';
import { QueryClient } from '@tanstack/react-query';

const supabase = createClient();

// Realtime subscription types
export type RealtimeEvent<T = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  old?: T;
  new?: T;
  timestamp: string;
};

export type RealtimeRisksPayload = {
  [key: string]: RealtimeEvent<Risk>;
};

export type RealtimeCompliancePayload = {
  [key: string]: RealtimeEvent<ComplianceItem>;
};

// Realtime connection status
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'reconnecting' | 'error';

// Hook for realtime risks subscription
export function useRealtimeRisks(queryClient: QueryClient, orgId: string) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const channelRef = useRef<any>(null);

  useEffect(() => {
    const channelName = `risks:${orgId}`;
    const channel = supabase.channel(channelName);

    // Set up connection status handlers
    channel
      .on('connect', () => {
        console.log('Connected to risks realtime channel');
        setConnectionStatus('connected');
      })
      .on('disconnect', () => {
        console.log('Disconnected from risks realtime channel');
        setConnectionStatus('disconnected');
      })
      .on('error', (error) => {
        console.error('Realtime connection error:', error);
        setConnectionStatus('error');
      })
      .on('reconnect', () => {
        console.log('Reconnecting to risks realtime channel');
        setConnectionStatus('reconnecting');
      });

    // Set up database change handlers
    channel
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'risks', filter: `org_id=eq.${orgId}` },
        (payload: RealtimeRisksPayload) => {
          console.log('Realtime risks event:', payload);
          
          Object.entries(payload).forEach(([key, event]) => {
            if (event.eventType === 'INSERT' && event.new) {
              // Handle new risk insertion
              queryClient.setQueryData(
                ['risks', orgId],
                (old: Risk[] | undefined) => {
                  if (!old) return [event.new];
                  return [...old, event.new];
                }
              );
            } else if (event.eventType === 'UPDATE' && event.new) {
              // Handle risk update
              queryClient.setQueryData(
                ['risks', orgId],
                (old: Risk[] | undefined) => {
                  if (!old) return [event.new];
                  return old.map(risk => 
                    risk.id === event.new.id ? event.new : risk
                  );
                }
              );
            } else if (event.eventType === 'DELETE' && event.old) {
              // Handle risk deletion
              queryClient.setQueryData(
                ['risks', orgId],
                (old: Risk[] | undefined) => {
                  if (!old) return [];
                  return old.filter(risk => risk.id !== event.old.id);
                }
              );
            }
          });
        }
      );

    // Subscribe to the channel
    channel.subscribe((status) => {
      console.log('Risks subscription status:', status);
      if (status === 'SUBSCRIBED') {
        setConnectionStatus('connected');
      } else if (status === 'CLOSED') {
        setConnectionStatus('disconnected');
      }
    });

    channelRef.current = channel;

    // Connect to the channel
    supabase.realtime.setAuth({
      access_token: (await supabase.auth.getSession()).data.session?.access_token
    });

    return () => {
      // Cleanup on unmount
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [orgId, queryClient]);

  return { connectionStatus };
}

// Hook for realtime compliance items subscription
export function useRealtimeCompliance(queryClient: QueryClient, orgId: string) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const channelRef = useRef<any>(null);

  useEffect(() => {
    const channelName = `compliance_items:${orgId}`;
    const channel = supabase.channel(channelName);

    // Set up connection status handlers
    channel
      .on('connect', () => {
        console.log('Connected to compliance realtime channel');
        setConnectionStatus('connected');
      })
      .on('disconnect', () => {
        console.log('Disconnected from compliance realtime channel');
        setConnectionStatus('disconnected');
      })
      .on('error', (error) => {
        console.error('Realtime connection error:', error);
        setConnectionStatus('error');
      })
      .on('reconnect', () => {
        console.log('Reconnecting to compliance realtime channel');
        setConnectionStatus('reconnecting');
      });

    // Set up database change handlers
    channel
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'compliance_items', filter: `org_id=eq.${orgId}` },
        (payload: RealtimeCompliancePayload) => {
          console.log('Realtime compliance event:', payload);
          
          Object.entries(payload).forEach(([key, event]) => {
            if (event.eventType === 'INSERT' && event.new) {
              // Handle new compliance item insertion
              queryClient.setQueryData(
                ['compliance_items', orgId],
                (old: ComplianceItem[] | undefined) => {
                  if (!old) return [event.new];
                  return [...old, event.new];
                }
              );
            } else if (event.eventType === 'UPDATE' && event.new) {
              // Handle compliance item update
              queryClient.setQueryData(
                ['compliance_items', orgId],
                (old: ComplianceItem[] | undefined) => {
                  if (!old) return [event.new];
                  return old.map(item => 
                    item.id === event.new.id ? event.new : item
                  );
                }
              );
            } else if (event.eventType === 'DELETE' && event.old) {
              // Handle compliance item deletion
              queryClient.setQueryData(
                ['compliance_items', orgId],
                (old: ComplianceItem[] | undefined) => {
                  if (!old) return [];
                  return old.filter(item => item.id !== event.old.id);
                }
              );
            }
          });
        }
      );

    // Subscribe to the channel
    channel.subscribe((status) => {
      console.log('Compliance subscription status:', status);
      if (status === 'SUBSCRIBED') {
        setConnectionStatus('connected');
      } else if (status === 'CLOSED') {
        setConnectionStatus('disconnected');
      }
    });

    channelRef.current = channel;

    // Connect to the channel
    supabase.realtime.setAuth({
      access_token: (await supabase.auth.getSession()).data.session?.access_token
    });

    return () => {
      // Cleanup on unmount
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [orgId, queryClient]);

  return { connectionStatus };
}

// Utility function to get combined connection status
export function useRealtimeStatus(risksStatus: ConnectionStatus, complianceStatus: ConnectionStatus) {
  const [combinedStatus, setCombinedStatus] = useState<ConnectionStatus>('disconnected');

  useEffect(() => {
    // Determine overall connection status
    if (risksStatus === 'connected' || complianceStatus === 'connected') {
      setCombinedStatus('connected');
    } else if (risksStatus === 'connecting' || complianceStatus === 'connecting' || 
               risksStatus === 'reconnecting' || complianceStatus === 'reconnecting') {
      setCombinedStatus('connecting');
    } else if (risksStatus === 'error' || complianceStatus === 'error') {
      setCombinedStatus('error');
    } else {
      setCombinedStatus('disconnected');
    }
  }, [risksStatus, complianceStatus]);

  return combinedStatus;
}

// Hook for manual reconnection
export function useRealtimeReconnect(
  connectionStatus: ConnectionStatus,
  onReconnect: () => void
) {
  useEffect(() => {
    if (connectionStatus === 'disconnected' || connectionStatus === 'error') {
      const timer = setTimeout(() => {
        console.log('Attempting to reconnect...');
        onReconnect();
      }, 5000); // Reconnect after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [connectionStatus, onReconnect]);
}

// Realtime event types for external components
export type RealtimeEventHandler = {
  onRiskInsert?: (risk: Risk) => void;
  onRiskUpdate?: (risk: Risk) => void;
  onRiskDelete?: (risk: Risk) => void;
  onComplianceInsert?: (item: ComplianceItem) => void;
  onComplianceUpdate?: (item: ComplianceItem) => void;
  onComplianceDelete?: (item: ComplianceItem) => void;
};

// Advanced hook with event handlers
export function useRealtimeEvents(
  orgId: string,
  queryClient: QueryClient,
  eventHandlers: RealtimeEventHandler
) {
  const { connectionStatus: risksStatus } = useRealtimeRisks(queryClient, orgId);
  const { connectionStatus: complianceStatus } = useRealtimeCompliance(queryClient, orgId);

  useEffect(() => {
    // Set up custom event handlers by listening to the raw events
    const risksChannel = supabase.channel(`risks:${orgId}`);
    const complianceChannel = supabase.channel(`compliance_items:${orgId}`);

    // Risk events
    risksChannel.on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'risks', filter: `org_id=eq.${orgId}` },
      (payload: RealtimeRisksPayload) => {
        Object.values(payload).forEach(event => {
          if (event.eventType === 'INSERT' && event.new && eventHandlers.onRiskInsert) {
            eventHandlers.onRiskInsert(event.new);
          }
        });
      }
    );

    risksChannel.on('postgres_changes', 
      { event: 'UPDATE', schema: 'public', table: 'risks', filter: `org_id=eq.${orgId}` },
      (payload: RealtimeRisksPayload) => {
        Object.values(payload).forEach(event => {
          if (event.eventType === 'UPDATE' && event.new && eventHandlers.onRiskUpdate) {
            eventHandlers.onRiskUpdate(event.new);
          }
        });
      }
    );

    risksChannel.on('postgres_changes', 
      { event: 'DELETE', schema: 'public', table: 'risks', filter: `org_id=eq.${orgId}` },
      (payload: RealtimeRisksPayload) => {
        Object.values(payload).forEach(event => {
          if (event.eventType === 'DELETE' && event.old && eventHandlers.onRiskDelete) {
            eventHandlers.onRiskDelete(event.old);
          }
        });
      }
    );

    // Compliance events
    complianceChannel.on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'compliance_items', filter: `org_id=eq.${orgId}` },
      (payload: RealtimeCompliancePayload) => {
        Object.values(payload).forEach(event => {
          if (event.eventType === 'INSERT' && event.new && eventHandlers.onComplianceInsert) {
            eventHandlers.onComplianceInsert(event.new);
          }
        });
      }
    );

    complianceChannel.on('postgres_changes', 
      { event: 'UPDATE', schema: 'public', table: 'compliance_items', filter: `org_id=eq.${orgId}` },
      (payload: RealtimeCompliancePayload) => {
        Object.values(payload).forEach(event => {
          if (event.eventType === 'UPDATE' && event.new && eventHandlers.onComplianceUpdate) {
            eventHandlers.onComplianceUpdate(event.new);
          }
        });
      }
    );

    complianceChannel.on('postgres_changes', 
      { event: 'DELETE', schema: 'public', table: 'compliance_items', filter: `org_id=eq.${orgId}` },
      (payload: RealtimeCompliancePayload) => {
        Object.values(payload).forEach(event => {
          if (event.eventType === 'DELETE' && event.old && eventHandlers.onComplianceDelete) {
            eventHandlers.onComplianceDelete(event.old);
          }
        });
      }
    );

    // Subscribe to both channels
    risksChannel.subscribe();
    complianceChannel.subscribe();

    return () => {
      // Cleanup
      supabase.removeChannel(risksChannel);
      supabase.removeChannel(complianceChannel);
    };
  }, [orgId, queryClient, eventHandlers]);

  return {
    risksConnectionStatus: risksStatus,
    complianceConnectionStatus: complianceStatus
  };
}
