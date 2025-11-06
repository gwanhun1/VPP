import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import type { FirebaseConfig } from './types';

export { getFirestore } from 'firebase/firestore';

let currentConfig: FirebaseConfig | null = null;
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;
let isInitialized = false;
let isInitializing = false;

export function setFirebaseConfig(config: FirebaseConfig): void {
  if (isInitialized) {
    console.warn('[Firebase] 이미 초기화된 상태에서 설정 변경 시도. 무시됩니다.');
    return;
  }
  currentConfig = config;
}

export function getFirebaseConfig(): FirebaseConfig | null {
  return currentConfig;
}

export function initializeFirebase(): void {
  if (isInitialized) {
    return;
  }

  if (isInitializing) {
    console.warn('[Firebase] 이미 초기화 진행 중입니다.');
    return;
  }

  if (!currentConfig) {
    throw new Error('Firebase config가 설정되지 않았습니다. setFirebaseConfig()를 먼저 호출하세요.');
  }

  try {
    isInitializing = true;
    app = initializeApp(currentConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
    isInitialized = true;
  } catch (error) {
    isInitializing = false;
    throw error;
  } finally {
    isInitializing = false;
  }
}

export function getFirebaseApp(): FirebaseApp | null {
  return app;
}

export function getFirebaseAuth(): Auth | null {
  return auth;
}

export function getFirebaseFirestore(): Firestore | null {
  return firestore;
}

export function isFirebaseInitialized(): boolean {
  return isInitialized;
}

export function resetFirebaseForTesting(): void {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('resetFirebaseForTesting은 테스트 환경에서만 사용 가능합니다.');
  }
  currentConfig = null;
  app = null;
  auth = null;
  firestore = null;
  isInitialized = false;
  isInitializing = false;
}
