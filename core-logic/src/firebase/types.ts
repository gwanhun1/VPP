// 공유 타입 정의
export type AuthProvider = 'anonymous' | 'google' | 'naver' | 'kakao';
export interface AuthUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  providerId?: AuthProvider;
}

export interface FirebaseConfig {
  apiKey: string;
  appId: string;
  projectId: string;
  authDomain?: string;
  storageBucket?: string;
  messagingSenderId?: string;
}

export interface AuthPersistence {
  // RN AsyncStorage 기반 persistence 인스턴스를 전달받는 용도
  type: 'react-native-async-storage';
}
