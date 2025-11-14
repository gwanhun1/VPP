import { Skeleton, Text } from '@vpp/shared-ui';
import RecentQuestionBadge from './Badge';
import { useEffect, useMemo, useState } from 'react';
import {
  fetchUserChatSessions,
  type ChatSession,
  useAuthStore,
  withRetry,
} from '@vpp/core-logic';
import { useChatInput } from '@/utils/inputProvider';

const RecentQuestionContainer = () => {
  const authUser = useAuthStore((s) => s.authUser);
  const firebaseReady = useAuthStore((s) => s.firebaseReady);
  const { loadSession } = useChatInput();
  const [sessions, setSessions] = useState<Array<ChatSession & { id: string }>>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // 중요: Firebase 초기화 및 사용자 인증 이후에만 호출
    if (!authUser || !firebaseReady) {
      setSessions([]);
      return;
    }
    let mounted = true;
    const loadSessions = async () => {
      setLoading(true);
      try {
        const list = await withRetry(() => fetchUserChatSessions(authUser.uid));
        if (mounted) setSessions(list);
      } catch (error) {
        console.error('[RecentQuestionContainer] 세션 로드 실패:', error);
        if (mounted) setSessions([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadSessions();
    return () => {
      mounted = false;
    };
  }, [authUser, firebaseReady]);

  const sessionsWithTitle = useMemo(
    () =>
      sessions
        .filter(
          (s) =>
            typeof s.title === 'string' && (s.title as string).trim().length > 0
        )
        .slice(0, 10),
    [sessions]
  );

  const hasData = sessionsWithTitle.length > 0;
  const hasAnyContent = loading || hasData;

  return (
    <div
      className={`flex flex-col px-4 border-b overflow-hidden transition-all duration-200 ${
        hasAnyContent ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <button
        type="button"
        className="flex justify-between items-center w-full py-1.5"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className="flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 text-neutral-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <Text variant="body2" color="muted">
            최근 질문
          </Text>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={`w-3 h-3 text-neutral-400 transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          expanded ? 'max-h-24 opacity-100 pt-1.5 pb-1.5' : 'max-h-0 opacity-0'
        }`}
      >
        <Skeleton isLoading={loading} className="w-20 h-9 rounded-3xl">
          {loading ? (
            <div className="w-20 h-9" />
          ) : hasData ? (
            <div className="flex overflow-x-auto gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {sessionsWithTitle.map((s) => (
                <RecentQuestionBadge
                  key={s.id}
                  question={s.title as string}
                  onClick={() => loadSession(s.id)}
                />
              ))}
            </div>
          ) : (
            <Text variant="caption" color="muted">
              최근 질문이 아직 없습니다.
            </Text>
          )}
        </Skeleton>
      </div>
    </div>
  );
};

export default RecentQuestionContainer;
