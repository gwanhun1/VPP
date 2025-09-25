import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { AuthUser } from '@vpp/core-logic';
import {
  createChatSession,
  addChatMessage,
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
  handleSendMessage: () => void;
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
  const { authUser } = useAuth();

  const addMessage = useCallback(async (text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      isUser,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);

    // Firebase에 메시지 저장 (새로운 구조 사용)
    if (authUser?.uid && currentSessionId) {
      const uid = authUser.uid;
      console.log('[ChatInput] 메시지 저장 시도:', {
        userId: uid,
        sessionId: currentSessionId,
        text: text.substring(0, 30) + '...',
        isUser,
      });

      try {
        const messageId = await addChatMessage(uid, currentSessionId, {
          role: isUser ? 'user' : 'assistant',
          text,
          platform: 'web',
          source: 'webview',
        });
        console.log('[ChatInput] 메시지 저장 성공:', messageId);

        if (isUser) {
          await addRecentActivity(uid, {
            type: 'chat',
            title: '채팅 메시지',
            description:
              text.length > 50 ? `${text.substring(0, 50)}...` : text,
          });
        }

        if (isUser && messages.length === 0) {
          await updateChatSession(uid, currentSessionId, {
            title: text.length > 30 ? `${text.substring(0, 30)}...` : text,
          });
        }
      } catch (error) {
        console.error('[ChatInput] Firebase 저장 실패:', error);
      }
    }
  }, [authUser?.uid, currentSessionId, messages.length]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      addMessage(inputText.trim(), true);
      setTimeout(() => {
        const userName = authUser?.displayName || authUser?.email || '사용자';
        addMessage(`${userName}님, 전력시장 관련 질문에 답변드리겠습니다.`, false);
      }, 500);
      setInputText('');
    }
  };

  // 채팅 세션 초기화
  useEffect(() => {
    if (authUser && !currentSessionId) {
      const initializeSession = async () => {
        try {
          console.log('[ChatInput] 세션 생성 시도 - 사용자:', authUser.uid);
          const uid = authUser.uid;
          const sessionId = await createChatSession(uid, {
            userId: uid,
            title: '새 채팅',
            lastMessage: null,
            messageCount: 0,
            platform: 'web',
            source: 'webview',
          });
          setCurrentSessionId(sessionId);
          console.log('[ChatInput] 세션 생성 성공:', sessionId);

          await addRecentActivity(uid, {
            type: 'chat',
            title: '새 채팅 시작',
            description: 'AI와 새로운 대화를 시작했습니다.',
          });
        } catch (error) {
          console.error('[ChatInput] 세션 생성 실패:', error);
          // 폴백으로 로컬 세션 ID 사용
          const fallbackSessionId = `session_${Date.now()}_${authUser.uid}`;
          setCurrentSessionId(fallbackSessionId);
          console.log('[ChatInput] 폴백 세션 ID 사용:', fallbackSessionId);
        }
      };
      
      initializeSession();
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
        console.log('message error');
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
