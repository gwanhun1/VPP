import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import {
  setFirebaseConfig,
  createReactNativeAuthPersistence,
} from '@vpp/core-logic';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // 중요: Firebase 전역 초기화 및 게스트 로그인 처리
  useEffect(() => {
    const authPersistence =
      typeof createReactNativeAuthPersistence === 'function'
        ? createReactNativeAuthPersistence(AsyncStorage)
        : undefined;

    const apiKey = process.env.EXPO_PUBLIC_FB_API_KEY;
    const appId = process.env.EXPO_PUBLIC_FB_APP_ID;
    const projectId = process.env.EXPO_PUBLIC_FB_PROJECT_ID;
    const envReady = Boolean(apiKey && appId && projectId);
    if (__DEV__) {
      console.log('[Firebase][ENV]', {
        apiKey: !!apiKey,
        appId: !!appId,
        projectId: !!projectId,
        authDomain: !!process.env.EXPO_PUBLIC_FB_AUTH_DOMAIN,
        storageBucket: !!process.env.EXPO_PUBLIC_FB_STORAGE_BUCKET,
        senderId: !!process.env.EXPO_PUBLIC_FB_SENDER_ID,
      });
    }

    if (!envReady) {
      // 개발 단계: Firebase 환경변수 미설정 시 초기화를 건너뛰어 런타임 에러 방지
      if (__DEV__) {
        console.warn(
          '[Firebase] ENV not ready. Skip initialization until EXPO_PUBLIC_FB_* are provided.'
        );
      }
      return; // 초기화/구독 패스
    }
    if (!apiKey || !appId || !projectId) return;
    setFirebaseConfig(
      {
        apiKey,
        appId,
        projectId,
        authDomain: process.env.EXPO_PUBLIC_FB_AUTH_DOMAIN ?? undefined,
        storageBucket: process.env.EXPO_PUBLIC_FB_STORAGE_BUCKET ?? undefined,
        messagingSenderId: process.env.EXPO_PUBLIC_FB_SENDER_ID ?? undefined,
      },
      {
        useEmulators: false,
        region: 'asia-northeast3',
        ...(authPersistence ? { authPersistence } : {}),
      }
    );

    // 이 레이아웃에서는 인증 구독을 수행하지 않습니다.
    // 인증 게이트는 `app/index.tsx`에서 Redirect로 처리합니다.
  }, []);

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
