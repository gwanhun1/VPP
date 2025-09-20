import { 
  addRecentActivity,
  getUserRecentActivities,
  subscribeToUserActivitiesUpdates,
  updateUserDevice,
  type RecentActivity,
  type AuthUser
} from '@vpp/core-logic';

// 타입들은 @vpp/core-logic에서 가져옴
export type { RecentActivity as UserActivity } from '@vpp/core-logic';

// 활동 타입 매핑
type ActivityTypeMapping = {
  'chat_message': 'chat';
  'page_view': 'study';
  'quiz_attempt': 'quiz';
  'login': 'study';
  'logout': 'study';
};

const mapActivityType = (activityType: keyof ActivityTypeMapping): RecentActivity['type'] => {
  const mapping: ActivityTypeMapping = {
    'chat_message': 'chat',
    'page_view': 'study',
    'quiz_attempt': 'quiz',
    'login': 'study',
    'logout': 'study',
  };
  return mapping[activityType];
};

/**
 * 사용자 활동 로그 저장
 */
export async function logUserActivity(
  authUser: AuthUser,
  activityType: 'chat_message' | 'page_view' | 'quiz_attempt' | 'login' | 'logout',
  details: {
    message?: string;
    page?: string;
    quizId?: string;
    score?: number;
    platform?: 'web' | 'mobile';
    source?: 'webview' | 'native';
    userAgent?: string;
  },
  sessionId?: string
): Promise<string> {
  try {
    const mappedType = mapActivityType(activityType);
    let title = '';
    let description = '';

    switch (activityType) {
      case 'chat_message':
        title = '채팅 메시지';
        description = details.message ? `메시지: ${details.message.substring(0, 50)}...` : 'AI와 대화했습니다.';
        break;
      case 'page_view':
        title = '페이지 방문';
        description = details.page ? `${details.page} 페이지를 방문했습니다.` : '페이지를 방문했습니다.';
        break;
      case 'quiz_attempt':
        title = '퀴즈 시도';
        description = details.score ? `퀴즈에서 ${details.score}점을 획득했습니다.` : '퀴즈를 시도했습니다.';
        break;
      case 'login':
        title = '로그인';
        description = 'VPP 서비스에 로그인했습니다.';
        break;
      case 'logout':
        title = '로그아웃';
        description = 'VPP 서비스에서 로그아웃했습니다.';
        break;
    }

    const activityId = await addRecentActivity(authUser.uid, {
      type: mappedType,
      title,
      description,
    });
    
    console.log('[UserActivity] 활동 로그 저장 완료:', activityType, activityId);
    return activityId;
  } catch (error) {
    console.error('[UserActivity] 활동 로그 저장 실패:', error);
    return '';
  }
}

/**
 * 사용자 디바이스 상태 업데이트
 */
export async function updateUserStatus(
  authUser: AuthUser,
  isOnline: boolean,
  sessionId?: string
): Promise<void> {
  try {
    // 웹 디바이스 정보 업데이트
    const deviceId = 'web-' + (sessionId || 'default');
    await updateUserDevice(authUser.uid, deviceId, {
      expoPushToken: null,
      fcmToken: null,
      platform: 'web',
      appVersion: '1.0.0', // 실제 앱 버전으로 교체 필요
    });
    
    console.log('[UserActivity] 사용자 디바이스 상태 업데이트 완료:', isOnline ? 'online' : 'offline');
  } catch (error) {
    console.error('[UserActivity] 사용자 상태 업데이트 실패:', error);
  }
}

/**
 * 사용자 최근 활동 조회
 */
export function subscribeToUserActivities(
  authUser: AuthUser,
  onActivitiesUpdate: (activities: Array<RecentActivity & { id: string }>) => void,
  limitCount: number = 50
): () => void {
  try {
    return subscribeToUserActivitiesUpdates((activities) => {
      console.log('[UserActivity] 활동 업데이트:', activities.length, '개');
      onActivitiesUpdate(activities);
    });
  } catch (error) {
    console.error('[UserActivity] 활동 구독 오류:', error);
    return () => {};
  }
}

/**
 * 사용자 최근 활동 조회 (일회성)
 */
export async function fetchUserActivities(authUser: AuthUser): Promise<Array<RecentActivity & { id: string }>> {
  try {
    const activities = await getUserRecentActivities(authUser.uid);
    console.log('[UserActivity] 활동 조회 완료:', activities.length, '개');
    return activities;
  } catch (error) {
    console.error('[UserActivity] 활동 조회 실패:', error);
    return [];
  }
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
 * 퀴즈 시도 로그
 */
export function logQuizAttempt(authUser: AuthUser, quizId: string, score: number, sessionId?: string) {
  return logUserActivity(authUser, 'quiz_attempt', { quizId, score }, sessionId);
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
