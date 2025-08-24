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

  // 리디렉션 URI 설정
  const redirectUri = __DEV__
    ? 'https://auth.expo.dev/@gwanhun/vpp-mobile'
    : AuthSession.makeRedirectUri({ scheme: 'vpp-mobile' });

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

  // Promise wrapper로 확실한 에러 처리
  return new Promise((resolve, reject) => {
    const executeAuth = async () => {
      try {
        // 인증 요청 수행 (브라우저 스타일 설정)
        const result = await request.promptAsync(discovery, {
          preferEphemeralSession: true,
          showInRecents: false,
          dismissButtonStyle: 'close',
          readerMode: false,
        });

        if (result.type !== 'success') {
          // 취소 타입별로 다른 에러 메시지 먼저 준비
          let errorMessage = 'Google 로그인이 취소되었습니다.';
          if (result.type === 'cancel') {
            errorMessage = 'Google 로그인이 취소되었습니다.';
          } else if (result.type === 'dismiss') {
            errorMessage = 'Google 로그인이 취소되었습니다.';
          } else if (result.type === 'error') {
            errorMessage = `Google 로그인 오류: ${
              result.error?.message || '알 수 없는 오류'
            }`;
          }

          // 브라우저 닫기를 백그라운드에서 실행
          setTimeout(async () => {
            try {
              await WebBrowser.dismissBrowser();
              await WebBrowser.coolDownAsync();
            } catch (dismissError) {
              console.warn('브라우저 닫기 실패:', dismissError);
            }
          }, 0);

          // 즉시 reject
          reject(new Error(errorMessage));
          return;
        }

        const { id_token } = result.params;

        if (!id_token) {
          reject(new Error('Google 로그인에서 ID 토큰을 받지 못했습니다.'));
          return;
        }

        // Firebase 자격 증명 생성
        const googleCredential = GoogleAuthProvider.credential(id_token);

        // Firebase에 로그인
        const userCredential = await signInWithCredential(
          auth,
          googleCredential
        );
        const authUser = convertFirebaseUser(userCredential.user);

        if (!authUser) {
          reject(new Error('Google 로그인에 실패했습니다.'));
          return;
        }

        // 로그인 성공 후 브라우저 강제 닫기
        setTimeout(async () => {
          try {
            await WebBrowser.dismissBrowser();
            await WebBrowser.coolDownAsync();
          } catch (error) {
            console.warn('성공 후 브라우저 닫기 실패:', error);
          }
        }, 0);

        resolve(authUser);
      } catch (error) {
        // 에러 발생 시에도 브라우저 닫기
        setTimeout(async () => {
          try {
            await WebBrowser.dismissBrowser();
            await WebBrowser.coolDownAsync();
          } catch (dismissError) {
            console.warn('예외 시 브라우저 닫기 실패:', dismissError);
          }
        }, 0);

        reject(error);
      }
    };

    executeAuth();
  });
}

export async function signInWithNaver(): Promise<AuthUser> {
  // TODO: 실제 구현 시 네이버 OAuth → 백엔드 커스텀 토큰 발급 → Firebase signInWithCustomToken
  throw new Error(
    '네이버 로그인은 준비 중입니다. Google 로그인을 이용해주세요.'
  );
}

export async function signInWithKakao(): Promise<AuthUser> {
  // TODO: 실제 구현 시 카카오 OAuth → 백엔드 커스텀 토큰 발급 → Firebase signInWithCustomToken
  throw new Error(
    '카카오 로그인은 준비 중입니다. Google 로그인을 이용해주세요.'
  );
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
