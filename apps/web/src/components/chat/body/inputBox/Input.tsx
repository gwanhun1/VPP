import { useChatInput } from '../../../../utils/inputProvider';

const ChattingInput = () => {
  const { inputText, setInputText, handleSendMessage } = useChatInput();

  return (
    <textarea
      value={inputText}
      onChange={(e) => {
        setInputText(e.target.value);
        e.target.style.height = '40px';
        const scrollHeight = e.target.scrollHeight;
        e.target.style.height =
          Math.min(scrollHeight, window.innerHeight * 0.25) + 'px';
      }}
      placeholder="전력시장에 대해 궁금한 것을 물어보세요..."
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage();
        }
      }}
      className="h-10 max-h-[25vh] flex-1 border-none placeholder:px-1 focus:outline-none px-2 text-md placeholder:text-gray-400 placeholder:text-md resize-none overflow-y-auto"
    />
  );
};

export default ChattingInput;
