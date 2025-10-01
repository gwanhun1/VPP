import { getCurrentUser } from '@vpp/core-logic';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';

import AppHeader from '../../components/common/AppHeader';
import MyPage from '../../components/myPage';
import tw from '../../utils/tailwind';
import useResponsive from '../../utils/useResponsive';

export default function MyPageScreen() {
  const { containerMaxWidth, horizontalPadding } = useResponsive();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const user = getCurrentUser();

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // 중요: 마이페이지 데이터 새로고침 로직과 연동 필요
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (user === null) {
      // if (user === null || user.providerId === 'anonymous') { 추후 소셜로그인 개발하면 연계
      router.replace('/(auth)');
    }
  }, [user, router]);

  // 로딩 상태 표시
  if (user === undefined) {
    return (
      <>
        <AppHeader title="마이페이지" subtitle="나만의 전력시장 학습 공간" />
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#14287f" />
          <View style={tw`mt-4`}>
            <Text style={tw`text-gray-600`}>사용자 정보를 불러오는 중...</Text>
          </View>
        </View>
      </>
    );
  }

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
          <MyPage />
        </View>
      </ScrollView>
    </>
  );
}
