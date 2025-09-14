import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { AuthUser } from '@vpp/core-logic';
import { getFirestore, createChatSession, updateChatSession } from '@vpp/core-logic';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

    // Firebase에 메시지 저장
    if (authUser) {
      try {
        const db = getFirestore();
        if (db) {
          // 채팅 메시지 저장
          await addDoc(collection(db, 'chatMessages'), {
            userId: authUser.uid,
            text,
            isUser,
            timestamp: serverTimestamp(),
            sessionId: currentSessionId,
            platform: 'web',
            source: 'webview'
          });

          // 사용자 활동 로그
          await addDoc(collection(db, 'userActivities'), {
            userId: authUser.uid,
            type: 'chat_message',
            data: { text, isUser, sessionId: currentSessionId },
            timestamp: serverTimestamp(),
            platform: 'web',
            source: 'webview'
          });

          // 첫 번째 메시지인 경우 세션 제목 업데이트
          if (currentSessionId && isUser && messages.length === 0) {
            await updateChatSession(currentSessionId, {
              title: text.length > 30 ? `${text.substring(0, 30)}...` : text,
            });
          }
        }
      } catch (error) {
        console.error('[ChatInput] Firebase 저장 실패:', error);
      }
    }
  }, [authUser, currentSessionId, messages.length]);

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
          const sessionId = await createChatSession({
            userId: authUser.uid,
            platform: 'web',
            source: 'webview'
          });
          setCurrentSessionId(sessionId);
        } catch (error) {
          console.error('[ChatInput] 세션 생성 실패:', error);
          // 폴백으로 로컬 세션 ID 사용
          const fallbackSessionId = `session_${Date.now()}_${authUser.uid}`;
          setCurrentSessionId(fallbackSessionId);
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
