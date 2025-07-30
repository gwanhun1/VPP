import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text } from '@vpp/shared-ui';
import { useState } from 'react';
import { Switch, View } from 'react-native';

import tw from '../../utils/tailwind';
import Card from '../common/Card';

const DarkMode = () => {
  const primaryColor = tw.color('primary') ?? '#14287f';
  const subColor = tw.color('sub') ?? '#f6a20b';

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((prev) => !prev);

  return (
    <Card>
      <View style={tw`flex-row items-center gap-2 mb-2`}>
        <View
          style={tw`w-10 p-2 rounded-xl items-center justify-center bg-gray-200`}
        >
          <MaterialIcons name="dark-mode" size={24} color={primaryColor} />
        </View>
        <Text variant="h5" color="primary" weight="semibold">
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
