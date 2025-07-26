import { StyleSheet, Text, View } from 'react-native';

/**
 * 용어 퀴즈 화면
 * - 투자 관련 용어 퀴즈 게임
 * - 사용자의 투자 지식 향상을 위한 학습 도구
 * - VPP 디자인 시스템 적용
 */
export default function QuizScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>용어 퀴즈</Text>
      <Text style={styles.subtitle}>투자 용어를 재미있게 학습해보세요</Text>
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
