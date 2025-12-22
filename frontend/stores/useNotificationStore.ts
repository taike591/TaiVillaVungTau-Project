import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string;
  timestamp: number;
  read: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  isInitialized: boolean;
  // Track IDs that user has manually marked as read (to preserve across API refetch)
  manuallyReadIds: Set<string>;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  loadInitialNotifications: (requests: any[]) => void;
  setInitialized: (value: boolean) => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isInitialized: false,
      manuallyReadIds: new Set<string>(),

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          read: false,
        };

        set((state) => {
          // Check if notification already exists (prevent duplicates)
          const exists = state.notifications.some(
            (n) => n.message === newNotification.message && 
                   Math.abs(n.timestamp - newNotification.timestamp) < 5000 // Within 5 seconds
          );

          if (exists) {
            return state;
          }

          return {
            notifications: [newNotification, ...state.notifications].slice(0, 50),
            unreadCount: state.unreadCount + 1,
          };
        });
      },

      markAsRead: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          if (!notification || notification.read) return state;

          // Add to manually read IDs set
          const newManuallyReadIds = new Set(state.manuallyReadIds);
          newManuallyReadIds.add(id);

          return {
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
            manuallyReadIds: newManuallyReadIds,
          };
        });
      },

      markAllAsRead: () => {
        set((state) => {
          // Add all current notification IDs to manually read set
          const newManuallyReadIds = new Set(state.manuallyReadIds);
          state.notifications.forEach((n) => newManuallyReadIds.add(n.id));

          return {
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
            manuallyReadIds: newManuallyReadIds,
          };
        });
      },

      deleteNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          const wasUnread = notification && !notification.read;

          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
          };
        });
      },

      clearAll: () => {
        set({
          notifications: [],
          unreadCount: 0,
          // Keep manuallyReadIds so they stay read if they come back
        });
      },

      loadInitialNotifications: (requests) => {
        const currentState = get();
        
        // Convert requests to notifications (only NEW and CONTACTED status)
        const fetchedNotifications: Notification[] = requests
          .filter((req: any) => req.status === 'NEW' || req.status === 'CONTACTED')
          .map((req: any) => {
            const notifId = `req-${req.id}`;
            // Check if this ID was manually marked as read by user
            const wasManuallyRead = currentState.manuallyReadIds.has(notifId);
            // Also check existing notifications for read status
            const existingNotif = currentState.notifications.find((n) => n.id === notifId);
            
            return {
              id: notifId,
              title: 'Yêu cầu tư vấn',
              message: `Khách ${req.customerName || 'hàng'} quan tâm${req.propertyCode ? ` căn ${req.propertyCode}` : ''}`,
              type: 'NEW_REQUEST',
              link: `/taike-manage/requests`,
              timestamp: req.createdAt ? new Date(req.createdAt).getTime() : Date.now(),
              // Preserve read status: manually read OR previously read OR CONTACTED status
              read: wasManuallyRead || (existingNotif?.read ?? false) || req.status === 'CONTACTED',
            };
          })
          .sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first

        const unreadCount = fetchedNotifications.filter((n) => !n.read).length;

        set({
          notifications: fetchedNotifications.slice(0, 30),
          unreadCount,
          isInitialized: true,
        });
      },

      setInitialized: (value) => {
        set({ isInitialized: value });
      },
    }),
    {
      name: 'notification-storage',
      // Custom serialization to handle Set
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        isInitialized: state.isInitialized,
        manuallyReadIds: Array.from(state.manuallyReadIds),
      }),
      // Custom deserialization
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        manuallyReadIds: new Set(persistedState?.manuallyReadIds || []),
      }),
    }
  )
);
