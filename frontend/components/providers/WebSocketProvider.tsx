'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface NotificationDTO {
  title: string;
  message: string;
  type: string;
  link: string;
}

interface WebSocketContextValue {
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(
  undefined
);

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error(
      'useWebSocketContext must be used within a WebSocketProvider'
    );
  }
  return context;
}

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const router = useRouter();
  const { addNotification, loadInitialNotifications } =
    useNotificationStore();

  // Fetch initial requests to populate notifications
  // Always fetch to get latest data
  const { data: requestsData } = useQuery({
    queryKey: ['initial-requests'],
    queryFn: async () => {
      const res = await api.get('/api/v1/requests');
      return res.data;
    },
    staleTime: 30000, // Refetch after 30 seconds
    refetchInterval: 60000, // Auto-refetch every 60 seconds
  });

  // Load initial notifications from requests
  useEffect(() => {
    if (requestsData?.data) {
      loadInitialNotifications(requestsData.data);
    }
  }, [requestsData, loadInitialNotifications]);

  // Handle incoming notifications
  const handleNotification = (notification: NotificationDTO) => {

    // Add to notification store
    addNotification({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      link: notification.link,
    });

    // Display toast notification with click handler
    toast.info(notification.message, {
      description: notification.title,
      duration: 5000,
      action: notification.link
        ? {
            label: 'Xem',
            onClick: () => {
              try {
                router.push(notification.link);
              } catch (error) {
                console.error('[WebSocketProvider] Navigation error:', error);
                // Fallback to requests page
                router.push('/taike-manage/requests');
              }
            },
          }
        : undefined,
    });
  };

  // Subscribe to admin topic
  const { isConnected } = useWebSocket('/topic/admin', handleNotification);

  // Connection status effect
  useEffect(() => {
    if (isConnected) {
      toast.success('Kết nối thông báo thành công', { duration: 2000 });
    }
  }, [isConnected]);

  return (
    <WebSocketContext.Provider value={{ isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}
