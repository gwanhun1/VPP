import {
  onAuthStateChanged,
  type AuthUser,
  fetchUserStats,
  countUserBookmarkedMessages,
} from '@vpp/core-logic';
import { Card, Text } from '@vpp/shared-ui';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import tw from '../../../utils/tailwind';

type DisplayStats = {
  learnedTerms: number;
  bookmarks: number;
  quizScore: number;
  studyDays: number;
};

const MyPageStatus = () => {
  const primaryColor = tw.color('primary-500');
  const subColor = tw.color('secondary-500');
  const redColor = tw.color('red-500');
  const greenColor = tw.color('green-500');

  const [user, setUser] = useState<AuthUser | null>(null);
  const [stats, setStats] = useState<DisplayStats>({
    learnedTerms: 0,
    bookmarks: 0,
    quizScore: 0,
    studyDays: 0,
  });

  useEffect(() => {
    let isMounted = true;

    const loadUserData = async (uid: string) => {
      try {
        const [userStats, bookmarkCount] = await Promise.all([
          fetchUserStats(),
          countUserBookmarkedMessages(uid),
        ]);
        if (isMounted) {
          setStats({
            learnedTerms: userStats?.learnedTerms ?? 0,
            bookmarks: bookmarkCount,
            quizScore: userStats?.quizScore ?? 0,
            studyDays: userStats?.studyDays ?? 0,
          });
        }
      } catch (error) {
        console.error('[MyPageStatus] 통계 로드 실패:', error);
      }
    };

    const unsubscribe = onAuthStateChanged((authUser: AuthUser | null) => {
      if (!isMounted) return;
      setUser(authUser);

      if (authUser && authUser.providerId !== 'anonymous') {
        void loadUserData(authUser.uid);
      } else {
        setStats({
          learnedTerms: 0,
          bookmarks: 0,
          quizScore: 0,
          studyDays: 0,
        });
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // 익명 사용자의 경우 기본 통계 표시
  if (!user || user.providerId === 'anonymous') {
    return (
      <View style={tw`flex-row items-center gap-2`}>
        <View style={tw`flex-1`}>
          <Card bordered backgroundColor={tw.color('gray-100')}>
            <View style={tw`flex-col justify-center items-center gap-2 py-2`}>
              <Text variant="h4" color="muted">
                로그인
              </Text>
              <Text variant="body2" weight="medium" color="muted">
                로그인 후 이용
              </Text>
            </View>
          </Card>
        </View>
      </View>
    );
  }

  return (
    <View style={tw`gap-1 flex-row`}>
      {/* 첫 번째 줄: 학습 통계 */}
      <View style={tw`flex-1`}>
        <Card bordered backgroundColor={subColor}>
          <View style={tw`flex-col justify-center items-center gap-2`}>
            <Text variant="h5" weight="bold" color="white">
              {stats.learnedTerms}
            </Text>
            <Text variant="caption" color="white" weight="bold">
              학습한 챕터
            </Text>
          </View>
        </Card>
      </View>

      <View style={tw`flex-1`}>
        <Card bordered backgroundColor={primaryColor}>
          <View style={tw`flex-col justify-center items-center gap-2`}>
            <Text variant="h5" weight="bold" color="white">
              {stats.bookmarks}
            </Text>
            <Text variant="caption" color="white" weight="bold">
              북마크
            </Text>
          </View>
        </Card>
      </View>
      <View style={tw`flex-1`}>
        <Card bordered backgroundColor={greenColor}>
          <View style={tw`flex-col justify-center items-center gap-2`}>
            <Text variant="h5" weight="bold" color="white">
              {stats.quizScore}{' '}
              <Text variant="body2" color="white" weight="bold">
                %
              </Text>
            </Text>
            <Text variant="caption" color="white" weight="bold">
              퀴즈 정답률
            </Text>
          </View>
        </Card>
      </View>

      <View style={tw`flex-1`}>
        <Card bordered backgroundColor={redColor}>
          <View style={tw`flex-col justify-center items-center gap-2`}>
            <Text variant="h5" weight="bold" color="white">
              {stats.studyDays}
            </Text>
            <Text variant="caption" color="white" weight="bold">
              연속 학습일
            </Text>
          </View>
        </Card>
      </View>
    </View>
  );
};

export default MyPageStatus;
