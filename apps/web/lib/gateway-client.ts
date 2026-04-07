/**
 * OpenClaw Gateway WebSocket Client
 * Connects to OpenClaw gateway and manages communication
 */

export interface GatewayClientOptions {
  url: string;
  token?: string;
  reconnect?: boolean;
  reconnectDelay?: number;
}

export interface GatewayMessage {
  type: string;
  data?: any;
  id?: string;
}

export type GatewayStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export class GatewayClient {
  private ws: WebSocket | null = null;
  private url: string;
  private token?: string;
  private reconnect: boolean;
  private reconnectDelay: number;
  private reconnectTimer?: NodeJS.Timeout;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private statusListeners: Set<(status: GatewayStatus) => void> = new Set();
  private currentStatus: GatewayStatus = 'disconnected';

  constructor(options: GatewayClientOptions) {
    this.url = options.url;
    this.token = options.token;
    this.reconnect = options.reconnect ?? true;
    this.reconnectDelay = options.reconnectDelay ?? 5000;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.setStatus('connecting');

    const wsUrl = this.token 
      ? `${this.url}?token=${this.token}`
      : this.url;
    
    try {
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        this.setStatus('connected');
        this.emit('connected', {});
      };
      
      this.ws.onmessage = (event) => {
        try {
          const message: GatewayMessage = JSON.parse(event.data);
          this.emit(message.type, message.data);
          this.emit('message', message);
        } catch (error) {
          console.error('Failed to parse gateway message:', error);
        }
      };
      
      this.ws.onerror = (error) => {
        this.setStatus('error');
        this.emit('error', error);
      };
      
      this.ws.onclose = () => {
        this.setStatus('disconnected');
        this.emit('disconnected', {});
        
        if (this.reconnect) {
          this.scheduleReconnect();
        }
      };
    } catch (error) {
      this.setStatus('error');
      this.emit('error', error);
    }
  }

  send(type: string, data?: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: GatewayMessage = { type, data };
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('Cannot send message: WebSocket not connected');
    }
  }

  disconnect(): void {
    this.reconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.ws?.close();
    this.setStatus('disconnected');
  }

  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: any) => void): void {
    this.listeners.get(event)?.delete(callback);
  }

  onStatus(callback: (status: GatewayStatus) => void): void {
    this.statusListeners.add(callback);
    // Immediately call with current status
    callback(this.currentStatus);
  }

  offStatus(callback: (status: GatewayStatus) => void): void {
    this.statusListeners.delete(callback);
  }

  getStatus(): GatewayStatus {
    return this.currentStatus;
  }

  private emit(event: string, data: any): void {
    this.listeners.get(event)?.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  private setStatus(status: GatewayStatus): void {
    if (this.currentStatus !== status) {
      this.currentStatus = status;
      this.statusListeners.forEach(callback => {
        try {
          callback(status);
        } catch (error) {
          console.error('Error in status listener:', error);
        }
      });
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    this.reconnectTimer = setTimeout(() => {
      console.log('Attempting to reconnect to gateway...');
      this.connect();
    }, this.reconnectDelay);
  }
}

// Singleton instance for app-wide use
let gatewayClientInstance: GatewayClient | null = null;

export function getGatewayClient(options?: GatewayClientOptions): GatewayClient {
  if (!gatewayClientInstance && options) {
    gatewayClientInstance = new GatewayClient(options);
  }
  
  if (!gatewayClientInstance) {
    throw new Error('Gateway client not initialized. Call getGatewayClient with options first.');
  }
  
  return gatewayClientInstance;
}

export function resetGatewayClient(): void {
  if (gatewayClientInstance) {
    gatewayClientInstance.disconnect();
    gatewayClientInstance = null;
  }
}
