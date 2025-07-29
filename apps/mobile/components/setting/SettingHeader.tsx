import { Text } from '@vpp/shared-ui';
import { View, SafeAreaView } from 'react-native';

import tw from '../../utils/tailwind';

/**
 * 설정 화면 헤더 컴포넌트
 */
const SettingHeader = () => {
  return (
    <SafeAreaView style={tw`bg-primary`}>
      <View
        style={tw`bg-primary px-md py-3 flex-row flex-col items-center justify-center border-b border-primary-light`}
      >
        <Text variant="h4" color="white">
          설정
        </Text>
        <Text variant="body2" color="white">
          앱 환경을 개인화하세요
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SettingHeader;
