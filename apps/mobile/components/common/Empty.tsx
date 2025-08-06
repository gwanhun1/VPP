import { Badge, Text } from '@vpp/shared-ui';
import { View } from 'react-native';

import tw from '../../utils/tailwind';

const Empty = () => {
  return (
    <View style={tw`flex-1 items-center justify-center w-full h-full`}>
      <Badge variant="outline" size="lg" rounded="full">
        <Text variant="h6" color="primary">
          데이터가 없습니다
        </Text>
      </Badge>
    </View>
  );
};

export default Empty;
