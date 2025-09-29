import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Card, Text } from '@vpp/shared-ui';
import { TouchableOpacity, View } from 'react-native';

import tw from '../../../utils/tailwind';

type BookmarkCardProps = {
  text: string;
  onPress?: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

const BookmarkCard = ({ text, onPress, icon = 'stars' }: BookmarkCardProps) => {
  const subColor = tw.color('secondary');

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card bordered>
        <View style={tw`flex flex-row justify-between items-center`}>
          <Text style={tw`max-w-66 text-primary`}>{text}</Text>
          <MaterialIcons name={icon} size={20} color={subColor} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};
export default BookmarkCard;
