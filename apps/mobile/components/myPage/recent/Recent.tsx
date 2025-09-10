import { fetchUserRecentActivities, getCurrentUser, type RecentActivity } from '@vpp/core-logic';
import { Text } from '@vpp/shared-ui';
import { useEffect, useState } from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';

import tw from '../../../utils/tailwind';

import RecentCard from './RecentCard';

const Recent = () => {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [user] = useState(() => getCurrentUser());

  useEffect(() => {
    if (user && user.providerId !== 'anonymous') {
      loadRecentActivities();
    }
  }, [user]);

  const loadRecentActivities = async () => {
    setLoading(true);
    try {
      const recentActivities = await fetchUserRecentActivities();
      setActivities(recentActivities);
    } catch (error) {
      console.error('최근 활동 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.providerId === 'anonymous') {
    return (
      <>
        <Text variant="h5" weight="bold" color="primary">
          최근 활동
        </Text>
        <View style={tw`h-60 items-center justify-center`}>
          <Text variant="body2" color="muted">
            로그인 후 활동 기록을 확인하세요
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Text variant="h5" weight="bold" color="primary">
        최근 활동
      </Text>
      <ScrollView style={tw`h-60`}>
        {loading ? (
          <View style={tw`flex-1 items-center justify-center py-8`}>
            <ActivityIndicator size="small" color="#14287f" />
            <View style={tw`mt-2`}>
              <Text variant="body2" color="muted">
                활동 기록을 불러오는 중...
              </Text>
            </View>
          </View>
        ) : activities.length > 0 ? (
          <View style={tw`flex-col`}>
            {activities.map((activity, idx) => (
              <View
                key={activity.id}
                style={idx !== activities.length - 1 ? tw`mb-1` : undefined}
              >
                <RecentCard 
                  text={activity.title} 
                  time={activity.createdAt.toDate().toString()} 
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={tw`flex-1 items-center justify-center py-8`}>
            <Text variant="body2" color="muted">
              아직 활동 기록이 없습니다
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default Recent;
