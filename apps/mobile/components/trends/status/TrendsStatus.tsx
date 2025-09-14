import { Card, Text } from '@vpp/shared-ui';
import { View } from 'react-native';

import tw from '../../../utils/tailwind';

const TrendsStatus = () => {
  const greenColor = tw.color('green-500');
  const secondaryColor = tw.color('secondary-400');

  return (
    <View style={tw`flex-row items-center gap-2`}>
      <View style={tw`flex-1`}>
        <Card bordered backgroundColor={greenColor}>
          <View style={tw`flex-col justify-center items-center gap-2`}>
            <Text variant="h3" weight="bold" color="white">
              120.25
            </Text>
            <Text variant="body2" color="white">
              SMP (원/kWh)
            </Text>
            <Text variant="subtitle2" weight="semibold" color="white">
              ↑ 5.2%
            </Text>
          </View>
        </Card>
      </View>

      <View style={tw`flex-1`}>
        <Card bordered backgroundColor={secondaryColor}>
          <View style={tw`flex-col justify-center items-center gap-2`}>
            <Text variant="h3" weight="bold" color="white">
              85.2
            </Text>
            <Text variant="body2" color="white">
              REC (원/kWh)
            </Text>
            <Text variant="subtitle2" weight="semibold" color="white">
              ↓ 2.5%
            </Text>
          </View>
        </Card>
      </View>
    </View>
  );
};

export default TrendsStatus;
