import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Card, Text } from '@vpp/shared-ui';
import { TouchableOpacity, View } from 'react-native';

import tw from '../../../utils/tailwind';

type BookmarkCardProps = {
  text: string;
  onPress?: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

const stripMarkdown = (text: string): string => {
  return text
    .replace(/```[\s\S]*?```/g, '[코드]')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/^#+\s+/gm, '')
    .replace(/^[*\-+]\s+/gm, '• ')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\n{2,}/g, ' ')
    .trim();
};

const BookmarkCard = ({ text, onPress, icon = 'stars' }: BookmarkCardProps) => {
  const subColor = tw.color('secondary');
  const displayText = stripMarkdown(text);

  const truncatedText =
    displayText.length > 100
      ? displayText.substring(0, 100) + '...'
      : displayText;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card bordered>
        <View style={tw`flex flex-row justify-between items-center`}>
          <Text color="primary">{truncatedText}</Text>
          <MaterialIcons name={icon} size={20} color={subColor} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};
export default BookmarkCard;
