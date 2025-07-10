import { Button } from '@vpp/shared-ui';
import { useState } from 'react';

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChattingContainer = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now(),
        text: inputText,
        isUser: true,
        timestamp: new Date(),
      };

      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

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
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 입력 영역 */}
      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-300">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            variant="primary"
            rounded="full"
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
          >
            전송
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChattingContainer;
