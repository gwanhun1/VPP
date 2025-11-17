import {
  getCurrentUser,
  onAuthStateChanged,
  signOut,
  type AuthUser,
  updateUserProfile,
  getUserProfile,
} from '@vpp/core-logic';
import { Card, Text } from '@vpp/shared-ui';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';

import tw from '../../../utils/tailwind';
import { useSettingsStore } from '../../hooks/useSettingsStore';

const UserProfile = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const darkMode = useSettingsStore((s) => s.darkMode);

  useEffect(() => {
    setUser(getCurrentUser());
    const unsubscribe = onAuthStateChanged((authUser) => setUser(authUser));
    return unsubscribe;
  }, []);

  useEffect(() => {
    setDisplayNameInput(user?.displayName ?? '');
  }, [user?.displayName]);

  if (!user || user.providerId === 'anonymous') {
    return null;
  }

  const handleDisplayNameSave = async () => {
    const trimmed = displayNameInput.trim();
    if (!trimmed) {
      Alert.alert('이름 수정', '이름을 입력해주세요.');
      return;
    }

    try {
      setIsSaving(true);
      await updateUserProfile(user.uid, { displayName: trimmed });

      try {
        const refreshedProfile = await getUserProfile(user.uid);
        if (refreshedProfile) {
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  displayName: refreshedProfile.displayName,
                  email: refreshedProfile.email,
                  photoURL: refreshedProfile.photoURL,
                  providerId: refreshedProfile.providerId,
                }
              : prev
          );
          setDisplayNameInput(refreshedProfile.displayName ?? '');
        } else {
          setUser((prev) => (prev ? { ...prev, displayName: trimmed } : prev));
          setDisplayNameInput(trimmed);
        }
      } catch (fetchError) {
        console.warn('업데이트된 프로필 조회 실패:', fetchError);
        setUser((prev) => (prev ? { ...prev, displayName: trimmed } : prev));
        setDisplayNameInput(trimmed);
      }

      Alert.alert('이름 수정', '이름이 업데이트되었습니다.');
      setIsEditingName(false);
    } catch (error) {
      console.error('displayName 업데이트 실패:', error);
      Alert.alert('오류', '이름을 저장하는 중 문제가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setDisplayNameInput(user.displayName ?? '');
    setIsEditingName(false);
  };

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
    <Card bordered>
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
                {
                  backgroundColor: darkMode ? '#1f2937' : '#f3f4f6',
                },
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
          {isEditingName ? (
            <View style={[tw`flex-row items-center gap-2`, { height: 32 }]}>
              <TextInput
                value={displayNameInput}
                onChangeText={setDisplayNameInput}
                placeholder="이름을 입력하세요"
                placeholderTextColor={tw.color('gray-400') || '#9CA3AF'}
                editable={!isSaving}
                autoFocus
                style={[
                  tw`flex-1 px-3 border rounded-lg`,
                  {
                    height: 32,
                    fontSize: 14,
                    lineHeight: 18,
                    paddingVertical: 0,
                    textAlignVertical: 'center',
                    borderColor: darkMode
                      ? tw.color('gray-600') || '#4b5563'
                      : tw.color('gray-200') || '#e5e7eb',
                    color: darkMode ? '#e5e7eb' : '#111827',
                    backgroundColor: darkMode ? '#030712' : '#ffffff',
                  },
                ]}
              />
              <TouchableOpacity
                style={tw`h-8 px-3 rounded-lg bg-primary items-center justify-center`}
                onPress={handleDisplayNameSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text variant="caption" weight="bold" color="white">
                    저장
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  tw`h-8 px-3 rounded-lg items-center justify-center`,
                  {
                    backgroundColor: darkMode
                      ? '#374151'
                      : tw.color('gray-100') || '#f3f4f6',
                  },
                ]}
                onPress={handleCancelEdit}
                disabled={isSaving}
              >
                <Text variant="caption" weight="medium" color="default">
                  취소
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsEditingName(true)}
              style={[tw`flex-row items-center gap-1`, { minHeight: 32 }]}
            >
              <Text variant="h5" weight="bold" color="default">
                {user.displayName || '사용자'}
              </Text>
              <MaterialIcons
                name="edit"
                size={18}
                color={tw.color('gray-500')}
              />
            </TouchableOpacity>
          )}
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
      </View>
      {/* 구분선 및 로그아웃 액션 */}
      <View
        style={[
          tw`border-t mt-3 pt-3`,
          {
            borderColor: darkMode
              ? tw.color('gray-700') || '#374151'
              : tw.color('gray-200') || '#e5e7eb',
          },
        ]}
      >
        <TouchableOpacity
          style={tw`flex-row items-center justify-between py-2`}
          onPress={() => {
            Alert.alert('로그아웃', '정말로 로그아웃하시겠습니까?', [
              { text: '취소', style: 'cancel' },
              {
                text: '로그아웃',
                style: 'destructive',
                onPress: async () => {
                  try {
                    await signOut();
                    router.replace('/(auth)');
                  } catch (error) {
                    console.error('로그아웃 실패:', error);
                    Alert.alert('오류', '로그아웃 중 오류가 발생했습니다.');
                  }
                },
              },
            ]);
          }}
        >
          <View style={tw`flex-row items-center gap-2`}>
            <MaterialIcons name="logout" size={20} color="#DC2626" />
            <Text color="error" weight="medium">
              로그아웃
            </Text>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={20}
            color={tw.color('red')}
          />
        </TouchableOpacity>
      </View>
    </Card>
  );
};

export default UserProfile;
