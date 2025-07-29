import { WebView } from 'react-native-webview';
/**
 * AI 채팅 화면
 * - VPP AI 어시스턴트와의 대화 화면
 * - 투자 상담, 시장 분석, 용어 설명 등 제공
 * - VPP 디자인 시스템 적용
 */
export default function ChatScreen() {
  return (
    <WebView
      source={{ uri: 'https://vppweb.vercel.app' }}
      // 스크롤 방지
      bounces={false}
      overScrollMode="never"
      // 키보드 올라왔을 때 웹뷰 크기 조정
      keyboardDisplayRequiresUserAction={false}
    />
  );
}
