import { useEffect, useState } from 'react';
import type { AuthUser } from '@vpp/core-logic';
import { setFirebaseConfig, getFirestore } from '@vpp/core-logic';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';

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
    const detectWebView = () => {
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
          
          // 인증 정보 수신 시 사용자 상태 업데이트 및 로그인 활동 기록
          if (authData.payload) {
            (async () => {
              try {
                const db = getFirestore();
                if (db) {
                  // 사용자 온라인 상태 업데이트
                  await setDoc(doc(db, 'userStatus', authData.payload.uid), {
                    userId: authData.payload.uid,
                    isOnline: true,
                    lastSeen: serverTimestamp(),
                    platform: 'web',
                    source: 'webview',
                    activeSession: `webview_${Date.now()}`
                  }, { merge: true });

                  // 로그인 활동 기록
                  await addDoc(collection(db, 'userActivities'), {
                    userId: authData.payload.uid,
                    type: 'login',
                    data: { platform: 'web', source: 'webview' },
                    timestamp: serverTimestamp(),
                    platform: 'web',
                    source: 'webview'
                  });

                  // 페이지 뷰 기록
                  await addDoc(collection(db, 'userActivities'), {
                    userId: authData.payload.uid,
                    type: 'page_view',
                    data: { page: 'chat', url: window.location.href },
                    timestamp: serverTimestamp(),
                    platform: 'web',
                    source: 'webview'
                  });
                }
              } catch (error) {
                console.error('[WebViewAuth] 사용자 활동 로그 실패:', error);
              }
            })();
          }
        } else if (data.type === 'FIREBASE_CONFIG') {
          const configData = data as FirebaseConfigMessage;
          console.log('[WebView] Firebase 설정 수신');
          setFirebaseConfig(configData.payload);
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
      // initializeFirebaseFromEnv(); // TODO: 환경변수 초기화 함수 구현 필요

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
