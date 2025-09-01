import {
  getCurrentUser,
  onAuthStateChanged,
  signOut,
  type AuthUser,
} from '@vpp/core-logic';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AppHeader from '../../components/common/AppHeader';
import MyPage from '../../components/myPage';
import tw from '../../utils/tailwind';
import useResponsive from '../../utils/useResponsive';

export default function MyPageScreen() {
  const { containerMaxWidth, horizontalPadding } = useResponsive();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    setUser(getCurrentUser());
    const off = onAuthStateChanged((u) => setUser(u));
    return off;
  }, []);

  useEffect(() => {
    if (user === null || user?.providerId === 'anonymous') {
      router.replace('/(auth)');
    }
  }, [user, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)');
    } catch {
      Alert.alert('로그아웃 실패', '다시 시도해주세요.');
    }
  };

  if (user === undefined) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-white`}>
        <ActivityIndicator size="large" color="#14287f" />
      </View>
    );
  }

  if (!user || user.providerId === 'anonymous') {
    return null; // 이동은 useEffect에서 처리되므로 화면 렌더링하지 않음
  }

  return (
    <>
      <AppHeader title="마이페이지" subtitle="나만의 전력시장 학습 공간" />
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
  );
}
