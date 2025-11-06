export type AuthProvider =
  | 'anonymous'
  | 'google'
  | 'naver'
  | 'kakao'
  | 'password';
export type AuthUser = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  providerId?: AuthProvider;
};

export type FirebaseConfig = {
  apiKey: string;
  appId: string;
  projectId: string;
  authDomain?: string;
  storageBucket?: string;
  messagingSenderId?: string;
};

export type AuthPersistence = {
  type: 'react-native-async-storage';
};
