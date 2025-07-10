import ChattingContainer from './Container';
import RecentQuestionContainer from './recentQuestion/Container';

const Chatting = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <RecentQuestionContainer />
      <div className="flex-1 overflow-hidden">
        <ChattingContainer />
      </div>
    </div>
  );
};

export default Chatting;
