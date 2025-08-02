import { View } from 'react-native';

import Setting from '../../components/setting';
import SettingHeader from '../../components/setting/SettingHeader';

/**
 * 설정 화면
 * - 앱의 설정을 관리하는 화면
 */
export default function SettingsScreen() {
  return (
    <View>
      <SettingHeader />
      <Setting />
    </View>
  );
}
