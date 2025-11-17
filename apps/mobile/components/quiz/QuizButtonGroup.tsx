import AntDesign from '@expo/vector-icons/AntDesign';
import { Text } from '@vpp/shared-ui';
import { Alert, View } from 'react-native';

import { useQuiz } from '../../utils/QuizProvider';
import tw from '../../utils/tailwind';
import { useSettingsStore } from '../hooks/useSettingsStore';

import QuizActionButton from './QuizActionButton';

const QuizButtonGroup = () => {
  const primaryColor = tw.color('primary');
  const primaryColor600 = tw.color('primary-600') ?? primaryColor;
  const darkMode = useSettingsStore((s) => s.darkMode);
  const iconColor = darkMode ? primaryColor600 : primaryColor;
  const {
    step,
    nextStep,
    prevStep,
    questions,
    currentQuestion,
    answer,
    getQuizResult,
    resetQuiz,
    submitResults,
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

  const showFinalResult = async () => {
    const result = getQuizResult();
    const percentage = Math.round(
      (result.correctCount / result.totalQuestions) * 100
    );

    // Firebase에 퀴즈 결과 저장
    const saveResult = await submitResults();

    Alert.alert(
      '퀴즈 완료 🙌',
      `총 ${result.totalQuestions}문제 중 ${result.correctCount}문제 맞춤\n정답률: ${percentage}%\n점수: ${result.totalScore}점\n\n오답 ${result.wrongCount}개\n\n${saveResult.message}`,
      [{ text: '다시 풀기', onPress: () => resetQuiz() }, { text: '확인' }]
    );
  };

  const isLastQuestion = step === questions.length - 1;
  const hasAnswer = currentQuestion ? !!answer[currentQuestion.id] : false;

  return (
    <View style={tw`mt-2 flex-row justify-between`}>
      <QuizActionButton
        variant="outline"
        onPress={handlePrevStep}
        disabled={step === 0}
        rounded="full"
      >
        <View style={tw`flex-row items-center gap-1`}>
          <AntDesign name="left" size={12} color={iconColor} />
          <Text variant="body" weight="bold" color="primary">
            이전
          </Text>
        </View>
      </QuizActionButton>

      <QuizActionButton
        onPress={isLastQuestion ? handleComplete : handleNextStep}
        disabled={!hasAnswer}
        rounded="full"
        variant="secondary"
      >
        <View style={tw`flex-row items-center gap-1`}>
          <Text variant="body" weight="bold" color="white">
            {isLastQuestion ? '완료' : '다음'}
          </Text>
          {!isLastQuestion && <AntDesign name="right" size={12} color="#fff" />}
        </View>
      </QuizActionButton>
    </View>
  );
};

export default QuizButtonGroup;
