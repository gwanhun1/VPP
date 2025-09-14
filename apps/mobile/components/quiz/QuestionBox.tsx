import { Text } from '@vpp/shared-ui';
import tw from '../../utils/tailwind';
import { View } from 'react-native';

type QuestionBoxProps = {
  quiz: {
    id: number;
    type: string;
    question: string;
    options?: string[];
    correctAnswer?: string;
    description?: string;
  };
};

const QuestionBox = ({ quiz }: QuestionBoxProps) => {
  return (
    <View style={tw`flex-col mb-6`}>
      <Text variant="h4" weight="bold" color="primary">
        {quiz?.question}
      </Text>
    </View>
  );
};

export default QuestionBox;
