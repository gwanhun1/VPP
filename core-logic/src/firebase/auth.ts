import type { AuthUser, AuthPersistence } from './types';

// 간단한 이벤트 구독 패턴으로 onAuthStateChanged 흉내
export type AuthStateCallback = (user: AuthUser | null) => void;

let currentUser: AuthUser | null = null;
const listeners = new Set<AuthStateCallback>();

export function onAuthStateChanged(cb: AuthStateCallback): () => void {
  // 첫 호출 시 비동기적으로 현재 사용자 전달
  const timeout = setTimeout(() => cb(currentUser), 0);
  listeners.add(cb);
  return () => {
    clearTimeout(timeout);
    listeners.delete(cb);
  };
}

export async function signInAsGuest(): Promise<AuthUser> {
  // 실제 Firebase 없이 게스트 사용자 모의 생성
  currentUser = { uid: 'guest', isAnonymous: true };
  listeners.forEach((l) => l(currentUser));
  return currentUser;
}

export function createReactNativeAuthPersistence(_storage: unknown): AuthPersistence {
  // RN AsyncStorage 기반이라는 표시만 남김
  void _storage; // 사용 표시로 린트 경고 방지
  return { type: 'react-native-async-storage' };
}

// 아래 소셜 로그인 함수들은 Firebase 실제 구현 전까지 모의 동작을 제공합니다.
// 앱에서는 동일한 API를 사용하므로, 이후 실제 SDK 연동 시 내부 구현만 교체하면 됩니다.

export async function signInWithGoogle(): Promise<AuthUser> {
  // TODO: 실제 구현 시 Expo AuthSession + Firebase Auth(google) 사용
  currentUser = { uid: 'google_mock_uid', isAnonymous: false };
  listeners.forEach((l) => l(currentUser));
  return currentUser;
}

export async function signInWithNaver(): Promise<AuthUser> {
  // TODO: 실제 구현 시 네이버 OAuth → 백엔드 커스텀 토큰 발급 → Firebase signInWithCustomToken
  currentUser = { uid: 'naver_mock_uid', isAnonymous: false };
  listeners.forEach((l) => l(currentUser));
  return currentUser;
}

export async function signInWithKakao(): Promise<AuthUser> {
  // TODO: 실제 구현 시 카카오 OAuth → 백엔드 커스텀 토큰 발급 → Firebase signInWithCustomToken
  currentUser = { uid: 'kakao_mock_uid', isAnonymous: false };
  listeners.forEach((l) => l(currentUser));
  return currentUser;
}

export async function signOut(): Promise<void> {
  currentUser = null;
  listeners.forEach((l) => l(currentUser));
}

export function getCurrentUser(): AuthUser | null {
  return currentUser;
}
