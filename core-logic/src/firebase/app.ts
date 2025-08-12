import type { AuthPersistence, FirebaseConfig } from './types';

let currentConfig: FirebaseConfig | null = null;

export interface InitOptions {
  useEmulators?: boolean;
  region?: string;
  authPersistence?: AuthPersistence;
}

export function setFirebaseConfig(config: FirebaseConfig, options?: InitOptions): void {
  // 실제 Firebase 초기화 대신 설정값만 보관
  currentConfig = { ...config };
  // 옵션 읽기(미사용 변수 린트 회피용 및 향후 확장 대비)
  if (options?.useEmulators || options?.region || options?.authPersistence) {
    // no-op
  }
}

export function getFirebaseConfig(): FirebaseConfig | null {
  return currentConfig;
}
