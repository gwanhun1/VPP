import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

import AppHeader from '../../components/common/AppHeader';
import Trends from '../../components/trends';
import useResponsive from '../../utils/useResponsive';
import { useSettingsStore } from '../../components/hooks/useSettingsStore';
/**
 * 시장 동향 화면
 * - 주식, 암호화폐, 부동산 등의 시장 동향 정보 제공
 * - VPP 디자인 시스템 적용
 */
export default function TrendsScreen() {
  const { containerMaxWidth, horizontalPadding } = useResponsive();
  const [refreshing, setRefreshing] = useState(false);
  const darkMode = useSettingsStore((s) => s.darkMode);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // 시장 동향 데이터 새로고침 로직과 연동 필요
    } finally {
      setRefreshing(false);
    }
  }, []);
  return (
    <View
      style={{ flex: 1, backgroundColor: darkMode ? '#17171B' : '#ffffff' }}
    >
      <AppHeader title="시장 동향" subtitle="실시간 시장 정보를 확인하세요" />
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
          <Trends />
        </View>
      </ScrollView>
    </View>
  );
}
