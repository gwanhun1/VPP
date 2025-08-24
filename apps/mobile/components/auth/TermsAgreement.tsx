import { View, Text } from 'react-native';
import tw from '../../utils/tailwind';

export default function TermsAgreement() {
  return (
    <View style={tw`pb-6 pt-4`}>
      <Text style={tw`text-xs text-gray-500 text-center leading-relaxed px-4`}>
        로그인 시 <Text style={tw`text-[#14287f] font-medium`}>이용약관</Text>{' '}
        및 <Text style={tw`text-[#14287f] font-medium`}>개인정보처리방침</Text>
        에 동의합니다.
      </Text>
    </View>
  );
}
