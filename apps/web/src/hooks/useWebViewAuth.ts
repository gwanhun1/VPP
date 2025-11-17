import { useEffect, useRef } from 'react';
import type { AuthUser } from '@vpp/core-logic';
import {
  setFirebaseConfig,
  initializeFirebase,
  updateUserDevice,
  addRecentActivity,
  useAuthStore,
} from '@vpp/core-logic';

type ThemeMode = 'light' | 'dark';

type AuthMessage = {
  type: 'AUTH';
  payload: AuthUser | null;
};

type OpenSessionMessage = {
  type: 'OPEN_SESSION';
  payload: {
    sessionId: string;
    messageId?: string;
  };
};

type ThemeModeMessage = {
  type: 'THEME_MODE';
  payload: {
    mode: ThemeMode;
  };
};

type FirebaseConfigMessage = {
  type: 'FIREBASE_CONFIG';
  payload: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
};

type WebViewMessage =
  | AuthMessage
  | FirebaseConfigMessage
  | OpenSessionMessage
  | ThemeModeMessage;

// React Native WebView / 전역 유틸 타입 확장
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    vppSetThemeMode?: (mode: ThemeMode) => void;
  }
}

/**
 * 웹뷰에서 모바일 앱으로부터 인증 정보를 받아 처리하는 훅
 * 모바일 앱에서 postMessage로 전송한 AUTH 메시지를 수신하여 상태를 업데이트
 */
export function useWebViewAuth() {
  const {
    setAuthUser,
    setIsWebView,
    setFirebaseReady,
    setOpenSessionId,
    setOpenMessageId,
    clearOpenSessionId,
  } = useAuthStore();
  const authUser = useAuthStore((s) => s.authUser);
  const isWebView = useAuthStore((s) => s.isWebView);
  const firebaseReady = useAuthStore((s) => s.firebaseReady);
  const openSessionId = useAuthStore((s) => s.openSessionId);
  const openMessageId = useAuthStore((s) => s.openMessageId);
  const firebaseReadyRef = useRef(false);

  useEffect(() => {
    // 웹뷰 환경 감지
    const detectWebView = (): boolean => {
      const userAgent = navigator.userAgent;
      const isWebViewUA = /wv|WebView|Version.*Chrome/i.test(userAgent);
      const hasReactNativeWebView = !!window.ReactNativeWebView;

      return isWebViewUA || hasReactNativeWebView;
    };

    const isWebViewEnv = detectWebView();
    setIsWebView(isWebViewEnv);

    // 모바일 앱으로부터 메시지 수신 처리
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as WebViewMessage;

        if (data.type === 'THEME_MODE') {
          const themeData = data;
          const mode = themeData.payload?.mode;
          if (mode === 'light' || mode === 'dark') {
            try {
              if (typeof window !== 'undefined' && window.vppSetThemeMode) {
                // 앱 루트(main.tsx)의 ThemeProvider 모드까지 함께 변경
                window.vppSetThemeMode(mode);
              } else {
                // 예비: setter가 아직 없으면 직접 html.class와 localStorage만 갱신
                if (typeof document !== 'undefined') {
                  const rootEl = document.documentElement;
                  if (mode === 'dark') {
                    rootEl.classList.add('dark');
                  } else {
                    rootEl.classList.remove('dark');
                  }
                }
                if (typeof window !== 'undefined' && window.localStorage) {
                  window.localStorage.setItem('vpp:web-theme', mode);
                }
              }
            } catch {
              // ignore
            }
          }
          return;
        }

        if (data.type === 'AUTH') {
          const authData = data;
          setAuthUser(authData.payload || null);

          // 모바일 앱에서 전달받은 인증 정보로 사용자 상태 업데이트 및 활동 기록
          if (authData.payload) {
            const userPayload = authData.payload;
            (async () => {
              try {
                // Firebase 설정이 준비될 때까지 대기 (최대 20 * 50ms = 1s)
                if (!firebaseReadyRef.current) {
                  for (let i = 0; i < 20 && !firebaseReadyRef.current; i += 1) {
                    await new Promise((r) => setTimeout(r, 50));
                  }
                }
                // 준비 상태에서만 진행
                if (!firebaseReadyRef.current) return;

                // 웹 디바이스 정보 업데이트
                const deviceId = `webview_${Date.now()}`;
                await updateUserDevice(userPayload.uid, deviceId, {
                  expoPushToken: null,
                  fcmToken: null,
                  platform: 'web',
                  appVersion: '1.0.0',
                });

                // 로그인 활동 기록
                await addRecentActivity(userPayload.uid, {
                  type: 'study',
                  title: '웹에서 로그인',
                  description: 'VPP 웹 서비스에 접속했습니다.',
                });

                // 페이지 뷰 기록
                await addRecentActivity(userPayload.uid, {
                  type: 'study',
                  title: '채팅 페이지 방문',
                  description: 'AI 채팅 페이지를 방문했습니다.',
                });
              } catch {
                // no-op
              }
            })();
          }
        } else if (data.type === 'FIREBASE_CONFIG') {
          const configData = data;
          setFirebaseConfig(configData.payload);
          // Firebase 설정 후 즉시 초기화
          try {
            initializeFirebase();
            setFirebaseReady(true);
            firebaseReadyRef.current = true;
          } catch {
            // no-op
          }
        } else if (data.type === 'OPEN_SESSION') {
          const sessionData = data;
          setOpenSessionId(sessionData.payload.sessionId);
          setOpenMessageId(sessionData.payload.messageId ?? null);
        }
      } catch {
        // JSON 파싱 실패는 무시 (다른 메시지일 수 있음)
      }
    };

    // 환경변수 기반 초기화/자동 로그인 제거 (모바일 WebView 메시지에만 의존)

    if (isWebViewEnv) {
      window.addEventListener('message', handleMessage);

      const requestAuth = () => {
        try {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'REQUEST_AUTH' })
            );
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'REQUEST_FIREBASE_CONFIG' })
            );
          }
        } catch {
          // no-op
        }
      };

      const timer = setTimeout(requestAuth, 100);

      return () => {
        window.removeEventListener('message', handleMessage);
        clearTimeout(timer);
      };
    }

    // 웹뷰가 아닌 환경에서는 아무 것도 하지 않음 (모바일에서 내려주는 설정/인증에 의존)

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [
    setAuthUser,
    setIsWebView,
    setFirebaseReady,
    setOpenSessionId,
    setOpenMessageId,
  ]);

  const requestAuth = () => {
    if (isWebView && window.ReactNativeWebView) {
      try {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'REQUEST_AUTH' })
        );
      } catch {
        // no-op
      }
    }
  };

  return {
    authUser,
    isWebView,
    firebaseReady,
    openSessionId,
    openMessageId,
    clearOpenSessionId,
    requestAuth,
  };
}
