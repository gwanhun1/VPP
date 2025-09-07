import { Ionicons } from '@expo/vector-icons';
import {
  signInAsGuest,
  signInWithKakao,
  signInWithNaver,
} from '@vpp/core-logic';
import { signInWithGoogle } from '@vpp/core-logic/firebase/auth-native';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import tw from '../../utils/tailwind';

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
          disabled={loading !== null}
          onPress={() => onLogin('google', async () => signInWithGoogle())}
          style={[
            tw`bg-white border border-gray-300 py-3.5 px-5 rounded-xl flex-row items-center justify-center`,
            {
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            },
            loading === 'google' && tw`opacity-70`,
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
            {loading === 'google' ? '로그인 중...' : 'Google로 계속하기'}
          </Text>
          {loading === 'google' && (
            <ActivityIndicator size="small" color="#14287f" style={tw`ml-2`} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={loading !== null}
          onPress={() => onLogin('naver', async () => signInWithNaver())}
          style={[
            tw`bg-[#03C75A] py-3.5 px-5 rounded-xl flex-row items-center justify-center`,
            {
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            },
            loading === 'naver' && tw`opacity-70`,
          ]}
        >
          <View
            style={tw`w-5 h-5 bg-white rounded-full items-center justify-center mr-3`}
          >
            <Text style={tw`text-[#03C75A] font-bold text-xs`}>N</Text>
          </View>
          <Text style={tw`text-white font-semibold text-sm flex-1 text-center`}>
            {loading === 'naver' ? '로그인 중...' : '네이버로 계속하기'}
          </Text>
          {loading === 'naver' && (
            <ActivityIndicator size="small" color="#fff" style={tw`ml-2`} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={loading !== null}
          onPress={() => onLogin('kakao', async () => signInWithKakao())}
          style={[
            tw`bg-[#FEE500] py-3.5 px-5 rounded-xl flex-row items-center justify-center`,
            {
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            },
            loading === 'kakao' && tw`opacity-70`,
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
            {loading === 'kakao' ? '로그인 중...' : '카카오로 계속하기'}
          </Text>
          {loading === 'kakao' && (
            <ActivityIndicator size="small" color="#3C1E1E" style={tw`ml-2`} />
          )}
        </TouchableOpacity>
      </View>

      {/* 구분선 */}
      <View style={tw`flex-row items-center my-4`}>
        <View style={tw`flex-1 h-px bg-gray-200`} />
        <Text style={tw`px-3 text-gray-500 text-xs`}>또는</Text>
        <View style={tw`flex-1 h-px bg-gray-200`} />
      </View>

      {/* 익명 로그인 */}
      <TouchableOpacity
        onPress={() => onLogin('guest', async () => signInAsGuest())}
        disabled={loading !== null}
        style={[
          tw`border border-dashed border-gray-300 bg-gray-50 py-3.5 px-5 rounded-xl flex-row items-center justify-center mb-8`,
          loading === 'guest' && tw`opacity-70`,
        ]}
      >
        <Ionicons
          name="person-outline"
          size={18}
          color="#6B7280"
          style={tw`mr-2`}
        />
        <Text style={tw`text-gray-700 font-medium text-sm flex-1 text-center`}>
          {loading === 'guest' ? '접속 중...' : '익명으로 둘러보기'}
        </Text>
        {loading === 'guest' && (
          <ActivityIndicator size="small" color="#6B7280" style={tw`ml-2`} />
        )}
      </TouchableOpacity>
    </>
  );
}
