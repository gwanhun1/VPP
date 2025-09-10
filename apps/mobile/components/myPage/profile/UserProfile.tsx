import { getCurrentUser, type AuthUser } from '@vpp/core-logic';
import { Card, Text } from '@vpp/shared-ui';
import { useEffect, useState } from 'react';
import { Image, View, TouchableOpacity } from 'react-native';

import tw from '../../../utils/tailwind';

const UserProfile = () => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // 로그인된 사용자 정보 가져오기
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  // 로그인되지 않은 경우 표시하지 않음
  if (!user || user.providerId === 'anonymous') {
    return null;
  }

  const getProviderColor = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return '#4285F4';
      case 'naver':
        return '#03C75A';
      case 'kakao':
        return '#FEE500';
      default:
        return tw.color('primary') || '#14287f';
    }
  };

  const getProviderDisplayName = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return 'Google';
      case 'naver':
        return 'Naver';
      case 'kakao':
        return 'Kakao';
      default:
        return 'VPP';
    }
  };

  return (
    <Card bordered backgroundColor="white">
      <View style={tw`flex-row items-center gap-4`}>
        {/* 프로필 이미지 또는 기본 아이콘 */}
        <View style={tw`relative`}>
          {user.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={tw`w-16 h-16 rounded-full`}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                tw`w-16 h-16 rounded-full items-center justify-center`,
                { backgroundColor: '#f3f4f6' },
              ]}
            >
              <Text variant="h2" weight="bold" color="muted">
                {user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : 'U'}
              </Text>
            </View>
          )}

          {/* 소셜 로그인 제공자 배지 */}
          <View
            style={[
              tw`absolute -bottom-1 -right-1 w-6 h-6 rounded-full items-center justify-center border-2 border-white`,
              {
                backgroundColor: getProviderColor(
                  user.providerId || 'anonymous'
                ),
              },
            ]}
          >
            <Text variant="caption" weight="bold" color="white">
              {getProviderDisplayName(user.providerId || 'anonymous').charAt(0)}
            </Text>
          </View>
        </View>

        {/* 사용자 정보 */}
        <View style={tw`flex-1`}>
          <Text variant="h5" weight="bold" color="default">
            {user.displayName || '사용자'}
          </Text>
          {user.email && (
            <View style={tw`mt-1`}>
              <Text variant="body2" color="muted">
                {user.email}
              </Text>
            </View>
          )}
          <View style={tw`flex-row items-center mt-2`}>
            <View
              style={[
                tw`px-2 py-1 rounded-full`,
                {
                  backgroundColor:
                    getProviderColor(user.providerId || 'anonymous') + '20',
                },
              ]}
            >
              <Text variant="caption" weight="medium" color="primary">
                {getProviderDisplayName(user.providerId || 'anonymous')} 로그인
              </Text>
            </View>
          </View>
        </View>

        {/* 설정 버튼 */}
        <TouchableOpacity
          style={tw`items-center justify-center p-2`}
          onPress={() => {
            // TODO: 설정 페이지로 이동
            console.log('설정 페이지로 이동');
          }}
        >
          <Text variant="h6" color="muted">
            설정
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

export default UserProfile;
