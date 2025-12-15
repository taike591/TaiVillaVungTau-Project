import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  login: (userData: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  isAuthenticated: () => boolean;
  fetchUser: () => Promise<void>;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: typeof window !== 'undefined' ? Cookies.get('auth-token') || null : null,
      refreshToken: null,
      isHydrated: false,
      
      login: (userData, accessToken, refreshToken) => {
        // Set cookie with proper options for cross-route access
        Cookies.set('auth-token', accessToken, { 
          expires: 7,
          path: '/',
          sameSite: 'lax'
        });
        set({ user: userData, token: accessToken, refreshToken });
      },
      
      logout: () => {
        Cookies.remove('auth-token');
        set({ user: null, token: null, refreshToken: null });
      },
      
      setUser: (user) => {
        set({ user });
      },

      setTokens: (accessToken, refreshToken) => {
        Cookies.set('auth-token', accessToken, { 
          expires: 7,
          path: '/',
          sameSite: 'lax'
        });
        if (refreshToken) {
          set({ token: accessToken, refreshToken });
        } else {
          set({ token: accessToken });
        }
      },
      
      isAuthenticated: () => {
        const state = get();
        return !!state.token;
      },
      
      fetchUser: async () => {
        const state = get();
        if (!state.token) return;
        
        try {
          // Dynamic import to avoid circular dependency issues if api imports store
          const api = (await import('@/lib/api')).default;
          const response = await api.get('/api/v1/auth/me');
          if (response.data && response.data.data) {
            // Backend returns: { token, refreshToken, id, username, email, role }
            // Extract user object from flat response
            const data = response.data.data;
            const user = {
              id: data.id,
              email: data.email,
              username: data.username,
              role: data.role,
            };
            set({ user });
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
          // Only logout if it's a 401, otherwise keep trying or let the interceptor handle it
          // But here we just clear user if fetch fails hard implies token is invalid
          set({ user: null, token: null, refreshToken: null });
          Cookies.remove('auth-token');
        }
      },
      
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, refreshToken: state.refreshToken }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

