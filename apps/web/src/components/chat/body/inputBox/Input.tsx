import { useChatInput } from '../../../../utils/inputProvider';

type ChattingInputProps = {
  onFocus?: () => void;
  onBlur?: () => void;
};

const ChattingInput = ({ onFocus, onBlur }: ChattingInputProps) => {
  const { inputText, setInputText, handleSendMessage, isGeneratingResponse } =
    useChatInput();

  return (
    <textarea
      value={inputText}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={isGeneratingResponse}
      onChange={(e) => {
        setInputText(e.target.value);
        e.target.style.height = '40px';
        const scrollHeight = e.target.scrollHeight;
        e.target.style.height =
          Math.min(scrollHeight, window.innerHeight * 0.25) + 'px';
      }}
      placeholder={
        isGeneratingResponse
          ? 'AI가 답변 생성 중입니다...'
          : '전력시장에 대해 궁금한 것을 물어보세요...'
      }
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey && !isGeneratingResponse) {
          e.preventDefault();
          handleSendMessage();
        }
      }}
      className={`h-10 max-h-[25vh] flex-1 border-none bg-transparent
  px-2 text-md resize-none overflow-y-auto text-gray-900 dark:text-gray-100
  placeholder:px-1 focus:outline-none
  xs:placeholder:text-sm sm:placeholder:text-md placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
    isGeneratingResponse ? 'opacity-50 cursor-not-allowed' : ''
  }`}
    />
  );
};

export default ChattingInput;
