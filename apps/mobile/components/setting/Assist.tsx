import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '@vpp/shared-ui';
import { TouchableOpacity, View } from 'react-native';

import tw from '../../utils/tailwind';
import Card from '../common/Card';

const Assist = () => {
  const primaryColor = tw.color('primary');
  const subColor = tw.color('secondary');

  return (
    <TouchableOpacity>
      <Card>
        <View style={tw`flex-row items-center gap-2 mb-2 justify-between`}>
          <View style={tw`flex-row items-center gap-2`}>
            <View
              style={tw`w-10 p-2 rounded-xl items-center justify-center bg-gray-200`}
            >
              <MaterialIcons name="help" size={24} color={primaryColor} />
            </View>
            <View>
              <Text variant="h5" color="primary" weight="semibold">
                도움말 및 지원
              </Text>
              <Text variant="body2" color="muted">
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
