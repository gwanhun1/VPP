import { Text, View, SafeAreaView } from 'react-native';

import tw from '../../utils/tailwind';

/**
 * 설정 화면 헤더 컴포넌트
 */
const SettingHeader = () => {
  return (
    <SafeAreaView style={tw`bg-primary`}>
      <View style={tw`bg-primary px-md py-3 flex-row items-center justify-center border-b border-primary-light`}>
        <Text style={tw`text-white font-semibold text-lg text-center`}>설정</Text>
      </View>
    </SafeAreaView>
  );
};

export default SettingHeader;
