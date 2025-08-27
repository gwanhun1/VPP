import type { AuthUser, AuthPersistence } from './types';

export type AuthStateCallback = (user: AuthUser | null) => void;

// 최소 스텁 구현: 외부 SDK에 의존하지 않고 항상 null 사용자 반환
export function onAuthStateChanged(cb: AuthStateCallback): () => void {
  cb(null);
  return () => {
    // no-op
  };
}

export async function signInAsGuest(): Promise<AuthUser> {
  // 소셜/Firebase 제거: 게스트 로그인도 비활성화 (필요 시 추후 구현)
  throw new Error('로그인 기능이 비활성화되었습니다. 구성 후 다시 시도하세요.');
}

export function createReactNativeAuthPersistence(_storage: unknown): AuthPersistence {
  void _storage;
  return { type: 'react-native-async-storage' };
}

export function initializeGoogleSignIn(): void {
  // no-op (제거됨)
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

export async function signOut(): Promise<void> {
  // no-op
}

export function getCurrentUser(): AuthUser | null {
  return null;
}
