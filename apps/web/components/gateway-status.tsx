'use client';

import { GatewayStatus } from '@/lib/gateway-client';
import { Button } from '@/components/ui/button';

interface GatewayStatusProps {
  status: GatewayStatus;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function GatewayStatusIndicator({ status, onConnect, onDisconnect }: GatewayStatusProps) {
  const statusConfig = {
    disconnected: {
      color: 'bg-gray-500',
      text: 'Disconnected',
      icon: '⚫',
      description: 'Gateway is not connected',
    },
    connecting: {
      color: 'bg-yellow-500',
      text: 'Connecting',
      icon: '🟡',
      description: 'Connecting to gateway...',
    },
    connected: {
      color: 'bg-green-500',
      text: 'Connected',
      icon: '🟢',
      description: 'Gateway is online and ready',
    },
    error: {
      color: 'bg-red-500',
      text: 'Error',
      icon: '🔴',
      description: 'Failed to connect to gateway',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${config.color} animate-pulse`} />
            <span className="font-semibold">{config.text}</span>
          </div>
          <span className="text-sm text-muted-foreground">{config.description}</span>
        </div>
        
        <div className="flex gap-2">
          {status === 'disconnected' || status === 'error' ? (
            <Button onClick={onConnect} size="sm">
              Connect
            </Button>
          ) : status === 'connected' ? (
            <Button onClick={onDisconnect} variant="outline" size="sm">
              Disconnect
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
