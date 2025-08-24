import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import tw from '../../utils/tailwind';

export default function AuthHeader() {
  return (
    <View style={tw`items-center mb-8`}>
      <LinearGradient
        colors={['#14287f', '#1a3299']}
        style={tw`w-14 h-14 rounded-2xl items-center justify-center mb-3`}
      >
        <Ionicons name="flash" size={22} color="#fff" />
      </LinearGradient>

      <Text style={tw`text-2xl font-bold text-[#14287f] mb-1`}>
        전력시장 AI
      </Text>
      <Text style={tw`text-gray-600 text-sm mb-4`}>
        전문가 어시스턴트와 함께 시작하세요
      </Text>
    </View>
  );
}
