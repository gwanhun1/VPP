import { createContext, useContext, ReactNode } from 'react';
import { useWebViewAuth } from '../hooks/useWebViewAuth';
import { useWebAuth } from '../hooks/useWebAuth';
import type { AuthUser } from '@vpp/core-logic';

interface AuthContextType {
  authUser: AuthUser | null;
  isWebView: boolean;
  firebaseReady: boolean;
  isLoading?: boolean;
  openSessionId?: string | null;
  openMessageId?: string | null;
  clearOpenSessionId?: () => void;
  requestAuth: () => void;
  login?: (user: AuthUser) => void;
  logout?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 웹 앱의 인증 상태를 관리하는 Context Provider
 * 웹뷰 환경에서는 모바일 앱으로부터 인증 정보를 받아 처리
 * 일반 웹 브라우저에서는 Firebase 직접 인증 사용
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const webViewAuth = useWebViewAuth();
  const webAuth = useWebAuth();

  // 웹뷰 환경인지 확인
  const isWebViewEnv = webViewAuth.isWebView;

  const contextValue: AuthContextType = isWebViewEnv
    ? {
        authUser: webViewAuth.authUser,
        isWebView: true,
        firebaseReady: webViewAuth.firebaseReady,
        openSessionId: webViewAuth.openSessionId,
        openMessageId: webViewAuth.openMessageId,
        clearOpenSessionId: webViewAuth.clearOpenSessionId,
        requestAuth: webViewAuth.requestAuth,
      }
    : {
        authUser: webAuth.authUser,
        isWebView: false,
        firebaseReady: webAuth.firebaseReady,
        isLoading: webAuth.isLoading,
        openSessionId: null,
        openMessageId: null,
        clearOpenSessionId: undefined,
        requestAuth: () => { /* 웹에서는 사용하지 않음 */ },
        login: webAuth.login,
        logout: webAuth.logout,
      };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
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
