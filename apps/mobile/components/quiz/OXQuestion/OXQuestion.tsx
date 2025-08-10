import { View } from 'react-native';

import tw from '../../../utils/tailwind';

import OXButton from './OXButton';

type OXQuestionProps = {
  quiz: {
    id: number;
    type: string;
    question: string;
    options?: string[];
    correctAnswer?: string;
    description?: string;
  };
};

const OXQuestion = ({ quiz }: OXQuestionProps) => {
  return (
    <View style={tw`flex-col gap-2`}>
      <View style={tw`flex-row justify-center items-center gap-2`}>
        {quiz?.options?.map((option, index) => (
          <OXButton
            key={index}
            option={option}
            questionId={quiz.id}
            number={index + 1}
          />
        ))}
      </View>
    </View>
  );
};

export default OXQuestion;
