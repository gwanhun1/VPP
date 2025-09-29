import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { AuthUser } from '@vpp/core-logic';
import {
  setFirebaseConfig,
  initializeFirebase,
  getFirebaseAuth,
  updateUserDevice,
  addRecentActivity,
} from '@vpp/core-logic';

// 개발 환경에서 사용할 Firebase 설정
const DEV_FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/**
 * 웹 브라우저 환경에서의 Firebase 인증을 처리하는 훅
 * 개발 환경에서만 동작하며, Firebase 설정을 환경변수에서 가져와 초기화
 */
export function useWebAuth() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 개발 환경에서만 Firebase 초기화
    if (import.meta.env.DEV) {
      try {
        // Firebase 설정
        setFirebaseConfig(DEV_FIREBASE_CONFIG);
        initializeFirebase();
        setFirebaseReady(true);

        // 인증 상태 변화 감지
        const auth = getFirebaseAuth();
        if (auth) {
          // 웹 브라우저에서는 기본적으로 로그아웃 상태로 시작
          auth.signOut().catch(() => {
            // 로그아웃 실패는 무시 (이미 로그아웃 상태일 수 있음)
          });

          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
              const authUser: AuthUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                providerId: user.providerData[0]?.providerId || 'password',
                emailVerified: user.emailVerified,
              };

              setAuthUser(authUser);

              // 웹 디바이스 정보 업데이트
              try {
                const deviceId = `web_${Date.now()}`;
                await updateUserDevice(user.uid, deviceId, {
                  expoPushToken: null,
                  fcmToken: null,
                  platform: 'web',
                  appVersion: '1.0.0',
                });

                // 로그인 활동 기록
                await addRecentActivity(user.uid, {
                  type: 'study',
                  title: '웹에서 로그인',
                  description: 'VPP 웹 서비스에 접속했습니다.',
                });
              } catch (error) {
                console.warn('사용자 정보 업데이트 실패:', error);
              }
            } else {
              setAuthUser(null);
            }
            setIsLoading(false);
          });

          return unsubscribe;
        }
      } catch (error) {
        console.error('Firebase 초기화 실패:', error);
        setFirebaseReady(false);
        setIsLoading(false);
      }
    } else {
      // 프로덕션 환경에서는 웹 로그인 비활성화
      setIsLoading(false);
    }
  }, []);

  const login = (user: AuthUser) => {
    setAuthUser(user);
  };

  const logout = async () => {
    const auth = getFirebaseAuth();
    if (auth) {
      try {
        await auth.signOut();
        setAuthUser(null);
      } catch (error) {
        console.error('로그아웃 실패:', error);
      }
    }
  };

  return {
    authUser,
    firebaseReady,
    isLoading,
    login,
    logout,
  };
}
