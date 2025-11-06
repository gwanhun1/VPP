import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { setFirebaseConfig, initializeFirebase } from '@vpp/core-logic';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();
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
    try {
      initializeFirebase();
    } catch (e) {
      console.warn('Firebase initialize 실패:', e);
    }
  } else {
    console.warn(
      'Firebase env not set. Set EXPO_PUBLIC_FIREBASE_* (or EXPO_PUBLIC_FB_*) variables to enable auth.'
    );
  }
})();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
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
