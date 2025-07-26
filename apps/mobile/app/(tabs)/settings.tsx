import { StyleSheet, Text, View } from 'react-native';

/**
 * 설정 화면
 * - 앱의 설정을 관리하는 화면
 * - 메인 컬러: #14287f
 * - 서브 컬러: #f6a20b
 */
export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.colorSample}>
        <View style={styles.mainColor}>
          <Text style={styles.colorText}>메인 컬러</Text>
        </View>
        <View style={styles.subColor}>
          <Text style={styles.colorText}>서브 컬러</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#14287f', // VPP 메인 컬러
    marginBottom: 20,
  },
  colorSample: {
    width: '80%',
    flexDirection: 'column',
    gap: 10,
  },
  mainColor: {
    backgroundColor: '#14287f', // VPP 메인 컬러
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  subColor: {
    backgroundColor: '#f6a20b', // VPP 서브 컬러
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  colorText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
