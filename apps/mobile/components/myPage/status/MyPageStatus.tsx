import { onAuthStateChanged, type AuthUser, fetchUserStats } from '@vpp/core-logic';
import { Card, Text } from '@vpp/shared-ui';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import tw from '../../../utils/tailwind';

interface DisplayStats {
  learnedTerms: number;
  bookmarks: number;
  quizScore: number;
  studyDays: number;
}

const MyPageStatus = () => {
  const primaryColor = tw.color('primary');
  const subColor = tw.color('secondary');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [stats, setStats] = useState<DisplayStats>({
    learnedTerms: 0,
    bookmarks: 0,
    quizScore: 0,
    studyDays: 0,
  });

  useEffect(() => {
    // Auth 상태 변경 리스너 등록
    const unsubscribe = onAuthStateChanged((authUser: AuthUser | null) => {
      setUser(authUser);
      
      if (authUser && authUser.providerId !== 'anonymous') {
        // 사용자 통계 로드
        const loadUserData = async () => {
          try {
            const userStats = await fetchUserStats();
            if (userStats) {
              setStats({
                learnedTerms: userStats.learnedTerms,
                bookmarks: userStats.bookmarks,
                quizScore: userStats.quizScore,
                studyDays: userStats.studyDays,
              });
            }
          } catch (error) {
            console.error('사용자 데이터 로드 실패:', error);
            // 실패 시 기본값 유지
          }
        };
        
        loadUserData();
      } else {
        // 로그아웃 시 통계 초기화
        setStats({
          learnedTerms: 0,
          bookmarks: 0,
          quizScore: 0,
          studyDays: 0,
        });
      }
    });
    
    return unsubscribe;
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
    <View style={tw`gap-3`}>
      {/* 첫 번째 줄: 학습 통계 */}
      <View style={tw`flex-row items-center gap-2`}>
        <View style={tw`flex-1`}>
          <Card bordered backgroundColor={subColor}>
            <View style={tw`flex-col justify-center items-center gap-2`}>
              <Text variant="h3" weight="bold" color="white">
                {stats.learnedTerms}
              </Text>
              <Text variant="h6" weight="semibold" color="white">
                학습한 용어
              </Text>
            </View>
          </Card>
        </View>

        <View style={tw`flex-1`}>
          <Card bordered backgroundColor={primaryColor}>
            <View style={tw`flex-col justify-center items-center gap-2`}>
              <Text variant="h3" weight="bold" color="white">
                {stats.bookmarks}
              </Text>
              <Text variant="h6" weight="semibold" color="white">
                북마크
              </Text>
            </View>
          </Card>
        </View>
      </View>

      {/* 두 번째 줄: 퀴즈 성과 */}
      <View style={tw`flex-row items-center gap-2`}>
        <View style={tw`flex-1`}>
          <Card bordered backgroundColor="#10B981">
            <View style={tw`flex-col justify-center items-center gap-2`}>
              <Text variant="h3" weight="bold" color="white">
                {stats.quizScore}%
              </Text>
              <Text variant="h6" weight="semibold" color="white">
                퀴즈 정답률
              </Text>
            </View>
          </Card>
        </View>

        <View style={tw`flex-1`}>
          <Card bordered backgroundColor="#F59E0B">
            <View style={tw`flex-col justify-center items-center gap-2`}>
              <Text variant="h3" weight="bold" color="white">
                {stats.studyDays}
              </Text>
              <Text variant="h6" weight="semibold" color="white">
                연속 학습일
              </Text>
            </View>
          </Card>
        </View>
      </View>
    </View>
  );
};

export default MyPageStatus;
