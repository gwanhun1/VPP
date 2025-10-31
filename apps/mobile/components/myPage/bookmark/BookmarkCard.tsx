import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Card } from '@vpp/shared-ui';
import { TouchableOpacity, View, Text } from 'react-native';

import tw from '../../../utils/tailwind';

type BookmarkCardProps = {
  text: string;
  onPress?: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

// 간단한 마크다운 텍스트 정리 함수
const stripMarkdown = (text: string): string => {
  return text
    // 코드 블록 제거
    .replace(/```[\s\S]*?```/g, '[코드]')
    // 인라인 코드 제거
    .replace(/`([^`]+)`/g, '$1')
    // 링크 제거 [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 볼드/이탤릭 제거
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // 헤딩 제거
    .replace(/^#+\s+/gm, '')
    // 리스트 마커 제거
    .replace(/^[*\-+]\s+/gm, '• ')
    .replace(/^\d+\.\s+/gm, '')
    // 여러 줄 바꿈을 하나로
    .replace(/\n{2,}/g, ' ')
    // 앞뒤 공백 제거
    .trim();
};

const BookmarkCard = ({ text, onPress, icon = 'stars' }: BookmarkCardProps) => {
  const subColor = tw.color('secondary');
  const displayText = stripMarkdown(text);
  
  // 텍스트가 너무 길면 자르기
  const truncatedText = displayText.length > 100 
    ? displayText.substring(0, 100) + '...' 
    : displayText;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card bordered>
        <View style={tw`flex flex-row justify-between items-center`}>
          <Text 
            style={tw`max-w-66 text-primary text-sm`}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {truncatedText}
          </Text>
          <MaterialIcons name={icon} size={20} color={subColor} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};
export default BookmarkCard;
