import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text } from '@vpp/shared-ui';
import { View } from 'react-native';

import { useQuiz } from '../../utils/QuizProvider';
import tw from '../../utils/tailwind';

import GaugeBar from './GaugeBar';

const QuizHeader = () => {
  const { step, question } = useQuiz();
  const primaryColor = tw.color('primary');

  return (
    <View>
      <View
        style={tw`bg-primary flex-row items-center justify-between px-md py-3 border-b border-primary-light`}
      >
        {/* 왼쪽 아이콘 + 텍스트 영역 */}
        <View style={tw`flex-row items-center gap-2`}>
          <View
            style={tw`w-10 h-10 rounded-xl items-center justify-center bg-gray-200`}
          >
            <MaterialIcons name="language" size={24} color={primaryColor} />
          </View>

          <View>
            <Text variant="h4" weight="bold" color="white">
              전력시장 퀴즈
            </Text>
            <View style={tw`ml-1`}>
              <Text variant="caption" color="muted">
                지식을 테스트해보세요
              </Text>
            </View>
          </View>
        </View>

        {/* 오른쪽 진행률 영역 */}
        <View style={tw`items-end`}>
          <Text variant="body2" color="muted">
            진행률
          </Text>
          <Text variant="body2" color="white" weight="bold">
            {step}/{question?.length}
          </Text>
        </View>
      </View>

      {/* 진행률 게이지 */}
      <GaugeBar />
    </View>
  );
};

export default QuizHeader;
