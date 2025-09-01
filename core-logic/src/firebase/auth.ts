import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInAnonymously,
  User,
} from 'firebase/auth';
import { getFirebaseAuth, initializeFirebase } from './app';

// --- 타입 정의 (기존 types.ts 파일에 있을 내용) ---

// 소셜 로그인을 포함한 인증 제공자 타입을 정의합니다.
export type AuthProvider = 'anonymous' | 'google' | 'naver' | 'kakao';

// 앱 전체에서 사용할 사용자 정보 인터페이스입니다.
// 소셜 로그인을 통해 얻을 수 있는 추가 정보를 포함하도록 확장되었습니다.
export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  providerId: AuthProvider;
}

export interface AuthPersistence {
  type: 'react-native-async-storage';
}
// --- 타입 정의 끝 ---

export type AuthStateCallback = (user: AuthUser | null) => void;

// AsyncStorage에 사용자 정보를 저장할 때 사용할 키입니다.
const AUTH_USER_STORAGE_KEY = '@Auth/user';

/**
 * Firebase의 User 객체를 우리가 정의한 AuthUser 객체로 변환합니다.
 * 이 함수를 통해 앱의 다른 부분에서는 Firebase 객체에 직접 의존하지 않아도 됩니다.
 * @param user Firebase Auth에서 제공하는 User 객체
 * @returns 앱에서 사용할 AuthUser 객체
 */
function mapFirebaseUserToAuthUser(user: User): AuthUser {
  // 사용자의 주된 인증 제공자 정보를 가져옵니다.
  const providerId = user.providerData[0]?.providerId || 'anonymous';
  let mappedProvider: AuthProvider = 'anonymous';

  // Firebase의 providerId 문자열을 우리가 정의한 AuthProvider 타입으로 매핑합니다.
  if (providerId === 'google.com') {
    mappedProvider = 'google';
  }
  // TODO: 추후 네이버, 카카오 로그인 구현 시 여기에 매핑 로직을 추가합니다.
  // if (providerId === 'naver.com') { ... }

  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    providerId: mappedProvider,
  };
}

/**
 * Firebase의 인증 상태 변경을 감지하는 리스너를 설정합니다.
 * 로그인 또는 로그아웃 시, 사용자 정보를 AsyncStorage에 저장하거나 삭제합니다.
 * @param cb 인증 상태가 변경될 때 호출될 콜백 함수
 * @returns 리스너를 해제할 수 있는 함수
 */
export function onAuthStateChanged(cb: AuthStateCallback): () => void {
  initializeFirebase();
  const auth = getFirebaseAuth();
  if (!auth) {
    cb(null);
    return () => void 0;
  }

  const unsubscribe = firebaseOnAuthStateChanged(
    auth,
    async (user: User | null) => {
      if (user) {
        // 사용자가 로그인한 경우
        const authUser = mapFirebaseUserToAuthUser(user);
        try {
          // 사용자 정보를 JSON 문자열로 변환하여 AsyncStorage에 저장합니다.
          await AsyncStorage.setItem(
            AUTH_USER_STORAGE_KEY,
            JSON.stringify(authUser)
          );
        } catch (error) {
          console.error('AsyncStorage: 사용자 정보 저장 실패', error);
        }
        cb(authUser);
      } else {
        // 사용자가 로그아웃한 경우
        try {
          // AsyncStorage에서 사용자 정보를 삭제합니다.
          await AsyncStorage.removeItem(AUTH_USER_STORAGE_KEY);
        } catch (error) {
          console.error('AsyncStorage: 사용자 정보 삭제 실패', error);
        }
        cb(null);
      }
    }
  );
  return unsubscribe;
}

/**
 * 앱 시작 시 AsyncStorage에 저장된 사용자 정보를 가져옵니다.
 * 이를 통해 Firebase 초기화 이전에 로그인 상태를 빠르게 복원할 수 있습니다.
 * @returns 저장된 AuthUser 객체 또는 정보가 없으면 null을 반환합니다.
 */
export async function getStoredUser(): Promise<AuthUser | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(AUTH_USER_STORAGE_KEY);
    return jsonValue != null ? (JSON.parse(jsonValue) as AuthUser) : null;
  } catch (error) {
    console.error('AsyncStorage: 사용자 정보 불러오기 실패', error);
    return null;
  }
}

/**
 * 익명으로 Firebase에 로그인합니다.
 * @returns 로그인된 사용자의 AuthUser 정보
 */
export async function signInAsGuest(): Promise<AuthUser> {
  initializeFirebase();
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase Auth가 초기화되지 않았습니다.');

  const userCredential = await signInAnonymously(auth);
  const user = userCredential.user;
  // onAuthStateChanged 리스너가 저장 로직을 처리하므로, 여기서는 변환된 사용자 객체만 반환합니다.
  return mapFirebaseUserToAuthUser(user);
}

/**
 * 현재 로그인된 사용자를 로그아웃시킵니다.
 */
export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) {
    await auth.signOut();
  }
}

/**
 * 현재 로그인된 사용자의 정보를 동기적으로 가져옵니다.
 * @returns 현재 사용자의 AuthUser 객체 또는 없으면 null
 */
export function getCurrentUser(): AuthUser | null {
  const auth = getFirebaseAuth();

  console.log(auth);
  const user = auth?.currentUser ?? null;
  return user ? mapFirebaseUserToAuthUser(user) : null;
}

export function createReactNativeAuthPersistence(
  _storage: unknown
): AuthPersistence {
  void _storage;
  return { type: 'react-native-async-storage' };
}

export function initializeGoogleSignIn(): void {
  // no-op
}

export async function signInWithGoogle(): Promise<AuthUser> {
  throw new Error('Google 로그인 기능이 제거되었습니다.');
}

export async function signInWithNaver(): Promise<AuthUser> {
  throw new Error('네이버 로그인 기능이 제거되었습니다.');
}

export async function signInWithKakao(): Promise<AuthUser> {
  throw new Error('카카오 로그인 기능이 제거되었습니다.');
}
