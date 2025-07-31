import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Card, Text } from '@vpp/shared-ui';
import { TouchableOpacity, View } from 'react-native';

import tw from '../../../utils/tailwind';

type BookmarkCardProps = { text: string };

const BookmarkCard = ({ text }: BookmarkCardProps) => {
  const subColor = tw.color('secondary');

  return (
    <TouchableOpacity>
      <Card bordered>
        <View style={tw`flex flex-row justify-between items-center`}>
          <Text color="primary">{text}</Text>
          <MaterialIcons name="stars" size={24} color={subColor} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};
export default BookmarkCard;
