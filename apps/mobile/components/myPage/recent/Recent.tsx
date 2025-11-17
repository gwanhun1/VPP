import { Card, CardHeader, Text } from '@vpp/shared-ui';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useMemo } from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';

import tw from '../../../utils/tailwind';
import { useSettingsStore } from '../../hooks/useSettingsStore';
import { useMyPageStore } from '../../hooks/useMyPageStore';

import RecentCard from './RecentCard';

const Recent = () => {
  const user = useMyPageStore((s) => s.user);
  const activities = useMyPageStore((s) => s.recentActivities);
  const loading = useMyPageStore((s) => s.recentLoading);
  const primaryColor = tw.color('primary');
  const primaryColor600 = tw.color('primary-600') ?? primaryColor;
  const darkMode = useSettingsStore((s) => s.darkMode);
  const iconColor = darkMode ? primaryColor600 : primaryColor;
  const hasActivities = useMemo(() => activities.length > 0, [activities]);

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
            <MaterialIcons name="history" size={16} color={iconColor} />
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
            color={tw.color('primary-600') ?? '#14287f'}
          />
          <View style={tw`mt-2`}>
            <Text variant="body2" color="muted">
              활동 기록을 불러오는 중...
            </Text>
          </View>
        </View>
      ) : hasActivities ? (
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
