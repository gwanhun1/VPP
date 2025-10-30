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
  addRecentActivity,
} from '@vpp/core-logic';
import { useAuth } from '../contexts/AuthContext';
import { callDifyAPI } from './difyApi';

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

export const ChatInputProvider = ({ children }: { children: ReactNode }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [historyMode, setHistoryMode] = useState(false);
  const [focusMessageId, setFocusMessageId] = useState<string | null>(null);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);

  const difyConversationIdRef = useRef<string | null>(null);
  const lastUserMsgIdRef = useRef<string | null>(null);

  const {
    authUser,
    firebaseReady,
    openSessionId,
    openMessageId,
    clearOpenSessionId,
  } = useAuth();

  // 세션 생성 또는 기존 세션 반환
  const ensureSession = useCallback(async (): Promise<string> => {
    if (!authUser || !firebaseReady) {
      throw new Error('사용자 인증이 필요합니다.');
    }

    if (currentSessionId) return currentSessionId;

    const sessionId = await createUserChatSession(
      authUser.uid,
      null,
      'web',
      'webview'
    );
    setCurrentSessionId(sessionId);
    return sessionId;
  }, [authUser, firebaseReady, currentSessionId]);

  // Firebase에 메시지 저장
  const saveMessage = useCallback(
    async (text: string, isUser: boolean): Promise<string> => {
      if (!authUser) throw new Error('사용자 인증이 필요합니다.');

      const sessionId = await ensureSession();

      const messageId = await sendChatMessage(
        authUser.uid,
        sessionId,
        text,
        isUser ? 'user' : 'assistant',
        'web',
        'webview',
        !isUser && lastUserMsgIdRef.current
          ? { replyTo: lastUserMsgIdRef.current }
          : undefined
      );

      // 메시지 ID 업데이트
      setMessages((prev) =>
        prev.map((msg) =>
          msg.text === text && !msg.messageId ? { ...msg, messageId } : msg
        )
      );

      // 사용자 메시지면 참조 저장
      if (isUser) {
        lastUserMsgIdRef.current = messageId;

        // 첫 메시지면 세션 제목 업데이트
        if (messages.length === 0) {
          await updateChatSession(authUser.uid, sessionId, {
            title: text.length > 30 ? `${text.substring(0, 30)}...` : text,
          });
        }

        // 활동 로그
        await addRecentActivity(authUser.uid, {
          type: 'chat',
          title: '채팅 메시지',
          description: text.length > 50 ? `${text.substring(0, 50)}...` : text,
        });
      }

      return messageId;
    },
    [authUser, ensureSession, messages.length]
  );

  const handleSendMessage = useCallback(async () => {
    const trimmed = inputText.trim();
    if (!trimmed || !authUser) return;

    if (historyMode) setHistoryMode(false);

    // 1. 사용자 메시지 UI에 즉시 표시
    const userMessage: Message = {
      id: Date.now(),
      text: trimmed,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsGeneratingResponse(true);

    try {
      // 2. 사용자 메시지 Firebase 저장
      await saveMessage(trimmed, true);

      // 3. Dify API 호출
      const response = await callDifyAPI(
        trimmed,
        difyConversationIdRef.current || undefined
      );

      // 4. conversation_id 저장
      if (response.conversationId) {
        difyConversationIdRef.current = response.conversationId;
      }

      // 5. AI 응답 UI에 표시
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: response.answer,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // 6. AI 응답 Firebase 저장
      await saveMessage(response.answer, false);
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
  }, [inputText, authUser, historyMode, saveMessage]);

  // 기존 세션 로드
  const loadSession = useCallback(
    async (sessionId: string, targetMessageId?: string) => {
      if (!authUser || !firebaseReady) return;

      try {
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
        setCurrentSessionId(sessionId);
        setHistoryMode(true);
        difyConversationIdRef.current = null;

        if (targetMessageId) {
          setFocusMessageId(targetMessageId);
        }
      } catch (error) {
        console.error('[loadSession] 오류:', error);
      }
    },
    [authUser, firebaseReady]
  );

  // 새 채팅 시작
  const startNewChat = useCallback(() => {
    setMessages([]);
    setCurrentSessionId(null);
    setHistoryMode(false);
    setInputText('');
    setFocusMessageId(null);
    difyConversationIdRef.current = null;
    lastUserMsgIdRef.current = null;
  }, []);

  // 모바일에서 세션 열기
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

  return (
    <ChatInputContext.Provider
      value={{
        inputText,
        setInputText,
        messages,
        setMessages,
        handleSendMessage,
        loadSession,
        startNewChat,
        historyMode,
        currentSessionId,
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
