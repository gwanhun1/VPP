import { Badge, Text } from '@vpp/shared-ui';

import { useQuiz } from '../../utils/QuizProvider';

const PointBox = () => {
  const { getQuizResult } = useQuiz();

  return (
    <Badge variant="secondary" rounded="full" size="lg">
      <Text variant="body2" weight="bold" color="secondary">
        현재 점수 {getQuizResult().totalScore}
      </Text>
    </Badge>
  );
};

export default PointBox;
