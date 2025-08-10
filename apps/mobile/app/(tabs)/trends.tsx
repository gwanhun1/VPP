import { ScrollView, View } from 'react-native';

import AppHeader from '../../components/common/AppHeader';
import Trends from '../../components/trends';
import useResponsive from '../../utils/useResponsive';
/**
 * 시장 동향 화면
 * - 주식, 암호화폐, 부동산 등의 시장 동향 정보 제공
 * - VPP 디자인 시스템 적용
 */
export default function TrendsScreen() {
  const { containerMaxWidth, horizontalPadding } = useResponsive();
  return (
    <>
      <AppHeader title="시장 동향" subtitle="실시간 시장 정보를 확인하세요" />
      <ScrollView
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24, flexGrow: 1 }}
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
          <Trends />
        </View>
      </ScrollView>
    </>
  );
}
