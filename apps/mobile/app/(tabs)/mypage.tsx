import { ScrollView, View, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { signOut, onAuthStateChanged, getCurrentUser, type AuthUser } from '@vpp/core-logic';
import { useEffect, useState } from 'react';

import AppHeader from '../../components/common/AppHeader';
import MyPage from '../../components/myPage';
import useResponsive from '../../utils/useResponsive';
import tw from '../../utils/tailwind';

/**
 * 마이페이지 화면
 * - 사용자 프로필 및 개인 설정
 * - 투자 포트폴리오, 관심 종목, 학습 진도 등
 * - VPP 디자인 시스템 적용
 */
export default function MyPageScreen() {
  const { containerMaxWidth, horizontalPadding } = useResponsive();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    // 초기 사용자 반영 후 구독
    setUser(getCurrentUser());
    const off = onAuthStateChanged((u) => setUser(u));
    return off;
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)');
    } catch {
      Alert.alert('로그아웃 실패', '다시 시도해주세요.');
    }
  };
  return (
    <>
      {user === undefined && (
        <View style={tw`flex-1 items-center justify-center bg-white`}>
          <ActivityIndicator size="large" color="#14287f" />
        </View>
      )}
      {(user === null || user?.isAnonymous) && <Redirect href="/(auth)" />}
      {user && !user.isAnonymous && (
        <>
          <AppHeader title="마이페이지" subtitle="나만의 전력시장 학습 공간" />
          {/* 로그아웃 버튼 */}
          <View
            style={[
              tw`px-4`,
              { alignSelf: 'center', width: '100%', maxWidth: containerMaxWidth },
            ]}
          >
            <TouchableOpacity
              onPress={handleSignOut}
              activeOpacity={0.85}
              style={tw`mt-3 self-end bg-[#14287f] px-4 py-2 rounded-lg`}
            >
              <Text style={tw`text-white font-semibold`}>로그아웃</Text>
            </TouchableOpacity>
          </View>
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
      )}
    </>
  );    
}
