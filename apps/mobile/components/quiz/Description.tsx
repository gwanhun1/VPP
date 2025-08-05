import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Card, Text } from '@vpp/shared-ui';
import { View } from 'react-native';

import tw from '../../utils/tailwind';

type DescriptionProps = {
  description?: string;
};

const Description = ({ description }: DescriptionProps) => {
  const subColor = tw.color('secondary');

  return (
    <View style={tw`mt-2`}>
      <Card bordered variant="primary">
        <View style={tw`flex-row items-center gap-2`}>
          <SimpleLineIcons name="energy" size={20} color={subColor} />
          <Text variant="h5" color="primary" weight="bold">
            설명
          </Text>
        </View>
        <View style={tw`p-2`}>
          <Text variant="subtitle2" color="primary">
            {description}
          </Text>
        </View>
      </Card>
    </View>
  );
};

export default Description;
