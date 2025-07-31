import { Text } from '@vpp/shared-ui';
import { View } from 'react-native';

import tw from '../../../utils/tailwind';

const QuizResponse = () => {
  return (
    <View style={tw`flex-col gap-2 p-2`}>
      <View style={tw`flex-row justify-between items-center gap-2`}>
        <Text variant="body" color="primary">
          총 문제수
        </Text>
        <Text variant="h6" weight="bold" color="primary">
          0 문제
        </Text>
      </View>
      <View style={tw`flex-row justify-between items-center gap-2`}>
        <Text variant="body" color="primary">
          정답 수
        </Text>
        <Text variant="h6" weight="bold" color="secondary">
          0 문제
        </Text>
      </View>
      <View style={tw`flex-row justify-between items-center gap-2`}>
        <Text variant="body" color="primary">
          정답률
        </Text>
        <Text variant="h6" weight="bold" color="primary">
          0 %
        </Text>
      </View>
    </View>
  );
};

export default QuizResponse;
