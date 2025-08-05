import { Button } from '@vpp/shared-ui';
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

  const handleTextChange = (text: string) => {
    setAnswer(quiz.id, text);
    setIsCorrect(false);
  };

  const handleCheckAnswer = () => {
    setIsCorrect(true);
  };

  return (
    <View style={tw`flex-col gap-2`}>
      <View style={tw`flex-col gap-2`}>
        <TextInput
          style={tw`border ${
            isCorrect ? 'border-red-500' : 'border-gray-300'
          } rounded-md px-4 py-2 text-base h-12`}
          placeholder="정답을 입력하세요"
          value={answer[quiz.id]?.toString() || ''}
          onChangeText={handleTextChange}
          returnKeyType="done"
        />
        <Button onClick={handleCheckAnswer} disabled={isCorrect}>
          정답 확인
        </Button>
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
