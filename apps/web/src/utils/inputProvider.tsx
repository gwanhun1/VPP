import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import type { AuthUser } from '@vpp/core-logic';
import {
  createUserChatSession,
  fetchUserChatSessions,
  sendChatMessage,
  updateChatSession,
  addRecentActivity,
} from '@vpp/core-logic';
import { useAuth } from '../contexts/AuthContext';

export type Message = {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export type ChatInputContextType = {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  handleSendMessage: () => Promise<void>;
  addMessage: (text: string, isUser: boolean) => void;
};

type IncomingMessage =
  | { type: 'AI_RESPONSE'; payload: { text: string } }
  | { type: 'AUTH'; payload: AuthUser }
  | { type: string; payload?: unknown };

const ChatInputContext = createContext<ChatInputContextType | undefined>(
  undefined
);

export const ChatInputProvider = ({ children }: { children: ReactNode }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const creatingSessionRef = useRef(false);
  const lastSessionIdRef = useRef<string | null>(null);
  const { authUser } = useAuth();

  const ensureSession = useCallback(
    async (titleHint: string): Promise<string | null> => {
      if (!authUser) {
        return null;
      }

      if (currentSessionId) {
        lastSessionIdRef.current = currentSessionId;
        return currentSessionId;
      }

      if (creatingSessionRef.current) {
        return null;
      }

      creatingSessionRef.current = true;

      try {
        const normalizedTitle = titleHint
          ? titleHint.length > 30
            ? `${titleHint.substring(0, 30)}...`
            : titleHint
          : '새 채팅';

        const sessionId = await createUserChatSession(
          authUser.uid,
          normalizedTitle,
          'web',
          'webview'
        );
        setCurrentSessionId(sessionId);
        lastSessionIdRef.current = sessionId;
        return sessionId;
      } catch (error) {
        return null;
      } finally {
        creatingSessionRef.current = false;
      }
    },
    [authUser, currentSessionId]
  );

  const addMessage = useCallback(
    async (text: string, isUser: boolean) => {
      const newMessage: Message = {
        id: Date.now(),
        text,
        isUser,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);

      // Firebase에 메시지 저장 (새로운 구조 사용)
      if (authUser) {
        let sessionId = currentSessionId ?? lastSessionIdRef.current;

        if (!sessionId && isUser) {
          sessionId = await ensureSession(text);
        }

        if (!sessionId) {
          return;
        }

        try {
          // 채팅 메시지 저장
          await sendChatMessage(
            authUser.uid,
            sessionId,
            text,
            isUser ? 'user' : 'assistant',
            'web',
            'webview'
          );

          // 사용자 활동 로그 (채팅 메시지인 경우에만)
          if (isUser) {
            await addRecentActivity(authUser.uid, {
              type: 'chat',
              title: '채팅 메시지',
              description:
                text.length > 50 ? `${text.substring(0, 50)}...` : text,
            });
          }

          // 첫 번째 사용자 메시지인 경우 세션 제목 업데이트
          if (isUser && messages.length === 0) {
            await updateChatSession(authUser.uid, sessionId, {
              title: text.length > 30 ? `${text.substring(0, 30)}...` : text,
            });
          }
        } catch (error) {
          // no-op
        }
      }
    },
    [authUser, currentSessionId, ensureSession, messages.length]
  );

  const generateMockAiAnswer = useCallback(
    async (question: string, userName: string): Promise<string> => {
      await new Promise((resolve) => setTimeout(resolve, 600));

      return `${userName}님, "${question}"에 대한 정보를 정리하고 있습니다. 곧 더 자세한 내용을 전달드릴게요.`;
    },
    []
  );

  const handleSendMessage = useCallback(async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    if (!authUser) {
      return;
    }

    const userName = authUser.displayName || authUser.email || '사용자';

    await addMessage(trimmed, true);
    setInputText('');

    const aiResponse = await generateMockAiAnswer(trimmed, userName);
    await addMessage(aiResponse, false);
  }, [addMessage, authUser, generateMockAiAnswer, inputText]);

  // 채팅 세션 초기화
  useEffect(() => {
    if (!authUser) {
      setCurrentSessionId(null);
      lastSessionIdRef.current = null;
      creatingSessionRef.current = false;
      return;
    }

    const loadLatestSession = async () => {
      try {
        const sessions = await fetchUserChatSessions(authUser.uid);
        if (sessions.length > 0) {
          setCurrentSessionId(sessions[0].id);
          lastSessionIdRef.current = sessions[0].id;
        } else {
          setCurrentSessionId(null);
          lastSessionIdRef.current = null;
        }
      } catch (error) {
        setCurrentSessionId(null);
        lastSessionIdRef.current = null;
      }
    };

    if (!currentSessionId && !creatingSessionRef.current) {
      void loadLatestSession();
    } else if (currentSessionId) {
      lastSessionIdRef.current = currentSessionId;
    }
  }, [authUser, currentSessionId]);

  // AI 응답 메시지 수신 처리
  useEffect(() => {
    const handleExternalMessage = (event: MessageEvent) => {
      try {
        const raw = (event as MessageEvent).data as unknown;
        const data: IncomingMessage =
          typeof raw === 'string'
            ? (JSON.parse(raw) as IncomingMessage)
            : (raw as IncomingMessage);

        // AI 응답 메시지만 처리 (AUTH는 AuthContext에서 처리)
        if (
          data?.type === 'AI_RESPONSE' &&
          data?.payload &&
          typeof (data as { payload: { text?: unknown } }).payload.text ===
            'string'
        ) {
          addMessage(
            (data as { payload: { text: string } }).payload.text,
            false
          );
          return;
        }
      } catch {
        // no-op
      }
    };

    window.addEventListener('message', handleExternalMessage);
    return () => window.removeEventListener('message', handleExternalMessage);
  }, [addMessage]);

  return (
    <ChatInputContext.Provider
      value={{
        inputText,
        setInputText,
        messages,
        setMessages,
        handleSendMessage,
        addMessage,
      }}
    >
      {children}
    </ChatInputContext.Provider>
  );
};

export const useChatInput = () => {
  const context = useContext(ChatInputContext);
  if (!context) {
    throw new Error('useChatInput must be used within a ChatInputProvider');
  }
  return context;
};
