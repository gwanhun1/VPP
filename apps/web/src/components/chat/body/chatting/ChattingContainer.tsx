import { ChatInputProvider } from '@/utils/inputProvider';
import ChattingMessage from './ChattingMessage';
import ChattingInputBox from '../inputBox/InputBox';

const ChattingContainer = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] min-h-[500px] max-h-[100vh]">
      {/* 메세지 영역 */}
      <ChatInputProvider>
        <ChattingMessage />

        {/* 입력 영역 */}
        <ChattingInputBox />
      </ChatInputProvider>
    </div>
  );
};

export default ChattingContainer;
