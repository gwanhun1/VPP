import UserChattingBox from './UserChattingBox';
import AiChattingBox from './AiChattingBox';
import PromptHintBox from '../promptHint/HintBox';
import {
  type TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import RecentQuestionContainer from '../recentQuestion/Container';
import { useChatInput } from '@/utils/inputProvider';
import { useAuthStore } from '@vpp/core-logic';

const ChattingMessage = () => {
  const {
    messages,
    historyMode,
    loadSession,
    currentSessionId,
    focusMessageId,
    consumeFocusMessage,
    isGeneratingResponse,
  } = useChatInput();
  const authUser = useAuthStore((s: any) => s.authUser);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartYRef = useRef<number | null>(null);
  const scrollStartTopRef = useRef<number>(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  const triggerRefresh = useCallback(async () => {
    if (!currentSessionId || refreshing) return;
    setRefreshing(true);
    setIsPulling(false);
    try {
      await loadSession(currentSessionId);
    } finally {
      setRefreshing(false);
      setPullDistance(0);
    }
  }, [currentSessionId, loadSession, refreshing]);

  const handleTouchStart = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (refreshing || !scrollContainerRef.current) return;

      // 버튼이나 클릭 가능한 요소에서 시작된 터치는 무시
      const target = event.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('textarea')
      ) {
        return;
      }

      const scrollTop = scrollContainerRef.current.scrollTop;

      // 스크롤이 최상단에 있을 때만 pull 시작
      if (scrollTop <= 0) {
        touchStartYRef.current = event.touches[0]?.clientY ?? null;
        scrollStartTopRef.current = scrollTop;
        setIsPulling(true);
      }
    },
    [refreshing]
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const startY = touchStartYRef.current;
      if (
        startY === null ||
        !scrollContainerRef.current ||
        refreshing ||
        !isPulling
      )
        return;

      const target = event.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('textarea')
      ) {
        return;
      }

      const currentY = event.touches[0]?.clientY ?? 0;
      const diff = currentY - startY;
      const scrollTop = scrollContainerRef.current.scrollTop;

      if (diff > 0 && scrollTop <= 0) {
        const resistance = 2.5;
        const adjustedDistance = diff / resistance;
        setPullDistance(Math.min(adjustedDistance, 100));

        // 기본 스크롤 방지
        event.preventDefault();
      } else {
        setPullDistance(0);
        setIsPulling(false);
      }
    },
    [refreshing, isPulling]
  );

  const handleTouchEnd = useCallback(() => {
    if (pullDistance > 60 && !refreshing) {
      void triggerRefresh();
    } else {
      setPullDistance(0);
      setIsPulling(false);
    }
    touchStartYRef.current = null;
  }, [pullDistance, refreshing, triggerRefresh]);

  useEffect(() => {
    if (!currentSessionId) {
      setPullDistance(0);
      setRefreshing(false);
      setIsPulling(false);
    }
  }, [currentSessionId]);

  useEffect(() => {
    if (!focusMessageId || !scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const target = container.querySelector<HTMLElement>(
      `[data-message-id="${focusMessageId}"]`
    );

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      consumeFocusMessage();
    }
  }, [focusMessageId, consumeFocusMessage]);

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    container.scrollTop = container.scrollHeight;
  }, [messages, isGeneratingResponse]);

  const showWelcomeScreen = messages.length === 0 && !isGeneratingResponse;
  const showHintBox = !historyMode && !currentSessionId && messages.length <= 2;

  return (
    <div className="flex overflow-hidden relative flex-col flex-1">
      {showWelcomeScreen && <RecentQuestionContainer />}

      {!showWelcomeScreen &&
        currentSessionId &&
        (pullDistance > 0 || refreshing) && (
          <div
            className="flex justify-center items-center py-2 transition-all duration-200"
            style={{
              height: `${Math.min(pullDistance, 60)}px`,
              opacity: refreshing ? 1 : Math.min(pullDistance / 60, 1),
            }}
          >
            <div className="flex gap-2 items-center px-4 py-1 text-xs rounded-full text-primary-600 bg-primary-50">
              {refreshing ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>새로고침 중...</span>
                </>
              ) : pullDistance > 60 ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>놓으면 새로고침</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  <span>아래로 당기기</span>
                </>
              )}
            </div>
          </div>
        )}

      {/* 스크롤 컨테이너 */}
      <div
        ref={scrollContainerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.tagName === 'A' || target.closest('a')) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{
          transition: isPulling ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {showWelcomeScreen ? (
          <div className="flex flex-col justify-between pb-6 min-h-full">
            <AiChattingBox
              message={{
                id: 1752583353312,
                text: `안녕하세요${
                  authUser
                    ? `, ${
                        authUser.displayName || authUser.email || '사용자'
                      }님`
                    : ''
                }! \n 🔋 복잡한 전력시장 용어나 개념에 대해 궁금한 것이 있으시면 언제든 물어보세요.`,
                isUser: false,
                timestamp: new Date('2025-07-15T12:42:33.312Z'),
              }}
              layout={true}
            />
            <PromptHintBox />
          </div>
        ) : (
          <div className="flex flex-col justify-between pb-4 min-h-full">
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  data-message-id={message.messageId}
                  className={`flex ${
                    message.isUser ? 'justify-end' : 'justify-start'
                  } animate-fade-in`}
                  style={{ animationDuration: '500ms' }}
                >
                  {message.isUser ? (
                    <UserChattingBox message={message} />
                  ) : (
                    <AiChattingBox
                      message={message}
                      layout={historyMode ? true : undefined}
                    />
                  )}
                </div>
              ))}
              {isGeneratingResponse && (
                <div className="flex justify-start animate-fade-in">
                  <AiChattingBox
                    message={{
                      id: Date.now(),
                      text: '',
                      isUser: false,
                      timestamp: new Date(),
                    }}
                    layout={false}
                  />
                </div>
              )}
              <div ref={messagesEndRef} className="h-24" />
            </div>
            {showHintBox && <PromptHintBox />}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChattingMessage;
