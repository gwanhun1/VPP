import { onAuthStateChanged } from '@vpp/core-logic';
import { AuthUser } from '@vpp/core-logic/firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';

/**
 * AI 채팅 화면
 * - VPP AI 어시스턴트와의 대화 화면
 * - 투자 상담, 시장 분석, 용어 설명 등 제공
 * - VPP 디자인 시스템 적용
 */
export default function ChatScreen() {
  const webViewRef = useRef<WebView>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  // 로그인 상태 감지 → WebView로 전달
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser: any) => {
      setUser(authUser);

      if (webViewRef.current) {
        webViewRef.current.postMessage(
          JSON.stringify({
            type: 'AUTH',
            payload: authUser, // 로그인 정보(uid, email 등)
          })
        );
      }
    });

    return unsubscribe;
  }, []);

  // WebView → RN 메시지 수신
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'REQUEST_AUTH' && user && webViewRef.current) {
        // 웹뷰에서 로그인 정보 요청 시 다시 전달
        webViewRef.current.postMessage(
          JSON.stringify({
            type: 'AUTH',
            payload: user,
          })
        );
      }
    } catch (e) {
      console.error('WebView message parse error', e);
    }
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: 'https://vppweb.vercel.app' }}
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
    />
  );
}
