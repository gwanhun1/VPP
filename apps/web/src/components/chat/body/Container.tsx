import ChattingInputBox from './inputBox/InputBox';
import { ChatInputProvider } from '../../../utils/inputProvider';

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
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.isUser
                    ? 'bg-primary-500 text-white rounded-tr-sm shadow-lg'
                    : 'bg-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
                }`}
              >
                {message.text}
              </div>
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

const messages = [
  {
    id: Date.now(),
    text: 'Hello',
    isUser: true,
    timestamp: new Date(),
  },
];
