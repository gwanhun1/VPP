import { ScrollView, View, TextInput } from 'react-native';

import { useQuiz } from '../../../utils/QuizProvider';
import tw from '../../../utils/tailwind';

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
  const { answer, setAnswer } = useQuiz();

  const handleTextChange = (text: string) => {
    setAnswer(quiz.id, text);
  };

  return (
    <ScrollView>
      <View style={tw`flex-col gap-2`}>
        <TextInput
          style={tw`border border-gray-300 rounded-md px-4 py-2 text-base`}
          placeholder="정답을 입력하세요"
          value={answer[quiz.id]?.toString() || ''}
          onChangeText={handleTextChange}
          returnKeyType="done"
        />
      </View>
    </ScrollView>
  );
};

export default ShortAnswerQuestion;
