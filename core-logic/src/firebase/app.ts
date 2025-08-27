import type { FirebaseConfig } from './types';

let currentConfig: FirebaseConfig | null = null;

export function setFirebaseConfig(config: FirebaseConfig): void {
  // SDK 제거: 설정만 보관
  currentConfig = { ...config };
}

export function getFirebaseConfig(): FirebaseConfig | null {
  return currentConfig;
}

export function getFirebaseApp(): null {
  // SDK 제거: 항상 null
  return null;
}

export function getFirebaseAuth(): null {
  // SDK 제거: 항상 null
  return null;
}
