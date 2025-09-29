import {
  fetchUserBookmarkedMessages,
  getCurrentUser,
  type ChatBookmarkedMessage,
} from '@vpp/core-logic';
import { Card, CardHeader, Text } from '@vpp/shared-ui';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import tw from '../../../utils/tailwind';

import BookmarkCard from './BookmarkCard';

const BookMark = () => {
  const [chatBookmarks, setChatBookmarks] = useState<ChatBookmarkedMessage[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [user] = useState(() => getCurrentUser());
  const primaryColor = tw.color('primary');
  const router = useRouter();

  useEffect(() => {
    if (user && user.providerId !== 'anonymous') {
      loadBookmarks();
    }
  }, [user]);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const userChatBookmarks = user
        ? await fetchUserBookmarkedMessages(user.uid, {
            sessionLimit: 20,
            perSessionLimit: 20,
          })
        : [];
      setChatBookmarks(userChatBookmarks);
    } catch (error) {
      console.error('북마크 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card bordered>
      <CardHeader>
        <View style={tw`flex-row items-center gap-2`}>
          <View
            style={tw`w-8 p-2 rounded-xl items-center justify-center bg-gray-200`}
          >
            <MaterialIcons name="bookmark" size={16} color={primaryColor} />
          </View>
          <Text variant="h6" weight="semibold" color="primary">
            북마크한 답변
          </Text>
        </View>
      </CardHeader>
      <View style={tw`max-h-80`}>
        {!user || user.providerId === 'anonymous' ? (
          <View style={tw`flex-1 items-center justify-center`}>
            <Text variant="body2" color="muted">
              로그인 후 북마크 기능을 이용하세요
            </Text>
          </View>
        ) : loading ? (
          <View style={tw`flex-1 items-center justify-center py-8`}>
            <ActivityIndicator
              size="small"
              color={tw.color('primary-500') ?? '#14287f'}
            />
            <View style={tw`mt-2`}>
              <Text variant="body2" color="muted">
                북마크를 불러오는 중...
              </Text>
            </View>
          </View>
        ) : (
          <ScrollView style={tw`max-h-72`}>
            <View style={tw`flex-col`}>
              {chatBookmarks.length > 0 ? (
                chatBookmarks.map((bm, idx) => (
                  <View
                    key={`${bm.sessionId}_${bm.id}`}
                    style={
                      idx !== chatBookmarks.length - 1 ? tw`mb-1` : undefined
                    }
                  >
                    <BookmarkCard
                      text={bm.text}
                      onPress={() => {
                        router.push({
                          pathname: '/(tabs)/index',
                          params: { openSessionId: bm.sessionId },
                        });
                      }}
                    />
                  </View>
                ))
              ) : (
                <View style={tw`flex-1 items-center justify-center py-4`}>
                  <Text variant="body2" color="muted">
                    아직 북마크한 답변이 없습니다
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </Card>
  );
};

export default BookMark;
