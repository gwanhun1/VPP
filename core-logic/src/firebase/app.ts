import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { FirebaseConfig } from './types';

// Firebase 원본 함수들을 re-export
export { getFirestore } from 'firebase/firestore';

let currentConfig: FirebaseConfig | null = null;

export function setFirebaseConfig(config: FirebaseConfig): void {
  currentConfig = { ...config };
}

export function getFirebaseConfig(): FirebaseConfig | null {
  return currentConfig;
}

let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let firestore: ReturnType<typeof getFirestore> | null = null;

export function initializeFirebase(): void {
  if (!currentConfig) throw new Error('Firebase config가 설정되지 않았습니다.');
  if (!app) {
    app = initializeApp(currentConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
  }
}

export function getFirebaseApp(): ReturnType<typeof initializeApp> | null {
  return app;
}

export function getFirebaseAuth(): ReturnType<typeof getAuth> | null {
  return auth;
}

export function getFirebaseFirestore(): ReturnType<typeof getFirestore> | null {
  return firestore;
}
