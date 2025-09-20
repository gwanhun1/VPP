import { Redirect } from 'expo-router';
import { useState } from 'react';
import { View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import tw from '../../utils/tailwind';
import AuthHeader from '../../components/auth/AuthHeader';
import SocialLoginButtons from '../../components/auth/SocialLoginButtons';
import FeatureIntro from '../../components/auth/FeatureIntro';
import TermsAgreement from '../../components/auth/TermsAgreement';
import LoadingOverlay from '../../components/auth/LoadingOverlay';

export default function AuthScreen() {
  const [loading, setLoading] = useState<
    null | 'google' | 'naver' | 'kakao' | 'guest'
  >(null);
  const [redirect, setRedirect] = useState(false);

  const run = async (
    key: 'google' | 'naver' | 'kakao' | 'guest',
    fn: () => Promise<unknown>
  ) => {
    try {
      setLoading(key);
      await fn(); // 더미 작업 (실제 로그인 없음)

      // RootLayout 마운트 이후 안전하게 전환 (선언적 Redirect 사용)
      setLoading(null);
      setRedirect(true);
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
    // 로그인 성공 시 선언적으로 탭 루트로 이동
    redirect ? (
      <Redirect href="/(tabs)" />
    ) : (
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
    )
  );
}
