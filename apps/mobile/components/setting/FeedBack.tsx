import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Card, Text } from '@vpp/shared-ui';
import { TouchableOpacity, View } from 'react-native';

import tw from '../../utils/tailwind';
import { useSettingsStore } from '../hooks/useSettingsStore';

const FeedBack = () => {
  const primaryColor = tw.color('primary');
  const subColor = tw.color('secondary');
  const darkMode = useSettingsStore((s) => s.darkMode);

  return (
    <TouchableOpacity>
      <Card bordered>
        <View style={tw`flex-row items-center gap-2 mb-2 justify-between`}>
          <View style={tw`flex-row items-center gap-2`}>
            <View
              style={[
                tw`w-8 p-2 rounded-xl items-center justify-center`,
                {
                  backgroundColor: darkMode
                    ? '#1f2937'
                    : tw.color('gray-200') || '#e5e7eb',
                },
              ]}
            >
              <Ionicons name="chatbox-outline" size={16} color={primaryColor} />
            </View>
            <View>
              <Text variant="subtitle2" color="primary" weight="semibold">
                피드백 보내기
              </Text>
              <Text variant="caption" color="muted">
                개선사항을 알려주세요
              </Text>
            </View>
          </View>

          <MaterialIcons name="arrow-right" size={32} color={subColor} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default FeedBack;
