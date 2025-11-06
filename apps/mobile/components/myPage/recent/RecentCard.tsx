import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Card, Text } from '@vpp/shared-ui';
import { TouchableOpacity, View } from 'react-native';

import tw from '../../../utils/tailwind';

type RecentCardProps = {
  text: string;
  time?: string;
};

const RecentCard = ({ text, time }: RecentCardProps) => {
  const subColor = tw.color('secondary');

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    try {
      const date = new Date(timeString);
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <TouchableOpacity>
      <Card bordered>
        <View style={tw`flex flex-row justify-between items-center`}>
          <View style={tw`flex-1 flex-col overflow-hidden`}>
            <Text color="primary" weight="bold">
              {text}
            </Text>
            {time && (
              <View style={tw`mt-1`}>
                <Text variant="body2" color="muted">
                  {formatTime(time)}
                </Text>
              </View>
            )}
          </View>
          <MaterialIcons name="arrow-right" size={32} color={subColor} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};
export default RecentCard;
