import { useEffect, useState } from 'react';
import type { AuthUser } from '@vpp/core-logic';
import { 
  setFirebaseConfig, 
  initializeFirebase,
  updateUserDevice,
  addRecentActivity
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
      // User Agent 기반 웹뷰 감지
      const userAgent = navigator.userAgent;
      const isWebViewUA = /wv|WebView|Version.*Chrome/i.test(userAgent);
      
      // React Native WebView의 경우 window.ReactNativeWebView 객체가 존재
      const hasReactNativeWebView = !!window.ReactNativeWebView;
      
      return isWebViewUA || hasReactNativeWebView;
    };

    setIsWebView(detectWebView());

    // 모바일 앱으로부터 메시지 수신 처리
    const handleMessage = (event: MessageEvent) => {
      try {
        const data: WebViewMessage | FirebaseConfigMessage = JSON.parse(event.data);
        
        if (data.type === 'AUTH') {
          const authData = data as WebViewMessage;
          console.log('[WebView] 인증 정보 수신:', authData.payload);
          setAuthUser(authData.payload || null);
          
          // 인증 정보 수신 시 사용자 상태 업데이트 및 로그인 활동 기록 (새로운 구조 사용)
          if (authData.payload) {
            const userPayload = authData.payload;
            (async () => {
              try {
                // Firebase 초기화 확인
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
                
                console.log('[WebViewAuth] 사용자 활동 로그 완료');
              } catch (error) {
                console.error('[WebViewAuth] 사용자 활동 로그 실패:', error);
              }
            })();
          }
        } else if (data.type === 'FIREBASE_CONFIG') {
          const configData = data as FirebaseConfigMessage;
          console.log('[WebView] Firebase 설정 수신');
          setFirebaseConfig(configData.payload);
          // Firebase 설정 후 즉시 초기화
          try {
            initializeFirebase();
            console.log('[WebView] Firebase 초기화 완료');
          } catch (error) {
            console.error('[WebView] Firebase 초기화 실패:', error);
          }
        }
      } catch (error) {
        // JSON 파싱 실패는 무시 (다른 메시지일 수 있음)
        console.debug('[WebView] 메시지 파싱 실패:', error);
      }
    };

    // 웹뷰 환경에서만 메시지 리스너 등록
    if (detectWebView()) {
      window.addEventListener('message', handleMessage);
      
      // 모바일 앱에 인증 정보 및 Firebase 설정 요청
      const requestAuth = () => {
        try {
          if (window.ReactNativeWebView) {
            // 인증 정보 요청
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'REQUEST_AUTH' })
            );
            // Firebase 설정 요청
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'REQUEST_FIREBASE_CONFIG' })
            );
          }
        } catch (error) {
          console.error('[WebView] 인증 정보 요청 실패:', error);
        }
      };

      // Fallback: 환경변수로 Firebase 초기화 시도
      const initializeFromEnv = () => {
        try {
          const config = {
            apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
            storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
            messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
            appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
          };
          
          // 필수 설정이 있으면 초기화
          if (config.apiKey && config.projectId) {
            setFirebaseConfig(config);
            initializeFirebase();
            console.log('[WebView] 환경변수로 Firebase 초기화 완료');
          }
        } catch (error) {
          console.warn('[WebView] 환경변수 Firebase 초기화 실패:', error);
        }
      };
      
      // 웹뷰가 아닌 경우 환경변수로 초기화 시도
      if (!detectWebView()) {
        initializeFromEnv();
      }

      // 페이지 로드 후 약간의 지연을 두고 인증 정보 요청
      const timer = setTimeout(requestAuth, 100);

      return () => {
        window.removeEventListener('message', handleMessage);
        clearTimeout(timer);
      };
    }
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
        } catch (error) {
          console.error('[WebView] 인증 정보 재요청 실패:', error);
        }
      }
    }
  };
}
