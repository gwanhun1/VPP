import { RefreshControl, ScrollView, View } from 'react-native';

import AppHeader from '../../components/common/AppHeader';
import Trends from '../../components/trends';
import useResponsive from '../../utils/useResponsive';
import { useSettingsStore } from '../../components/hooks/useSettingsStore';
import { useTrends } from '../../components/hooks/useTrends';

export default function TrendsScreen() {
  const { containerMaxWidth, horizontalPadding } = useResponsive();
  const darkMode = useSettingsStore((s) => s.darkMode);
  const {
    loading,
    error,
    refreshing,
    smp,
    rec,
    trends,
    filter,
    setFilter,
    refresh,
  } = useTrends();
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
            onRefresh={refresh}
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
          <Trends
            loading={loading}
            error={error}
            smp={smp}
            rec={rec}
            trends={trends}
            filter={filter}
            onFilterChange={setFilter}
          />
        </View>
      </ScrollView>
    </View>
  );
}
