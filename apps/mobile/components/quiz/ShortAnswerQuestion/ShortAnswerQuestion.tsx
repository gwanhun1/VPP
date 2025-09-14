import { Button, Text } from '@vpp/shared-ui';
import { useState } from 'react';
import { View, TextInput } from 'react-native';

import { useQuiz } from '../../../utils/QuizProvider';
import tw from '../../../utils/tailwind';
import Description from '../Description';

type ShortAnswerQuestionProps = {
  quiz: {
    id: number;
    type: string;
    question: string;
    options?: string[];
    correctAnswer?: string;
    description?: string;
  };
};

const ShortAnswerQuestion = ({ quiz }: ShortAnswerQuestionProps) => {
  const { answer, setAnswer, currentQuestion, getAnswerState, checkAnswer } =
    useQuiz();

  const [isCorrect, setIsCorrect] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleTextChange = (text: string) => {
    setAnswer(quiz.id, text);
    setIsCorrect(false);
  };

  const handleCheckAnswer = () => {
    checkAnswer(quiz.id);
    setIsCorrect(true);
  };

  return (
    <View style={tw`flex-col gap-3`}>
      <View style={tw`flex-col gap-2`}>
        <Text variant="body2" weight="bold" color="primary">
          정답
        </Text>
        <TextInput
          style={tw`rounded-md px-4 h-12 text-base bg-white border ${
            getAnswerState(quiz.id) === 'incorrect'
              ? 'border-red-500'
              : focused
              ? 'border-primary'
              : 'border-gray-300'
          }`}
          placeholder="정답을 입력하세요"
          placeholderTextColor={tw.color('gray-400') || '#9ca3af'}
          value={answer[quiz.id]?.toString() || ''}
          onChangeText={handleTextChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          returnKeyType="done"
          onSubmitEditing={handleCheckAnswer}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={tw`flex-row justify-end`}>
          <Button onPress={handleCheckAnswer} disabled={isCorrect}>
            정답 확인
          </Button>
        </View>
        {!isCorrect && (
          <Text variant="caption" color="gray">
            정답을 입력한 뒤 확인을 눌러주세요.
          </Text>
        )}
      </View>

      {/* 오답 시 설명 표시 */}
      {isCorrect &&
        currentQuestion &&
        getAnswerState(currentQuestion.id) === 'incorrect' && (
          <Description
            description={checkAnswer(currentQuestion.id)?.description}
          />
        )}
    </View>
  );
};

export default ShortAnswerQuestion;
