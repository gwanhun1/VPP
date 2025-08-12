import {
  onAuthStateChanged,
  type AuthUser,
  getCurrentUser,
} from '@vpp/core-logic';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import tw from '../utils/tailwind';

export default function IndexGate() {
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    // 초기 렌더에서 이미 로그인되어 있을 수 있으므로 현재 사용자 반영
    setUser(getCurrentUser());
    const off = onAuthStateChanged((u) => setUser(u));
    return off;
  }, []);

  if (user === undefined) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-white`}>
        <ActivityIndicator size="large" color="#14287f" />
      </View>
    );
  }

  // 로그인 여부에 따라 분기
  if (user) return <Redirect href="/(tabs)" />;
  return <Redirect href="/(auth)" />;
}
