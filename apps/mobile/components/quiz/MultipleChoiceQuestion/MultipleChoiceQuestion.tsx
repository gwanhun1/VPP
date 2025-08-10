import { View } from 'react-native';

import tw from '../../../utils/tailwind';

import MultipleChoiceCard from './MultipleChoiceCard';

type MultipleChoiceQuestionProps = {
  quiz: {
    id: number;
    type: string;
    question: string;
    options?: string[];
    correctAnswer?: string;
    description?: string;
  };
};

const MultipleChoiceQuestion = ({ quiz }: MultipleChoiceQuestionProps) => {
  return (
    <View style={tw`flex-col gap-2`}>
      {quiz?.options?.map((option, index) => (
        <MultipleChoiceCard
          key={index}
          number={index + 1}
          option={option}
          questionId={quiz.id}
        />
      ))}
    </View>
  );
};

export default MultipleChoiceQuestion;
