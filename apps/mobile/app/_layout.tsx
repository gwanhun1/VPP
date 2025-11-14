import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { setFirebaseConfig, initializeFirebase } from '@vpp/core-logic';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useSettingsStore } from '../components/hooks/useSettingsStore';
import { ThemeProvider as UIThemeProvider } from '@vpp/shared-ui';

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

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#14287f',
    background: '#ffffff',
    card: '#ffffff',
    text: '#0f172a',
    border: DefaultTheme.colors.border,
    notification: '#ff9800',
  },
};

const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#ffcc80',
    background: '#17171B',
    card: '#0f172a',
    text: '#f9fafb',
    border: DarkTheme.colors.border,
    notification: '#ff9800',
  },
};

export default function RootLayout() {
  const darkMode = useSettingsStore((s) => s.darkMode);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <UIThemeProvider mode={darkMode ? 'dark' : 'light'}>
      <NavigationThemeProvider value={darkMode ? darkTheme : lightTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </NavigationThemeProvider>
    </UIThemeProvider>
  );
}
