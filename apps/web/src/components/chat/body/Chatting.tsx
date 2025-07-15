import ChattingContainer from './chatting/Container';
import RecentQuestionContainer from './recentQuestion/Container';

const Chatting = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="overflow-auto flex-1">
        <RecentQuestionContainer />
        <ChattingContainer />
      </div>
    </div>
  );
};

export default Chatting;
