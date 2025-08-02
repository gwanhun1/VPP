import { Text } from '@vpp/shared-ui';

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
    <Text variant="h4" weight="bold" color="primary">
      {quiz?.question}
    </Text>
  );
};

export default QuestionBox;
