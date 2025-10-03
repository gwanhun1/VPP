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
  subscribeToUserStats,
  subscribeToUserBookmarks,
  subscribeToUserRecentActivities,
  type UserStats,
  type Bookmark,
  type QuizResult,
  type RecentActivity,
  type ChatSession,
  type ChatMessage,
  getUserChatSessions,
  subscribeToChatMessages,
} from '../firebase/firestore';
import { serverTimestamp, Timestamp } from 'firebase/firestore';

// 모바일 앱 호환성을 위한 타입 별칭
export type ChatHistory = ChatSession;
import { getCurrentUser } from '../firebase/auth';

// ===== 연속 학습일(Study Streak) 계산 유틸 =====
// 중요: 서버 Timestamp를 기록하지만, 날짜 경계 비교는 Asia/Seoul 기준으로 처리
function toSeoulDateString(d: Date): string {
  // Intl을 사용해 'Asia/Seoul' 기준 연-월-일 문자열 생성
  const fmt = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = fmt.formatToParts(d);
  const y = parts.find((p) => p.type === 'year')?.value ?? '0000';
  const m = parts.find((p) => p.type === 'month')?.value ?? '01';
  const day = parts.find((p) => p.type === 'day')?.value ?? '01';
  return `${y}-${m}-${day}`; // YYYY-MM-DD
}

function diffSeoulDays(a: Date, b: Date): number {
  // a, b를 Asia/Seoul 기준 같은 자정으로 정규화 후 일수 차이 계산
  const aStr = toSeoulDateString(a);
  const bStr = toSeoulDateString(b);
  // 간단 비교: 문자열 비교가 같으면 0
  if (aStr === bStr) return 0;
  // 일수 차이 계산을 위해 UTC 자정으로 재해석
  const toUTCFromSeoul = (s: string): number => {
    // s: YYYY-MM-DD (Seoul)
    const [yy, mm, dd] = s.split('-').map((v) => Number(v));
    // 서울 자정 시각을 UTC로 변환: Date.UTC(yy, mm-1, dd) - 9시간
    const utcMs = Date.UTC(yy, mm - 1, dd);
    const seoulOffsetMs = 9 * 60 * 60 * 1000;
    return utcMs - seoulOffsetMs;
  };
  const aMs = toUTCFromSeoul(aStr);
  const bMs = toUTCFromSeoul(bStr);
  const diff = Math.round((bMs - aMs) / (24 * 60 * 60 * 1000));
  return diff;
}

function computeNextStudyDays(prev: UserStats | null, now: Date): number {
  if (!prev || !prev.lastStudyDate) return 1;
  const last = (prev.lastStudyDate as unknown as Timestamp)?.toDate?.() ?? null;
  if (!last) return 1;
  const d = diffSeoulDays(last, now);
  if (d === 0) return prev.studyDays || 1; // 같은 날은 증가하지 않음
  if (d === 1) return (prev.studyDays || 0) + 1; // 하루 차이면 +1
  return 1; // 그 외는 리셋
}

// 외부에서 재사용 가능: 어떤 학습 활동이 발생했을 때 호출
export async function recordStudyActivity(): Promise<void> {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.providerId === 'anonymous') {
    return; // 익명은 무시
  }
  try {
    const prev = await getUserStats(currentUser.uid);
    const nextDays = computeNextStudyDays(prev, new Date());
    await updateUserStats(currentUser.uid, {
      studyDays: nextDays,
      lastStudyDate: serverTimestamp() as Timestamp,
    });
  } catch (error) {
    console.error('연속 학습일 갱신 실패:', error);
  }
}

// 사용자 프로필 초기화 (Auth 상태 변경 시 호출)
export async function initializeUserProfile(): Promise<void> {
  return initializeUser();
}

// 채팅 기록 조회 (모바일용): 최근 업데이트 순 정렬된 세션 목록 반환
export async function fetchUserChatHistory(
  limitCount = 20
): Promise<ChatHistory[]> {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.providerId === 'anonymous') {
    return [];
  }

  try {
    const sessions = await getUserChatSessions(currentUser.uid, limitCount);
    // 최신 업데이트 순으로 이미 정렬되어 오지만, 방어적으로 정렬 유지
    return sessions as ChatHistory[];
  } catch (error) {
    console.error('채팅 기록 조회 실패:', error);
    return [];
  }
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
export async function addTermBookmark(
  termId: string,
  termName: string,
  definition: string,
  category: string
): Promise<void> {
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

    // 통계 업데이트 (+ 연속학습일 갱신 포함)
    const stats = await getUserStats(currentUser.uid);
    if (stats) {
      const nextDays = computeNextStudyDays(stats, new Date());
      await updateUserStats(currentUser.uid, {
        bookmarks: stats.bookmarks + 1,
        studyDays: nextDays,
        lastStudyDate: serverTimestamp() as Timestamp,
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

    // 사용자 통계 업데이트 (+ 연속학습일 갱신 포함)
    const currentStats = await getUserStats(currentUser.uid);
    if (currentStats) {
      const newTotalQuizzes = (currentStats.totalQuizzes || 0) + 1;
      const newCorrectAnswers =
        (currentStats.correctAnswers || 0) + correctAnswers;
      const newQuizScore = Math.round(
        (newCorrectAnswers / (newTotalQuizzes * totalQuestions)) * 100
      );
      const nextDays = computeNextStudyDays(currentStats, new Date());

      await updateUserStats(currentUser.uid, {
        totalQuizzes: newTotalQuizzes,
        correctAnswers: newCorrectAnswers,
        quizScore: newQuizScore,
        studyDays: nextDays,
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

// 채팅 관련 함수들은 firestore.ts로 이동됨
// 웹에서는 직접 firestore 함수들을 사용하세요

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
export function subscribeToUserStatsUpdates(
  callback: (stats: UserStats | null) => void
): () => void {
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

export function subscribeToUserBookmarksUpdates(
  callback: (bookmarks: Array<Bookmark & { id: string }>) => void
): () => void {
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

export function subscribeToUserActivitiesUpdates(
  callback: (activities: Array<RecentActivity & { id: string }>) => void
): () => void {
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

export function subscribeToChatMessagesUpdates(
  sessionId: string,
  callback: (messages: Array<ChatMessage & { id: string }>) => void
): () => void {
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
