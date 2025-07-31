import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Card, Text } from '@vpp/shared-ui';
import { TouchableOpacity, View } from 'react-native';

import tw from '../../../utils/tailwind';

type RecentCardProps = { text: string };

const RecentCard = ({ text }: RecentCardProps) => {
  const subColor = tw.color('secondary');

  return (
    <TouchableOpacity>
      <Card bordered>
        <View style={tw`flex flex-row justify-between items-center`}>
          <View style={tw`flex-1 flex-row items-center overflow-hidden`}>
            <Text color="primary" weight="bold">
              {text}
            </Text>
          </View>
          <MaterialIcons name="arrow-right" size={32} color={subColor} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};
export default RecentCard;
