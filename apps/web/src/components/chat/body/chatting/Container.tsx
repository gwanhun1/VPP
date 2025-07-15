import ChattingInputBox from '../inputBox/InputBox';
import { ChatInputProvider } from '../../../../utils/inputProvider';
import UserChattingBox from './UserChattingBox';
import AiChattingBox from './AiChattingBox';
import PromptHintBox from '../promptHint/HintBox';

const ChattingContainer = () => {
  return (
    <div className="flex flex-col h-full">
      {/* 메세지 영역 */}
      <div className="overflow-y-auto flex-1 p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col h-full">
            <AiChattingBox
              message={{
                id: Date.now(),
                text: '안녕하세요! 전력시장 AI 어시스턴트입니다. 🔋\n복잡한 전력시장 용어나 개념에 대해 궁금한 것이 있으시면 언제든 물어보세요. 쉽고 정확하게 설명해드릴게요!',
                isUser: false,
                timestamp: new Date(),
              }}
            />
            {/* 추천 질문 영역 */}
            <PromptHintBox />
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.isUser ? (
                <UserChattingBox message={message} />
              ) : (
                <AiChattingBox message={message} />
              )}
            </div>
          ))
        )}
      </div>

      {/* 입력 영역 */}
      <ChatInputProvider>
        <ChattingInputBox />
      </ChatInputProvider>
    </div>
  );
};

export default ChattingContainer;

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const messages: Message[] = [
  {
    id: Date.now(),
    text: 'hi!',
    isUser: true,
    timestamp: new Date(),
  },
  {
    id: Date.now(),
    text: '안녕하세요! 전력시장 AI 어시스턴트입니다. 🔋\n\n복잡한 전력시장 용어나 개념에 대해 궁금한 것이 있으시면 언제든 물어보세요. 쉽고 정확하게 설명해드릴게요!',
    isUser: false,
    timestamp: new Date(),
  },
];
