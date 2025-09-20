import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import {
  onAuthStateChanged,
  setFirebaseConfig,
  type AuthUser,
} from '@vpp/core-logic';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';

// OAuth 리디렉션 완료 처리: auth.expo.io에서 돌아올 때 세션을 마무리
WebBrowser.maybeCompleteAuthSession();
// 모듈 로드 시점에서 Firebase 설정을 주입해 렌더 전에 준비되도록 함
(() => {
  const apiKey =
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ??
    process.env.EXPO_PUBLIC_FB_API_KEY;
  const appId =
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ??
    process.env.EXPO_PUBLIC_FB_APP_ID;
  const projectId =
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ??
    process.env.EXPO_PUBLIC_FB_PROJECT_ID;
  const authDomain =
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    process.env.EXPO_PUBLIC_FB_AUTH_DOMAIN;
  const storageBucket =
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    process.env.EXPO_PUBLIC_FB_STORAGE_BUCKET;
  const messagingSenderId =
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
    process.env.EXPO_PUBLIC_FIREBASE_SENDER_ID ??
    process.env.EXPO_PUBLIC_FB_SENDER_ID;

  if (apiKey && appId && projectId) {
    setFirebaseConfig({
      apiKey,
      appId,
      projectId,
      authDomain,
      storageBucket,
      messagingSenderId,
    });
  } else {
    console.warn(
      'Firebase env not set. Set EXPO_PUBLIC_FIREBASE_* (or EXPO_PUBLIC_FB_*) variables to enable auth.'
    );
  }
})();

export default function RootLayout() {
  // 전역 Auth 구독: 로그인 직후 Firestore 사용자 초기화가 반드시 실행되도록 보장
  useEffect(() => {
    const off = onAuthStateChanged((user: AuthUser | null) => {
      // 중요: core-logic onAuthStateChanged 내부에서 initializeUserProfile을 호출함
      if (user) {
        // console.log('[RootLayout] Auth user detected:', user.email);
      }
    });
    return off;
  }, []);

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
