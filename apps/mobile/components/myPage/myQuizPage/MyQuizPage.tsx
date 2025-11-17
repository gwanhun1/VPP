import { Card, CardHeader, Text } from '@vpp/shared-ui';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { View, ActivityIndicator } from 'react-native';

import tw from '../../../utils/tailwind';
import { useSettingsStore } from '../../hooks/useSettingsStore';
import { useMyPageStore } from '../../hooks/useMyPageStore';

import QuizResponse from './QuizResponse';

const MyQuizPage = () => {
  const primaryColor = tw.color('primary');
  const primaryColor600 = tw.color('primary-600') ?? primaryColor;
  const quizHistory = useMyPageStore((s) => s.quizHistory);
  const loading = useMyPageStore((s) => s.quizHistoryLoading);
  const darkMode = useSettingsStore((s) => s.darkMode);
  const iconColor = darkMode ? primaryColor600 : primaryColor;

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
            <MaterialIcons name="emoji-events" size={16} color={iconColor} />
          </View>
          <Text variant="h6" weight="semibold" color="primary">
            퀴즈 성과
          </Text>
        </View>
      </CardHeader>
      {loading ? (
        <View style={tw`py-4 items-center`}>
          <ActivityIndicator size="small" color="#14287f" />
        </View>
      ) : (
        <QuizResponse quizHistory={quizHistory} />
      )}
    </Card>
  );
};

export default MyQuizPage;
