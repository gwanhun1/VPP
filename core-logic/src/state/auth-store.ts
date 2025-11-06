import { create } from 'zustand';
import type { AuthUser } from '../firebase/types';

export type AuthState = {
  authUser: AuthUser | null;
  isLoading: boolean;
  firebaseReady: boolean;
  isWebView: boolean;
  openSessionId: string | null;
  openMessageId: string | null;
};

export type AuthActions = {
  setAuthUser: (user: AuthUser | null) => void;
  setIsLoading: (loading: boolean) => void;
  setFirebaseReady: (ready: boolean) => void;
  setIsWebView: (isWebView: boolean) => void;
  setOpenSessionId: (sessionId: string | null) => void;
  setOpenMessageId: (messageId: string | null) => void;
  clearOpenSessionId: () => void;
  reset: () => void;
};

export type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  authUser: null,
  isLoading: true,
  firebaseReady: false,
  isWebView: false,
  openSessionId: null,
  openMessageId: null,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,

  setAuthUser: (authUser) => set({ authUser, isLoading: false }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setFirebaseReady: (firebaseReady) => set({ firebaseReady }),
  setIsWebView: (isWebView) => set({ isWebView }),
  setOpenSessionId: (openSessionId) => set({ openSessionId }),
  setOpenMessageId: (openMessageId) => set({ openMessageId }),
  clearOpenSessionId: () => set({ openSessionId: null, openMessageId: null }),
  
  reset: () => set({ ...initialState }),
}));

// Selectors
export const authSelectors = {
  authUser: (s: AuthStore) => s.authUser,
  isLoading: (s: AuthStore) => s.isLoading,
  firebaseReady: (s: AuthStore) => s.firebaseReady,
  isWebView: (s: AuthStore) => s.isWebView,
  openSessionId: (s: AuthStore) => s.openSessionId,
  openMessageId: (s: AuthStore) => s.openMessageId,
  isAuthenticated: (s: AuthStore) => s.authUser !== null && s.authUser.providerId !== 'anonymous',
};
