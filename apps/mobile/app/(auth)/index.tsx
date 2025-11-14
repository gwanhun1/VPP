import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import tw from '../../utils/tailwind';
import AuthHeader from '../../components/auth/AuthHeader';
import SocialLoginButtons from '../../components/auth/SocialLoginButtons';
import FeatureIntro from '../../components/auth/FeatureIntro';
import TermsAgreement from '../../components/auth/TermsAgreement';
import LoadingOverlay from '../../components/auth/LoadingOverlay';
import { wasSessionExpired } from '@vpp/core-logic';

export default function AuthScreen() {
  const [loading, setLoading] = useState<
    null | 'google' | 'naver' | 'kakao' | 'guest'
  >(null);
  const [redirect, setRedirect] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const expired = await wasSessionExpired();
      if (mounted && expired) {
        setSessionExpired(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const run = async (
    key: 'google' | 'naver' | 'kakao' | 'guest',
    fn: () => Promise<unknown>
  ) => {
    try {
      setLoading(key);
      await fn();
      setLoading(null);
      setRedirect(true);
    } catch (error) {
      setLoading(null);

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

  return redirect ? (
    <Redirect href="/(tabs)" />
  ) : (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`flex-1 px-6 pt-12`}>
        <View style={tw`flex-1`}>
          <AuthHeader />
          {sessionExpired ? (
            <View style={tw`mt-3 mb-2 px-3 py-2 rounded-lg bg-red-50`}>
              <Text style={tw`text-xs text-red-600`}>
                보안상 30일이 지나 다시 로그인이 필요합니다.
              </Text>
            </View>
          ) : null}
          <SocialLoginButtons loading={loading} onLogin={run} />
          <FeatureIntro />
        </View>

        <TermsAgreement />
      </View>

      <LoadingOverlay loading={loading} />
    </SafeAreaView>
  );
}
