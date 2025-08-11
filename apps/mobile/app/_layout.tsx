import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import {
  setFirebaseConfig,
  onAuthStateChanged,
  signInAsGuest,
  type AuthUser,
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

    const apiKey = process.env.EXPO_PUBLIC_FB_API_KEY as string | undefined;
    const appId = process.env.EXPO_PUBLIC_FB_APP_ID as string | undefined;
    const projectId = process.env.EXPO_PUBLIC_FB_PROJECT_ID as
      | string
      | undefined;
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
    setFirebaseConfig(
      {
        apiKey: apiKey!,
        appId: appId!,
        projectId: projectId!,
        authDomain:
          (process.env.EXPO_PUBLIC_FB_AUTH_DOMAIN as string | undefined) ??
          undefined,
        storageBucket:
          (process.env.EXPO_PUBLIC_FB_STORAGE_BUCKET as string | undefined) ??
          undefined,
        messagingSenderId:
          (process.env.EXPO_PUBLIC_FB_SENDER_ID as string | undefined) ??
          undefined,
      },
      {
        useEmulators: false,
        region: 'asia-northeast3',
        ...(authPersistence ? { authPersistence } : {}),
      }
    );

    const off = onAuthStateChanged(async (user: AuthUser | null) => {
      if (__DEV__) {
        console.log('[Auth] onAuthStateChanged', { uid: user?.uid ?? null });
      }
      if (!user) {
        try {
          await signInAsGuest();
          if (__DEV__) console.log('[Auth] Guest sign-in attempted');
        } catch {
          // 로그인 실패 시 조용히 무시 (네트워크 등)
        }
      }
    });
    return off;
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="(tabs)">
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
