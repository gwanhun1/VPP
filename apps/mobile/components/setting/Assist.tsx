import { MaterialIcons } from '@expo/vector-icons';
import { Card, Text } from '@vpp/shared-ui';
import { TouchableOpacity, View } from 'react-native';

import tw from '../../utils/tailwind';
import { useSettingsStore } from '../hooks/useSettingsStore';

const Assist = () => {
  const primaryColor = tw.color('primary');
  const subColor = tw.color('secondary');
  const darkMode = useSettingsStore((s) => s.darkMode);
  const primaryColor600 = tw.color('primary-600') ?? primaryColor;
  const iconColor = darkMode ? primaryColor600 : primaryColor;

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
              <MaterialIcons name="help" size={16} color={iconColor} />
            </View>
            <View>
              <Text variant="subtitle2" color="primary" weight="semibold">
                도움말 및 지원
              </Text>
              <Text variant="caption" color="muted">
                자주 묻는 질문과 고객지원
              </Text>
            </View>
          </View>

          <MaterialIcons name="arrow-right" size={32} color={subColor} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default Assist;
