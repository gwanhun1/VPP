import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

import Setting from '../../components/setting';
import SettingHeader from '../../components/setting/SettingHeader';
import useResponsive from '../../utils/useResponsive';

/**
 * 설정 화면
 * - 앱의 설정을 관리하는 화면
 */
export default function SettingsScreen() {
  const { containerMaxWidth, horizontalPadding } = useResponsive();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // 설정 데이터 새로고침 로직과 연동 필요
    } finally {
      setRefreshing(false);
    }
  }, []);

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#14287f"
          />
        }
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
