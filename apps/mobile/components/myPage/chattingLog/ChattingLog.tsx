import { Card, CardHeader, Text } from '@vpp/shared-ui';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCallback } from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import tw from '../../../utils/tailwind';
import { useSettingsStore } from '../../hooks/useSettingsStore';
import { useMyPageStore } from '../../hooks/useMyPageStore';

import ChattingLogCard from './ChattingLogCard';

const ChattingLog = () => {
  const user = useMyPageStore((s) => s.user);
  const chatHistory = useMyPageStore((s) => s.chatHistory);
  const loading = useMyPageStore((s) => s.chatHistoryLoading);
  const primaryColor = tw.color('primary');
  const primaryColor600 = tw.color('primary-600') ?? primaryColor;
  const router = useRouter();
  const darkMode = useSettingsStore((s) => s.darkMode);
  const iconColor = darkMode ? primaryColor600 : primaryColor;

  const handleOpenSession = useCallback(
    (sessionId: string) => {
      router.push(`/(tabs)?openSessionId=${encodeURIComponent(sessionId)}`);
    },
    [router]
  );

  return (
    <Card bordered>
      <CardHeader>
        <View style={tw`flex-row items-center gap-2`}>
          <View
            style={[
              tw`w-8 p-2 rounded-xl items-center justify-center`,
              {
                backgroundColor: darkMode
                  ? '#1f2937'
                  : tw.color('gray-200') || '#e5e7eb',
              },
            ]}
          >
            <MaterialIcons name="chat" size={16} color={iconColor} />
          </View>
          <Text variant="h6" weight="semibold" color="primary">
            AI 채팅 기록
          </Text>
        </View>
      </CardHeader>
      {!user || user.providerId === 'anonymous' ? (
        <View style={tw`py-8 items-center`}>
          <Text variant="body2" color="muted">
            로그인 후 채팅 기록을 확인하세요
          </Text>
        </View>
      ) : loading ? (
        <View style={tw`py-8 items-center`}>
          <ActivityIndicator
            size="small"
            color={tw.color('primary-600') ?? '#14287f'}
          />
          <View style={tw`mt-2`}>
            <Text variant="body2" color="muted">
              채팅 기록을 불러오는 중...
            </Text>
          </View>
        </View>
      ) : chatHistory.length > 0 ? (
        <ScrollView style={tw`max-h-60`}>
          <View style={tw`flex-col`}>
            {chatHistory.map((chat, idx) => (
              <View
                key={chat.id}
                style={idx !== chatHistory.length - 1 ? tw`mb-1` : undefined}
              >
                <ChattingLogCard
                  text={chat.title ?? '제목 없음'}
                  time={chat.updatedAt.toDate().toString()}
                  onPress={() => handleOpenSession(chat.id)}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={tw`py-8 items-center`}>
          <Text variant="body2" color="muted">
            아직 AI 채팅 기록이 없습니다
          </Text>
        </View>
      )}
    </Card>
  );
};
export default ChattingLog;
