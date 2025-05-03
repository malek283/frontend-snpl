// src/components/Store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LoginResponse, User } from '../../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setTokens: (data: LoginResponse) => void;
  logout: () => void;
}

const logMiddleware = (config: (set: any, get: any, api: any) => any) => (set: (arg0: any) => void, get: any, api: any) =>
  config(
    (...args: [any]) => {
      const [newState] = args;
      if (newState && (newState.user !== get().user || newState.accessToken !== get().accessToken)) {
        console.log('useAuthStore state change:', { user: newState.user, accessToken: newState.accessToken });
      }
      set(...args);
    },
    get,
    api
  );

export const useAuthStore = create<AuthState>()(
  logMiddleware(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        setTokens: (data: LoginResponse) => {
          set({
            user: data.user ? { ...data.user } : null,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            isAuthenticated: !!data.user && !!data.access_token,
          });
        },
        logout: () => {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        },
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
        }),
        merge: (persisted: any, current: AuthState) => {
          const mergedState = {
            ...current,
            ...persisted,
            user: persisted?.user ? { ...persisted.user } : current.user,
          };
          delete mergedState.role;
          delete mergedState.first_name;
          return mergedState;
        },
      }
    )
  )
);