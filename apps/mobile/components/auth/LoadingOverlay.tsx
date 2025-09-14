import { View } from 'react-native';
import tw from '../../utils/tailwind';
import { Spinner } from '@vpp/shared-ui';
import { Text } from '@vpp/shared-ui';

type LoadingOverlayProps = {
  loading: null | 'google' | 'naver' | 'kakao' | 'guest';
};

export default function LoadingOverlay({ loading }: LoadingOverlayProps) {
  if (!loading) return null;

  return (
    <View style={tw`absolute inset-0 items-center justify-center bg-black/20`}>
      <View style={tw`bg-white p-6 rounded-2xl items-center`}>
        <Spinner size={44} color="#8EC5FF" />
        <Text style={tw`text-gray-600 mt-3 font-medium`}>로그인 중...</Text>
      </View>
    </View>
  );
}
