import type { AuthUser, AuthPersistence } from './types';

// 간단한 이벤트 구독 패턴으로 onAuthStateChanged 흉내
export type AuthStateCallback = (user: AuthUser | null) => void;

let currentUser: AuthUser | null = null;

export function onAuthStateChanged(cb: AuthStateCallback): () => void {
  // 첫 호출 시 비동기적으로 현재 사용자 전달
  const timeout = setTimeout(() => cb(currentUser), 0);
  return () => clearTimeout(timeout);
}

export async function signInAsGuest(): Promise<AuthUser> {
  // 실제 Firebase 없이 게스트 사용자 모의 생성
  currentUser = { uid: 'guest', isAnonymous: true };
  return currentUser;
}

export function createReactNativeAuthPersistence(_storage: unknown): AuthPersistence {
  // RN AsyncStorage 기반이라는 표시만 남김
  return { type: 'react-native-async-storage' };
}
