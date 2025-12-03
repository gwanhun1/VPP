import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  createUserChatSession,
  fetchChatMessages,
  sendChatMessage,
  updateChatSession,
  getChatSession,
  addRecentActivity,
  useAuthStore,
} from '@vpp/core-logic';
import { callDifyAPI } from './difyApi';
import { sanitizeProfanity } from '@/utils/profanityFilter';

export type Message = {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  messageId?: string;
  isBookmarked?: boolean;
};

export type ChatInputContextType = {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  handleSendMessage: () => Promise<void>;
  loadSession: (sessionId: string, focusMessageId?: string) => Promise<void>;
  startNewChat: () => void;
  historyMode: boolean;
  currentSessionId: string | null;
  focusMessageId: string | null;
  consumeFocusMessage: () => void;
  isGeneratingResponse: boolean;
};

const ChatInputContext = createContext<ChatInputContextType | undefined>(
  undefined
);

type ChatDomainParams = {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setHistoryMode: React.Dispatch<React.SetStateAction<boolean>>;
  setFocusMessageId: React.Dispatch<React.SetStateAction<string | null>>;
};

const useChatDomain = ({
  setMessages,
  setHistoryMode,
  setFocusMessageId,
}: ChatDomainParams) => {
  const authUser = useAuthStore((s) => s.authUser);
  const firebaseReady = useAuthStore((s) => s.firebaseReady);
  const openSessionId = useAuthStore((s) => s.openSessionId);
  const openMessageId = useAuthStore((s) => s.openMessageId);
  const clearOpenSessionId = useAuthStore((s) => s.clearOpenSessionId);

  const currentSessionIdRef = useRef<string | null>(null);
  const difyConversationIdRef = useRef<string | null>(null);
  const lastUserMsgIdRef = useRef<string | null>(null);

  const ensureSession = useCallback(async (): Promise<string> => {
    if (!authUser || !firebaseReady) {
      throw new Error('사용자 인증이 필요합니다.');
    }

    if (currentSessionIdRef.current) {
      return currentSessionIdRef.current;
    }

    const sessionId = await createUserChatSession(
      authUser.uid,
      null,
      'web',
      'webview'
    );
    currentSessionIdRef.current = sessionId;
    return sessionId;
  }, [authUser, firebaseReady]);

  const saveMessage = useCallback(
    async (
      text: string,
      isUser: boolean,
      isFirstMessage: boolean,
      explicitTimestamp?: Date
    ): Promise<string> => {
      if (!authUser) throw new Error('사용자 인증이 필요합니다.');

      const sessionId = await ensureSession();

      const messageId = await sendChatMessage(
        authUser.uid,
        sessionId,
        text,
        isUser ? 'user' : 'assistant',
        'web',
        'webview',
        {
          ...(!isUser && lastUserMsgIdRef.current
            ? { replyTo: lastUserMsgIdRef.current }
            : {}),
          ...(explicitTimestamp ? { explicitTimestamp } : {}),
        }
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg.text === text && !msg.messageId ? { ...msg, messageId } : msg
        )
      );

      if (isUser) {
        lastUserMsgIdRef.current = messageId;

        if (isFirstMessage) {
          await updateChatSession(authUser.uid, sessionId, {
            title: text.length > 30 ? `${text.substring(0, 30)}...` : text,
          });
        }

        await addRecentActivity(authUser.uid, {
          type: 'chat',
          title: '채팅 메시지',
          description: text.length > 50 ? `${text.substring(0, 50)}...` : text,
        });
      }

      return messageId;
    },
    [authUser, ensureSession, setMessages]
  );

  const loadSession = useCallback(
    async (sessionId: string, targetMessageId?: string) => {
      if (!authUser || !firebaseReady) return;

      try {
        // 세션 정보 로드하여 Dify conversation ID 복원
        const session = await getChatSession(authUser.uid, sessionId);
        if (session?.difyConversationId) {
          difyConversationIdRef.current = session.difyConversationId;
        } else {
          difyConversationIdRef.current = null;
        }

        const rawMessages = await fetchChatMessages(authUser.uid, sessionId);

        const mapped: Message[] = rawMessages.map((m, idx) => ({
          id: Date.now() + idx,
          text: m.text,
          isUser: m.role === 'user',
          timestamp: m.timestamp instanceof Date ? m.timestamp : new Date(),
          messageId: (m as { id?: string }).id,
          isBookmarked: (m as { isBookmarked?: boolean }).isBookmarked,
        }));

        setMessages(mapped);
        currentSessionIdRef.current = sessionId;
        setHistoryMode(true);

        if (targetMessageId) {
          setFocusMessageId(targetMessageId);
        }
      } catch (error) {
        console.error('[loadSession] 오류:', error);
      }
    },
    [authUser, firebaseReady, setMessages, setHistoryMode, setFocusMessageId]
  );

  const startNewChat = useCallback(() => {
    setMessages([]);
    currentSessionIdRef.current = null;
    setHistoryMode(false);
    setFocusMessageId(null);
    difyConversationIdRef.current = null;
    lastUserMsgIdRef.current = null;
  }, [setMessages, setHistoryMode, setFocusMessageId]);

  useEffect(() => {
    if (openSessionId && authUser && firebaseReady) {
      loadSession(openSessionId, openMessageId ?? undefined).then(() => {
        clearOpenSessionId?.();
      });
    }
  }, [
    openSessionId,
    openMessageId,
    authUser,
    firebaseReady,
    loadSession,
    clearOpenSessionId,
  ]);

  return {
    authUser,
    firebaseReady,
    ensureSession,
    saveMessage,
    loadSession,
    startNewChat,
    currentSessionIdRef,
    difyConversationIdRef,
    lastUserMsgIdRef,
  };
};

