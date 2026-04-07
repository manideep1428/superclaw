'use client';

import { useEffect, useState, useCallback } from 'react';
import { GatewayClient, GatewayStatus, getGatewayClient } from '@/lib/gateway-client';

export interface UseGatewayOptions {
  url?: string;
  token?: string;
  autoConnect?: boolean;
}

export interface UseGatewayReturn {
  status: GatewayStatus;
  client: GatewayClient | null;
  error: any;
  connect: () => void;
  disconnect: () => void;
  send: (type: string, data?: any) => void;
}

export function useGateway(options: UseGatewayOptions = {}): UseGatewayReturn {
  const {
    url = process.env.NEXT_PUBLIC_GATEWAY_URL || 'ws://localhost:18789',
    token = process.env.NEXT_PUBLIC_GATEWAY_TOKEN,
    autoConnect = true,
  } = options;

  const [status, setStatus] = useState<GatewayStatus>('disconnected');
  const [client, setClient] = useState<GatewayClient | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const gatewayClient = getGatewayClient({ url, token });
    
    const handleStatus = (newStatus: GatewayStatus) => {
      setStatus(newStatus);
      if (newStatus === 'connected') {
        setError(null);
      }
    };

    const handleError = (err: any) => {
      setError(err);
    };

    gatewayClient.onStatus(handleStatus);
    gatewayClient.on('error', handleError);
    
    if (autoConnect) {
      gatewayClient.connect();
    }
    
    setClient(gatewayClient);
    
    return () => {
      gatewayClient.offStatus(handleStatus);
      gatewayClient.off('error', handleError);
    };
  }, [url, token, autoConnect]);

  const connect = useCallback(() => {
    client?.connect();
  }, [client]);

  const disconnect = useCallback(() => {
    client?.disconnect();
  }, [client]);

  const send = useCallback((type: string, data?: any) => {
    client?.send(type, data);
  }, [client]);

  return { status, client, error, connect, disconnect, send };
}
