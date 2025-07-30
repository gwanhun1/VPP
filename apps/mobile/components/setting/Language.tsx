import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text } from '@vpp/shared-ui';
import { View } from 'react-native';

import tw from '../../utils/tailwind';
import Card from '../common/Card';

const Language = () => {
  const primaryColor = tw.color('primary');

  return (
    <Card>
      <View style={tw`flex-row items-center gap-2 mb-2`}>
        <View
          style={tw`w-10 p-2 rounded-xl items-center justify-center bg-gray-200`}
        >
          <MaterialIcons name="language" size={24} color={primaryColor} />
        </View>
        <Text variant="h5" color="primary" weight="semibold">
          언어 설정
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
        <Text variant="h6" weight="bold" color="primary">
          한국어
        </Text>
      </View>
    </Card>
  );
};

export default Language;
