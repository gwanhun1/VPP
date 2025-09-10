import {
  getCurrentUser,
  onAuthStateChanged,
  signOut,
  type AuthUser,
} from '@vpp/core-logic';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Card, Text } from '@vpp/shared-ui';
import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert, Image } from 'react-native';
import { router } from 'expo-router';

import tw from '../../utils/tailwind';

const UserProfile = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const primaryColor = tw.color('primary');
  const mutedColor = tw.color('muted');

  useEffect(() => {
    // 초기 사용자 상태 설정
    setUser(getCurrentUser());

    // Auth 상태 변경 리스너 등록
    const unsubscribe = onAuthStateChanged((authUser: AuthUser | null) => {
      setUser(authUser);
    });

    return unsubscribe;
  }, []);

  const handleSignOut = () => {
    Alert.alert('로그아웃', '정말로 로그아웃하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
            // 로그아웃 후 로그인 페이지로 이동
            router.replace('/(auth)');
          } catch (error) {
            console.error('로그아웃 실패:', error);
            Alert.alert('오류', '로그아웃 중 오류가 발생했습니다.');
          }
        },
      },
    ]);
  };

  const getSocialProvider = (providerId: string) => {
    switch (providerId) {
      case 'google':
      case 'google.com':
        return { name: 'Google', color: '#DB4437' };
      case 'apple.com':
        return { name: 'Apple', color: '#000000' };
      case 'facebook.com':
        return { name: 'Facebook', color: '#4267B2' };
      default:
        return { name: 'Email', color: primaryColor };
    }
  };

  if (user === undefined) {
    return (
      <Card bordered>
        <View style={tw`flex-col items-center py-6`}>
          <MaterialIcons name="person" size={32} color={mutedColor} />
          <View style={tw`mt-2`}>
            <Text variant="body2" color="muted">
              사용자 정보를 불러오는 중...
            </Text>
          </View>
        </View>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card bordered>
        <View style={tw`flex-col items-center py-4`}>
          <MaterialIcons name="account-circle" size={64} color={mutedColor} />
          <View style={tw`mt-2`}>
            <Text variant="h6" color="muted">
              로그인이 필요합니다
            </Text>
          </View>
          <TouchableOpacity
            style={tw`mt-3 px-4 py-2 bg-primary rounded-lg`}
            onPress={() => router.push('/(auth)')}
          >
            <Text color="white" weight="semibold">
              로그인하기
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  }

  const provider = getSocialProvider(user.providerId || 'anonymous');

  return (
    <Card bordered>
      <View style={tw`flex-col gap-3`}>
        <View style={tw`flex-row items-center gap-4`}>
          {user.photoURL && user.photoURL.length > 0 ? (
            <Image
              source={{ uri: user.photoURL }}
              style={tw`w-16 h-16 rounded-full`}
            />
          ) : (
            <View
              style={tw`w-16 h-16 rounded-full bg-gray-200 items-center justify-center`}
            >
              <MaterialIcons name="person" size={32} color={mutedColor} />
            </View>
          )}

          <View style={tw`flex-1`}>
            <Text variant="h6" weight="bold" color="primary">
              {user.displayName || '사용자'}
            </Text>
            <Text variant="body2" color="muted">
              {user.email}
            </Text>
            <View style={tw`flex-row items-center gap-1 mt-1`}>
              <View
                style={[
                  tw`px-2 py-1 rounded-full`,
                  { backgroundColor: provider.color + '20' },
                ]}
              >
                <Text variant="caption" weight="medium" color="primary">
                  {provider.name}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={tw`border-t border-gray-200 pt-3`}>
          <TouchableOpacity
            style={tw`flex-row items-center justify-between py-2`}
            onPress={handleSignOut}
          >
            <View style={tw`flex-row items-center gap-2`}>
              <MaterialIcons name="logout" size={20} color="#DC2626" />
              <Text color="error" weight="medium">
                로그아웃
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={mutedColor} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

export default UserProfile;
