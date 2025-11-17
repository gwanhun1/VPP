import AntDesign from '@expo/vector-icons/AntDesign';
import { Button, Card, Text } from '@vpp/shared-ui';
import { Alert, Modal, View } from 'react-native';
import { useState } from 'react';

import { useQuiz, type QuizResult } from '../../utils/QuizProvider';
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
  const [showResultModal, setShowResultModal] = useState(false);
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);
  const [lastSaveMessage, setLastSaveMessage] = useState<string | undefined>();

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

    setLastResult(result);
    setLastSaveMessage(saveResult.message);
    setShowResultModal(true);

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

      <Modal
        visible={showResultModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResultModal(false)}
      >
        <View style={tw`flex-1 items-center justify-center bg-black/40 px-4`}>
          <Card bordered>
            <View style={tw`p-4 gap-3`}>
              <Text variant="h5" weight="bold" color="primary">
                퀴즈 결과
              </Text>
              {lastResult ? (
                <View style={tw`gap-1`}>
                  <Text variant="body2" color="primary">
                    총 문제 수: {lastResult.totalQuestions}
                  </Text>
                  <Text variant="body2" color="primary">
                    정답 수: {lastResult.correctCount}
                  </Text>
                  <Text variant="body2" color="primary">
                    오답 수: {lastResult.wrongCount}
                  </Text>
                  <Text variant="body2" color="primary">
                    정답률:{' '}
                    {Math.round(
                      (lastResult.correctCount /
                        (lastResult.totalQuestions || 1)) *
                        100
                    )}
                    %
                  </Text>
                  <Text variant="body2" color="primary">
                    점수: {lastResult.totalScore}점
                  </Text>
                </View>
              ) : null}
              {lastSaveMessage ? (
                <Text variant="caption" color="muted">
                  {lastSaveMessage}
                </Text>
              ) : null}
              <View style={tw`flex-row justify-end gap-2 mt-2`}>
                <Button
                  variant="outline"
                  onPress={() => {
                    setShowResultModal(false);
                    resetQuiz();
                  }}
                >
                  다시 풀기
                </Button>
                <Button onPress={() => setShowResultModal(false)}>닫기</Button>
              </View>
            </View>
          </Card>
        </View>
      </Modal>
    </View>
  );
};

export default QuizButtonGroup;
