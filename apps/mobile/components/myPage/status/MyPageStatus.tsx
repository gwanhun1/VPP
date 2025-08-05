import { Card, Text } from '@vpp/shared-ui';
import { View } from 'react-native';

import tw from '../../../utils/tailwind';

const MyPageStatus = () => {
  const primaryColor = tw.color('primary');
  const subColor = tw.color('secondary');

  return (
    <View style={tw`flex-row items-center gap-2`}>
      <View style={tw`flex-1`}>
        <Card bordered backgroundColor={subColor}>
          <View style={tw`flex-col justify-center items-center gap-2`}>
            <Text variant="h3" weight="bold" color="white">
              4
            </Text>
            <Text variant="h6" weight="semibold" color="white">
              학습한 용어
            </Text>
          </View>
        </Card>
      </View>

      <View style={tw`flex-1`}>
        <Card bordered backgroundColor={primaryColor}>
          <View style={tw`flex-col justify-center items-center gap-2`}>
            <Text variant="h3" weight="bold" color="white">
              4
            </Text>
            <Text variant="h6" weight="semibold" color="white">
              북마크
            </Text>
          </View>
        </Card>
      </View>
    </View>
  );
};

export default MyPageStatus;
