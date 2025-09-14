import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase 설정 타입
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// 웹뷰에서 모바일로부터 받은 Firebase 설정을 저장
let firebaseConfig: FirebaseConfig | null = null;
let firebaseApp: any = null;
let auth: any = null;
let db: any = null;
let functions: any = null;

/**
 * 모바일 앱으로부터 Firebase 설정을 받아 초기화
 */
export function initializeFirebaseFromMobile(config: FirebaseConfig) {
  if (firebaseApp) return; // 이미 초기화됨

  firebaseConfig = config;
  
  try {
    // Firebase 앱 초기화
    firebaseApp = initializeApp(config);
    
    // Auth 초기화
    auth = getAuth(firebaseApp);
    
    // Firestore 초기화
    db = getFirestore(firebaseApp);
    
    // Functions 초기화
    functions = getFunctions(firebaseApp);
    
    // 개발 환경에서 에뮬레이터 연결 (선택사항)
    if (process.env.NODE_ENV === 'development') {
      // 에뮬레이터가 실행 중인 경우에만 연결
      try {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        connectFirestoreEmulator(db, 'localhost', 8080);
        connectFunctionsEmulator(functions, 'localhost', 5001);
      } catch (error) {
        // 에뮬레이터가 실행되지 않은 경우 무시
        console.debug('Firebase 에뮬레이터 연결 실패 (정상적인 상황일 수 있음):', error);
      }
    }
    
    console.log('[Firebase] 웹에서 Firebase 초기화 완료');
  } catch (error) {
    console.error('[Firebase] 초기화 실패:', error);
    throw error;
  }
}

/**
 * 환경변수로부터 Firebase 설정을 가져와 초기화 (fallback)
 */
export function initializeFirebaseFromEnv() {
  if (firebaseApp) return; // 이미 초기화됨

  const config: FirebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  };

  // 필수 설정이 없으면 초기화하지 않음
  if (!config.apiKey || !config.projectId) {
    console.warn('[Firebase] 환경변수 설정이 불완전하여 Firebase 초기화를 건너뜁니다.');
    return;
  }

  initializeFirebaseFromMobile(config);
}

// Firebase 서비스 getter 함수들
export function getFirebaseAuth() {
  if (!auth) {
    console.warn('[Firebase] Auth가 초기화되지 않았습니다.');
  }
  return auth;
}

export function getFirestore() {
  if (!db) {
    console.warn('[Firebase] Firestore가 초기화되지 않았습니다.');
  }
  return db;
}

export function getFunctionsInstance() {
  if (!functions) {
    console.warn('[Firebase] Functions가 초기화되지 않았습니다.');
  }
  return functions;
}

export function getFirebaseApp() {
  return firebaseApp;
}

export function isFirebaseInitialized(): boolean {
  return !!firebaseApp;
}
