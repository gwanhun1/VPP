import { MaterialIcons } from '@expo/vector-icons';
import { Card, Text } from '@vpp/shared-ui';
import { TouchableOpacity, View } from 'react-native';

import tw from '../../utils/tailwind';

const FeedBack = () => {
  const primaryColor = tw.color('primary');
  const subColor = tw.color('secondary');

  return (
    <TouchableOpacity>
      <Card bordered>
        <View style={tw`flex-row items-center gap-2 mb-2 justify-between`}>
          <View style={tw`flex-row items-center gap-2`}>
            <View
              style={tw`w-10 p-2 rounded-xl items-center justify-center bg-gray-200`}
            >
              <MaterialIcons name="help" size={24} color={primaryColor} />
            </View>
            <View>
              <Text variant="h5" color="primary" weight="semibold">
                피드백 보내기
              </Text>
              <Text variant="body2" color="muted">
                개선사항을 알려주세요
              </Text>
            </View>
          </View>

          <MaterialIcons name="arrow-right" size={32} color={subColor} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default FeedBack;
