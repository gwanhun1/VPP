import { StyleSheet, Text, View } from 'react-native';

/**
 * 마이페이지 화면
 * - 사용자 프로필 및 개인 설정
 * - 투자 포트폴리오, 관심 종목, 학습 진도 등
 * - VPP 디자인 시스템 적용
 */
export default function MyPageScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>마이페이지</Text>
      <Text style={styles.subtitle}>나의 투자 정보를 관리하세요</Text>
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
