import Chatting from './body/Chatting';
import ChattingHeader from './header/Header';
import { ChatInputProvider } from '../../utils/inputProvider';

const ChattingPage = () => {
  return (
    <ChatInputProvider>
      <div>
        <ChattingHeader />
        <Chatting />
      </div>
    </ChatInputProvider>
  );
};
export default ChattingPage;
