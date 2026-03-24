// src/components/ui/realtime-status.tsx
// Realtime connection status indicator component

'use client';

import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';
import type { ConnectionStatus } from '@/lib/realtime';

interface RealtimeStatusProps {
  status: ConnectionStatus;
  className?: string;
}

export function RealtimeStatus({ status, className = '' }: RealtimeStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
      case 'reconnecting':
        return 'bg-yellow-500';
      case 'disconnected':
        return 'bg-gray-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'reconnecting':
        return 'Reconnecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <Wifi className="h-3 w-3" />;
      case 'connecting':
      case 'reconnecting':
        return <RefreshCw className="h-3 w-3 animate-spin" />;
      case 'disconnected':
        return <WifiOff className="h-3 w-3" />;
      case 'error':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <WifiOff className="h-3 w-3" />;
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge 
        variant="outline" 
        className={`${getStatusColor()} text-white`}
      >
        <div className="flex items-center gap-1">
          {getStatusIcon()}
          <span className="text-xs font-medium">
            {getStatusText()}
          </span>
        </div>
      </Badge>
      
      {status === 'connecting' || status === 'reconnecting' && (
        <span className="text-xs text-gray-500 animate-pulse">
          Syncing...
        </span>
      )}
      
      {status === 'error' && (
        <span className="text-xs text-red-500">
          Failed to connect
        </span>
      )}
    </div>
  );
}

// Full page connection status component
interface RealtimeStatusPageProps {
  risksStatus: ConnectionStatus;
  complianceStatus: ConnectionStatus;
  className?: string;
}

export function RealtimeStatusPage({ 
  risksStatus, 
  complianceStatus, 
  className = '' 
}: RealtimeStatusPageProps) {
  const getOverallStatus = () => {
    if (risksStatus === 'connected' || complianceStatus === 'connected') {
      return 'connected';
    } else if (risksStatus === 'connecting' || complianceStatus === 'connecting' || 
               risksStatus === 'reconnecting' || complianceStatus === 'reconnecting') {
      return 'connecting';
    } else if (risksStatus === 'error' || complianceStatus === 'error') {
      return 'error';
    } else {
      return 'disconnected';
    }
  };

  const getStatusColor = () => {
    const status = getOverallStatus();
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'connecting':
      case 'reconnecting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = () => {
    const status = getOverallStatus();
    switch (status) {
      case 'connected':
        return 'Realtime Connected';
      case 'connecting':
      case 'reconnecting':
        return 'Connecting to Realtime...';
      case 'error':
        return 'Realtime Connection Error';
      default:
        return 'Realtime Disconnected';
    }
  };

  const getStatusDescription = () => {
    const status = getOverallStatus();
    switch (status) {
      case 'connected':
        return 'Live updates are enabled for risks and compliance items.';
      case 'connecting':
      case 'reconnecting':
        return 'Attempting to establish realtime connection...';
      case 'error':
        return 'Failed to connect to realtime. Please refresh the page.';
      default:
        return 'Realtime connection is inactive. Changes may not sync automatically.';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor()} ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <div className="flex items-center gap-2">
            {getOverallStatus() === 'connected' ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : getOverallStatus() === 'connecting' || getOverallStatus() === 'reconnecting' ? (
              <RefreshCw className="h-5 w-5 text-yellow-600 animate-spin" />
            ) : getOverallStatus() === 'error' ? (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-gray-600" />
            )}
            {getStatusText()}
          </div>
          Realtime Status
        </h3>
        
        <Badge 
          variant={getOverallStatus() === 'connected' ? 'default' : 'destructive'}
          className="text-xs"
        >
          {getOverallStatus() === 'connected' ? 'LIVE' : 'OFFLINE'}
        </Badge>
      </div>
      
      <p className="text-sm text-gray-600">
        {getStatusDescription()}
      </p>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700">Risks Channel</h4>
          <RealtimeStatus status={risksStatus} />
          <div className="text-xs text-gray-500 mt-1">
            Status: {risksStatus}
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700">Compliance Channel</h4>
          <RealtimeStatus status={complianceStatus} />
          <div className="text-xs text-gray-500 mt-1">
            Status: {complianceStatus}
          </div>
        </div>
      </div>
    </div>
  );
}
