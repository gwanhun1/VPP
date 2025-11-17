import { Card, CardHeader, Text } from '@vpp/shared-ui';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useMemo } from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import tw from '../../../utils/tailwind';
import { useSettingsStore } from '../../hooks/useSettingsStore';
import { useMyPageStore } from '../../hooks/useMyPageStore';

import BookmarkCard from './BookmarkCard';

const BookMark = () => {
  const user = useMyPageStore((s) => s.user);
  const chatBookmarks = useMyPageStore((s) => s.bookmarks);
  const loading = useMyPageStore((s) => s.bookmarksLoading);
  const primaryColor = tw.color('primary');
  const primaryColor600 = tw.color('primary-600') ?? primaryColor;
  const router = useRouter();
  const darkMode = useSettingsStore((s) => s.darkMode);
  const iconColor = darkMode ? primaryColor600 : primaryColor;

  const hasBookmarks = useMemo(() => chatBookmarks.length > 0, [chatBookmarks]);

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
            <MaterialIcons name="bookmark" size={16} color={iconColor} />
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
              color={tw.color('primary-600') ?? '#14287f'}
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
              {hasBookmarks ? (
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
                        router.push(
                          `/(tabs)?openSessionId=${encodeURIComponent(
                            bm.sessionId
                          )}&openMessageId=${encodeURIComponent(bm.id)}`
                        );
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
