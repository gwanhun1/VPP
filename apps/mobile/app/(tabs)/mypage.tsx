import { ScrollView, View } from 'react-native';

import AppHeader from '../../components/common/AppHeader';
import MyPage from '../../components/myPage';
import useResponsive from '../../utils/useResponsive';

/**
 * 마이페이지 화면
 * - 사용자 프로필 및 개인 설정
 * - 투자 포트폴리오, 관심 종목, 학습 진도 등
 * - VPP 디자인 시스템 적용
 */
export default function MyPageScreen() {
  const { containerMaxWidth, horizontalPadding } = useResponsive();
  return (
    <>
      <AppHeader title="마이페이지" subtitle="나만의 전력시장 학습 공간" />
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
          <MyPage />
        </View>
      </ScrollView>
    </>
  );
}
