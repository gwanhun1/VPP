import { fetchUserChatHistory, getCurrentUser, type ChatHistory } from '@vpp/core-logic';
import { Text } from '@vpp/shared-ui';
import { useEffect, useState } from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';

import tw from '../../../utils/tailwind';

import ChattingLogCard from './ChattingLogCard';

const ChattingLog = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [user] = useState(() => getCurrentUser());

  useEffect(() => {
    if (user && user.providerId !== 'anonymous') {
      loadChatHistory();
    }
  }, [user]);

  const loadChatHistory = async () => {
    setLoading(true);
    try {
      const history = await fetchUserChatHistory();
      setChatHistory(history);
    } catch (error) {
      console.error('채팅 기록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.providerId === 'anonymous') {
    return (
      <>
        <Text variant="h5" weight="bold" color="primary">
          AI 채팅 기록
        </Text>
        <View style={tw`h-60 items-center justify-center`}>
          <Text variant="body2" color="muted">
            로그인 후 채팅 기록을 확인하세요
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Text variant="h5" weight="bold" color="primary">
        AI 채팅 기록
      </Text>
      <ScrollView style={tw`h-60`}>
        {loading ? (
          <View style={tw`flex-1 items-center justify-center py-8`}>
            <ActivityIndicator size="small" color="#14287f" />
            <View style={tw`mt-2`}>
              <Text variant="body2" color="muted">
                채팅 기록을 불러오는 중...
              </Text>
            </View>
          </View>
        ) : chatHistory.length > 0 ? (
          <View style={tw`flex-col`}>
            {chatHistory.map((chat, idx) => (
              <View
                key={chat.id}
                style={idx !== chatHistory.length - 1 ? tw`mb-1` : undefined}
              >
                <ChattingLogCard 
                  text={chat.title} 
                  time={chat.updatedAt.toDate().toString()} 
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={tw`flex-1 items-center justify-center py-8`}>
            <Text variant="body2" color="muted">
              아직 AI 채팅 기록이 없습니다
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default ChattingLog;
