import {
  fetchUserQuizHistory,
  getCurrentUser,
  type QuizResult,
} from '@vpp/core-logic';
import { Card, CardHeader, Text } from '@vpp/shared-ui';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

import tw from '../../../utils/tailwind';

import QuizResponse from './QuizResponse';

const MyQuizPage = () => {
  const primaryColor = tw.color('primary');
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [user] = useState(() => getCurrentUser());

  useEffect(() => {
    if (user && user.providerId !== 'anonymous') {
      loadQuizHistory();
    }
  }, [user]);

  const loadQuizHistory = async () => {
    setLoading(true);
    try {
      const history = await fetchUserQuizHistory();
      setQuizHistory(history);
    } catch (error) {
      console.error('퀴즈 기록 로드 실패:', error);
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
            <MaterialIcons name="emoji-events" size={16} color={primaryColor} />
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
