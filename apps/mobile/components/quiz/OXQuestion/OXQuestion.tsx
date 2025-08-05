import { ScrollView, View } from 'react-native';

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
    <ScrollView>
      <View style={tw`flex-col gap-2`}>
        <View
          style={tw`flex-row items-center gap-2 justify-center items-center`}
        >
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
    </ScrollView>
  );
};

export default OXQuestion;
