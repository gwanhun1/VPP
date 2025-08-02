import { Button, Text } from '@vpp/shared-ui';
import { View } from 'react-native';

import { useQuiz } from '../../utils/QuizProvider';
import tw from '../../utils/tailwind';

const QuizButtonGroup = () => {
  const { step, setStep, question } = useQuiz();

  const handleNextStep = () => {
    if (step === question?.length - 1) {
      return;
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step === 0) {
      return;
    }
    setStep(step - 1);
  };

  const handleComplete = () => {
    console.log('complete');
  };

  return (
    <View style={tw`mt-2 flex-row justify-between`}>
      <Button
        variant="outline"
        onClick={handlePrevStep}
        disabled={step === 0}
        rounded="full"
      >
        <Text variant="body2" weight="bold" color="primary">
          이전
        </Text>
      </Button>
      <Button
        onClick={
          question?.length - 1 === step ? handleComplete : handleNextStep
        }
      >
        <Text variant="body2" weight="bold" color="white">
          {question?.length - 1 === step ? '완료' : '다음'}
        </Text>
      </Button>
    </View>
  );
};

export default QuizButtonGroup;
