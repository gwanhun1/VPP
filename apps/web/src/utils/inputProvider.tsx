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
  fetchChatMessages,
  sendChatMessage,
  updateChatSession,
  addRecentActivity,
} from '@vpp/core-logic';
import { useAuth } from '../contexts/AuthContext';

// RN WebView 브릿지 안전 접근자 (any 회피)
const getRNWebView = () => {
  const w = window as unknown as {
    ReactNativeWebView?: { postMessage: (msg: string) => void };
  };
  return w.ReactNativeWebView;
};

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
  loadSession: (sessionId: string) => Promise<void>;
  startNewChat: () => void; // 새 채팅 시작
  historyMode: boolean; // 히스토리 로드 시 스켈레톤 비활성화를 위한 플래그
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
  const [historyMode, setHistoryMode] = useState<boolean>(false);
  const creatingSessionRef = useRef(false);
  const lastSessionIdRef = useRef<string | null>(null);
  const { authUser, firebaseReady } = useAuth();

  const ensureSession = useCallback(
    async (titleHint: string): Promise<string | null> => {
      // Firebase 초기화 전에는 세션을 만들지 않음
      if (!authUser || !firebaseReady) {
        return null;
      }

      if (currentSessionId) {
        lastSessionIdRef.current = currentSessionId;
        return currentSessionId;
      }

      // 세션 생성 중이면 잠시 대기하여 race condition 방지
      if (creatingSessionRef.current) {
        const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
        for (let i = 0; i < 40; i++) { // 최대 ~2초 대기
          const sid = currentSessionId ?? lastSessionIdRef.current;
          if (sid) return sid;
          await wait(50);
        }
        // 아직도 세션 ID가 없다면 생성 흐름이 끝나길 기다리도록 null 반환
        return null;
      }

      creatingSessionRef.current = true;

      try {
        // 세션 생성 시 제목은 항상 null로 두고, 첫 사용자 메시지 저장 이후에 제목을 업데이트
        const sessionId = await createUserChatSession(
          authUser.uid,
          null,
          'web',
          'webview'
        );
        setCurrentSessionId(sessionId);
        lastSessionIdRef.current = sessionId;
        return sessionId;
      } catch (error) {
        console.error('[ChatInputProvider] 세션 생성 실패:', error);
        try {
          if (typeof window !== 'undefined') {
            const rnwv = getRNWebView();
            rnwv?.postMessage(
              JSON.stringify({ type: 'WEB_ERROR', payload: `세션 생성 실패: ${String(error)}` })
            );
          }
        } catch { /* no-op: RN bridge may be unavailable */ }
        return null;
      } finally {
        creatingSessionRef.current = false;
      }
    },
    [authUser, currentSessionId, firebaseReady]
  );

  const addMessage = useCallback(
    async (text: string, isUser: boolean) => {
      // 새 메시지 흐름에서는 히스토리 모드 해제
      if (historyMode) setHistoryMode(false);
      const newMessage: Message = {
        id: Date.now(),
        text,
        isUser,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);

      // Firebase에 메시지 저장 (새로운 구조 사용)
      if (authUser && firebaseReady) {
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
          console.error('[ChatInputProvider] 메시지 저장/활동/제목 업데이트 중 오류:', error);
          try {
            if (typeof window !== 'undefined') {
              const rnwv = getRNWebView();
              rnwv?.postMessage(
                JSON.stringify({ type: 'WEB_ERROR', payload: `메시지 저장 오류: ${String(error)}` })
              );
            }
          } catch { /* no-op: RN bridge may be unavailable */ }
        }
      }
    },
    [authUser, currentSessionId, ensureSession, messages.length, firebaseReady, historyMode]
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
      } catch {
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

  // 기존 채팅 세션 로드: Firestore의 메시지를 현재 메시지 배열로 매핑
  const loadSession = useCallback(async (sessionId: string) => {
    if (!authUser || !firebaseReady) return;
    try {
      const rawMessages = await fetchChatMessages(authUser.uid, sessionId);
      type TimestampLike = { toDate?: () => Date } | Date | undefined;
      const toDateSafe = (ts: TimestampLike): Date => {
        if (!ts) return new Date();
        if (ts instanceof Date) return ts;
        if (typeof ts.toDate === 'function') return ts.toDate();
        return new Date();
      };

      const mapped: Message[] = rawMessages.map((m, idx) => ({
        id: Number(`${Date.now()}${idx}`),
        text: m.text,
        isUser: m.role === 'user',
        timestamp: toDateSafe((m as { timestamp?: TimestampLike }).timestamp),
      }));

      setMessages(mapped);
      setCurrentSessionId(sessionId);
      lastSessionIdRef.current = sessionId;
      // 히스토리 로드 활성화: 스켈레톤 비활성화용
      setHistoryMode(true);
    } catch (e) {
      console.error('[ChatInputProvider] 세션 로드 실패:', e);
    }
  }, [authUser, firebaseReady]);

  // 새 채팅 시작 함수: 즉시 새 세션 생성 후 전환
  const startNewChat = useCallback(() => {
    setMessages([]);
    setHistoryMode(false);
    setInputText('');

    // 새로운 세션을 즉시 생성하여 이후 메시지가 기존 세션으로 들어가지 않도록 함
    if (authUser && firebaseReady) {
      creatingSessionRef.current = true;
      (async () => {
        try {
          const newSessionId = await createUserChatSession(
            authUser.uid,
            null,
            'web',
            'webview'
          );
          setCurrentSessionId(newSessionId);
          lastSessionIdRef.current = newSessionId;
        } catch (e) {
          console.error('[ChatInputProvider] 새 채팅 세션 생성 실패:', e);
          // 실패 시 세션은 비워둠. 이후 첫 사용자 메시지에서 ensureSession로 재시도됨
          setCurrentSessionId(null);
          lastSessionIdRef.current = null;
        } finally {
          creatingSessionRef.current = false;
        }
      })();
    } else {
      // 인증/파이어베이스 준비 전이면 세션은 비워두고 첫 메시지에서 생성
      setCurrentSessionId(null);
      lastSessionIdRef.current = null;
    }
  }, [authUser, firebaseReady]);

  return (
    <ChatInputContext.Provider
      value={{
        inputText,
        setInputText,
        messages,
        setMessages,
        handleSendMessage,
        addMessage,
        loadSession,
        startNewChat,
        historyMode,
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
