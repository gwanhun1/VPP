import {
  AuthUser,
  onAuthStateChanged,
  getFirebaseConfig,
} from '@vpp/core-logic';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Platform } from 'react-native';
import { Spinner } from '@vpp/shared-ui';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

/**
 * AI 채팅 화면
 * - VPP AI 어시스턴트와의 대화 화면
 * - 투자 상담, 시장 분석, 용어 설명 등 제공
 * - VPP 디자인 시스템 적용
 */
const DEV_URL_CANDIDATES = Platform.select({
  ios: [
    'http://localhost:4200',
    'http://127.0.0.1:4200',
    'http://192.168.0.4:4200',
  ],
  android: ['http://10.0.2.2:4200'],
  default: ['http://127.0.0.1:4200'],
});

const PROD_URL = 'https://vpp-two.vercel.app';

export default function ChatScreen() {
  const webViewRef = useRef<WebView>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [webViewReady, setWebViewReady] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [devUrlIndex, setDevUrlIndex] = useState(0);

  const currentUrl = __DEV__
    ? DEV_URL_CANDIDATES?.[devUrlIndex] ?? DEV_URL_CANDIDATES?.[0] ?? PROD_URL
    : PROD_URL;

  useEffect(() => {
    if (__DEV__) {
      console.log('[WebView] currentUrl:', currentUrl);
    }
  }, [currentUrl]);

  // RN → Web AUTH 전송 (필요 시 재시도)
  const postAuthToWeb = useCallback(
    (authUser: AuthUser | null, attempt = 0): void => {
      const maxAttempts = 3;
      const delayMs = 150;
      const payload = JSON.stringify({ type: 'AUTH', payload: authUser });

      if (!webViewRef.current) return;
      try {
        webViewRef.current.postMessage(payload);
      } catch {
        if (attempt < maxAttempts) {
          setTimeout(() => postAuthToWeb(authUser, attempt + 1), delayMs);
        }
      }
    },
    []
  );

  // 로그인 상태 감지 → WebView로 전달
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser: AuthUser | null) => {
      setUser(authUser);
      // WebView가 준비된 이후에는 즉시 전송
      if (webViewReady) {
        postAuthToWeb(authUser);
      }
    });

    return unsubscribe;
  }, [postAuthToWeb, webViewReady]);

  // WebView → RN 메시지 수신
  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data) as
        | { type: 'REQUEST_AUTH' }
        | { type: 'REQUEST_FIREBASE_CONFIG' }
        | { type: 'WEB_ERROR'; payload?: string }
        | { type: string; payload?: unknown };
      if (data.type === 'REQUEST_AUTH' && user && webViewRef.current) {
        // 웹뷰에서 로그인 정보 요청 시 다시 전달
        postAuthToWeb(user);
        return;
      }
      if (data.type === 'REQUEST_FIREBASE_CONFIG') {
        // 웹뷰에서 Firebase 설정 요청 시 즉시 전달
        postFirebaseConfigToWeb();
        return;
      }
      if (data.type === 'WEB_ERROR') {
        console.warn(
          '[WebView][WEB_ERROR]:',
          (data as { payload?: string }).payload
        );
        return;
      }
    } catch (e) {
      console.error('WebView message parse error', e);
    }
  };

  // Firebase 설정을 웹으로 전송
  const postFirebaseConfigToWeb = useCallback(() => {
    const config = getFirebaseConfig();
    if (config && webViewRef.current) {
      const payload = JSON.stringify({
        type: 'FIREBASE_CONFIG',
        payload: config,
      });
      try {
        webViewRef.current.postMessage(payload);
      } catch (error) {
        console.error('Firebase config 전송 실패:', error);
      }
    }
  }, []);

  // WebView 로드 완료 시 인증 정보 및 Firebase 설정 전송
  const handleLoadEnd = () => {
    setWebViewReady(true);
    // Firebase 설정을 먼저 전달하여 Web이 초기화된 뒤 AUTH를 처리하도록 보장
    postFirebaseConfigToWeb();
    postAuthToWeb(user);
    setIsLoading(false);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <WebView
        originWhitelist={['*']}
        ref={webViewRef}
        source={{ uri: currentUrl }}
        // 스크롤 방지
        bounces={false}
        overScrollMode="never"
        // 전체 화면 채움 + iOS 자동 인셋/액세서리 바 비활성화
        style={{ flex: 1 }}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        hideKeyboardAccessoryView
        // 키보드 올라왔을 때 웹뷰 크기 조정
        keyboardDisplayRequiresUserAction={false}
        onMessage={handleMessage} // RN <-> WebView 통신 연결
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={(e) => {
          // iOS 시뮬레이터에서 localhost/127.0.0.1 해석 문제 시 대체 URL로 재시도
          if (__DEV__) {
            const next = (DEV_URL_CANDIDATES?.length ?? 0) - 1;
            if (devUrlIndex < next) {
              setDevUrlIndex((idx) => idx + 1);
              return;
            }
          }
          console.warn('WebView load error:', e.nativeEvent);
        }}
      />

      {isLoading ? <Spinner overlay size={36} message="로딩 중..." /> : null}
    </View>
  );
}
