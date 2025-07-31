import { Card, Text } from '@vpp/shared-ui';
import { View } from 'react-native';

import tw from '../../../utils/tailwind';

const MyPageStatus = () => {
  return (
    <View style={tw`flex-row items-center gap-2`}>
      <View style={tw`flex-1`}>
        <Card variant="secondary" bordered>
          <View style={tw`flex-col justify-center items-center gap-2`}>
            <Text variant="h3" weight="bold" color="secondary">
              4
            </Text>
            <Text variant="h6" weight="semibold" color="secondary">
              학습한 용어
            </Text>
          </View>
        </Card>
      </View>

      <View style={tw`flex-1`}>
        <Card variant="primary" bordered>
          <View style={tw`flex-col justify-center items-center gap-2`}>
            <Text variant="h3" weight="bold" color="primary">
              4
            </Text>
            <Text variant="h6" weight="semibold" color="primary">
              북마크
            </Text>
          </View>
        </Card>
      </View>
    </View>
  );
};

export default MyPageStatus;
