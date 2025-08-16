import { Ionicons } from '@expo/vector-icons';
import {
  signInWithGoogle,
  signInWithNaver,
  signInWithKakao,
  signInAsGuest,
  onAuthStateChanged,
} from '@vpp/core-logic';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import tw from '../../utils/tailwind';

export default function AuthScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState<
    null | 'google' | 'naver' | 'kakao' | 'guest'
  >(null);

  // 인증 상태 변화 감지하여 자동 네비게이션
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user && loading) {
        // 로그인 성공 시 AI 채팅 탭으로 이동
        setTimeout(() => {
          router.replace('/(tabs)/ai-chat');
        }, 100); // 약간의 지연으로 상태 안정화
      }
    });

    return unsubscribe;
  }, [loading, router]);

  const run = async (
    key: 'google' | 'naver' | 'kakao' | 'guest',
    fn: () => Promise<unknown>
  ) => {
    try {
      setLoading(key);
      await fn();
      // Firebase 인증 상태 변화를 기다림 (useEffect에서 처리)
    } catch (e) {
      Alert.alert(
        '로그인 실패',
        e instanceof Error ? e.message : '알 수 없는 오류'
      );
      setLoading(null);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`flex-1 px-6 py-6`}>
        {/* 헤더 */}
        <View style={tw`items-center mb-6`}>
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

        {/* 로그인 버튼들 */}
        <View style={tw`gap-3 mb-6`}>
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={loading !== null}
            onPress={() => run('google', () => signInWithGoogle())}
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
              <ActivityIndicator
                size="small"
                color="#14287f"
                style={tw`ml-2`}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={loading !== null}
            onPress={() => run('naver', () => signInWithNaver())}
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
            <Text
              style={tw`text-white font-semibold text-sm flex-1 text-center`}
            >
              {loading === 'naver' ? '로그인 중...' : '네이버로 계속하기'}
            </Text>
            {loading === 'naver' && (
              <ActivityIndicator size="small" color="#fff" style={tw`ml-2`} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={loading !== null}
            onPress={() => run('kakao', () => signInWithKakao())}
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
              <ActivityIndicator
                size="small"
                color="#3C1E1E"
                style={tw`ml-2`}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* 구분선 */}
        <View style={tw`flex-row items-center my-3`}>
          <View style={tw`flex-1 h-px bg-gray-200`} />
          <Text style={tw`px-3 text-gray-500 text-xs`}>또는</Text>
          <View style={tw`flex-1 h-px bg-gray-200`} />
        </View>

        {/* 익명 로그인 */}
        <TouchableOpacity
          onPress={() => run('guest', () => signInAsGuest())}
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
          <Text
            style={tw`text-gray-700 font-medium text-sm flex-1 text-center`}
          >
            {loading === 'guest' ? '접속 중...' : '익명으로 둘러보기'}
          </Text>
          {loading === 'guest' && (
            <ActivityIndicator size="small" color="#6B7280" style={tw`ml-2`} />
          )}
        </TouchableOpacity>

        {/* 기능 소개 */}
        <View style={tw`flex-1 justify-center px-2`}>
          <Text
            style={tw`text-center text-base font-semibold text-gray-800 mb-5`}
          >
            전력시장 AI와 함께하면
          </Text>

          <View style={tw`gap-4`}>
            {[
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
            ].map((feature, index) => (
              <View key={index} style={tw`flex-row items-center px-1`}>
                <View
                  style={[
                    tw`w-10 h-10 rounded-xl items-center justify-center mr-4`,
                    { backgroundColor: `${feature.color}20` },
                  ]}
                >
                  <Ionicons
                    name={feature.icon}
                    size={20}
                    color={feature.color}
                  />
                </View>
                <Text style={tw`text-sm text-gray-700 flex-1 leading-relaxed`}>
                  {feature.text}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 약관 동의 */}
        <Text style={tw`text-xs text-gray-500 text-center leading-relaxed px-4`}>
          로그인 시{' '}
          <Text style={tw`text-[#14287f] font-medium`}>이용약관</Text> 및{' '}
          <Text style={tw`text-[#14287f] font-medium`}>개인정보처리방침</Text>에 동의합니다.
        </Text>
      </View>

      {/* 전체 로딩 오버레이 */}
      {loading && (
        <View
          style={tw`absolute inset-0 items-center justify-center bg-black/20`}
        >
          <View style={tw`bg-white p-6 rounded-2xl items-center`}>
            <ActivityIndicator size="large" color="#14287f" />
            <Text style={tw`text-gray-600 mt-3 font-medium`}>로그인 중...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
