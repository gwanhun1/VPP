import { StyleSheet, Text, View } from 'react-native';

/**
 * 시장 동향 화면
 * - 주식, 암호화폐, 부동산 등의 시장 동향 정보 제공
 * - VPP 디자인 시스템 적용
 */
export default function TrendsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>시장 동향</Text>
      <Text style={styles.subtitle}>실시간 시장 정보를 확인하세요</Text>
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
