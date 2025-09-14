import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot, 
  serverTimestamp,
  Timestamp,
  updateDoc,
  doc
} from 'firebase/firestore';
import { getFirestore } from '../lib/firebase';
import type { AuthUser } from '@vpp/core-logic';

// 사용자 활동 타입 정의
export interface UserActivity {
  id: string;
  userId: string;
  activityType: 'chat_message' | 'page_view' | 'quiz_attempt' | 'login' | 'logout';
  details: {
    message?: string;
    page?: string;
    quizId?: string;
    score?: number;
    platform: 'web' | 'mobile';
    source: 'webview' | 'native';
    userAgent?: string;
  };
  timestamp: Timestamp;
  sessionId?: string;
}

// 사용자 상태 타입 정의
export interface UserStatus {
  id: string;
  userId: string;
  isOnline: boolean;
  lastSeen: Timestamp;
  currentPlatform: 'web' | 'mobile';
  currentSource: 'webview' | 'native';
  activeSessionId?: string;
}

/**
 * 사용자 활동 로그 저장
 */
export async function logUserActivity(
  authUser: AuthUser,
  activityType: UserActivity['activityType'],
  details: Partial<UserActivity['details']>,
  sessionId?: string
): Promise<string> {
  const db = getFirestore();
  if (!db) {
    console.warn('[UserActivity] Firestore가 초기화되지 않아 활동 로그를 건너뜁니다.');
    return '';
  }

  const activityData: Omit<UserActivity, 'id'> = {
    userId: authUser.uid,
    activityType,
    details: {
      platform: 'web',
      source: 'webview',
      userAgent: navigator.userAgent,
      ...details,
    },
    timestamp: serverTimestamp() as Timestamp,
    sessionId,
  };

  try {
    const docRef = await addDoc(collection(db, 'userActivities'), activityData);
    console.log('[UserActivity] 활동 로그 저장 완료:', activityType, docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('[UserActivity] 활동 로그 저장 실패:', error);
    return '';
  }
}

/**
 * 사용자 온라인 상태 업데이트
 */
export async function updateUserStatus(
  authUser: AuthUser,
  isOnline: boolean,
  sessionId?: string
): Promise<void> {
  const db = getFirestore();
  if (!db) {
    console.warn('[UserActivity] Firestore가 초기화되지 않아 상태 업데이트를 건너뜁니다.');
    return;
  }

  const statusData: Omit<UserStatus, 'id'> = {
    userId: authUser.uid,
    isOnline,
    lastSeen: serverTimestamp() as Timestamp,
    currentPlatform: 'web',
    currentSource: 'webview',
    activeSessionId: sessionId,
  };

  try {
    // 사용자 상태 문서 ID는 userId와 동일하게 설정
    const statusRef = doc(db, 'userStatus', authUser.uid);
    await updateDoc(statusRef, statusData);
    console.log('[UserActivity] 사용자 상태 업데이트 완료:', isOnline ? 'online' : 'offline');
  } catch (error) {
    // 문서가 없는 경우 새로 생성
    try {
      await addDoc(collection(db, 'userStatus'), {
        id: authUser.uid,
        ...statusData,
      });
      console.log('[UserActivity] 사용자 상태 문서 생성 완료');
    } catch (createError) {
      console.error('[UserActivity] 사용자 상태 업데이트/생성 실패:', createError);
    }
  }
}

/**
 * 사용자 최근 활동 조회
 */
export function subscribeToUserActivities(
  authUser: AuthUser,
  onActivitiesUpdate: (activities: UserActivity[]) => void,
  limitCount: number = 50
): () => void {
  const db = getFirestore();
  if (!db) {
    console.warn('[UserActivity] Firestore가 초기화되지 않아 활동 구독을 건너뜁니다.');
    return () => {};
  }

  const q = query(
    collection(db, 'userActivities'),
    where('userId', '==', authUser.uid),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const activities: UserActivity[] = [];
      querySnapshot.forEach((doc) => {
        activities.push({
          id: doc.id,
          ...doc.data(),
        } as UserActivity);
      });
      
      onActivitiesUpdate(activities);
    },
    (error) => {
      console.error('[UserActivity] 활동 구독 오류:', error);
    }
  );

  return unsubscribe;
}

/**
 * 페이지 방문 로그
 */
export function logPageView(authUser: AuthUser, page: string, sessionId?: string) {
  return logUserActivity(authUser, 'page_view', { page }, sessionId);
}

/**
 * 채팅 메시지 로그
 */
export function logChatMessage(authUser: AuthUser, message: string, sessionId?: string) {
  return logUserActivity(authUser, 'chat_message', { message }, sessionId);
}

/**
 * 로그인 로그
 */
export function logLogin(authUser: AuthUser) {
  return logUserActivity(authUser, 'login', {});
}

/**
 * 로그아웃 로그
 */
export function logLogout(authUser: AuthUser) {
  return logUserActivity(authUser, 'logout', {});
}
