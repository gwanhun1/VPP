import { StyleSheet, Text, View } from 'react-native';

/**
 * AI 채팅 화면
 * - VPP AI 어시스턴트와의 대화 화면
 * - 투자 상담, 시장 분석, 용어 설명 등 제공
 * - VPP 디자인 시스템 적용
 */
export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI 채팅</Text>
      <Text style={styles.subtitle}>투자 전문 AI와 대화해보세요</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#14287f', // VPP 메인 컬러
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});
