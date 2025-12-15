'use client';

import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface NotificationDTO {
  title: string;
  message: string;
  type: string;
  link: string;
}

export function useWebSocket(topic: string, onMessage: (notification: NotificationDTO) => void) {
  const clientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create WebSocket client
    const client = new Client({
      webSocketFactory: () => new SockJS(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/ws`),
      debug: () => {
        // Debug logging disabled in production
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      setIsConnected(true);

      // Subscribe to topic
      client.subscribe(topic, (message: any) => {
        try {
          const notification: NotificationDTO = JSON.parse(message.body);
          onMessage(notification);
        } catch (error) {
          console.error('[WebSocket] Failed to parse message:', error);
          // Don't crash the app - just log the error
        }
      });
    };

    client.onDisconnect = () => {
      setIsConnected(false);
    };

    client.onStompError = (frame: any) => {
      console.error('[WebSocket] Error:', frame.headers['message']);
      console.error('[WebSocket] Details:', frame.body);
      // Don't crash the app - just log the error
    };

    // Activate connection
    client.activate();
    clientRef.current = client;

    // Cleanup on unmount
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [topic, onMessage]);

  return { isConnected };
}
