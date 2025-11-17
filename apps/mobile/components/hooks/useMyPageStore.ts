import { create } from 'zustand';
import {
  onAuthStateChanged,
  type AuthUser,
  type ChatHistory,
  type ChatBookmarkedMessage,
  type QuizResult,
  type RecentActivity,
  fetchUserStats,
  fetchUserQuizHistory,
  fetchUserRecentActivities,
  fetchUserChatHistory,
  countUserBookmarkedMessages,
  fetchUserBookmarkedMessages,
} from '@vpp/core-logic';
import { useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export type MyPageStats = {
  learnedTerms: number;
  bookmarks: number;
  quizScore: number;
  studyDays: number;
};

type MyPageState = {
  user: AuthUser | null;
  initialized: boolean;

  stats: MyPageStats;
  statsLoading: boolean;

  bookmarks: ChatBookmarkedMessage[];
  bookmarksLoading: boolean;

  recentActivities: Array<RecentActivity & { id: string }>;
  recentLoading: boolean;

  chatHistory: ChatHistory[];
  chatHistoryLoading: boolean;

  quizHistory: QuizResult[];
  quizHistoryLoading: boolean;

  setUser: (user: AuthUser | null) => void;
  clearAll: () => void;
  loadStats: () => Promise<void>;
  loadBookmarks: () => Promise<void>;
  loadRecentActivities: () => Promise<void>;
  loadChatHistory: () => Promise<void>;
  loadQuizHistory: () => Promise<void>;
  refreshAll: () => Promise<void>;
};

const initialStats: MyPageStats = {
  learnedTerms: 0,
  bookmarks: 0,
  quizScore: 0,
  studyDays: 0,
};

export const useMyPageStore = create<MyPageState>((set, get) => ({
  user: null,
  initialized: false,

  stats: initialStats,
  statsLoading: false,

  bookmarks: [],
  bookmarksLoading: false,

  recentActivities: [],
  recentLoading: false,

  chatHistory: [],
  chatHistoryLoading: false,

  quizHistory: [],
  quizHistoryLoading: false,

  setUser: (user) => {
    set((state) => {
      if (!user || user.providerId === 'anonymous') {
        return {
          ...state,
          user,
          initialized: true,
          stats: initialStats,
          bookmarks: [],
          recentActivities: [],
          chatHistory: [],
          quizHistory: [],
        };
      }

      return {
        ...state,
        user,
        initialized: true,
      };
    });
  },

  clearAll: () => {
    set({
      stats: initialStats,
      bookmarks: [],
      recentActivities: [],
      chatHistory: [],
      quizHistory: [],
      statsLoading: false,
      bookmarksLoading: false,
      recentLoading: false,
      chatHistoryLoading: false,
      quizHistoryLoading: false,
    });
  },

  loadStats: async () => {
    const { user } = get();
    if (!user || user.providerId === 'anonymous') {
      set({ stats: initialStats, statsLoading: false });
      return;
    }

    set({ statsLoading: true });
    try {
      const [userStats, bookmarkCount] = await Promise.all([
        fetchUserStats(),
        countUserBookmarkedMessages(user.uid),
      ]);

      set({
        stats: {
          learnedTerms: userStats?.learnedTerms ?? 0,
          bookmarks: bookmarkCount,
          quizScore: userStats?.quizScore ?? 0,
          studyDays: userStats?.studyDays ?? 0,
        },
      });
    } catch (error) {
      console.error('[MyPageStore] 통계 로드 실패:', error);
    } finally {
      set({ statsLoading: false });
    }
  },

  loadBookmarks: async () => {
    const { user } = get();
    if (!user || user.providerId === 'anonymous') {
      set({ bookmarks: [], bookmarksLoading: false });
      return;
    }

    set({ bookmarksLoading: true });
    try {
      const userChatBookmarks = await fetchUserBookmarkedMessages(user.uid, {
        sessionLimit: 20,
        perSessionLimit: 20,
      });
      set({ bookmarks: userChatBookmarks });
    } catch (error) {
      console.error('[MyPageStore] 북마크 로드 실패:', error);
    } finally {
      set({ bookmarksLoading: false });
    }
  },

  loadRecentActivities: async () => {
    const { user } = get();
    if (!user || user.providerId === 'anonymous') {
      set({ recentActivities: [], recentLoading: false });
      return;
    }

    set({ recentLoading: true });
    try {
      const recentActivities = await fetchUserRecentActivities();
      set({ recentActivities });
    } catch (error) {
      console.error('[MyPageStore] 최근 활동 로드 실패:', error);
    } finally {
      set({ recentLoading: false });
    }
  },

  loadChatHistory: async () => {
    const { user } = get();
    if (!user || user.providerId === 'anonymous') {
      set({ chatHistory: [], chatHistoryLoading: false });
      return;
    }

    set({ chatHistoryLoading: true });
    try {
      const history = await fetchUserChatHistory();
      set({ chatHistory: history });
    } catch (error) {
      console.error('[MyPageStore] 채팅 기록 로드 실패:', error);
    } finally {
      set({ chatHistoryLoading: false });
    }
  },

  loadQuizHistory: async () => {
    const { user } = get();
    if (!user || user.providerId === 'anonymous') {
      set({ quizHistory: [], quizHistoryLoading: false });
      return;
    }

    set({ quizHistoryLoading: true });
    try {
      const history = await fetchUserQuizHistory();
      set({ quizHistory: history });
    } catch (error) {
      console.error('[MyPageStore] 퀴즈 기록 로드 실패:', error);
    } finally {
      set({ quizHistoryLoading: false });
    }
  },

  refreshAll: async () => {
    const {
      user,
      loadStats,
      loadBookmarks,
      loadRecentActivities,
      loadChatHistory,
      loadQuizHistory,
    } = get();

    if (!user || user.providerId === 'anonymous') {
      set({
        stats: initialStats,
        bookmarks: [],
        recentActivities: [],
        chatHistory: [],
        quizHistory: [],
      });
      return;
    }

    await Promise.all([
      loadStats(),
      loadBookmarks(),
      loadRecentActivities(),
      loadChatHistory(),
      loadQuizHistory(),
    ]);
  },
}));

export function useMyPageData() {
  const user = useMyPageStore((s) => s.user);
  const initialized = useMyPageStore((s) => s.initialized);
  const setUser = useMyPageStore((s) => s.setUser);
  const refreshAll = useMyPageStore((s) => s.refreshAll);

  useEffect(() => {
    let mounted = true;
    const unsubscribe = onAuthStateChanged((authUser) => {
      if (!mounted) return;
      setUser(authUser);
      if (authUser && authUser.providerId !== 'anonymous') {
        void refreshAll();
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [setUser, refreshAll]);

  useFocusEffect(
    useCallback(() => {
      if (user && user.providerId !== 'anonymous') {
        void refreshAll();
      }
    }, [user, refreshAll])
  );

  return { user, initialized };
}
