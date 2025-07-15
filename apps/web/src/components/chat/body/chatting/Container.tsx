import ChattingInputBox from '../inputBox/InputBox';
import { ChatInputProvider } from '../../../../utils/inputProvider';
import UserChattingBox from './UserChattingBox';
import AiChattingBox from './AiChattingBox';

const ChattingContainer = () => {
  return (
    <div className="flex flex-col h-full">
      {/* 메세지 영역 */}
      <div className="overflow-y-auto flex-1 p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-400">
            대화를 시작해 보세요
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

      {/* 추천 질문 영역 */}
      {/* <PromptHintBox /> */}

      {/* 입력 영역 */}
      <ChatInputProvider>
        <ChattingInputBox />
      </ChatInputProvider>
    </div>
  );
};

export default ChattingContainer;

const messages = [
  {
    id: Date.now(),
    text: 'Hello',
    isUser: true,
    timestamp: new Date(),
  },
  {
    id: Date.now(),
    text: 'Hi',
    isUser: false,
    timestamp: new Date(),
  },
];
