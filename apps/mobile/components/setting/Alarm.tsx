import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Card, Text } from '@vpp/shared-ui';
import { View } from 'react-native';

import tw from '../../utils/tailwind';

import AlarmButtonGroup from './AlarmButtonGroup';

const Alarm = () => {
  const primaryColor = tw.color('primary');

  return (
    <Card bordered>
      <View style={tw`flex-row items-center gap-2 mb-2`}>
        <View
          style={tw`w-8 p-2 rounded-xl items-center justify-center bg-gray-200`}
        >
          <MaterialIcons name="notifications" size={16} color={primaryColor} />
        </View>
        <Text variant="h6" color="primary" weight="semibold">
          알림 설정
        </Text>
      </View>

      {/* 버튼 그룹 */}
      <AlarmButtonGroup />
    </Card>
  );
};

export default Alarm;
