import { onAuthStateChanged } from '@vpp/core-logic';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import tw from '../../utils/tailwind';
import AuthHeader from '../../components/auth/AuthHeader';
import SocialLoginButtons from '../../components/auth/SocialLoginButtons';
import FeatureIntro from '../../components/auth/FeatureIntro';
import TermsAgreement from '../../components/auth/TermsAgreement';
import LoadingOverlay from '../../components/auth/LoadingOverlay';

export default function AuthScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState<
    null | 'google' | 'naver' | 'kakao' | 'guest'
  >(null);

  // 인증 상태 변화 감지하여 자동 네비게이션
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user && loading) {
        // 로그인 성공 시 즉시 상태 초기화
        setLoading(null);

        // 강제 네비게이션 - 여러 방법으로 시도
        const navigate = () => {
          try {
            router.replace('/(tabs)');
          } catch (error) {
            console.warn('첫 번째 네비게이션 실패:', error);
            // 대안 경로로 시도
            setTimeout(() => {
              try {
                router.push('/(tabs)');
              } catch (pushError) {
                console.warn('두 번째 네비게이션 실패:', pushError);
                // 마지막 시도
                router.replace('/(tabs)');
              }
            }, 100);
          }
        };

        // 즉시 실행 및 지연 실행으로 이중 보장
        navigate();
        setTimeout(navigate, 300);
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

      // 로그인 성공 후 강제 리다이렉트 (Firebase 상태 변화 대기하지 않음)
      setTimeout(() => {
        setLoading(null);
        router.replace('/(tabs)');
      }, 500); // 브라우저 닫기와 Firebase 인증 처리 시간 확보
    } catch (error) {
      // 에러 발생 시 즉시 로딩 상태 초기화
      setLoading(null);

      // 사용자가 취소한 경우는 에러 메시지를 표시하지 않음
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류';

      if (
        !errorMessage.includes('취소') &&
        !errorMessage.includes('canceled')
      ) {
        Alert.alert('로그인 실패', errorMessage);
      }
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`flex-1 px-6 pt-12`}>
        {/* 메인 콘텐츠 영역 */}
        <View style={tw`flex-1`}>
          <AuthHeader />
          <SocialLoginButtons loading={loading} onLogin={run} />
          <FeatureIntro />
        </View>

        <TermsAgreement />
      </View>

      <LoadingOverlay loading={loading} />
    </SafeAreaView>
  );
}
