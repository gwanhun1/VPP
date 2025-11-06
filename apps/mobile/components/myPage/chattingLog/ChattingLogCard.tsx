import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Card, Text } from '@vpp/shared-ui';
import { TouchableOpacity, View } from 'react-native';

import tw from '../../../utils/tailwind';

type ChattingLogCardProps = {
  text: string;
  time: string;
  onPress?: () => void;
};

const ChattingLogCard = ({ text, time, onPress }: ChattingLogCardProps) => {
  const mutedColor = tw.color('neutral-500');

  //시간 계산 함수
  function getTimeAgo(dateStr: string): string {
    const inputDate = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - inputDate.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return `${diffSec}초 전`;
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 7) return `${diffDay}일 전`;

    return inputDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card bordered>
        <View style={tw`flex flex-row justify-between items-center`}>
          <View
            style={tw`w-10 p-2 rounded-xl items-center justify-center bg-secondary mr-2`}
          >
            <Ionicons name="chatbox-ellipses-outline" size={24} color="white" />
          </View>

          <View style={tw`flex-1 flex-col  overflow-hidden`}>
            <Text color="primary" weight="bold">
              {text}
            </Text>
            <Text color="muted">{getTimeAgo(time)}</Text>
          </View>
          <MaterialIcons name="arrow-right" size={32} color={mutedColor} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};
export default ChattingLogCard;
