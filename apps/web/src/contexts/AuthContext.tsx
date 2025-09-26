import React, { createContext, useContext, ReactNode } from 'react';
import { useWebViewAuth } from '../hooks/useWebViewAuth';
import type { AuthUser } from '@vpp/core-logic';

interface AuthContextType {
  authUser: AuthUser | null;
  isWebView: boolean;
  firebaseReady: boolean;
  requestAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 웹 앱의 인증 상태를 관리하는 Context Provider
 * 웹뷰 환경에서는 모바일 앱으로부터 인증 정보를 받아 처리
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const webViewAuth = useWebViewAuth();

  return (
    <AuthContext.Provider value={webViewAuth as unknown as AuthContextType}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * AuthContext를 사용하기 위한 훅
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내부에서 사용해야 합니다.');
  }
  return context;
}
