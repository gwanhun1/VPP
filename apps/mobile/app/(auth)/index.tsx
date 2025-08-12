import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { signInWithGoogle, signInWithNaver, signInWithKakao, signInAsGuest } from '@vpp/core-logic';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import tw from '../../utils/tailwind';

export default function AuthScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState<
    null | 'google' | 'naver' | 'kakao' | 'guest'
  >(null);

  const run = async (
    key: 'google' | 'naver' | 'kakao' | 'guest',
    fn: () => Promise<unknown>
  ) => {
    try {
      setLoading(key);
      await fn();
      // 성공 시 탭으로 이동
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert(
        '로그인 실패',
        e instanceof Error ? e.message : '알 수 없는 오류'
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`flex-1 items-center justify-center px-6`}>
        <View
          style={[
            tw`w-full bg-white rounded-2xl p-5`,
            {
              maxWidth: 420,
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 3,
            },
          ]}
        >
          <View style={tw`items-center mb-4`}>
            <View style={tw`w-12 h-12 rounded-2xl bg-[#14287f] items-center justify-center mb-2`}>
              <Ionicons name="flash" size={24} color="#fff" />
            </View>
            <Text style={tw`text-2xl font-extrabold text-[#14287f]`}>로그인</Text>
            <Text style={tw`text-sm text-gray-600 mt-1`}>소셜 계정으로 빠르게 시작하세요</Text>
          </View>

          <View style={tw`gap-3`}>
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={loading !== null}
              onPress={() => run('google', () => signInWithGoogle())}
              style={tw`bg-[#14287f] py-3 rounded-lg items-center flex-row justify-center`}
            >
              <Ionicons name="logo-google" size={18} color="#fff" style={tw`mr-2`} />
              <Text style={tw`text-white font-semibold`}>
                {loading === 'google' ? '구글로 로그인 중…' : 'Google로 계속하기'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={loading !== null}
              onPress={() => run('naver', () => signInWithNaver())}
              style={tw`bg-[#03c75a] py-3 rounded-lg items-center flex-row justify-center`}
            >
              <MaterialIcons name="nature" size={18} color="#fff" style={tw`mr-2`} />
              <Text style={tw`text-white font-semibold`}>
                {loading === 'naver' ? '네이버로 로그인 중…' : 'Naver로 계속하기'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={loading !== null}
              onPress={() => run('kakao', () => signInWithKakao())}
              style={tw`bg-[#fee500] py-3 rounded-lg items-center flex-row justify-center`}
            >
              <Ionicons name="chatbubbles" size={18} color="#000" style={tw`mr-2`} />
              <Text style={tw`text-black font-semibold`}>
                {loading === 'kakao' ? '카카오로 로그인 중…' : 'Kakao로 계속하기'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={tw`flex-row items-center my-4`}>
            <View style={tw`flex-1 h-[1px] bg-gray-200`} />
            <Text style={tw`mx-3 text-xs text-gray-500`}>또는</Text>
            <View style={tw`flex-1 h-[1px] bg-gray-200`} />
          </View>

          <View style={tw`items-center`}>
            <TouchableOpacity onPress={() => run('guest', () => signInAsGuest())} disabled={loading !== null}>
              <Text style={tw`text-[#14287f] font-medium`}>로그인 없이 익명으로 둘러보기</Text>
            </TouchableOpacity>
            <Text style={tw`text-[11px] text-gray-400 mt-2`}>
              로그인 시 서비스 약관 및 개인정보 처리방침에 동의하게 됩니다.
            </Text>
          </View>
        </View>
      </View>

      {loading && (
        <View style={tw`absolute inset-0 items-center justify-center bg-black/10`}>
          <ActivityIndicator size="large" color="#14287f" />
        </View>
      )}
    </SafeAreaView>
  );
}
