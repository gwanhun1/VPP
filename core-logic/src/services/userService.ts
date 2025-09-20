import { 
  getUserProfile,
  getUserStats,
  updateUserStats,
  addBookmark,
  getUserBookmarks,
  removeBookmark,
  getUserQuizResults,
  getUserRecentActivities,
  addRecentActivity,
  addQuizResult,
  initializeNewUser,
  createChatSession,
  getUserChatSessions,
  deleteChatSession,
  addChatMessage,
  getChatMessages,
  updateChatSession,
  subscribeToUserStats,
  subscribeToUserBookmarks,
  subscribeToUserRecentActivities,
  subscribeToChatMessages,
  type UserStats,
  type Bookmark,
  type QuizResult,
  type RecentActivity,
  type ChatSession,
  type ChatMessage,
} from '../firebase/firestore';
import { serverTimestamp, Timestamp } from 'firebase/firestore';

// 모바일 앱 호환성을 위한 타입 별칭
export type ChatHistory = ChatSession;
import { getCurrentUser } from '../firebase/auth';

// 사용자 프로필 초기화 (Auth 상태 변경 시 호출)
export async function initializeUserProfile(): Promise<void> {
  return initializeUser();
}

// 사용자 초기화 서비스 (기존 함수명 유지)
export async function initializeUser(): Promise<void> {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.providerId === 'anonymous') {
    throw new Error('로그인된 사용자가 없습니다.');
  }

  try {
    // 기존 프로필 확인
    const existingProfile = await getUserProfile(currentUser.uid);
    
    if (!existingProfile) {
      // 새 사용자 초기화 (프로필, 통계, 첫 활동 모두 포함)
      await initializeNewUser({
        uid: currentUser.uid,
        displayName: currentUser.displayName || null,
        email: currentUser.email || null,
        photoURL: currentUser.photoURL || null,
        providerId: currentUser.providerId || 'anonymous',
      });
    }
  } catch (error) {
    console.error('사용자 초기화 실패:', error);
    throw error;
  }
}

// 사용자 통계 조회
export async function fetchUserStats(): Promise<UserStats | null> {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.providerId === 'anonymous') {
    return null;
  }

  try {
    return await getUserStats(currentUser.uid);
  } catch (error) {
    console.error('사용자 통계 조회 실패:', error);
    return null;
  }
}

// 북마크 관리
export async function addTermBookmark(termId: string, termName: string, definition: string, category: string): Promise<void> {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.providerId === 'anonymous') {
    throw new Error('로그인이 필요합니다.');
  }

  try {
    await addBookmark(currentUser.uid, {
      termId,
      termName,
      definition,
      category,
    });

    // 통계 업데이트
    const stats = await getUserStats(currentUser.uid);
    if (stats) {
      await updateUserStats(currentUser.uid, {
        bookmarks: stats.bookmarks + 1,
      });
    }

    // 최근 활동 추가
    await addRecentActivity(currentUser.uid, {
      type: 'bookmark',
      title: '용어 북마크',
      description: `"${termName}" 용어를 북마크했습니다.`,
    });
  } catch (error) {
    console.error('북마크 추가 실패:', error);
    throw error;
  }
}

export async function fetchUserBookmarks(): Promise<Bookmark[]> {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.providerId === 'anonymous') {
    return [];
  }

  try {
    return await getUserBookmarks(currentUser.uid);
  } catch (error) {
    console.error('북마크 조회 실패:', error);
    return [];
  }
}

export async function removeTermBookmark(bookmarkId: string): Promise<void> {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.providerId === 'anonymous') {
    throw new Error('로그인이 필요합니다.');
  }

  try {
    await removeBookmark(currentUser.uid, bookmarkId);

    // 통계 업데이트
    const stats = await getUserStats(currentUser.uid);
    if (stats && stats.bookmarks > 0) {
      await updateUserStats(currentUser.uid, {
        bookmarks: stats.bookmarks - 1,
      });
    }
  } catch (error) {
    console.error('북마크 삭제 실패:', error);
    throw error;
  }
}

// 퀴즈 결과 저장
export async function saveUserQuizResult(
  quizType: string,
  score: number,
  totalQuestions: number,
  correctAnswers: number,
  timeSpent: number
): Promise<void> {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.providerId === 'anonymous') {
    throw new Error('로그인이 필요합니다.');
  }

  try {
    await addQuizResult(currentUser.uid, {
      quizId: null, // 템플릿 연결 시 사용
      quizType,
      score,
      totalQuestions,
      correctAnswers,
      timeSpent,
    });

    // 사용자 통계 업데이트
    const currentStats = await getUserStats(currentUser.uid);
    if (currentStats) {
      const newTotalQuizzes = (currentStats.totalQuizzes || 0) + 1;
      const newCorrectAnswers = (currentStats.correctAnswers || 0) + correctAnswers;
      const newQuizScore = Math.round((newCorrectAnswers / (newTotalQuizzes * totalQuestions)) * 100);
      
      await updateUserStats(currentUser.uid, {
        totalQuizzes: newTotalQuizzes,
        correctAnswers: newCorrectAnswers,
        quizScore: newQuizScore,
        lastStudyDate: serverTimestamp() as Timestamp,
      });
    }

    // 최근 활동 추가
    await addRecentActivity(currentUser.uid, {
      type: 'quiz',
      title: '퀴즈 완료',
      description: `${quizType}에서 ${score}점을 획득했습니다.`,
    });
  } catch (error) {
    console.error('퀴즈 결과 저장 실패:', error);
    throw error;
  }
}

