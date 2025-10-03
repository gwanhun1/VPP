import Chatting from './body/Chatting';
import ChattingHeader from './header/Header';
import { ChatInputProvider } from '../../utils/inputProvider';

const ChattingPage = () => {
  return (
    <ChatInputProvider>
      <ChattingHeader />
      <Chatting />
    </ChatInputProvider>
  );
};
export default ChattingPage;
