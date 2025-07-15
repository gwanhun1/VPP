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
}

const ChatInputContext = createContext<ChatInputContextType | undefined>(
  undefined
);

export const ChatInputProvider = ({ children }: { children: ReactNode }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now(),
      text: '안녕하세요! 전력시장 AI 어시스턴트입니다. 🔋\n복잡한 전력시장 용어나 개념에 대해 궁금한 것이 있으시면 언제든 물어보세요. 쉽고 정확하게 설명해드릴게요!',
      isUser: false,
      timestamp: new Date(),
    },
  ]);

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
