import { AuthUser } from '@vpp/core-logic';
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatInputContextType {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  handleSendMessage: () => void;
  addMessage: (text: string, isUser: boolean) => void;
  authUser: AuthUser | null; // 추가
  setAuthUser: React.Dispatch<React.SetStateAction<AuthUser | null>>; // 추가
}

const ChatInputContext = createContext<ChatInputContextType | undefined>(
  undefined
);

export const ChatInputProvider = ({ children }: { children: ReactNode }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null); // 추가

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
