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
import { callHuggingFaceAPI } from './huggingfaceApi';

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
  messageId?: string; // Firestore message doc id
  isBookmarked?: boolean;
};

export type ChatInputContextType = {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  handleSendMessage: () => Promise<void>;
  addMessage: (text: string, isUser: boolean) => void;
  loadSession: (sessionId: string, focusMessageId?: string) => Promise<void>;
  startNewChat: () => void; // 새 채팅 시작
  historyMode: boolean; // 히스토리 로드 시 스켈레톤 비활성화를 위한 플래그
  currentSessionId: string | null;
  focusMessageId: string | null;
  consumeFocusMessage: () => void;
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
  const [focusMessageId, setFocusMessageId] = useState<string | null>(null);
  const creatingSessionRef = useRef(false);
  const lastSessionIdRef = useRef<string | null>(null);
  // 마지막 사용자 메시지 정보를 보관하여 assistant 메시지 저장 시 replyTo/preview로 사용
  const lastUserMsgIdRef = useRef<string | null>(null);
  const lastUserMsgTextRef = useRef<string | null>(null);
  // 새 채팅 의도 시, 최근 세션 자동 로드를 잠시 비활성화하기 위한 플래그
  const suppressAutoLoadRef = useRef(false);
  const {
    authUser,
    firebaseReady,
    openSessionId,
    openMessageId,
    clearOpenSessionId,
  } = useAuth();

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
        for (let i = 0; i < 40; i++) {
          // 최대 ~2초 대기
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
        // 새 세션이 만들어졌으므로 자동 로드 억제 해제
        suppressAutoLoadRef.current = false;
        return sessionId;
      } catch (error) {
        console.error('[ChatInputProvider] 세션 생성 실패:', error);
        try {
          if (typeof window !== 'undefined') {
            const rnwv = getRNWebView();
            rnwv?.postMessage(
              JSON.stringify({
                type: 'WEB_ERROR',
                payload: `세션 생성 실패: ${String(error)}`,
              })
            );
          }
        } catch {
          /* no-op: RN bridge may be unavailable */
        }
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
        isBookmarked: false,
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
          const savedMessageId = await sendChatMessage(
            authUser.uid,
            sessionId,
            text,
            isUser ? 'user' : 'assistant',
            'web',
            'webview',
            // assistant일 때만 reply 메타 포함
            !isUser && lastUserMsgIdRef.current
              ? {
                  replyTo: lastUserMsgIdRef.current || undefined,
                  replyPreview: lastUserMsgTextRef.current
                    ? {
                        role: 'user',
                        text:
                          lastUserMsgTextRef.current.length > 120
                            ? `${lastUserMsgTextRef.current.substring(0, 120)}...`
                            : lastUserMsgTextRef.current,
                      }
                    : undefined,
                }
              : undefined
          );

          // 방금 추가한 로컬 메시지에 Firestore messageId를 매핑
          setMessages((prev) => {
            const next = [...prev];
            const lastIdx = next.length - 1;
            if (lastIdx >= 0 && next[lastIdx].text === text && next[lastIdx].timestamp === newMessage.timestamp) {
              next[lastIdx] = { ...next[lastIdx], messageId: savedMessageId };
            }
            return next;
          });

          // 사용자 메시지 저장 직후에는 마지막 사용자 메시지 참조를 업데이트
          if (isUser) {
            lastUserMsgIdRef.current = savedMessageId;
            lastUserMsgTextRef.current = text;
          }

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
          console.error(
            '[ChatInputProvider] 메시지 저장/활동/제목 업데이트 중 오류:',
            error
          );
          try {
            if (typeof window !== 'undefined') {
              const rnwv = getRNWebView();
              rnwv?.postMessage(
                JSON.stringify({
                  type: 'WEB_ERROR',
                  payload: `메시지 저장 오류: ${String(error)}`,
                })
              );
            }
          } catch {
            /* no-op: RN bridge may be unavailable */
          }
        }
      }
    },
    [
      authUser,
      currentSessionId,
      ensureSession,
      messages.length,
      firebaseReady,
      historyMode,
    ]
  );

  const generateAiAnswer = useCallback(
    async (question: string): Promise<string> => {
      try {
        const response = await callHuggingFaceAPI(question);
        return response;
      } catch (error) {
        console.error('[ChatInputProvider] AI 응답 생성 실패:', error);
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
        return `죄송합니다. AI 응답을 생성하는 중 오류가 발생했습니다. (${errorMessage})`;
      }
    },
    []
  );

  const handleSendMessage = useCallback(async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    if (!authUser) {
      return;
    }

    await addMessage(trimmed, true);
    setInputText('');

    // 로딩 메시지 먼저 표시
    await addMessage('💭 답변을 생성하고 있습니다... (최초 실행 시 2-3분 소요될 수 있습니다)', false);
    
    const aiResponse = await generateAiAnswer(trimmed);
    
    // 로딩 메시지 제거하고 실제 응답으로 교체
    setMessages((prev) => {
      const filtered = prev.filter((msg) => !msg.text.startsWith('💭 답변을 생성하고'));
      return [...filtered, {
        id: Date.now(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        isBookmarked: false,
      }];
    });
  }, [addMessage, authUser, generateAiAnswer, inputText]);

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
        // 새 채팅 의도 시에는 자동 로드 금지
        if (suppressAutoLoadRef.current) return;
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
  const loadSession = useCallback(
    async (sessionId: string, targetMessageId?: string) => {
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
          messageId: (m as { id?: string }).id,
          isBookmarked: (m as { isBookmarked?: boolean }).isBookmarked ?? false,
        }));

        setMessages(mapped);
        setCurrentSessionId(sessionId);
        lastSessionIdRef.current = sessionId;
        // 히스토리 로드 활성화: 스켈레톤 비활성화용
        setHistoryMode(true);

        if (targetMessageId) {
          setFocusMessageId(targetMessageId);
        }
      } catch (e) {
        console.error('[ChatInputProvider] 세션 로드 실패:', e);
      }
    },
    [authUser, firebaseReady]
  );

  // 새 채팅 시작 함수: 세션은 생성하지 않고 상태만 초기화
  const startNewChat = useCallback(() => {
    // 이후 자동 최신 세션 로드를 막아, 첫 사용자 메시지에서 반드시 새 세션을 만들도록 함
    suppressAutoLoadRef.current = true;
    setMessages([]);
    setCurrentSessionId(null);
    lastSessionIdRef.current = null;
    setHistoryMode(false);
    setInputText('');
    setFocusMessageId(null);
  }, []);

  // 모바일에서 전달받은 세션 ID로 특정 채팅방 열기
  useEffect(() => {
    if (openSessionId && authUser && firebaseReady) {
      loadSession(openSessionId, openMessageId ?? undefined).then(() => {
        // 세션 로드 완료 후 openSessionId 초기화
        if (clearOpenSessionId) {
          clearOpenSessionId();
        }
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
        addMessage,
        loadSession,
        startNewChat,
        historyMode,
        currentSessionId,
        focusMessageId,
        consumeFocusMessage: () => setFocusMessageId(null),
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
