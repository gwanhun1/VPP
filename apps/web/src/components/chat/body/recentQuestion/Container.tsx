import { Skeleton, Text } from '@vpp/shared-ui';
import RecentQuestionBadge from './Badge';
import { useEffect, useMemo, useState } from 'react';
import { fetchUserChatSessions, type ChatSession } from '@vpp/core-logic';
import { useAuth } from '@/contexts/AuthContext';
import { useChatInput } from '@/utils/inputProvider';

const RecentQuestionContainer = () => {
  const { authUser, firebaseReady } = useAuth();
  const { loadSession } = useChatInput();
  const [sessions, setSessions] = useState<Array<ChatSession & { id: string }>>(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 중요: Firebase 초기화 및 사용자 인증 이후에만 호출
    if (!authUser || !firebaseReady) {
      setSessions([]);
      return;
    }
    let mounted = true;
    setLoading(true);
    fetchUserChatSessions(authUser.uid)
      .then((list) => {
        if (mounted) setSessions(list);
      })
      .catch(() => {
        if (mounted) setSessions([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
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

  return (
    <div className="flex flex-col gap-2 px-6 py-4 border-b">
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
      <Skeleton isLoading={loading} rounded={true} className="w-24 h-6">
        <div className="flex overflow-x-auto gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {sessionsWithTitle.map((s) => (
            <RecentQuestionBadge
              key={s.id}
              question={s.title as string}
              onClick={() => loadSession(s.id)}
            />
          ))}
        </div>
      </Skeleton>
    </div>
  );
};

export default RecentQuestionContainer;
