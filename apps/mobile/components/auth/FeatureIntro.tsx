import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import tw from '../../utils/tailwind';

const features = [
  {
    icon: 'sparkles-outline' as const,
    text: 'AI 전문가와 실시간 상담',
    color: '#14287f',
  },
  {
    icon: 'shield-checkmark-outline' as const,
    text: '개인정보 안전 보호',
    color: '#059669',
  },
  {
    icon: 'flash-outline' as const,
    text: '맞춤형 시장 정보 제공',
    color: '#f6a20b',
  },
];

export default function FeatureIntro() {
  return (
    <View style={tw`flex-1 justify-center px-2`}>
      <View style={tw`gap-4`}>
        {features.map((feature, index) => (
          <View key={index} style={tw`flex-row items-center px-1`}>
            <View
              style={[
                tw`w-10 h-10 rounded-xl items-center justify-center mr-4`,
                { backgroundColor: `${feature.color}20` },
              ]}
            >
              <Ionicons name={feature.icon} size={20} color={feature.color} />
            </View>
            <Text style={tw`text-sm text-gray-700 flex-1 leading-relaxed`}>
              {feature.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
