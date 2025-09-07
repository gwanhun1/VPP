import { View, Text, ActivityIndicator } from 'react-native';
import tw from '../../utils/tailwind';

type LoadingOverlayProps = {
  loading: null | 'google' | 'naver' | 'kakao' | 'guest';
};

export default function LoadingOverlay({ loading }: LoadingOverlayProps) {
  if (!loading) return null;

  return (
    <View style={tw`absolute inset-0 items-center justify-center bg-black/20`}>
      <View style={tw`bg-white p-6 rounded-2xl items-center`}>
        <ActivityIndicator size="large" color="#14287f" />
        <Text style={tw`text-gray-600 mt-3 font-medium`}>로그인 중...</Text>
      </View>
    </View>
  );
}