// 채팅 세션 관리
export async function createUserChatSession(title: string | null, platform: 'web' | 'mobile', source: 'webview' | 'native'): Promise<string> {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.providerId === 'anonymous') {
    throw new Error('로그인이 필요합니다.');
  }

  try {
    const sessionId = await createChatSession(currentUser.uid, {
      userId: currentUser.uid,
      title,
      lastMessage: null,
      messageCount: 0,
      platform,
      source,
    });

    // 최근 활동 추가
    await addRecentActivity(currentUser.uid, {
      type: 'chat',
      title: '새 채팅 시작',
      description: 'AI와 새로운 대화를 시작했습니다.',
    });

    return sessionId;
  } catch (error) {
    console.error('채팅 세션 생성 실패:', error);
    throw error;
  }
}

export async function fetchUserChatSessions(): Promise<Array<ChatSession & { id: string }>> {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.providerId === 'anonymous') {
    return [];
  }

  try {
    return await getUserChatSessions(currentUser.uid);
  } catch (error) {
    console.error('채팅 세션 조회 실패:', error);
    return [];
  }
}

// 모바일 앱 호환성을 위한 별칭 함수
export async function fetchUserChatHistory(): Promise<Array<ChatSession & { id: string }>> {
  return fetchUserChatSessions();
}

export async function fetchChatMessages(sessionId: string): Promise<Array<ChatMessage & { id: string }>> {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.providerId === 'anonymous') {
    return [];
  }

  try {
    return await getChatMessages(currentUser.uid, sessionId);
  } catch (error) {
    console.error('채팅 메시지 조회 실패:', error);
    return [];
  }
}

export async function sendChatMessage(sessionId: string, text: string, role: 'user' | 'assistant', platform: 'web' | 'mobile', source: 'webview' | 'native'): Promise<string> {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.providerId === 'anonymous') {
    throw new Error('로그인이 필요합니다.');
  }

  try {
    const messageId = await addChatMessage(currentUser.uid, sessionId, {
      role,
      text,
      platform,
      source,
    });
    return messageId;
  } catch (error) {
    console.error('채팅 메시지 전송 실패:', error);
    throw error;
  }
}

export async function deleteUserChatSession(sessionId: string): Promise<void> {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.providerId === 'anonymous') {
    throw new Error('로그인이 필요합니다.');
  }

  try {
    await deleteChatSession(currentUser.uid, sessionId);
  } catch (error) {
    console.error('채팅 세션 삭제 실패:', error);
    throw error;
  }
}

// 최근 활동 조회
export async function fetchUserRecentActivities(): Promise<RecentActivity[]> {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.providerId === 'anonymous') {
    return [];
  }

  try {
    return await getUserRecentActivities(currentUser.uid);
  } catch (error) {
    console.error('최근 활동 조회 실패:', error);
    return [];
  }
}

// 퀴즈 기록 조회
export async function fetchUserQuizHistory(): Promise<QuizResult[]> {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.providerId === 'anonymous') {
    return [];
  }

  try {
    return await getUserQuizResults(currentUser.uid);
  } catch (error) {
    console.error('퀴즈 기록 조회 실패:', error);
    return [];
  }
}

// 실시간 구독 서비스
export function subscribeToUserStatsUpdates(callback: (stats: UserStats | null) => void): () => void {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.providerId === 'anonymous') {
    callback(null);
    return () => {
      // 익명 사용자의 경우 구독 해제할 것이 없음
    };
  }

  try {
    return subscribeToUserStats(currentUser.uid, callback);
  } catch (error) {
    console.error('통계 구독 실패:', error);
    callback(null);
    return () => {
      // 오류 발생 시 구독 해제할 것이 없음
    };
  }
}

export function subscribeToUserBookmarksUpdates(callback: (bookmarks: Array<Bookmark & { id: string }>) => void): () => void {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.providerId === 'anonymous') {
    callback([]);
    return () => {
      // 익명 사용자의 경우 구독 해제할 것이 없음
    };
  }

  try {
    return subscribeToUserBookmarks(currentUser.uid, callback);
  } catch (error) {
    console.error('북마크 구독 실패:', error);
    callback([]);
    return () => {
      // 오류 발생 시 구독 해제할 것이 없음
    };
  }
}

export function subscribeToUserActivitiesUpdates(callback: (activities: Array<RecentActivity & { id: string }>) => void): () => void {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.providerId === 'anonymous') {
    callback([]);
    return () => {
      // 익명 사용자의 경우 구독 해제할 것이 없음
    };
  }

  try {
    return subscribeToUserRecentActivities(currentUser.uid, callback);
  } catch (error) {
    console.error('최근 활동 구독 실패:', error);
    callback([]);
    return () => {
      // 오류 발생 시 구독 해제할 것이 없음
    };
  }
}

export function subscribeToChatMessagesUpdates(sessionId: string, callback: (messages: Array<ChatMessage & { id: string }>) => void): () => void {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.providerId === 'anonymous') {
    callback([]);
    return () => {
      // 익명 사용자의 경우 구독 해제할 것이 없음
    };
  }

  try {
    return subscribeToChatMessages(currentUser.uid, sessionId, callback);
  } catch (error) {
    console.error('채팅 메시지 구독 실패:', error);
    callback([]);
    return () => {
      // 오류 발생 시 구독 해제할 것이 없음
    };
  }
}
