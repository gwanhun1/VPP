import { type QuizResult } from '@vpp/core-logic';
import { Text } from '@vpp/shared-ui';
import { View } from 'react-native';

import tw from '../../../utils/tailwind';

type QuizResponseProps = {
  quizHistory: QuizResult[];
};

const QuizResponse = ({ quizHistory }: QuizResponseProps) => {
  const totalQuizzes = quizHistory.length;
  const totalQuestions = quizHistory.reduce(
    (sum, quiz) => sum + quiz.totalQuestions,
    0
  );
  const totalCorrect = quizHistory.reduce(
    (sum, quiz) => sum + quiz.correctAnswers,
    0
  );
  const averageScore =
    totalQuizzes > 0
      ? Math.round(
          quizHistory.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes
        )
      : 0;

  return (
    <View style={tw`flex-col gap-2 p-2`}>
      <View style={tw`flex-row justify-between items-center gap-2`}>
        <Text variant="body" color="primary">
          총 풀어본 문제
        </Text>
        <Text variant="h6" weight="bold" color="primary">
          {totalQuestions} 문제
        </Text>
      </View>
      <View style={tw`flex-row justify-between items-center gap-2`}>
        <Text variant="body" color="primary">
          정답 수
        </Text>
        <Text variant="h6" weight="bold" color="secondary">
          {totalCorrect} 문제
        </Text>
      </View>
      <View style={tw`flex-row justify-between items-center gap-2`}>
        <Text variant="body" color="primary">
          평균 점수
        </Text>
        <Text variant="h6" weight="bold" color="primary">
          {averageScore} 점
        </Text>
      </View>
      {totalQuizzes > 0 && (
        <View style={tw`flex-row justify-between items-center gap-2`}>
          <Text variant="body" color="primary">
            참여한 퀴즈
          </Text>
          <Text variant="h6" weight="bold" color="muted">
            {totalQuizzes} 회
          </Text>
        </View>
      )}
    </View>
  );
};

export default QuizResponse;
