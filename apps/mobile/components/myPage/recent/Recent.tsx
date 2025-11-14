import {
  fetchUserRecentActivities,
  onAuthStateChanged,
  type AuthUser,
} from '@vpp/core-logic';
import { Card, CardHeader, Text } from '@vpp/shared-ui';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';

import tw from '../../../utils/tailwind';
import { useSettingsStore } from '../../hooks/useSettingsStore';

import RecentCard from './RecentCard';

const Recent = () => {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const primaryColor = tw.color('primary');
  const darkMode = useSettingsStore((s) => s.darkMode);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged((authUser) => {
      if (!mounted) return;
      setUser(authUser);

      if (authUser && authUser.providerId !== 'anonymous') {
        void loadRecentActivities();
      } else {
        setActivities([]);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

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
            <MaterialIcons name="history" size={16} color={primaryColor} />
          </View>
          <Text variant="h6" weight="semibold" color="primary">
            최근 활동
          </Text>
        </View>
      </CardHeader>
      {!user || user.providerId === 'anonymous' ? (
        <View style={tw`py-8 items-center`}>
          <Text variant="body2" color="muted">
            로그인 후 활동 기록을 확인하세요
          </Text>
        </View>
      ) : loading ? (
        <View style={tw`py-8 items-center`}>
          <ActivityIndicator
            size="small"
            color={tw.color('primary-500') ?? '#14287f'}
          />
          <View style={tw`mt-2`}>
            <Text variant="body2" color="muted">
              활동 기록을 불러오는 중...
            </Text>
          </View>
        </View>
      ) : activities.length > 0 ? (
        <ScrollView style={tw`max-h-60`}>
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
        </ScrollView>
      ) : (
        <View style={tw`py-8 items-center`}>
          <Text variant="body2" color="muted">
            아직 활동 기록이 없습니다
          </Text>
        </View>
      )}
    </Card>
  );
};

export default Recent;
