import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import tw from '../../utils/tailwind';
import { router } from 'expo-router';

type SocialLoginButtonsProps = {
  loading: null | 'google' | 'naver' | 'kakao' | 'guest';
  onLogin: (
    key: 'google' | 'naver' | 'kakao' | 'guest',
    fn: () => Promise<unknown>
  ) => void;
};

export default function SocialLoginButtons({
  loading,
  onLogin,
}: SocialLoginButtonsProps) {
  return (
    <>
      {/* 로그인 버튼들 */}
      <View style={tw`gap-3 mb-4`}>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={true}
          onPress={() => undefined}
          style={[
            tw`bg-white border border-gray-300 py-3.5 px-5 rounded-xl flex-row items-center justify-center`,
            {
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            },
            tw`opacity-30`,
          ]}
        >
          <View
            style={tw`w-5 h-5 bg-red-500 rounded-full items-center justify-center mr-3`}
          >
            <Text style={tw`text-white font-bold text-xs`}>G</Text>
          </View>
          <Text
            style={tw`text-gray-800 font-semibold text-sm flex-1 text-center`}
          >
            점검 중입니다 (Google)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={true}
          onPress={() => undefined}
          style={[
            tw`bg-[#03C75A] py-3.5 px-5 rounded-xl flex-row items-center justify-center`,
            {
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            },
            tw`opacity-30`,
          ]}
        >
          <View
            style={tw`w-5 h-5 bg-white rounded-full items-center justify-center mr-3`}
          >
            <Text style={tw`text-[#03C75A] font-bold text-xs`}>N</Text>
          </View>
          <Text style={tw`text-white font-semibold text-sm flex-1 text-center`}>
            점검 중입니다 (네이버)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={true}
          onPress={() => undefined}
          style={[
            tw`bg-[#FEE500] py-3.5 px-5 rounded-xl flex-row items-center justify-center`,
            {
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            },
            tw`opacity-30`,
          ]}
        >
          <View
            style={tw`w-5 h-5 bg-[#3C1E1E] rounded-full items-center justify-center mr-3`}
          >
            <Text style={tw`text-[#FEE500] font-bold text-xs`}>K</Text>
          </View>
          <Text
            style={tw`text-[#3C1E1E] font-semibold text-sm flex-1 text-center`}
          >
            점검 중입니다 (카카오)
          </Text>
        </TouchableOpacity>
      </View>

      {/* 구분선 */}
      <View style={tw`flex-row items-center my-4`}>
        <View style={tw`flex-1 h-px bg-gray-200`} />
        <Text style={tw`px-3 text-gray-500 text-xs`}>또는</Text>
        <View style={tw`flex-1 h-px bg-gray-200`} />
      </View>

      {/* 아이디/비밀번호 로그인 이동 */}
      <TouchableOpacity
        onPress={() => router.push({ pathname: '/(auth)/login' })}
        style={[
          tw`bg-[#14287f] py-3.5 px-5 rounded-xl flex-row items-center justify-center mb-8`,
          {
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
          },
        ]}
        activeOpacity={0.9}
      >
        <Ionicons name="key-outline" size={18} color="#fff" style={tw`mr-2`} />
        <Text style={tw`text-white font-semibold text-sm flex-1 text-center`}>
          아이디 / 비밀번호로 로그인
        </Text>
      </TouchableOpacity>
    </>
  );
}
