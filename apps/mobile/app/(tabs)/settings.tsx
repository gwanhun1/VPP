import { StyleSheet, View } from 'react-native';

import Setting from '../../components/setting';
import SettingHeader from '../../components/setting/SettingHeader';

/**
 * 설정 화면
 * - 앱의 설정을 관리하는 화면
 */
export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <SettingHeader />
      <Setting />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
