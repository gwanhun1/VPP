import { Badge, Card, Text } from '@vpp/shared-ui';
import { TouchableOpacity, View } from 'react-native';

import { useQuiz } from '../../../utils/QuizProvider';
import tw from '../../../utils/tailwind';

type MultipleChoiceCardProps = {
  number: number;
  option: string;
  questionId: number;
};

const SelectAlphabet = (number: number) => {
  switch (number) {
    case 1:
      return 'A';
    case 2:
      return 'B';
    case 3:
      return 'C';
    case 4:
      return 'D';
    default:
      return '';
  }
};

const MultipleChoiceCard = ({
  number,
  option,
  questionId,
}: MultipleChoiceCardProps) => {
  const { answer, setAnswer, getAnswerState } = useQuiz();

  const isSelected = answer[questionId] === option;
  const answerState = getAnswerState(questionId);

  // 카드 variant 결정
  const getCardVariant = () => {
    if (!isSelected) return 'default';
    if (answerState === 'correct') return 'primary'; // 정답은 primary
    if (answerState === 'incorrect') return 'error'; // 오답은 error
    return 'primary';
  };

  return (
    <TouchableOpacity onPress={() => setAnswer(questionId, option)}>
      <Card bordered variant={getCardVariant()}>
        <View style={tw`flex-row items-center gap-2`}>
          <Badge variant="primary" rounded="full" size="sm">
            <Text weight="bold">{SelectAlphabet(number)}</Text>
          </Badge>
          <Text variant="body" color="primary">
            {option}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default MultipleChoiceCard;
