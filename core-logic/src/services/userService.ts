import { 
  createUserProfile, 
  getUserProfile,
  createUserStats,
  getUserStats,
  updateUserStats,
  addBookmark,
  getUserBookmarks,
  removeBookmark,
  getUserChatHistory,
  getUserQuizResults,
  getUserRecentActivities,
  addRecentActivity,
  saveQuizResult,
  subscribeToUserStats,
  subscribeToUserBookmarks,
  type UserStats,
  type Bookmark,
  type ChatHistory,
  type QuizResult,
  type RecentActivity,
} from '../firebase/firestore';
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
      // 새 사용자 프로필 생성
      await createUserProfile({
        uid: currentUser.uid,
        displayName: currentUser.displayName || null,
        email: currentUser.email || null,
        photoURL: currentUser.photoURL || null,
        providerId: currentUser.providerId || 'anonymous',
      });

      // 사용자 통계 초기화
      await createUserStats(currentUser.uid);

      // 환영 활동 추가
      await addRecentActivity({
        uid: currentUser.uid,
        type: 'study',
        title: 'VPP 앱 시작',
        description: '전력시장 AI 학습을 시작했습니다!',
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
    await addBookmark({
      uid: currentUser.uid,
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
    await addRecentActivity({
      uid: currentUser.uid,
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
    await removeBookmark(bookmarkId);

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
    // 퀴즈 결과 저장
    await saveQuizResult({
      uid: currentUser.uid,
      quizType,
      score,
      totalQuestions,
      correctAnswers,
      timeSpent,
    });

    // 사용자 통계 업데이트
    const stats = await getUserStats(currentUser.uid);
    if (stats) {
      const newTotalQuizzes = stats.totalQuizzes + 1;
      const newCorrectAnswers = stats.correctAnswers + correctAnswers;
      const newQuizScore = Math.round((newCorrectAnswers / (newTotalQuizzes * totalQuestions)) * 100);

      await updateUserStats(currentUser.uid, {
        totalQuizzes: newTotalQuizzes,
        correctAnswers: newCorrectAnswers,
        quizScore: newQuizScore,
        learnedTerms: stats.learnedTerms + correctAnswers, // 정답 개수만큼 학습한 용어 증가
      });
    }

    // 최근 활동 추가
    await addRecentActivity({
      uid: currentUser.uid,
      type: 'quiz',
      title: '퀴즈 완료',
      description: `${quizType} 퀴즈에서 ${score}점을 획득했습니다.`,
    });
  } catch (error) {
    console.error('퀴즈 결과 저장 실패:', error);
    throw error;
  }
}

// 채팅 기록 조회
export async function fetchUserChatHistory(): Promise<ChatHistory[]> {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.providerId === 'anonymous') {
    return [];
  }

  try {
    return await getUserChatHistory(currentUser.uid);
  } catch (error) {
    console.error('채팅 기록 조회 실패:', error);
    return [];
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

export function subscribeToUserBookmarksUpdates(callback: (bookmarks: Bookmark[]) => void): () => void {
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
