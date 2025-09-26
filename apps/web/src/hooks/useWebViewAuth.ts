import { useEffect, useState } from 'react';
import type { AuthUser } from '@vpp/core-logic';
import {
  setFirebaseConfig,
  initializeFirebase,
  updateUserDevice,
  addRecentActivity,
} from '@vpp/core-logic';

interface WebViewMessage {
  type: string;
  payload?: AuthUser | null;
}

interface FirebaseConfigMessage {
  type: 'FIREBASE_CONFIG';
  payload: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
}

// React Native WebView 타입 확장
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

// 테스트 하드코딩 제거: 자동 로그인 함수 삭제

/**
 * 웹뷰에서 모바일 앱으로부터 인증 정보를 받아 처리하는 훅
 * 모바일 앱에서 postMessage로 전송한 AUTH 메시지를 수신하여 상태를 업데이트
 */
export function useWebViewAuth() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isWebView, setIsWebView] = useState(false);

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
        const data: WebViewMessage | FirebaseConfigMessage = JSON.parse(event.data);
        
        if (data.type === 'AUTH') {
          const authData = data as WebViewMessage;
          setAuthUser(authData.payload || null);
          
          // 인증 정보 수신 시 사용자 상태 업데이트 및 로그인 활동 기록 (새로운 구조 사용)
          if (authData.payload) {
            const userPayload = authData.payload;
            (async () => {
              try {
                // Firebase 초기화 (FIREBASE_CONFIG 수신 이후에도 idempotent 하게 동작)
                initializeFirebase();
                
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
          const configData = data as FirebaseConfigMessage;
          setFirebaseConfig(configData.payload);
          // Firebase 설정 후 즉시 초기화
          try {
            initializeFirebase();
          } catch {
            // no-op
          }
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
  }, []);

  return {
    authUser,
    isWebView,
    // 웹뷰에서 모바일 앱에 인증 정보 재요청
    requestAuth: () => {
      if (isWebView && window.ReactNativeWebView) {
        try {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ type: 'REQUEST_AUTH' })
          );
        } catch {
          // no-op
        }
      }
    }
  };
}
