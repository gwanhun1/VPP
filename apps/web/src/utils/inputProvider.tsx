import { AuthUser } from '@vpp/core-logic';
import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
} from 'react';

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
  authUser: AuthUser | null; // 추가
  setAuthUser: React.Dispatch<React.SetStateAction<AuthUser | null>>; // 추가
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
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      isUser,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      addMessage(inputText.trim(), true);
      setTimeout(() => {
        addMessage('전력시장 관련 질문에 답변드리겠습니다.', false);
      }, 500);
      setInputText('');
    }
  };

  // 🔹 WebView 등 외부 메시지 수신
  useEffect(() => {
    const handleExternalMessage = (event: MessageEvent) => {
      try {
        // RN(WebView) → Web으로 오는 payload는 문자열일 수도, 객체일 수도 있음
        const raw = (event as MessageEvent).data as unknown;
        const data: IncomingMessage =
          typeof raw === 'string'
            ? (JSON.parse(raw) as IncomingMessage)
            : (raw as IncomingMessage);

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

        if (data?.type === 'AUTH') {
          // RN에서 전달된 로그인 사용자 정보를 보관
          setAuthUser(data.payload as AuthUser);
          return;
        }
      } catch {
        console.log('message error');
      }
    };

    window.addEventListener('message', handleExternalMessage);

    // 웹이 WebView 안에서 구동될 때, 초기 로드시 RN에 인증정보를 요청
    try {
      // 존재하지 않을 수 있으므로 optional chaining 사용
      (
        window as unknown as {
          ReactNativeWebView?: { postMessage: (msg: string) => void };
        }
      ).ReactNativeWebView?.postMessage(
        JSON.stringify({ type: 'REQUEST_AUTH' })
      );
    } catch {
      // no-op
    }

    return () => window.removeEventListener('message', handleExternalMessage);
  }, []);

  return (
    <ChatInputContext.Provider
      value={{
        inputText,
        setInputText,
        messages,
        setMessages,
        handleSendMessage,
        addMessage,
        authUser,
        setAuthUser,
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
