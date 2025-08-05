import AntDesign from '@expo/vector-icons/AntDesign';
import { Button, Text } from '@vpp/shared-ui';
import { Alert, View } from 'react-native';

import { useQuiz } from '../../utils/QuizProvider';
import tw from '../../utils/tailwind';

const QuizButtonGroup = () => {
  const primaryColor = tw.color('primary');
  const {
    step,
    nextStep,
    prevStep,
    questions,
    currentQuestion,
    answer,
    getQuizResult,
  } = useQuiz();

  const handleNextStep = () => {
    if (!hasAnswer) {
      Alert.alert('알림', '답안을 선택해주세요.');
      return;
    }
    nextStep();
  };

  const handlePrevStep = () => {
    prevStep();
  };

  const handleComplete = () => {
    if (!hasAnswer) {
      Alert.alert('알림', '답안을 선택해주세요.');
      return;
    }
    showFinalResult();
  };

  const showFinalResult = () => {
    const result = getQuizResult();
    const percentage = Math.round(
      (result.correctCount / result.totalQuestions) * 100
    );

    Alert.alert(
      '퀴즈 완료 🙌',

      `총 ${result.totalQuestions}문제 중 ${result.correctCount}문제 맞춤\n정답률: ${percentage}%\n점수: ${result.totalScore}점\n\n오답 ${result.wrongCount}개`,
      [
        { text: '다시 풀기', onPress: () => window.location.reload() },
        { text: '확인' },
      ]
    );
  };

  const isLastQuestion = step === questions.length - 1;
  const hasAnswer = currentQuestion ? !!answer[currentQuestion.id] : false;

  return (
    <View style={tw`mt-2 flex-row justify-between`}>
      <Button
        variant="outline"
        onClick={handlePrevStep}
        disabled={step === 0}
        rounded="full"
        size="lg"
      >
        <View style={tw`flex-row items-center gap-1`}>
          <AntDesign name="left" size={12} color={primaryColor} />
          <Text variant="body" weight="bold" color="primary">
            이전
          </Text>
        </View>
      </Button>

      <Button
        onClick={isLastQuestion ? handleComplete : handleNextStep}
        disabled={!hasAnswer}
        rounded="full"
        variant="secondary"
        size="lg"
      >
        <View style={tw`flex-row items-center gap-1`}>
          <Text variant="body" weight="bold" color="white">
            {isLastQuestion ? '완료' : '다음'}
          </Text>
          {!isLastQuestion && <AntDesign name="right" size={12} color="#fff" />}
        </View>
      </Button>
    </View>
  );
};

export default QuizButtonGroup;
