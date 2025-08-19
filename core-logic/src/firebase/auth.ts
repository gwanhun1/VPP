import {
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInAnonymously,
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { getFirebaseAuth } from './app';
import type { AuthUser, AuthPersistence } from './types';

export type AuthStateCallback = (user: AuthUser | null) => void;

// Firebase User를 AuthUser로 변환하는 헬퍼 함수
function convertFirebaseUser(firebaseUser: User | null): AuthUser | null {
  if (!firebaseUser) return null;

  return {
    uid: firebaseUser.uid,
    isAnonymous: firebaseUser.isAnonymous,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
  };
}

export function onAuthStateChanged(cb: AuthStateCallback): () => void {
  const auth = getFirebaseAuth();
  if (!auth) {
    console.warn('Firebase Auth가 초기화되지 않았습니다.');
    return () => {
      // Firebase Auth가 초기화되지 않은 경우의 빈 unsubscribe 함수
    };
  }

  return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
    const authUser = convertFirebaseUser(firebaseUser);
    cb(authUser);
  });
}

export async function signInAsGuest(): Promise<AuthUser> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase Auth가 초기화되지 않았습니다.');
  }

  const userCredential = await signInAnonymously(auth);
  const authUser = convertFirebaseUser(userCredential.user);
  if (!authUser) {
    throw new Error('게스트 로그인에 실패했습니다.');
  }
  return authUser;
}

export function createReactNativeAuthPersistence(
  _storage: unknown
): AuthPersistence {
  // RN AsyncStorage 기반이라는 표시만 남김
  void _storage; // 사용 표시로 린트 경고 방지
  return { type: 'react-native-async-storage' };
}

// WebBrowser 완료 설정
WebBrowser.maybeCompleteAuthSession();

// Google OAuth 설정
let googleClientId: string | null = null;

export function initializeGoogleSignIn(webClientId: string): void {
  googleClientId = webClientId;
}

export async function signInWithGoogle(): Promise<AuthUser> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase Auth가 초기화되지 않았습니다.');
  }

  if (!googleClientId) {
    throw new Error('Google 클라이언트 ID가 설정되지 않았습니다.');
  }

  try {
    // 리디렉션 URI 설정
    // 개발(Expo Go)에서는 Google이 요구하는 HTTPS 리디렉션을 위해 Expo Auth Proxy를 명시적으로 사용
    // 운영(스탠드얼론)은 커스텀 스킴 딥링크 사용
    const redirectUri = __DEV__
      ? 'https://auth.expo.dev/@gwanhun/vpp-mobile'
      : AuthSession.makeRedirectUri({ scheme: 'vpp-mobile' });

    if (__DEV__) {
      console.log('Google OAuth 리디렉션 URI:', redirectUri);
    }

    // AuthSession 요청 설정 (PKCE 비활성화)
    const request = new AuthSession.AuthRequest({
      clientId: googleClientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: redirectUri,
      responseType: AuthSession.ResponseType.IdToken,
      extraParams: {
        nonce: Math.random().toString(36).substring(2, 15),
      },
      usePKCE: false, // PKCE 비활성화
    });

    // Google OAuth 엔드포인트
    const discovery = {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
    };

    // 인증 요청 수행 (브라우저 스타일 설정)
    const result = await request.promptAsync(discovery, {
      preferEphemeralSession: true,
      showInRecents: false,
      dismissButtonStyle: 'close',
      readerMode: false,
    });

    if (result.type !== 'success') {
      // 실패 시에도 브라우저 강제 닫기
      try {
        await WebBrowser.dismissBrowser();
        await WebBrowser.coolDownAsync();
      } catch (dismissError) {
        console.warn('브라우저 닫기 실패:', dismissError);
        try {
          await WebBrowser.coolDownAsync();
        } catch (coolDownError) {
          console.warn('브라우저 쿨다운 실패:', coolDownError);
        }
      }
      throw new Error('Google 로그인이 취소되었습니다.');
    }

    const { id_token } = result.params;

    if (!id_token) {
      throw new Error('Google 로그인에서 ID 토큰을 받지 못했습니다.');
    }

    // Firebase 자격 증명 생성
    const googleCredential = GoogleAuthProvider.credential(id_token);

    // Firebase에 로그인
    const userCredential = await signInWithCredential(auth, googleCredential);
    const authUser = convertFirebaseUser(userCredential.user);

    if (!authUser) {
      throw new Error('Google 로그인에 실패했습니다.');
    }

    // 로그인 성공 후 브라우저 강제 닫기 (플랫폼별 최적화)
    const forceDismissBrowser = async () => {
      try {
        await WebBrowser.dismissBrowser();

        if (Platform.OS === 'ios') {
          // iOS에서 추가 정리
          await WebBrowser.coolDownAsync();
        }

        if (__DEV__) {
          console.log('브라우저 닫기 성공');
        }
      } catch (error) {
        console.warn('브라우저 닫기 실패:', error);

        // 재시도
        setTimeout(async () => {
          try {
            await WebBrowser.dismissBrowser();
            if (Platform.OS === 'ios') {
              await WebBrowser.coolDownAsync();
            }
          } catch (retryError) {
            console.warn('브라우저 재시도 실패:', retryError);
          }
        }, 100);
      }
    };

    // 즉시 실행
    await forceDismissBrowser();

    // 추가 보장을 위한 지연 실행
    setTimeout(forceDismissBrowser, 200);

    return authUser;
  } catch (error) {
    // 에러 발생 시에도 브라우저 강제 닫기 시도
    try {
      await WebBrowser.dismissBrowser();
      await WebBrowser.coolDownAsync();
    } catch (dismissError) {
      console.warn('에러 시 브라우저 닫기 실패:', dismissError);
      // 추가 시도
      try {
        await WebBrowser.coolDownAsync();
      } catch (coolDownError) {
        console.warn('에러 시 브라우저 쿨다운 실패:', coolDownError);
      }
    }

    console.error('Google 로그인 오류:', error);
    throw error;
  }
}

export async function signInWithNaver(): Promise<AuthUser> {
  // TODO: 실제 구현 시 네이버 OAuth → 백엔드 커스텀 토큰 발급 → Firebase signInWithCustomToken
  throw new Error('네이버 로그인은 아직 구현되지 않았습니다.');
}

export async function signInWithKakao(): Promise<AuthUser> {
  // TODO: 실제 구현 시 카카오 OAuth → 백엔드 커스텀 토큰 발급 → Firebase signInWithCustomToken
  throw new Error('카카오 로그인은 아직 구현되지 않았습니다.');
}

export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase Auth가 초기화되지 않았습니다.');
  }

  try {
    // Firebase 로그아웃
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('로그아웃 오류:', error);
    throw error;
  }
}

export function getCurrentUser(): AuthUser | null {
  const auth = getFirebaseAuth();
  if (!auth) {
    return null;
  }

  return convertFirebaseUser(auth.currentUser);
}
