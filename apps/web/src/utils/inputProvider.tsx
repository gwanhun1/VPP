import React, { createContext, useContext, useState, ReactNode } from 'react';

type ChatInputContextType = {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
};

const ChatInputContext = createContext<ChatInputContextType | undefined>(
  undefined
);

export const ChatInputProvider = ({ children }: { children: ReactNode }) => {
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setInputText('');
    }
  };

  return (
    <ChatInputContext.Provider
      value={{ inputText, setInputText, handleSendMessage }}
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
