import ChattingInputBox from '../inputBox/InputBox';
import {
  ChatInputProvider,
  useChatInput,
} from '../../../../utils/inputProvider';
import UserChattingBox from './UserChattingBox';
import AiChattingBox from './AiChattingBox';
import PromptHintBox from '../promptHint/HintBox';
import { useEffect, useRef } from 'react';
import RecentQuestionContainer from '../recentQuestion/Container';

const ChatMessages = () => {
  const { messages } = useChatInput();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
      {messages.length <= 1 ? <RecentQuestionContainer /> : null}
      <div className="overflow-y-auto flex-1 p-4 space-y-4 min-h-[50vh]">
        {messages.length <= 1 ? (
          <div className="flex flex-col h-full">
            <AiChattingBox
              message={{
                id: 1752583353312,
                text: '안녕하세요! 전력시장 AI 어시스턴트입니다. 🔋\n복잡한 전력시장 용어나 개념에 대해 궁금한 것이 있으시면 언제든 물어보세요. 쉽고 정확하게 설명해드릴게요!',
                isUser: false,
                timestamp: new Date('2025-07-15T12:42:33.312Z'),
              }}
            />
            <PromptHintBox />
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex animate-fade-in ${
                  message.isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.isUser ? (
                  <UserChattingBox message={message} />
                ) : (
                  <AiChattingBox message={message} />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </>
  );
};

const ChattingContainer = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] min-h-[500px] max-h-[100vh]">
      {/* 메세지 영역 */}
      <ChatInputProvider>
        <ChatMessages />

        {/* 입력 영역 */}
        <ChattingInputBox />
      </ChatInputProvider>
    </div>
  );
};

export default ChattingContainer;
