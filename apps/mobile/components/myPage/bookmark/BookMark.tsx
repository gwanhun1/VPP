import { fetchUserBookmarks, getCurrentUser, type Bookmark } from '@vpp/core-logic';
import { Text } from '@vpp/shared-ui';
import { useEffect, useState } from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';

import tw from '../../../utils/tailwind';

import BookmarkCard from './BookmarkCard';

const BookMark = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [user] = useState(() => getCurrentUser());

  useEffect(() => {
    if (user && user.providerId !== 'anonymous') {
      loadBookmarks();
    }
  }, [user]);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const userBookmarks = await fetchUserBookmarks();
      setBookmarks(userBookmarks);
    } catch (error) {
      console.error('북마크 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.providerId === 'anonymous') {
    return (
      <>
        <Text variant="h5" weight="bold" color="primary">
          북마크한 용어
        </Text>
        <View style={tw`h-60 items-center justify-center`}>
          <Text variant="body2" color="muted">
            로그인 후 북마크 기능을 이용하세요
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Text variant="h5" weight="bold" color="primary">
        북마크한 용어
      </Text>
      <ScrollView style={tw`h-60`}>
        {loading ? (
          <View style={tw`flex-1 items-center justify-center py-8`}>
            <ActivityIndicator size="small" color="#14287f" />
            <View style={tw`mt-2`}>
              <Text variant="body2" color="muted">
                북마크를 불러오는 중...
              </Text>
            </View>
          </View>
        ) : bookmarks.length > 0 ? (
          <View style={tw`flex-col`}>
            {bookmarks.map((bookmark, idx) => (
              <View
                key={bookmark.id}
                style={idx !== bookmarks.length - 1 ? tw`mb-1` : undefined}
              >
                <BookmarkCard text={bookmark.termName} />
              </View>
            ))}
          </View>
        ) : (
          <View style={tw`flex-1 items-center justify-center py-8`}>
            <Text variant="body2" color="muted">
              아직 북마크한 용어가 없습니다
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default BookMark;
