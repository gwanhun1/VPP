import { ScrollView, View } from 'react-native';

import Setting from '../../components/setting';
import SettingHeader from '../../components/setting/SettingHeader';
import useResponsive from '../../utils/useResponsive';

/**
 * 설정 화면
 * - 앱의 설정을 관리하는 화면
 */
export default function SettingsScreen() {
  const { containerMaxWidth, horizontalPadding } = useResponsive();

  return (
    <>
      <SettingHeader />
      <ScrollView
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: 24,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            alignSelf: 'center',
            width: '100%',
            maxWidth: containerMaxWidth,
            paddingHorizontal: horizontalPadding,
            rowGap: 12,
          }}
        >
          <Setting />
        </View>
      </ScrollView>
    </>
  );
}
