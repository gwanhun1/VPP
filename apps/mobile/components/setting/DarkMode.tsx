import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Card, Text } from '@vpp/shared-ui';
import { Switch, View } from 'react-native';

import tw from '../../utils/tailwind';
import { useSettingsStore } from '../hooks/useSettingsStore';

const DarkMode = () => {
  const primaryColor = tw.color('primary');
  const subColor = tw.color('secondary');
  const isEnabled = useSettingsStore((s) => s.darkMode);
  const setDarkMode = useSettingsStore((s) => s.setDarkMode);
  const toggleSwitch = () => setDarkMode(!isEnabled);

  return (
    <Card bordered>
      <View style={tw`flex-row items-center gap-2 mb-2`}>
        <View
          style={tw`w-8 p-2 rounded-xl items-center justify-center bg-gray-200`}
        >
          <MaterialIcons name="dark-mode" size={16} color={primaryColor} />
        </View>
        <Text variant="h6" color="primary" weight="semibold">
          화면 설정
        </Text>
      </View>

      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`p-2`}>
          <Text variant="h6" color="primary">
            다크 모드
          </Text>
          <Text variant="body2" color="muted">
            어두운 테마로 변경
          </Text>
        </View>
        <Switch
          value={isEnabled}
          onValueChange={toggleSwitch}
          trackColor={{ false: '#e5e7eb', true: subColor }}
        />
      </View>
    </Card>
  );
};

export default DarkMode;
