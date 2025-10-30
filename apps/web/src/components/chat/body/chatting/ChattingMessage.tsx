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
import { useAuth } from '../../../../contexts/AuthContext';

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
  const { authUser } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartYRef = useRef<number | null>(null);
  const pullTriggeredRef = useRef(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const triggerRefresh = useCallback(async () => {
    if (!currentSessionId || refreshing) return;
    setRefreshing(true);
    try {
      await loadSession(currentSessionId);
    } finally {
      setRefreshing(false);
    }
  }, [currentSessionId, loadSession, refreshing]);

  const handleTouchStart = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (refreshing) return;
      if (!scrollContainerRef.current) return;
      if (scrollContainerRef.current.scrollTop > 0) return;
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
      pullTriggeredRef.current = false;
    },
    [refreshing]
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const startY = touchStartYRef.current;
      if (startY === null || !scrollContainerRef.current || refreshing) return;
      const currentY = event.touches[0]?.clientY ?? 0;
      const diff = currentY - startY;
      if (diff > 0 && scrollContainerRef.current.scrollTop <= 0) {
        setPullDistance(diff);
        // 중요: 상단에서 충분히 끌어내렸을 때만 새로고침 실행
        if (diff > 80 && !pullTriggeredRef.current) {
          pullTriggeredRef.current = true;
          void triggerRefresh();
        }
      } else {
        setPullDistance(0);
      }
    },
    [refreshing, triggerRefresh]
  );

  const handleTouchEnd = useCallback(() => {
    touchStartYRef.current = null;
    setPullDistance(0);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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

  // 메시지가 없거나 AI 응답 생성 중이 아닐 때만 초기 화면 표시
  const showWelcomeScreen = messages.length === 0 && !isGeneratingResponse;

  return (
    <div className="flex flex-col flex-1 relative overflow-hidden">
      {showWelcomeScreen && <RecentQuestionContainer />}
      
      {/* 새로고침 인디케이터 */}
      <div
        className={`absolute left-0 right-0 top-0 flex justify-center transition-opacity duration-200 z-10 ${
          refreshing || pullDistance > 30 ? 'opacity-100' : 'opacity-0'
        } pointer-events-none`}
      >
        <div className="px-4 py-1 mt-2 text-xs text-gray-500 bg-gray-100 rounded-full">
          {refreshing ? '메시지를 불러오는 중...' : '당겨서 새로고침'}
        </div>
      </div>

      {/* 스크롤 컨테이너 */}
      <div
        ref={scrollContainerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{
          transform: `translateY(${Math.min(pullDistance, 80)}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        {showWelcomeScreen ? (
          <div className="flex flex-col justify-between min-h-full">
            <AiChattingBox
              message={{
                id: 1752583353312,
                text: `안녕하세요${
                  authUser
                    ? `, ${
                        authUser.displayName || authUser.email || '사용자'
                      }님`
                    : ''
                }! 전력시장 AI 어시스턴트입니다. 🔋\n복잡한 전력시장 용어나 개념에 대해 궁금한 것이 있으시면 언제든 물어보세요. 쉽고 정확하게 설명해드릴게요!`,
                isUser: false,
                timestamp: new Date('2025-07-15T12:42:33.312Z'),
              }}
              layout={true}
            />
            <PromptHintBox />
          </div>
        ) : (
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
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChattingMessage;
