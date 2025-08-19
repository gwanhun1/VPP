import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import type { AuthPersistence, FirebaseConfig } from './types';

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let currentConfig: FirebaseConfig | null = null;

export interface InitOptions {
  useEmulators?: boolean;
  region?: string;
  authPersistence?: AuthPersistence;
}

export function setFirebaseConfig(config: FirebaseConfig, options?: InitOptions): void {
  currentConfig = { ...config };
  
  // 실제 Firebase 앱 초기화
  firebaseApp = initializeApp({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
  });
  
  // Firebase Auth 초기화
  firebaseAuth = getAuth(firebaseApp);
  
  // 옵션 처리 (향후 확장 대비)
  if (options?.useEmulators || options?.region || options?.authPersistence) {
    // TODO: 에뮬레이터 설정 등
  }
}

export function getFirebaseConfig(): FirebaseConfig | null {
  return currentConfig;
}

export function getFirebaseApp(): FirebaseApp | null {
  return firebaseApp;
}

export function getFirebaseAuth(): Auth | null {
  return firebaseAuth;
}