export const ChatInputProvider = ({ children }: { children: ReactNode }) => {
  const [inputText, setInputTextInternal] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [historyMode, setHistoryMode] = useState(false);
  const [focusMessageId, setFocusMessageId] = useState<string | null>(null);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const setInputText = useCallback(
    (value: string | ((prev: string) => string)) => {
      setInputTextInternal(value);
    },
    []
  );
  const {
    authUser,
    saveMessage,
    loadSession,
    startNewChat,
    ensureSession,
    currentSessionIdRef,
    difyConversationIdRef,
  } = useChatDomain({
    setMessages,
    setHistoryMode,
    setFocusMessageId,
  });

  const handleSendMessage = useCallback(async () => {
    const trimmed = sanitizeProfanity(inputText).trim();
    if (!trimmed) return;

    // 인증 상태 체크 - 프로덕션에서 디버깅용
    if (!authUser) {
      console.warn('[handleSendMessage] authUser가 없음 - 인증 대기 중');
      const errorMsg: Message = {
        id: Date.now(),
        text: '로그인 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      return;
    }

    if (historyMode) setHistoryMode(false);

    // 현재 세션의 첫 메시지인지 확인
    const isFirstMessage = messages.length === 0;

    // 타임스탬프 생성 (순서 보장을 위해)
    const userTimestamp = new Date();

    // 1. 사용자 메시지 UI에 즉시 표시
    const userMessage: Message = {
      id: Date.now(),
      text: trimmed,
      isUser: true,
      timestamp: userTimestamp,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputTextInternal('');
    setIsGeneratingResponse(true);

    try {
      // 2. 사용자 메시지 Firebase 저장 (명시적 타임스탬프 사용)
      await saveMessage(trimmed, true, isFirstMessage, userTimestamp);

      // 세션 ID 확보 (saveMessage 내부에서도 호출되지만, 여기서도 필요)
      const sessionId = await ensureSession();

      // 3. Dify API 호출
      const response = await callDifyAPI(
        trimmed,
        difyConversationIdRef.current || undefined,
        authUser.uid
      );

      // 4. conversation_id 저장
      if (response.conversationId) {
        const isNewConversation =
          difyConversationIdRef.current !== response.conversationId;
        difyConversationIdRef.current = response.conversationId;

        if (isNewConversation) {
          await updateChatSession(authUser.uid, sessionId, {
            difyConversationId: response.conversationId,
          });
        }
      }

      // AI 응답 타임스탬프 (사용자 메시지보다 최소 1ms 이후)
      const aiTimestamp = new Date(userTimestamp.getTime() + 1);

      // 5. AI 응답 UI에 표시
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: response.answer,
        isUser: false,
        timestamp: aiTimestamp,
      };
      setMessages((prev) => [...prev, aiMessage]);

      // 6. AI 응답 Firebase 저장 (명시적 타임스탬프 사용)
      await saveMessage(response.answer, false, false, aiTimestamp);
    } catch (error) {
      console.error('[handleSendMessage] 오류:', error);

      // 에러 메시지 표시
      const errorMessage =
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.';
      const errorMsg: Message = {
        id: Date.now() + 1,
        text: `죄송합니다. 오류가 발생했습니다.\n\n${errorMessage}`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsGeneratingResponse(false);
    }
  }, [
    inputText,
    authUser,
    historyMode,
    saveMessage,
    messages.length,
    setInputTextInternal,
    difyConversationIdRef,
    ensureSession,
  ]);

  const wrappedStartNewChat = useCallback(() => {
    startNewChat();
    setInputTextInternal('');
  }, [startNewChat]);

  return (
    <ChatInputContext.Provider
      value={{
        inputText,
        setInputText,
        messages,
        setMessages,
        handleSendMessage,
        loadSession,
        startNewChat: wrappedStartNewChat,
        historyMode,
        currentSessionId: currentSessionIdRef.current,
        focusMessageId,
        consumeFocusMessage: () => setFocusMessageId(null),
        isGeneratingResponse,
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
