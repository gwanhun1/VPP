import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import {
  getFirestore as getFirestoreInstance,
  connectFirestoreEmulator,
  type Firestore,
} from 'firebase/firestore';
import {
  getFunctions,
  connectFunctionsEmulator,
  type Functions,
} from 'firebase/functions';

type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let functions: Functions | null = null;

export function initializeFirebaseFromMobile(config: FirebaseConfig) {
  if (firebaseApp) return;

  try {
    const app = initializeApp(config);
    const authInstance = getAuth(app);
    const dbInstance = getFirestoreInstance(app);
    const functionsInstance = getFunctions(app);

    firebaseApp = app;
    auth = authInstance;
    db = dbInstance;
    functions = functionsInstance;

    if (
      process.env.NODE_ENV === 'development' &&
      authInstance &&
      dbInstance &&
      functionsInstance
    ) {
      try {
        connectAuthEmulator(authInstance, 'http://localhost:9099', {
          disableWarnings: true,
        });
        connectFirestoreEmulator(dbInstance, 'localhost', 8080);
        connectFunctionsEmulator(functionsInstance, 'localhost', 5001);
      } catch (error) {
        console.debug('Firebase 에뮬레이터 연결 실패:', error);
      }
    }
  } catch (error) {
    console.error('[Firebase] 초기화 실패:', error);
    throw error;
  }
}

export function initializeFirebaseFromEnv() {
  if (firebaseApp) return;

  const config: FirebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  };

  if (!config.apiKey || !config.projectId) {
    console.warn(
      '[Firebase] 환경변수 설정이 불완전하여 Firebase 초기화를 건너뜁니다.'
    );
    return;
  }

  initializeFirebaseFromMobile(config);
}

export function getFirebaseAuth(): Auth | null {
  if (!auth) {
    console.warn('[Firebase] Auth가 초기화되지 않았습니다.');
  }
  return auth;
}

export function getFirestore(): Firestore | null {
  if (!db) {
    console.warn('[Firebase] Firestore가 초기화되지 않았습니다.');
  }
  return db;
}

export function getFunctionsInstance(): Functions | null {
  if (!functions) {
    console.warn('[Firebase] Functions가 초기화되지 않았습니다.');
  }
  return functions;
}

export function getFirebaseApp(): FirebaseApp | null {
  return firebaseApp;
}

export function isFirebaseInitialized(): boolean {
  return !!firebaseApp;
}
