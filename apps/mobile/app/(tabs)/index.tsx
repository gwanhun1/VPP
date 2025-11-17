import {
  AuthUser,
  onAuthStateChanged,
  getFirebaseConfig,
} from '@vpp/core-logic';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Platform, Text, Pressable } from 'react-native';
import { Spinner } from '@vpp/shared-ui';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import { useSettingsStore } from '../../components/hooks/useSettingsStore';
import tw from '../../utils/tailwind';

/**
 * AI 채팅 화면
 * - VPP AI 어시스턴트와의 대화 화면
 * - 투자 상담, 시장 분석, 용어 설명 등 제공
 * - VPP 디자인 시스템 적용
 */
type ThemeMode = 'light' | 'dark';

const DEV_URL_CANDIDATES = Platform.select({
  ios: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://192.168.0.40:5173',
  ],
  android: ['http://10.0.2.2:5173'],
  default: ['http://127.0.0.1:5173'],
});

const PROD_URL =
  process.env.EXPO_PUBLIC_WEB_BASE_URL ?? 'https://vpp-web.vercel.app';

export default function ChatScreen() {
  const webViewRef = useRef<WebView>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [webViewReady, setWebViewReady] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [devUrlIndex, setDevUrlIndex] = useState(0);
  const [webError, setWebError] = useState<string | null>(null);
  const darkMode = useSettingsStore((s) => s.darkMode);
  const { openSessionId, openMessageId } = useLocalSearchParams<{
    openSessionId?: string;
    openMessageId?: string;
  }>();

  const currentUrl = __DEV__
    ? DEV_URL_CANDIDATES?.[devUrlIndex] ?? DEV_URL_CANDIDATES?.[0] ?? PROD_URL
    : PROD_URL;

  useEffect(() => {
    if (!webViewReady || !openSessionId || !webViewRef.current) return;
    try {
      const payload = JSON.stringify({
        type: 'OPEN_SESSION',
        payload: {
          sessionId: String(openSessionId),
          messageId: openMessageId ? String(openMessageId) : undefined,
        },
      });
      webViewRef.current.postMessage(payload);
    } catch (e) {
      console.warn('세션 오픈 전달 실패:', e);
    }
  }, [webViewReady, openSessionId, openMessageId]);

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

  const postThemeModeToWeb = useCallback((mode: ThemeMode): void => {
    if (!webViewRef.current) return;
    const payload = JSON.stringify({
      type: 'THEME_MODE',
      payload: { mode },
    });
    try {
      webViewRef.current.postMessage(payload);
    } catch {
      // ignore
    }
  }, []);

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

  useEffect(() => {
    if (!webViewReady) return;
    postThemeModeToWeb(darkMode ? 'dark' : 'light');
  }, [darkMode, webViewReady, postThemeModeToWeb]);

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
    postThemeModeToWeb(darkMode ? 'dark' : 'light');
    setIsLoading(false);
    setWebError(null);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setWebError(null);
  };

  const handleRetry = () => {
    if (webViewRef.current) {
      setIsLoading(true);
      setWebError(null);
      webViewRef.current.reload();
    }
  };

  return (
    <View
      style={[
        tw`flex-1`,
        {
          position: 'relative',
          backgroundColor: darkMode ? '#17171B' : '#ffffff',
        },
      ]}
    >
      <WebView
        originWhitelist={['*']}
        ref={webViewRef}
        source={{ uri: currentUrl }}
        // 스크롤 방지
        bounces={false}
        overScrollMode="never"
        // 전체 화면 채움 + iOS 자동 인셋/액세서리 바 비활성화
        style={tw`flex-1`}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        hideKeyboardAccessoryView
        // 키보드 올라왔을 때 웹뷰 크기 조정
        keyboardDisplayRequiresUserAction={false}
        onMessage={handleMessage} // RN <-> WebView 통신 연결
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        renderError={() => (
          <View
            style={[
              tw`flex-1 items-center justify-center px-6`,
              { backgroundColor: '#ffffff' },
            ]}
          >
            <View style={tw`items-center gap-3`}>
              <View style={tw`mb-2`}>
                <Spinner size={24} message={undefined} />
              </View>
              <View>
                <Text
                  style={tw`text-base font-semibold text-center text-gray-900`}
                >
                  페이지를 불러오지 못했어요
                </Text>
                <Text style={tw`mt-1 text-xs text-center text-gray-600`}>
                  {webError ||
                    '네트워크 상태를 확인하시거나 잠시 후 다시 시도해 주세요.'}
                </Text>
              </View>
              <Pressable
                onPress={handleRetry}
                style={[
                  tw`mt-3 px-5 py-2.5 rounded-full items-center`,
                  { backgroundColor: '#2563EB' },
                ]}
              >
                <Text style={tw`text-sm font-semibold text-white`}>
                  다시 시도
                </Text>
              </Pressable>
            </View>
          </View>
        )}
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
          setIsLoading(false);
          const description =
            typeof e.nativeEvent.description === 'string'
              ? e.nativeEvent.description
              : '';
          setWebError(
            description || '페이지를 불러오는 중 문제가 발생했습니다.'
          );
        }}
      />

      {isLoading ? (
        <View
          style={[
            tw`absolute inset-0 items-center justify-center`,
            { backgroundColor: '#ffffff', zIndex: 9999 },
          ]}
        >
          <Spinner size={36} message="로딩 중..." />
        </View>
      ) : null}
    </View>
  );
}
