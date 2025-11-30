import { View, Text, Image } from 'react-native';
import tw from '../../utils/tailwind';

const appIcon = require('../../assets/images/main.png');

export default function AuthHeader() {
  return (
    <View style={tw`items-center mb-8`}>
      <Image source={appIcon} style={tw`w-20 h-20`} resizeMode="contain" />

      <Text style={tw`text-2xl font-bold text-[#14287f] mb-1`}>
        전력시장 AI
      </Text>
      <Text style={tw`text-gray-600 text-sm mb-4`}>
        전문가 어시스턴트와 함께 시작하세요
      </Text>
    </View>
  );
}
