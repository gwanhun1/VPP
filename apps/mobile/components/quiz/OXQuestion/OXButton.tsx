import { Card, Text } from '@vpp/shared-ui';
import { TouchableOpacity, View } from 'react-native';

import { useQuiz } from '../../../utils/QuizProvider';
import tw from '../../../utils/tailwind';

type OXButtonProps = {
  option?: string;
  questionId: number;
  number: number;
};

const OXButton = ({ option, questionId, number }: OXButtonProps) => {
  const { answer, setAnswer, getAnswerState } = useQuiz();

  const isSelected = answer[questionId] === option;
  const answerState = getAnswerState(questionId);

  const getCardVariant = () => {
    if (!isSelected) return 'default';
    if (answerState === 'correct') return 'primary';
    if (answerState === 'incorrect') return 'error';
    return 'primary';
  };

  return (
    <TouchableOpacity
      style={tw`flex-1`}
      onPress={() => setAnswer(questionId, option || '')}
    >
      <Card bordered variant={getCardVariant()}>
        <View style={tw`justify-center items-center h-30`}>
          <Text variant="h6" weight="bold" color={'primary'}>
            {option} {option === 'O' ? '(맞다)' : '(틀렸다)'}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default OXButton;
